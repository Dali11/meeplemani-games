"use server";

import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { coloringCategories } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { parseColoringForm, readColoringForm } from "@/lib/coloring-form";

export type SaveState = {
    status: "idle" | "error" | "saved";
    message?: string;
    errors?: Record<string, string>;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Makes the public coloring books page pick up the change straight away */
function refreshPublicPages() {
    revalidatePath("/coloring-books");
    revalidatePath("/admin/coloring");
}

async function nextSortOrder() {
    const rows = await db
        .select({ max: sql<number | null>`max(${coloringCategories.sortOrder})` })
        .from(coloringCategories);
    return (rows[0]?.max ?? 0) + 1;
}

export async function saveColoringCategory(
    _previous: SaveState,
    formData: FormData,
): Promise<SaveState> {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    const editing = id !== "";
    if (editing && !UUID.test(id)) {
        return { status: "error", message: "Something went wrong. Please reload the page." };
    }

    const { data, errors } = parseColoringForm(readColoringForm(formData));
    if (!data) {
        return { status: "error", message: "Please fix the highlighted fields.", errors };
    }

    // Each category needs its own web address
    const clash = await db
        .select({ id: coloringCategories.id })
        .from(coloringCategories)
        .where(eq(coloringCategories.slug, data.slug))
        .limit(1);
    if (clash[0] && clash[0].id !== id) {
        return {
            status: "error",
            message: "Please fix the highlighted fields.",
            errors: { slug: "Another category already uses this web address. Please change it." },
        };
    }

    const record = { ...data, sortOrder: data.sortOrder ?? (await nextSortOrder()) };

    let savedId = id;
    try {
        if (editing) {
            await db
                .update(coloringCategories)
                .set({ ...record, updatedAt: new Date() })
                .where(eq(coloringCategories.id, id));
        } else {
            const created = await db
                .insert(coloringCategories)
                .values(record)
                .returning({ id: coloringCategories.id });
            savedId = created[0].id;
        }
    } catch (error) {
        console.error("Could not save coloring category", error);
        return {
            status: "error",
            message: "We could not save this category just now. Please try again.",
        };
    }

    refreshPublicPages();

    if (!editing) redirect(`/admin/coloring/${savedId}?created=1`);
    return { status: "saved", message: "Saved. The site is updated." };
}

/** Quick publish or hide from the coloring list */
export async function setColoringStatus(formData: FormData) {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "");
    if (!UUID.test(id) || !["published", "draft"].includes(status)) return;

    await db
        .update(coloringCategories)
        .set({ status, updatedAt: new Date() })
        .where(eq(coloringCategories.id, id));

    refreshPublicPages();
}

export async function deleteColoringCategory(formData: FormData) {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    if (!UUID.test(id)) return;

    await db.delete(coloringCategories).where(eq(coloringCategories.id, id));

    refreshPublicPages();
    redirect("/admin/coloring");
}