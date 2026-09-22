"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Slot = { url: string; uploading: boolean; error?: string };

type Props = {
    /** The hidden field this component keeps in sync, so the rest of the form is unchanged */
    name: string;
    folder: string;
    initialUrls?: string[];
    multiple?: boolean;
    max?: number;
};

async function uploadOne(file: File, folder: string): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);

    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };

    if (!res.ok || !data.url) {
        throw new Error(data.error || "The upload failed. Please try again.");
    }
    return data.url;
}

export function ImageUploader({
    name,
    folder,
    initialUrls = [],
    multiple = false,
    max = multiple ? 12 : 1,
}: Props) {
    const [slots, setSlots] = useState<Slot[]>(
        initialUrls.map((url) => ({ url, uploading: false })),
    );
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const hiddenValue = slots
        .filter((s) => s.url && !s.uploading)
        .map((s) => s.url)
        .join("\n");

    function addFiles(files: FileList | File[]) {
        const room = max - slots.length;
        if (room <= 0) return;

        const picked = Array.from(files)
            .filter((f) => f.type.startsWith("image/"))
            .slice(0, multiple ? room : 1);
        if (picked.length === 0) return;

        const placeholders = picked.map(() => ({ url: "", uploading: true }));
        setSlots((prev) => (multiple ? [...prev, ...placeholders] : placeholders));

        picked.forEach((file, i) => {
            const index = multiple ? slots.length + i : i;
            uploadOne(file, folder)
                .then((url) => {
                    setSlots((prev) => prev.map((s, j) => (j === index ? { url, uploading: false } : s)));
                })
                .catch((err: Error) => {
                    setSlots((prev) =>
                        prev.map((s, j) => (j === index ? { url: "", uploading: false, error: err.message } : s)),
                    );
                });
        });
    }

    function removeAt(index: number) {
        setSlots((prev) => prev.filter((_, i) => i !== index));
    }

    const canAddMore = slots.length < max;

    return (
        <div>
            <input type="hidden" name={name} value={hiddenValue} />
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple={multiple}
                onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = "";
                }}
                className="hidden"
            />

            {slots.length > 0 && (
                <ul className={`mb-3 grid gap-3 ${multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1 sm:w-56"}`}>
                    {slots.map((slot, i) => (
                        <li key={i} className="relative aspect-square overflow-hidden rounded-xl border border-line bg-white/5">
                            {slot.url && (
                                <Image src={slot.url} alt="" fill sizes="200px" className="object-cover" />
                            )}
                            {slot.uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-ink/60 font-meta text-[12px] text-cream">
                                    Uploading...
                                </div>
                            )}
                            {slot.error && (
                                <div className="absolute inset-0 flex items-center justify-center bg-pink/20 p-2 text-center text-[11px] text-pink">
                                    {slot.error}
                                </div>
                            )}
                            {!slot.uploading && (
                                <button
                                    type="button"
                                    onClick={() => removeAt(i)}
                                    aria-label="Remove photo"
                                    className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-ink/80 text-cream transition-colors hover:bg-pink/80"
                                >
                                    &times;
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {canAddMore && (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
                    }}
                    className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center text-[14px] transition-colors ${dragOver ? "border-lamp bg-lamp/10 text-cream" : "border-line-strong text-muted hover:border-white/35 hover:text-cream"
                        }`}
                >
                    <span className="font-medium">Drop a photo here, or click to choose</span>
                    <span className="font-meta text-[12px] text-dim">
                        JPG, PNG, WEBP or GIF, up to 8 MB{multiple ? ` (${max - slots.length} more)` : ""}
                    </span>
                </button>
            )}
        </div>
    );
}