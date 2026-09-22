"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import { COLORING_STATUSES } from "@/lib/coloring-form";
import { saveColoringCategory, type SaveState } from "@/app/admin/coloring/actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/event-form";

const initial: SaveState = { status: "idle" };

const inputClass =
    "w-full rounded-xl border border-line-strong bg-white/5 px-4 py-2.5 text-[15px] text-cream placeholder:text-dim focus:border-lamp focus:outline-none focus:ring-2 focus:ring-lamp/30 aria-invalid:border-pink [color-scheme:dark]";
const labelClass = "mb-1.5 block text-[14px] font-medium";
const errorClass = "mt-1.5 text-[13px] text-pink";
const hintClass = "mt-1.5 text-[13px] text-dim";

export type ColoringFormDefaults = {
    id?: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    downloadUrl: string;
    status: string;
    sortOrder: number | null;
};

function Field({
    id,
    label,
    error,
    hint,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
            {children}
            {error ? <p className={errorClass}>{error}</p> : hint ? <p className={hintClass}>{hint}</p> : null}
        </div>
    );
}

export function ColoringForm({ defaults }: { defaults: ColoringFormDefaults }) {
    const router = useRouter();
    const [state, action, pending] = useActionState(saveColoringCategory, initial);
    const errors = state.errors ?? {};

    const [title, setTitle] = useState(defaults.title);
    const [slug, setSlug] = useState(defaults.slug);
    const [slugTouched, setSlugTouched] = useState(Boolean(defaults.slug));

    function onTitleChange(value: string) {
        setTitle(value);
        if (!slugTouched) setSlug(slugify(value));
    }

    return (
        <form action={action} className="grid gap-8">
            {defaults.id && <input type="hidden" name="id" value={defaults.id} />}

            {state.status === "error" && state.message && (
                <p role="alert" className="rounded-xl border border-pink/50 bg-pink/10 px-4 py-3 text-[15px]">
                    {state.message}
                </p>
            )}
            {state.status === "saved" && (
                <p role="status" className="rounded-xl border border-mint/40 bg-mint/10 px-4 py-3 text-[15px]">
                    {state.message}
                </p>
            )}

            <section className="grid gap-5">
                <h2 className="text-lg font-semibold">The basics</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="title" label="Title" error={errors.title}>
                        <input
                            id="title"
                            name="title"
                            required
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field
                        id="slug"
                        label="Web address"
                        error={errors.slug}
                        hint={`meeplemania.com/coloring-books#${slug || "..."}`}
                    >
                        <input
                            id="slug"
                            name="slug"
                            value={slug}
                            onChange={(e) => {
                                setSlugTouched(true);
                                setSlug(slugify(e.target.value));
                            }}
                            className={inputClass}
                        />
                    </Field>
                </div>

                <Field id="description" label="Short description" error={errors.description}>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        defaultValue={defaults.description}
                        className={`${inputClass} resize-y`}
                    />
                </Field>

                <Field id="status" label="Status" error={errors.status}>
                    <select
                        id="status"
                        name="status"
                        defaultValue={defaults.status}
                        className={`${inputClass} [&>option]:bg-plum [&>option]:text-cream sm:w-72`}
                    >
                        {COLORING_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </Field>
            </section>

            <section className="grid gap-5">
                <h2 className="text-lg font-semibold">Cover photo</h2>
                <Field id="imageUrl" label="Cover photo" error={errors.imageUrl}>
                    <ImageUploader
                        name="imageUrl"
                        folder="coloring"
                        initialUrls={defaults.imageUrl ? [defaults.imageUrl] : []}
                    />
                </Field>
            </section>

            <section className="grid gap-5">
                <h2 className="text-lg font-semibold">Download</h2>
                <Field
                    id="downloadUrl"
                    label="Link to the printable PDF (optional)"
                    error={errors.downloadUrl}
                    hint='Paste a full https:// link once the PDF is hosted somewhere. Leave empty to show "Coming soon".'
                >
                    <input
                        id="downloadUrl"
                        name="downloadUrl"
                        defaultValue={defaults.downloadUrl}
                        placeholder="https://..."
                        className={inputClass}
                    />
                </Field>
            </section>

            <section className="grid gap-5">
                <h2 className="text-lg font-semibold">Order</h2>
                <Field
                    id="sortOrder"
                    label="Position in the list (optional)"
                    error={errors.sortOrder}
                    hint="Lower numbers show first. Leave empty to add it at the end."
                >
                    <input
                        id="sortOrder"
                        name="sortOrder"
                        inputMode="numeric"
                        defaultValue={defaults.sortOrder ?? ""}
                        className={`${inputClass} sm:w-40`}
                    />
                </Field>
            </section>

            <div className="flex items-center gap-3 border-t border-line pt-6">
                <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-lamp px-6 text-base font-semibold text-[#1b1206] transition-colors hover:bg-lamp-bright disabled:cursor-wait disabled:opacity-60"
                >
                    {pending ? "Saving..." : defaults.id ? "Save changes" : "Create category"}
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/admin/coloring")}
                    className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-[15px] text-muted transition-colors hover:text-cream"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}