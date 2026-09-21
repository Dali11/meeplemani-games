"use client";

import { useActionState, useState } from "react";
import { Check } from "lucide-react";
import { submitInquiry } from "@/app/actions/inquiries";

import { SuccessPanel } from "@/components/forms/SuccessPanel";
import { Pill } from "@/components/ui/Pill";
import { PACKAGES, type QuoteFormat } from "@/lib/corporate-content";
import {
    initialFormState,
    QUOTE_BUDGETS,
    QUOTE_FORMATS,
    QUOTE_LOCATIONS,
} from "@/lib/inquiries";
import { whatsappLink } from "@/lib/site";
import { div } from "three/src/nodes/tsl/TSLBase.js";
import { HoneypotField, SelectField, TextAreaField, TextField } from "../forms/Fields";

const FORMAT_LABEL: Record<QuoteFormat, string> = {
    "Half day": "Half day",
    "Full day": "Full day",
    Retreat: "Retreat",
    Custom: "Something custom",
};

export function Planner() {
    const [format, setFormat] = useState<QuoteFormat>("Full day");
    const [round, setRound] = useState(0);

    function choose(next: QuoteFormat) {
        setFormat(next);
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document
            .getElementById("quote")
            ?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    }

    return (
        <>
            <section
                id="packages"
                aria-labelledby="packages-title"
                className="border-b border-line py-16 lg:py-24"
            >
                <div className="wrap">
                    <h2
                        id="packages-title"
                        className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                    >
                        Choose the format that fits your team
                    </h2>
                    <p className="mt-2 max-w-xl text-[16.5px] text-muted">
                        Every package is priced for your team, so pricing is by quote. Pick a
                        format and we will take you to the request form.
                    </p>

                    <div className="mt-10 grid gap-6 lg:grid-cols-3">
                        {PACKAGES.map((p) => {
                            const selected = format === p.format;
                            return (
                                <article
                                    key={p.format}
                                    className={`relative flex flex-col rounded-[22px] border p-6 transition-colors ${selected
                                        ? "border-lamp bg-lamp/5"
                                        : "border-line bg-plum hover:border-line-strong"
                                        }`}
                                >
                                    {p.popular && (
                                        <span className="absolute -top-3 left-6 rounded-full bg-lamp px-3 py-0.5 font-meta text-[12.5px] font-semibold text-[#1b1206]">
                                            Most popular
                                        </span>
                                    )}
                                    <p className="font-meta text-[13.5px] text-muted">{p.label}</p>
                                    <h3 className="mt-1 text-2xl font-semibold tracking-tight">{p.name}</h3>
                                    <p className="mt-3 text-[16px] text-muted">{p.blurb}</p>
                                    <ul className="mt-5 grid gap-2.5">
                                        {p.features.map((f) => (
                                            <li key={f} className="flex gap-2.5 text-[15.5px] text-muted">
                                                <Check className="mt-0.5 size-4.5 shrink-0 text-lamp" aria-hidden="true" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto pt-6">
                                        <button
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() => choose(p.format)}
                                            className={`inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 font-semibold transition-colors ${selected
                                                ? "bg-lamp text-[#1b1206] hover:bg-lamp-bright"
                                                : "border border-line-strong bg-white/5 text-cream hover:bg-white/10"
                                                }`}
                                        >
                                            {selected ? "Selected. Request a quote" : "Request a quote"}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section
                id="quote"
                aria-labelledby="quote-title"
                className="border-b border-line py-16 lg:py-24"
            >
                <div className="wrap">
                    <QuoteForm
                        key={round}
                        format={format}
                        onFormatChange={setFormat}
                        onReset={() => setRound((r) => r + 1)}
                    />
                </div>
            </section>
        </>
    );
}

function formatDate(iso: string) {
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function QuoteForm({
    format,
    onFormatChange,
    onReset,
}: {
    format: QuoteFormat;
    onFormatChange: (f: QuoteFormat) => void;
    onReset: () => void;
}) {
    const [state, action, pending] = useActionState(submitInquiry, initialFormState);
    const [teamSize, setTeamSize] = useState(40);
    const [location, setLocation] = useState<string>(QUOTE_LOCATIONS[0]);
    const [date, setDate] = useState("");
    const [budget, setBudget] = useState<string>(QUOTE_BUDGETS[0]);

    const errors = state.errors ?? {};
    const values = state.values ?? {};
    const sizeLabel = teamSize >= 100 ? "100+" : String(teamSize);

    if (state.status === "success") {
        return (
            <SuccessPanel
                title="Request received"
                message={state.message ?? "Thank you."}
                whatsappText={state.whatsappText ?? "Hi MeepleMania!"}
                resetLabel="Plan another session"
                onReset={onReset}
            />
        );
    }

    return (
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
            <div>
                <h2
                    id="quote-title"
                    className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                >
                    Get a custom quote
                </h2>
                <p className="mt-2 max-w-xl text-[16.5px] text-muted">
                    Tell us about your team and we will get back to you within 24 hours
                    with a custom proposal.
                </p>

                <form action={action} noValidate className="relative mt-8 grid gap-6">
                    <input type="hidden" name="kind" value="quote" />
                    <HoneypotField />

                    {state.status === "error" && state.message && (
                        <div
                            role="alert"
                            className="rounded-xl border border-pink/50 bg-pink/10 px-4 py-3 text-[15px]"
                        >
                            {state.message}{" "}

                            <a href={whatsappLink("Hi MeepleMania, I would like a corporate quote.")}
                                className="font-semibold underline underline-offset-4"
                            >
                                Message us on WhatsApp
                            </a>
                        </div>
                    )}

                    <fieldset>
                        <legend className="mb-2 text-[15px] font-medium">Format</legend>
                        <div className="grid gap-2 sm:grid-cols-4">
                            {QUOTE_FORMATS.map((f) => (
                                <label key={f} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="format"
                                        value={f}
                                        checked={format === f}
                                        onChange={() => onFormatChange(f)}
                                        className="peer sr-only"
                                    />
                                    <span className="flex min-h-11 items-center justify-center rounded-xl border border-line-strong px-3 text-center text-[15px] text-muted transition-colors hover:text-cream peer-checked:border-lamp peer-checked:bg-lamp/10 peer-checked:font-medium peer-checked:text-cream peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lamp">
                                        {FORMAT_LABEL[f]}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {errors.format && <p className="mt-1.5 text-[13.5px] text-pink">{errors.format}</p>}
                    </fieldset>

                    <div>
                        <div className="mb-1.5 flex items-baseline justify-between">
                            <label htmlFor="teamSize" className="text-[15px] font-medium">
                                Team size
                            </label>
                            <output htmlFor="teamSize" className="font-meta text-lg text-cream">
                                {sizeLabel} people
                            </output>
                        </div>
                        <input
                            id="teamSize"
                            name="teamSize"
                            type="range"
                            min={10}
                            max={100}
                            step={5}
                            value={teamSize}
                            onChange={(e) => setTeamSize(Number(e.target.value))}
                            className="h-11 w-full accent-lamp"
                        />
                        <div className="flex justify-between font-meta text-[13px] text-dim" aria-hidden="true">
                            <span>10</span>
                            <span>100+</span>
                        </div>
                        {errors.teamSize && <p className="mt-1.5 text-[13.5px] text-pink">{errors.teamSize}</p>}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <SelectField
                            id="location"
                            label="Where"
                            options={QUOTE_LOCATIONS}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            error={errors.location}
                        />
                        <TextField
                            id="date"
                            label="Preferred date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            error={errors.date}
                            hint="Optional. A rough date is fine."
                        />
                    </div>

                    <SelectField
                        id="budget"
                        label="Budget range"
                        options={QUOTE_BUDGETS}
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        error={errors.budget}
                    />

                    <div className="grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
                        <TextField
                            id="name"
                            label="Your name"
                            required
                            autoComplete="name"
                            defaultValue={values.name}
                            error={errors.name}
                        />
                        <TextField
                            id="company"
                            label="Company or organisation"
                            required
                            autoComplete="organization"
                            defaultValue={values.company}
                            error={errors.company}
                        />
                        <TextField
                            id="email"
                            label="Work email"
                            type="email"
                            autoComplete="email"
                            defaultValue={values.email}
                            error={errors.email}
                        />
                        <TextField
                            id="phone"
                            label="Phone or WhatsApp"
                            type="tel"
                            autoComplete="tel"
                            defaultValue={values.phone}
                            error={errors.phone}
                        />
                    </div>

                    <TextAreaField
                        id="message"
                        label="Goals or extra details"
                        hint="For example: what you want your team to get out of the day."
                        defaultValue={values.message}
                        error={errors.message}
                    />

                    <div>
                        <button
                            type="submit"
                            disabled={pending}
                            className="inline-flex min-h-11 items-center justify-center rounded-full bg-lamp px-6 text-base font-semibold text-[#1b1206] transition-colors hover:bg-lamp-bright disabled:cursor-wait disabled:opacity-60"
                        >
                            {pending ? "Sending..." : "Request corporate package"}
                        </button>
                    </div>
                </form>
            </div >

            <aside
                aria-label="Summary of your request"
                className="h-fit rounded-[22px] border border-line bg-plum p-6 lg:sticky lg:top-24"
            >
                <p className="font-meta text-[13.5px] text-muted">Your request</p>
                <dl className="mt-4 grid gap-4">
                    <div>
                        <dt className="font-meta text-[13px] text-dim">Format</dt>
                        <dd className="text-lg font-semibold">{FORMAT_LABEL[format]}</dd>
                    </div>
                    <div>
                        <dt className="font-meta text-[13px] text-dim">Team size</dt>
                        <dd className="text-lg font-semibold">{sizeLabel} people</dd>
                    </div>
                    <div>
                        <dt className="font-meta text-[13px] text-dim">Where</dt>
                        <dd className="text-lg font-semibold">{location}</dd>
                    </div>
                    {date && (
                        <div>
                            <dt className="font-meta text-[13px] text-dim">Around</dt>
                            <dd className="text-lg font-semibold">{formatDate(date)}</dd>
                        </div>
                    )}
                    {budget !== QUOTE_BUDGETS[0] && (
                        <div>
                            <dt className="font-meta text-[13px] text-dim">Budget</dt>
                            <dd className="text-lg font-semibold">{budget}</dd>
                        </div>
                    )}
                </dl>
                <div className="mt-6 border-t border-line pt-5">
                    <p className="text-[15px] text-muted">Prefer to talk it through?</p>
                    <Pill
                        href={whatsappLink(
                            `Hi MeepleMania, I am planning a ${format.toLowerCase()} session for about ${sizeLabel} people in ${location}.`,
                        )}
                        variant="wa"
                        size="sm"
                        className="mt-3 w-full"
                    >
                        Chat on WhatsApp
                    </Pill>
                </div>
            </aside>
        </div >
    );
}