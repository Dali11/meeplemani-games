/**
 * Reading and checking the event form. Pure code with no database or Next.js,
 * so the browser form and the server action share exactly the same rules.
 */

export const CATEGORIES = [
    { label: "Adventure", color: "#3b82f6" },
    { label: "Game Night", color: "#d94a8a" },
    { label: "Corporate", color: "#6366f1" },
] as const;

export const EVENT_STATUSES = [
    { value: "published", label: "Published (visible on the site)" },
    { value: "draft", label: "Draft (hidden while you write it)" },
    { value: "archived", label: "Archived (hidden, past event)" },
] as const;

export type EventFormValues = {
    title: string;
    slug: string;
    description: string;
    location: string;
    dateLabel: string;
    startsAt: string; // "2026-10-30T09:00" in Malawi time, or ""
    category: string;
    price: string;
    priceNote: string;
    imageUrl: string;
    highlights: string; // one per line
    galleryImages: string; // one per line
    schedule: { day: string; items: string }[]; // items: one per line
    faq: { q: string; a: string }[];
    status: string;
    sortOrder: string;
};

export type ParsedEvent = {
    title: string;
    slug: string;
    description: string;
    location: string | null;
    dateLabel: string | null;
    startsAt: Date | null;
    category: string;
    categoryColor: string;
    price: string | null;
    priceNote: string | null;
    imageUrl: string | null;
    highlights: string[] | null;
    schedule: { day: string; items: string[] }[] | null;
    faq: { q: string; a: string }[] | null;
    galleryImages: string[] | null;
    status: string;
    sortOrder: number | null;
};

export const emptyEventForm: EventFormValues = {
    title: "",
    slug: "",
    description: "",
    location: "",
    dateLabel: "",
    startsAt: "",
    category: CATEGORIES[1].label,
    price: "",
    priceNote: "",
    imageUrl: "",
    highlights: "",
    galleryImages: "",
    schedule: [],
    faq: [],
    status: "draft",
    sortOrder: "",
};

/** "The Great Lake Escape!" becomes "the-great-lake-escape" */
export function slugify(text: string) {
    return text
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80)
        .replace(/-+$/g, "");
}

const MALAWI_OFFSET_HOURS = 2;

/** A stored date shown in the form, as Malawi time (UTC+2) */
export function toMalawiInput(date: Date | null | undefined) {
    if (!date) return "";
    return new Date(date.getTime() + MALAWI_OFFSET_HOURS * 3600 * 1000)
        .toISOString()
        .slice(0, 16);
}

const LOCAL_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCAL_PATH = /^\/(?!\/)[A-Za-z0-9._~%/-]+$/;

/** Only our own image paths or https links are allowed, never javascript: or data: links */
export function isImageRef(value: string) {
    if (value.length > 500) return false;
    if (LOCAL_PATH.test(value)) return true;
    try {
        const url = new URL(value);
        return url.protocol === "https:" && !/\s/.test(value);
    } catch {
        return false;
    }
}

