"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";

import { SUBMISSION_STATUSES } from "@/lib/coloring-submission-form";
import { saveColoringSubmission, type SaveState } from "@/app/admin/coloring-wall/actions";
import { ImageUploader } from "@/components/admin/ImageUploader";

const initial: SaveState = { status: "idle" };

const inputClass =
    "w-full rounded-xl border border-line-strong bg-white/5 px-4 py-2.5 text-[15px] text-cream placeholder:text-dim focus:border-lamp focus:outline-none focus:ring-2 focus:ring-lamp/30 aria-invalid:border-pink [color-scheme:dark]";
const labelClass = "mb-1.5 block text-[14px] font-medium";
const errorClass = "mt-1.5 text-[13px] text-pink";
const hintClass = "mt-1.5 text-[13px] text-dim";

export type ColoringWallFormDefaults = {
    id?: string;
    childName: string;
    childAge: string;
    imageUrl: string;
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

export function ColoringWallForm({ defaults }: { defaults: ColoringWallFormDefaults }) {
    const router = useRouter();
    const [state, action, pending] = useActionState(saveColoringSubmission, initial);
    const errors = state.errors ?? {};

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
                <h2 className="text-lg font-semibold">Photo</h2>
                <Field id="imageUrl" label="Colored page photo" error={errors.imageUrl}>
                    <ImageUploader
                        name="imageUrl"
                        folder="coloring-wall"
                        initialUrls={defaults.imageUrl ? [defaults.imageUrl] : []}
                    />
                </Field>
            </section>

            <section className="grid gap-5">
                <h2 className="text-lg font-semibold">Credit</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="childName" label="First name (optional)" error={errors.childName}>
                        <input
                            id="childName"
                            name="childName"
                            defaultValue={defaults.childName}
                            placeholder="Amara"
                            className={inputClass}
                        />
                    </Field>
                    <Field
                        id="childAge"
                        label="Age (optional)"
                        error={errors.childAge}
                        hint='Shows as "Name, age 5" under the photo. Leave both blank to show nothing.'
                    >
                        <input
                            id="childAge"
                            name="childAge"
                            defaultValue={defaults.childAge}
                            placeholder="5"
                            className={inputClass}
                        />
                    </Field>
                </div>
            </section>

            <section className="grid gap-5">
                <h2 className="text-lg font-semibold">Status</h2>
                <Field id="status" label="Status" error={errors.status}>
                    <select
                        id="status"
                        name="status"
                        defaultValue={defaults.status}
                        className={`${inputClass} [&>option]:bg-plum [&>option]:text-cream sm:w-72`}
                    >
                        {SUBMISSION_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field
                    id="sortOrder"
                    label="Position in the wall (optional)"
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
                    {pending ? "Saving..." : defaults.id ? "Save changes" : "Add photo"}
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/admin/coloring-wall")}
                    className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-[15px] text-muted transition-colors hover:text-cream"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}