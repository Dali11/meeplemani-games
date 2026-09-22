/** Rules for a photo upload. Pure code, shared by the API route and its tests. */

export const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
export const ALLOWED_TYPES: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
};

export type UploadCheck = { ok: true } | { ok: false; error: string };

export function checkImageFile(file: { type: string; size: number }): UploadCheck {
    if (!(file.type in ALLOWED_TYPES)) {
        return { ok: false, error: "Please choose a JPG, PNG, WEBP or GIF photo." };
    }
    if (file.size <= 0) {
        return { ok: false, error: "That file looks empty. Please choose another one." };
    }
    if (file.size > MAX_BYTES) {
        return { ok: false, error: "Please choose a photo under 8 MB." };
    }
    return { ok: true };
}

/** A random, safe object key. The folder groups uploads (e.g. "events", "gallery"). */
export function buildObjectKey(folder: string, mimeType: string, randomId: string) {
    const ext = ALLOWED_TYPES[mimeType] ?? "jpg";
    const safeFolder = folder.replace(/[^a-z0-9-]/gi, "").slice(0, 40) || "uploads";
    return `${safeFolder}/${randomId}.${ext}`;
}

/** Builds the public URL for an object in a public_read bucket (path-style addressing) */
export function publicObjectUrl(endpoint: string, bucket: string, key: string) {
    return `${endpoint.replace(/\/+$/, "")}/${bucket}/${key}`;
}