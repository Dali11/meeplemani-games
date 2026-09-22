/**
 * Reading and checking the "show us your masterpiece" photo form. Pure code
 * with no database or Next.js, so it can be unit tested on its own.
 *
 * Photos come in over WhatsApp — an admin uploads and publishes them here,
 * so there is no public submission form to protect against spam.
 */

import { isImageRef } from "@/lib/event-form";

export const SUBMISSION_STATUSES = [
    { value: "published", label: "Published (visible on the site)" },
    { value: "draft", label: "Draft (hidden for now)" },
] as const;

export type SubmissionFormValues = {
    childName: string;
    childAge: string;
    imageUrl: string;
    status: string;
    sortOrder: string;
};

export type ParsedSubmission = {
    childName: string | null;
    childAge: string | null;
    imageUrl: string;
    status: string;
    sortOrder: number | null;
};

export const emptySubmissionForm: SubmissionFormValues = {
    childName: "",
    childAge: "",
    imageUrl: "",
    status: "draft",
    sortOrder: "",
};

/** Reads the raw text out of the submitted form */
export function readSubmissionForm(fd: FormData): SubmissionFormValues {
    const text = (key: string) => String(fd.get(key) ?? "").trim();

    return {
        childName: text("childName"),
        childAge: text("childAge"),
        imageUrl: text("imageUrl"),
        status: text("status"),
        sortOrder: text("sortOrder"),
    };
}

/** Checks every field. Returns the clean data, or a message for each problem. */
export function parseSubmissionForm(v: SubmissionFormValues): {
    data: ParsedSubmission | null;
    errors: Record<string, string>;
} {
    const errors: Record<string, string> = {};

    if (v.childName.length > 60) {
        errors.childName = "Please keep this under 60 characters.";
    }

    if (v.childAge.length > 20) {
        errors.childAge = "Keep this short, for example 5 or 6-7.";
    }

    if (!v.imageUrl || !isImageRef(v.imageUrl)) {
        errors.imageUrl = "Please add a photo.";
    }

    if (!SUBMISSION_STATUSES.some((s) => s.value === v.status)) {
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
            childName: v.childName || null,
            childAge: v.childAge || null,
            imageUrl: v.imageUrl,
            status: v.status,
            sortOrder,
        },
    };
}