"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import {
    CATEGORIES,
    EVENT_STATUSES,
    slugify,
    toMalawiInput,
    type EventFormValues,
} from "@/lib/event-form";
import { saveEvent, type SaveState } from "@/app/admin/events/actions";
import { ImageUploader } from "@/components/admin/ImageUploader";

const initial: SaveState = { status: "idle" };

const inputClass =
    "w-full rounded-xl border border-line-strong bg-white/5 px-4 py-2.5 text-[15px] text-cream placeholder:text-dim focus:border-lamp focus:outline-none focus:ring-2 focus:ring-lamp/30 aria-invalid:border-pink [color-scheme:dark]";
const labelClass = "mb-1.5 block text-[14px] font-medium";
const errorClass = "mt-1.5 text-[13px] text-pink";
const hintClass = "mt-1.5 text-[13px] text-dim";

export type EventFormDefaults = {
    id?: string;
    title: string;
    slug: string;
    description: string;
    location: string;
    dateLabel: string;
    startsAt: Date | null;
    category: string;
    price: string;
    priceNote: string;
    imageUrl: string;
    highlights: string[];
    schedule: { day: string; items: string[] }[];
    faq: { q: string; a: string }[];
    galleryImages: string[];
    organizerName: string;
    organizerBio: string;
    organizerTags: string[];
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

export function EventForm({ defaults }: { defaults: EventFormDefaults }) {
    const router = useRouter();
    const [state, action, pending] = useActionState(saveEvent, initial);
    const errors = state.errors ?? {};

    const [title, setTitle] = useState(defaults.title);
    const [slug, setSlug] = useState(defaults.slug);
    const [slugTouched, setSlugTouched] = useState(Boolean(defaults.slug));
    const [schedule, setSchedule] = useState(
        defaults.schedule.length
            ? defaults.schedule.map((d) => ({ day: d.day, items: d.items.join("\n") }))
            : [{ day: "", items: "" }],
    );
    const [faq, setFaq] = useState(
        defaults.faq.length ? defaults.faq : [{ q: "", a: "" }],
    );

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
                        hint={`meeplemania.com/events/${slug || "..."}`}
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
                        required
                        rows={3}
                        defaultValue={defaults.description}
                        className={`${inputClass} resize-y`}
                    />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="category" label="Category" error={errors.category}>
                        <select
                            id="category"
                            name="category"
                            defaultValue={defaults.category}
                            className={`${inputClass} [&>option]:bg-plum [&>option]:text-cream`}
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c.label} value={c.label}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field id="status" label="Status" error={errors.status}>
                        <select
                            id="status"
                            name="status"
                            defaultValue={defaults.status}
                            className={`${inputClass} [&>option]:bg-plum [&>option]:text-cream`}
                        >
                            {EVENT_STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>
            </section>

            <section className="grid gap-5">
                <h2 className="text-lg font-semibold">Where and when</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="location" label="Place" error={errors.location}>
                        <input id="location" name="location" defaultValue={defaults.location} className={inputClass} />
                    </Field>
                    <Field
                        id="dateLabel"
                        label="Date, as shown on the site"
                        error={errors.dateLabel}
                        hint='For example "30 Oct to 1 Nov 2026" or "Date coming soon".'
                    >
                        <input id="dateLabel" name="dateLabel" defaultValue={defaults.dateLabel} className={inputClass} />
                    </Field>
                </div>
                <Field
                    id="startsAt"
                    label="Start date and time (Malawi time)"
                    error={errors.startsAt}
                    hint="Only needed for the countdown on the flagship card. Leave empty otherwise."
                >
                    <input
                        id="startsAt"
                        name="startsAt"
                        type="datetime-local"
                        defaultValue={toMalawiInput(defaults.startsAt)}
                        className={`${inputClass} sm:w-72`}
                    />
                </Field>
            </section>

            <section className="grid gap-5">
                <h2 className="text-lg font-semibold">Price</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="price" label="Price, as shown on the site" error={errors.price} hint='For example "MK8,000" or "Custom quote".'>
                        <input id="price" name="price" defaultValue={defaults.price} className={inputClass} />
                    </Field>
                    <Field id="priceNote" label="Price note (optional)" error={errors.priceNote} hint='For example "Pay in 3 installments".'>
                        <input id="priceNote" name="priceNote" defaultValue={defaults.priceNote} className={inputClass} />
                    </Field>
                </div>
            </section>

            <section className="grid gap-5">
                <h2 className="text-lg font-semibold">Photos</h2>
                <Field id="imageUrl" label="Main photo" error={errors.imageUrl}>
                    <ImageUploader
                        name="imageUrl"
                        folder="events"
                        initialUrls={defaults.imageUrl ? [defaults.imageUrl] : []}
                    />
                </Field>
                <Field
                    id="galleryImages"
                    label="Extra photos for the event page"
                    error={errors.galleryImages}
                >
                    <ImageUploader
                        name="galleryImages"
                        folder="events"
                        initialUrls={defaults.galleryImages}
                        multiple
                        max={12}
                    />
                </Field>
            </section>

            <section className="grid gap-5">
                <h2 className="text-lg font-semibold">About the organizer</h2>
                <p className="-mt-2 text-[14px] text-dim">
                    Shown on the event page, between the schedule and the questions.
                    Leave this blank to hide the section.
                </p>
                <Field
                    id="organizerName"
                    label="Organizer name"
                    error={errors.organizerName}
                    hint='For example "MeepleMania Games" or a partner organization.'
                >
                    <input
                        id="organizerName"
                        name="organizerName"
                        defaultValue={defaults.organizerName}
                        className={inputClass}
                    />
                </Field>
                <Field id="organizerBio" label="About them" error={errors.organizerBio}>
                    <textarea
                        id="organizerBio"
                        name="organizerBio"
                        rows={4}
                        defaultValue={defaults.organizerBio}
                        className={`${inputClass} resize-y`}
                    />
                </Field>
                <Field
                    id="organizerTags"
                    label="Tags (one per line)"
                    error={errors.organizerTags}
                    hint='For example "Board Games", "Team Building", "Family Friendly".'
                >
                    <textarea
                        id="organizerTags"
                        name="organizerTags"
                        rows={3}
                        defaultValue={defaults.organizerTags.join("\n")}
                        className={`${inputClass} resize-y`}
                    />
                </Field>
            </section>

            <section className="grid gap-5">
                <h2 className="text-lg font-semibold">Event page content</h2>
                <Field
                    id="highlights"
                    label='"What is included" (one per line)'
                    error={errors.highlights}
                >
                    <textarea
                        id="highlights"
                        name="highlights"
                        rows={4}
                        defaultValue={defaults.highlights.join("\n")}
                        className={`${inputClass} resize-y`}
                    />
                </Field>

                <fieldset>
                    <legend className={labelClass}>Schedule</legend>
                    {errors.schedule && <p className={errorClass}>{errors.schedule}</p>}
                    <div className="grid gap-3">
                        {schedule.map((row, i) => (
                            <div key={i} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-[160px_1fr_auto] sm:items-start">
                                <input
                                    name="scheduleDay"
                                    placeholder="Day 1"
                                    value={row.day}
                                    onChange={(e) =>
                                        setSchedule((s) => s.map((r, j) => (j === i ? { ...r, day: e.target.value } : r)))
                                    }
                                    className={inputClass}
                                />
                                <textarea
                                    name="scheduleItems"
                                    placeholder={"One thing per line"}
                                    rows={2}
                                    value={row.items}
                                    onChange={(e) =>
                                        setSchedule((s) => s.map((r, j) => (j === i ? { ...r, items: e.target.value } : r)))
                                    }
                                    className={`${inputClass} resize-y`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setSchedule((s) => s.filter((_, j) => j !== i))}
                                    className="h-fit rounded-full border border-line-strong px-3 py-1.5 text-[13px] text-muted transition-colors hover:text-pink"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setSchedule((s) => [...s, { day: "", items: "" }])}
                        className="mt-2 text-[14px] text-lamp underline underline-offset-4"
                    >
                        Add a day
                    </button>
                </fieldset>

                <fieldset>
                    <legend className={labelClass}>Questions</legend>
                    {errors.faq && <p className={errorClass}>{errors.faq}</p>}
                    <div className="grid gap-3">
                        {faq.map((row, i) => (
                            <div key={i} className="grid gap-2 rounded-xl border border-line p-3">
                                <input
                                    name="faqQ"
                                    placeholder="Question"
                                    value={row.q}
                                    onChange={(e) => setFaq((f) => f.map((r, j) => (j === i ? { ...r, q: e.target.value } : r)))}
                                    className={inputClass}
                                />
                                <textarea
                                    name="faqA"
                                    placeholder="Answer"
                                    rows={2}
                                    value={row.a}
                                    onChange={(e) => setFaq((f) => f.map((r, j) => (j === i ? { ...r, a: e.target.value } : r)))}
                                    className={`${inputClass} resize-y`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setFaq((f) => f.filter((_, j) => j !== i))}
                                    className="w-fit rounded-full border border-line-strong px-3 py-1.5 text-[13px] text-muted transition-colors hover:text-pink"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setFaq((f) => [...f, { q: "", a: "" }])}
                        className="mt-2 text-[14px] text-lamp underline underline-offset-4"
                    >
                        Add a question
                    </button>
                </fieldset>
            </section>

            <section className="grid gap-5">
                <h2 className="text-lg font-semibold">Order</h2>
                <Field
                    id="sortOrder"
                    label="Position in the events list (optional)"
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
                    {pending ? "Saving..." : defaults.id ? "Save changes" : "Create event"}
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/admin/events")}
                    className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-[15px] text-muted transition-colors hover:text-cream"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}