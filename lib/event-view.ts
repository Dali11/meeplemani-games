import type { EventRow } from "@/db/schema";

/** The plain shape the event cards need. Dates are text so it can cross from server to browser safely. */
export type EventCardData = {
    slug: string;
    title: string;
    description: string;
    location: string | null;
    dateLabel: string | null;
    startsAt: string | null;
    category: string | null;
    categoryColor: string | null;
    price: string | null;
    priceNote: string | null;
    imageUrl: string | null;
};

export function toCardData(e: EventRow): EventCardData {
    return {
        slug: e.slug,
        title: e.title,
        description: e.description,
        location: e.location,
        dateLabel: e.dateLabel,
        startsAt: e.startsAt ? e.startsAt.toISOString() : null,
        category: e.category,
        categoryColor: e.categoryColor,
        price: e.price,
        priceNote: e.priceNote,
        imageUrl: e.imageUrl,
    };
}