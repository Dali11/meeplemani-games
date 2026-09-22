"use server";

import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { events } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { parseEventForm, readEventForm } from "@/lib/event-form";

export type SaveState = {
    status: "idle" | "error" | "saved";
    message?: string;
    errors?: Record<string, string>;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The Corporate page reads its FAQ from this event, so it must never be deleted */
const PROTECTED_SLUGS = ["corporate-team-building"];

/** Makes every public page that shows events pick up the change straight away */
function refreshPublicPages() {
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/events/[slug]", "page");
    revalidatePath("/corporate");
    revalidatePath("/admin/events");
}

async function nextSortOrder() {
    const rows = await db
        .select({ max: sql<number | null>`max(${events.sortOrder})` })
        .from(events);
    return (rows[0]?.max ?? 0) + 1;
}

export async function saveEvent(
    _previous: SaveState,
    formData: FormData,
): Promise<SaveState> {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    const editing = id !== "";
    if (editing && !UUID.test(id)) {
        return { status: "error", message: "Something went wrong. Please reload the page." };
    }

    const { data, errors } = parseEventForm(readEventForm(formData));
    if (!data) {
        return { status: "error", message: "Please fix the highlighted fields.", errors };
    }

    // Each event needs its own web address
    const clash = await db
        .select({ id: events.id })
        .from(events)
        .where(eq(events.slug, data.slug))
        .limit(1);
    if (clash[0] && clash[0].id !== id) {
        return {
            status: "error",
            message: "Please fix the highlighted fields.",
            errors: { slug: "Another event already uses this web address. Please change it." },
        };
    }

    const record = { ...data, sortOrder: data.sortOrder ?? (await nextSortOrder()) };

    let savedId = id;
    try {
        if (editing) {
            await db
                .update(events)
                .set({ ...record, updatedAt: new Date() })
                .where(eq(events.id, id));
        } else {
            const created = await db
                .insert(events)
                .values(record)
                .returning({ id: events.id });
            savedId = created[0].id;
        }
    } catch (error) {
        console.error("Could not save event", error);
        return {
            status: "error",
            message: "We could not save this event just now. Please try again.",
        };
    }

    refreshPublicPages();

    if (!editing) redirect(`/admin/events/${savedId}?created=1`);
    return { status: "saved", message: "Saved. The site is updated." };
}

/** Quick publish or hide from the events list */
export async function setEventStatus(formData: FormData) {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "");
    if (!UUID.test(id) || !["published", "draft", "archived"].includes(status)) return;

    await db
        .update(events)
        .set({ status, updatedAt: new Date() })
        .where(eq(events.id, id));

    refreshPublicPages();
}

export async function deleteEvent(formData: FormData) {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    if (!UUID.test(id)) return;

    const rows = await db
        .select({ slug: events.slug })
        .from(events)
        .where(eq(events.id, id))
        .limit(1);
    if (!rows[0] || PROTECTED_SLUGS.includes(rows[0].slug)) return;

    await db.delete(events).where(eq(events.id, id));

    refreshPublicPages();
    redirect("/admin/events");
}