import type { Metadata } from "next";
import Image from "next/image";
import { Leaf, Puzzle, Smile, Users } from "lucide-react";
import { Planner } from "@/components/corporate/Planner";
import { Faq } from "@/components/ui/Faq";
import { Pill } from "@/components/ui/Pill";
import {
    AUDIENCE,
    BENEFITS,
    EVERY_PACKAGE,
    SECTORS,
    STEPS,
    type BenefitIcon,
} from "@/lib/corporate-content";
import { getEventBySlug } from "@/lib/queries";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
    title: "Corporate team-building",
    description:
        "Board game team-building days and retreats for companies in Malawi. Half-day sessions, full-day tournaments and lake retreats, tailored to your team.",
};

// Refresh the FAQ from the database at most every 5 minutes
export const revalidate = 300;

const ICONS: Record<BenefitIcon, typeof Users> = {
    users: Users,
    puzzle: Puzzle,
    smile: Smile,
    leaf: Leaf,
};

export default async function CorporatePage() {
    // The FAQ lives on the "corporate-team-building" event in the database
    const corporate = await getEventBySlug("corporate-team-building").catch(() => null);
    const faq = corporate?.faq ?? [];

    return (
        <>
            {/* Hero */}
            <section className="border-b border-line py-14 lg:py-20">
                <div className="wrap grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <p className="font-meta text-[14px] text-lamp">
                            Corporate team-building and retreats
                        </p>
                        <h1 className="mt-3 text-[length:clamp(2.4rem,5.5vw,4.25rem)] font-bold leading-[1.04] tracking-tight text-balance">
                            Build better teams through play
                        </h1>
                        <p className="mt-5 max-w-xl text-lg text-muted">
                            Your team does not need another meeting. They need an experience.
                            Board games break down hierarchy, spark natural conversation and
                            build trust faster than another seminar.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Pill href="#quote">Request a quote</Pill>
                            <Pill
                                href={whatsappLink("Hi MeepleMania, I would like to talk about a team-building day.")}
                                variant="ghost"
                            >
                                Chat on WhatsApp
                            </Pill>
                        </div>
                    </div>

                    <div className="relative mx-auto h-80 w-full max-w-md sm:h-96" aria-hidden="true">
                        <div className="absolute left-0 top-6 w-[58%] -rotate-6 rounded-[20px] bg-cream p-2 shadow-[0_30px_50px_-22px_rgb(0_0_0/0.75)]">
                            <div className="relative aspect-4/5 overflow-hidden rounded-[13px]">
                                <Image
                                    src="/images/gallery-corporate-teambuilding.jpg"
                                    alt=""
                                    fill
                                    sizes="240px"
                                    className="object-cover object-[50%_85%]"
                                    priority
                                />
                            </div>
                        </div>
                        <div className="absolute right-0 top-0 w-[58%] rotate-6 rounded-[20px] bg-cream p-2 shadow-[0_30px_50px_-22px_rgb(0_0_0/0.75)]">
                            <div className="relative aspect-4/5 overflow-hidden rounded-[13px]">
                                <Image
                                    src="/images/gallery-tournament.jpg"
                                    alt=""
                                    fill
                                    sizes="240px"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why play */}
            <section aria-labelledby="why-title" className="border-b border-line py-16 lg:py-24">
                <div className="wrap">
                    <h2
                        id="why-title"
                        className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                    >
                        Why game-based team building works
                    </h2>
                    <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                        {BENEFITS.map((b) => {
                            const Icon = ICONS[b.icon];
                            return (
                                <div key={b.title}>
                                    <div className="flex size-11 items-center justify-center rounded-xl border border-line-strong bg-white/5">
                                        <Icon className="size-5 text-lamp" aria-hidden="true" />
                                    </div>
                                    <h3 className="mt-4 text-xl font-semibold">{b.title}</h3>
                                    <p className="mt-2 text-[16px] text-muted">{b.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Packages and quote builder (interactive) */}
            <Planner />

            {/* How it works */}
            <section aria-labelledby="steps-title" className="border-b border-line py-16 lg:py-24">
                <div className="wrap">
                    <h2
                        id="steps-title"
                        className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                    >
                        How it works
                    </h2>
                    <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {STEPS.map((s, i) => (
                            <li key={s.title} className="border-t border-line-strong pt-5">
                                <span className="font-meta text-[15px] text-lamp">Step {i + 1}</span>
                                <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
                                <p className="mt-2 text-[16px] text-muted">{s.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Included and audience */}
            <section aria-labelledby="included-title" className="border-b border-line py-16 lg:py-24">
                <div className="wrap grid gap-14 lg:grid-cols-2">
                    <div>
                        <h2
                            id="included-title"
                            className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                        >
                            Included in every package
                        </h2>
                        <ul className="mt-8 grid gap-3.5 sm:grid-cols-2">
                            {EVERY_PACKAGE.map((item) => (
                                <li key={item} className="flex gap-3 text-[16.5px] text-muted">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="mt-1 size-4.5 shrink-0 stroke-lamp"
                                        fill="none"
                                        strokeWidth="2.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight">
                            Who we work with
                        </h2>
                        <ul className="mt-8 grid gap-2.5 text-[16.5px] text-muted">
                            {AUDIENCE.map((a) => (
                                <li key={a} className="border-b border-line pb-2.5">
                                    {a}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-8 font-meta text-[14px] text-muted">
                            Sectors we design for
                        </p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                            {SECTORS.map((s) => (
                                <li
                                    key={s}
                                    className="rounded-full border border-line-strong bg-white/5 px-3.5 py-1.5 text-[14.5px] text-muted"
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* FAQ from the database */}
            {faq.length > 0 && (
                <section aria-labelledby="faq-title" className="border-b border-line py-16 lg:py-24">
                    <div className="wrap max-w-3xl">
                        <h2
                            id="faq-title"
                            className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                        >
                            Questions
                        </h2>
                        <div className="mt-8">
                            <Faq items={faq} />
                        </div>
                    </div>
                </section>
            )}

            {/* Closing call to action */}
            <section aria-labelledby="cta-title" className="py-16 lg:py-24">
                <div className="wrap">
                    <div className="rounded-[28px] border border-lamp/30 bg-plum p-8 sm:p-12">
                        <h2
                            id="cta-title"
                            className="max-w-xl text-[clamp(1.75rem,3.6vw,2.6rem)] font-semibold leading-[1.1] tracking-tight text-balance"
                        >
                            Ready to build a better team?
                        </h2>
                        <p className="mt-3 max-w-lg text-muted">
                            Let us design a memorable, high-impact game experience for your
                            organisation.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Pill href="#quote">Request a quote</Pill>
                            <Pill
                                href={whatsappLink("Hi MeepleMania, I would like to talk about a team-building day.")}
                                variant="wa"
                            >
                                Chat with us on WhatsApp
                            </Pill>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}