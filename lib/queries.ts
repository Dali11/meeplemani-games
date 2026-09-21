import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { EVENTS, type EventCategory, type EventItem } from "@/lib/events";
import { events, galleryImages, type EventRow } from "@/db/schema";

/** Events shown on the public site, in the order set by sort_order */
export async function getPublishedEvents() {
    return db
        .select()
        .from(events)
        .where(eq(events.status, "published"))
        .orderBy(asc(events.sortOrder));
}

/** One published event by its slug, or null if there is none */
export async function getEventBySlug(slug: string) {
    const rows = await db
        .select()
        .from(events)
        .where(eq(events.slug, slug))
        .limit(1);
    const event = rows[0];
    return event && event.status === "published" ? event : null;
}

// The category text saved in the database, matched to the keys the site uses
const CATEGORY_KEY: Record<string, EventCategory> = {
    adventure: "adventure",
    "game night": "game",
    corporate: "corporate",
};

const FALLBACK_IMAGE = "/images/bg-home-hero.jpg";

function toEventItem(row: EventRow): EventItem {
    return {
        slug: row.slug,
        title: row.title,
        location: row.location ?? "",
        dateLabel: row.dateLabel ?? "Date coming soon",
        price: row.price ?? "Price coming soon",
        category: CATEGORY_KEY[(row.category ?? "").toLowerCase()] ?? "game",
        image: row.imageUrl ?? FALLBACK_IMAGE,
        description: row.description,
        priceNote: row.priceNote ?? undefined,
        startsAt: row.startsAt ? row.startsAt.toISOString() : undefined,
    };
}

/**
 * The events for the home page, in the shape the event cards expect.
 * The first event with a real future date becomes the large "featured" card.
 * If the database cannot be reached, the built-in list is used so the site never breaks.
 */
export async function getUpcomingEvents(): Promise<EventItem[]> {
    try {
        const rows = await getPublishedEvents();
        const items: EventItem[] = rows.map(toEventItem);

        const now = Date.now();
        const featuredIndex = items.findIndex(
            (e) => e.startsAt !== undefined && new Date(e.startsAt).getTime() > now,
        );

        return items.map((e, i) => ({ ...e, featured: i === featuredIndex }));
    } catch (error) {
        console.error(
            "Could not load events from the database, using the built-in list.",
            error,
        );
        return EVENTS;
    }
}

/** Photos for the gallery page, in the order set by sort_order */
export async function getGalleryImages() {
    return db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.status, "published"))
        .orderBy(asc(galleryImages.sortOrder));
}