function lines(text: string) {
    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

/** Reads the raw text out of the submitted form */
export function readEventForm(fd: FormData): EventFormValues {
    const text = (key: string) => String(fd.get(key) ?? "").trim();

    const days = fd.getAll("scheduleDay").map(String);
    const dayItems = fd.getAll("scheduleItems").map(String);
    const questions = fd.getAll("faqQ").map(String);
    const answers = fd.getAll("faqA").map(String);

    return {
        title: text("title"),
        slug: text("slug"),
        description: text("description"),
        location: text("location"),
        dateLabel: text("dateLabel"),
        startsAt: text("startsAt"),
        category: text("category"),
        price: text("price"),
        priceNote: text("priceNote"),
        imageUrl: text("imageUrl"),
        highlights: String(fd.get("highlights") ?? ""),
        galleryImages: String(fd.get("galleryImages") ?? ""),
        schedule: days.map((day, i) => ({ day: day.trim(), items: dayItems[i] ?? "" })),
        faq: questions.map((q, i) => ({ q: q.trim(), a: (answers[i] ?? "").trim() })),
        status: text("status"),
        sortOrder: text("sortOrder"),
    };
}

/** Checks every field. Returns the clean data, or a message for each problem. */
export function parseEventForm(v: EventFormValues): {
    data: ParsedEvent | null;
    errors: Record<string, string>;
} {
    const errors: Record<string, string> = {};

    if (v.title.length < 2 || v.title.length > 120) {
        errors.title = "Please enter a title (2 to 120 characters).";
    }

    const slug = v.slug || slugify(v.title);
    if (slug.length < 2 || slug.length > 80 || !SLUG.test(slug)) {
        errors.slug = "Use lowercase letters, numbers and single hyphens, for example the-great-lake-escape.";
    }

    if (v.description.length < 10 || v.description.length > 1200) {
        errors.description = "Please write a short description (10 to 1200 characters).";
    }

    if (v.location.length > 120) errors.location = "Please keep the place under 120 characters.";
    if (v.dateLabel.length > 60) errors.dateLabel = "Please keep the date text under 60 characters.";
    if (v.price.length > 60) errors.price = "Please keep the price under 60 characters.";
    if (v.priceNote.length > 100) errors.priceNote = "Please keep this note under 100 characters.";

    let startsAt: Date | null = null;
    if (v.startsAt) {
        const date = LOCAL_DATE.test(v.startsAt)
            ? new Date(`${v.startsAt}:00+02:00`)
            : new Date(NaN);
        if (Number.isNaN(date.getTime())) {
            errors.startsAt = "Please pick a valid date and time.";
        } else {
            startsAt = date;
        }
    }

    const category = CATEGORIES.find((c) => c.label === v.category);
    if (!category) errors.category = "Please choose a category.";

    if (v.imageUrl && !isImageRef(v.imageUrl)) {
        errors.imageUrl = "Use a path like /images/photo.jpg or a full https:// link.";
    }

    const highlights = lines(v.highlights);
    if (highlights.length > 20 || highlights.some((h) => h.length > 200)) {
        errors.highlights = "Up to 20 lines, each under 200 characters.";
    }

    const gallery = lines(v.galleryImages);
    if (gallery.length > 12 || gallery.some((g) => !isImageRef(g))) {
        errors.galleryImages = "Up to 12 photos, one per line, each a /images/... path or https:// link.";
    }

    const schedule: { day: string; items: string[] }[] = [];
    for (const row of v.schedule) {
        const items = lines(row.items);
        if (!row.day && items.length === 0) continue; // an empty row is ignored
        if (!row.day || row.day.length > 60 || items.length === 0 || items.length > 15 || items.some((i) => i.length > 200)) {
            errors.schedule = "Each day needs a name and at least one item (up to 15).";
            break;
        }
        schedule.push({ day: row.day, items });
    }

    const faq: { q: string; a: string }[] = [];
    for (const row of v.faq) {
        if (!row.q && !row.a) continue;
        if (row.q.length < 3 || row.q.length > 200 || row.a.length < 3 || row.a.length > 1000) {
            errors.faq = "Each question needs both a question and an answer.";
            break;
        }
        faq.push(row);
    }
    if (faq.length > 15) errors.faq = "Please keep it to 15 questions.";

    if (!EVENT_STATUSES.some((s) => s.value === v.status)) {
        errors.status = "Please choose a status.";
    }

    let sortOrder: number | null = null;
    if (v.sortOrder !== "") {
        if (/^-?\d{1,4}$/.test(v.sortOrder)) sortOrder = Number(v.sortOrder);
        else errors.sortOrder = "Please enter a whole number, for example 3.";
    }

    if (Object.keys(errors).length > 0 || !category) return { data: null, errors };

    return {
        errors,
        data: {
            title: v.title,
            slug,
            description: v.description,
            location: v.location || null,
            dateLabel: v.dateLabel || null,
            startsAt,
            category: category.label,
            categoryColor: category.color,
            price: v.price || null,
            priceNote: v.priceNote || null,
            imageUrl: v.imageUrl || null,
            highlights: highlights.length ? highlights : null,
            schedule: schedule.length ? schedule : null,
            faq: faq.length ? faq : null,
            galleryImages: gallery.length ? gallery : null,
            status: v.status,
            sortOrder,
        },
    };
}