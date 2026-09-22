import { and, asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { coloringCategories, coloringSubmissions, events, inquiries } from "@/db/schema";
export const STATUSES = ["new", "contacted", "done"] as const;
export type InquiryStatus = (typeof STATUSES)[number];

export type InquiryFilters = {
    status?: InquiryStatus;
    kind?: "quote" | "contact";
    q?: string;
    limit: number;
};

export async function listInquiries(f: InquiryFilters) {
    const conditions: (SQL | undefined)[] = [];

    if (f.status) conditions.push(eq(inquiries.status, f.status));
    if (f.kind) conditions.push(eq(inquiries.kind, f.kind));
    if (f.q) {
        // Escape characters that have a special meaning in a LIKE search
        const like = `%${f.q.replace(/[\\%_]/g, "\\$&")}%`;
        conditions.push(
            or(
                ilike(inquiries.name, like),
                ilike(inquiries.company, like),
                ilike(inquiries.email, like),
                ilike(inquiries.phone, like),
                ilike(inquiries.message, like),
            ),
        );
    }

    return db
        .select()
        .from(inquiries)
        .where(and(...conditions))
        .orderBy(desc(inquiries.createdAt))
        .limit(f.limit);
}

export type InquiryRow = Awaited<ReturnType<typeof listInquiries>>[number];

/** How many requests are in each status, for the tabs */
export async function countByStatus() {
    const rows = await db
        .select({ status: inquiries.status, n: sql<number>`count(*)::int` })
        .from(inquiries)
        .groupBy(inquiries.status);

    const counts: Record<InquiryStatus, number> = { new: 0, contacted: 0, done: 0 };
    for (const row of rows) {
        if ((STATUSES as readonly string[]).includes(row.status)) {
            counts[row.status as InquiryStatus] = row.n;
        }
    }
    return counts;
}

/** Every event, including drafts and archived ones, for the admin list */
export async function listAllEvents() {
    return db.select().from(events).orderBy(asc(events.sortOrder), asc(events.title));
}

export type AdminEventRow = Awaited<ReturnType<typeof listAllEvents>>[number];

export async function getEventById(id: string) {
    const rows = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return rows[0] ?? null;
}

/** Every coloring category, including drafts, for the admin list */
export async function listAllColoringCategories() {
    return db
        .select()
        .from(coloringCategories)
        .orderBy(asc(coloringCategories.sortOrder), asc(coloringCategories.title));
}

export type AdminColoringCategoryRow = Awaited<
    ReturnType<typeof listAllColoringCategories>
>[number];

export async function getColoringCategoryById(id: string) {
    const rows = await db
        .select()
        .from(coloringCategories)
        .where(eq(coloringCategories.id, id))
        .limit(1);
    return rows[0] ?? null;
}

/** Every "show us your masterpiece" photo, including drafts, for the admin list */
export async function listAllColoringSubmissions() {
    return db
        .select()
        .from(coloringSubmissions)
        .orderBy(asc(coloringSubmissions.sortOrder), desc(coloringSubmissions.createdAt));
}

export type AdminColoringSubmissionRow = Awaited<
    ReturnType<typeof listAllColoringSubmissions>
>[number];

export async function getColoringSubmissionById(id: string) {
    const rows = await db
        .select()
        .from(coloringSubmissions)
        .where(eq(coloringSubmissions.id, id))
        .limit(1);
    return rows[0] ?? null;
}