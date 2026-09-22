/**
 * Reading and checking the coloring category form. Pure code with no database
 * or Next.js, so the browser form and the server action share the same rules.
 */

import { isImageRef, slugify } from "@/lib/event-form";

export const COLORING_STATUSES = [
    { value: "published", label: "Published (visible on the site)" },
    { value: "draft", label: "Draft (hidden while you prepare it)" },
] as const;

export type ColoringFormValues = {
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    downloadUrl: string;
    status: string;
    sortOrder: string;
};

export type ParsedColoringCategory = {
    title: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    downloadUrl: string | null;
    status: string;
    sortOrder: number | null;
};

export const emptyColoringForm: ColoringFormValues = {
    title: "",
    slug: "",
    description: "",
    imageUrl: "",
    downloadUrl: "",
    status: "draft",
    sortOrder: "",
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Only https links are accepted for the PDF, never javascript: or data: links */
function isPdfLink(value: string) {
    if (value.length > 500) return false;
    try {
        const url = new URL(value);
        return url.protocol === "https:" && !/\s/.test(value);
    } catch {
        return false;
    }
}

/** Reads the raw text out of the submitted form */
export function readColoringForm(fd: FormData): ColoringFormValues {
    const text = (key: string) => String(fd.get(key) ?? "").trim();

    return {
        title: text("title"),
        slug: text("slug"),
        description: text("description"),
        imageUrl: text("imageUrl"),
        downloadUrl: text("downloadUrl"),
        status: text("status"),
        sortOrder: text("sortOrder"),
    };
}

/** Checks every field. Returns the clean data, or a message for each problem. */
export function parseColoringForm(v: ColoringFormValues): {
    data: ParsedColoringCategory | null;
    errors: Record<string, string>;
} {
    const errors: Record<string, string> = {};

    if (v.title.length < 2 || v.title.length > 120) {
        errors.title = "Please enter a title (2 to 120 characters).";
    }

    const slug = v.slug || slugify(v.title);
    if (slug.length < 2 || slug.length > 80 || !SLUG.test(slug)) {
        errors.slug = "Use lowercase letters, numbers and single hyphens, for example lake-adventure.";
    }

    if (v.description.length > 400) {
        errors.description = "Please keep the description under 400 characters.";
    }

    if (v.imageUrl && !isImageRef(v.imageUrl)) {
        errors.imageUrl = "Use a path like /images/photo.jpg or a full https:// link.";
    }

    if (v.downloadUrl && !isPdfLink(v.downloadUrl)) {
        errors.downloadUrl = "Please paste a full https:// link to the PDF.";
    }

    if (!COLORING_STATUSES.some((s) => s.value === v.status)) {
        errors.status = "Please choose a status.";
    }

    let sortOrder: number | null = null;
    if (v.sortOrder !== "") {
        if (/^-?\d{1,4}$/.test(v.sortOrder)) sortOrder = Number(v.sortOrder);
        else errors.sortOrder = "Please enter a whole number, for example 3.";
    }

    if (Object.keys(errors).length > 0) return { data: null, errors };

    return {
        errors,
        data: {
            title: v.title,
            slug,
            description: v.description || null,
            imageUrl: v.imageUrl || null,
            downloadUrl: v.downloadUrl || null,
            status: v.status,
            sortOrder,
        },
    };
}