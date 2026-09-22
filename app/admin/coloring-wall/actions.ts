"use server";

import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { coloringSubmissions } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { parseSubmissionForm, readSubmissionForm } from "@/lib/coloring-submission-form";

export type SaveState = {
    status: "idle" | "error" | "saved";
    message?: string;
    errors?: Record<string, string>;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Makes the public coloring books page pick up the change straight away */
function refreshPublicPages() {
    revalidatePath("/coloring-books");
    revalidatePath("/admin/coloring-wall");
}

async function nextSortOrder() {
    const rows = await db
        .select({ max: sql<number | null>`max(${coloringSubmissions.sortOrder})` })
        .from(coloringSubmissions);
    return (rows[0]?.max ?? 0) + 1;
}

export async function saveColoringSubmission(
    _previous: SaveState,
    formData: FormData,
): Promise<SaveState> {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    const editing = id !== "";
    if (editing && !UUID.test(id)) {
        return { status: "error", message: "Something went wrong. Please reload the page." };
    }

    const { data, errors } = parseSubmissionForm(readSubmissionForm(formData));
    if (!data) {
        return { status: "error", message: "Please fix the highlighted fields.", errors };
    }

    const record = { ...data, sortOrder: data.sortOrder ?? (await nextSortOrder()) };

    let savedId = id;
    try {
        if (editing) {
            await db
                .update(coloringSubmissions)
                .set({ ...record, updatedAt: new Date() })
                .where(eq(coloringSubmissions.id, id));
        } else {
            const created = await db
                .insert(coloringSubmissions)
                .values(record)
                .returning({ id: coloringSubmissions.id });
            savedId = created[0].id;
        }
    } catch (error) {
        console.error("Could not save coloring submission", error);
        return {
            status: "error",
            message: "We could not save this photo just now. Please try again.",
        };
    }

    refreshPublicPages();

    if (!editing) redirect(`/admin/coloring-wall/${savedId}?created=1`);
    return { status: "saved", message: "Saved. The site is updated." };
}

/** Quick publish or hide from the list */
export async function setSubmissionStatus(formData: FormData) {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "");
    if (!UUID.test(id) || !["published", "draft"].includes(status)) return;

    await db
        .update(coloringSubmissions)
        .set({ status, updatedAt: new Date() })
        .where(eq(coloringSubmissions.id, id));

    refreshPublicPages();
}

export async function deleteColoringSubmission(formData: FormData) {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    if (!UUID.test(id)) return;

    await db.delete(coloringSubmissions).where(eq(coloringSubmissions.id, id));

    refreshPublicPages();
    redirect("/admin/coloring-wall");
}