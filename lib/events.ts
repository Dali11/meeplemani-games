export type EventCategory = "game" | "adventure" | "corporate";

export type EventItem = {
    slug: string;
    title: string;
    location: string;
    dateLabel: string;
    price: string;
    category: EventCategory;
    image: string;
    featured?: boolean;
    description?: string;
    priceNote?: string;
    /** ISO date with Malawi's +02:00 offset, used for the countdown */
    startsAt?: string;
};

export const CATEGORY_LABEL: Record<EventCategory, string> = {
    game: "Game night",
    adventure: "Adventure",
    corporate: "Corporate",
};

export const CATEGORY_BADGE_CLASS: Record<EventCategory, string> = {
    game: "bg-pink text-ink",
    adventure: "bg-lake text-ink",
    corporate: "bg-mint text-ink",
};

export const EVENTS: EventItem[] = [
    {
        slug: "the-great-lake-escape",
        title: "The Great Lake Escape",
        location: "Mangochi, Lake Malawi",
        dateLabel: "30 Oct to 1 Nov 2026",
        startsAt: "2026-10-30T00:00:00+02:00",
        price: "MK400,000 per person",
        priceNote: "Pay in 3 installments",
        category: "adventure",
        image: "/images/gle-hero-beach.jpg",
        featured: true,
        description:
            "Three days of board games, water sports and evening socials on the lakeshore, with transport and a beachfront stay handled by our partner Legendary Adventures.",
    },
    {
        slug: "dress-for-the-wrong-occasion",
        title: "Dress for the Wrong Occasion",
        location: "Kuwala Gardens, Lilongwe",
        dateLabel: "Date coming soon",
        price: "MK8,000",
        category: "game",
        image: "/images/bg-home-hero.jpg",
    },
    {
        slug: "corporate-team-building",
        title: "Corporate Team-Building",
        location: "Lilongwe, Blantyre or your venue",
        dateLabel: "Book any date",
        price: "Custom quote",
        category: "corporate",
        image: "/images/gallery-tournament.jpg",
    },
    {
        slug: "kids-fun-day",
        title: "Kids Fun Day",
        location: "Venue coming soon",
        dateLabel: "Date coming soon",
        price: "Price coming soon",
        category: "game",
        image: "/images/gallery-kids-fun.jpg",
    },
];

/** Returns e.g. "40 days to go", "Tomorrow", "Today", or null if there's no date yet. */
export function daysUntil(startsAt?: string): string | null {
    if (!startsAt) return null;
    const diffMs = new Date(startsAt).getTime() - Date.now();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (days < 0) return null;
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days to go`;
}