import type { Metadata } from "next";
import Image from "next/image";
import { Gamepad2, Handshake, TrendingUp, Users } from "lucide-react";
import { CountUp } from "@/components/about/CountUp";
import { Pill } from "@/components/ui/Pill";
import {
    IMPACT,
    STATS,
    STORY,
    TEAM,
    TIMELINE,
    VALUES,
    type ValueIcon,
} from "@/lib/about-content";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
    title: "About",
    description:
        "MeepleMania Games brings people together through play, with game nights, tournaments, team-building and lake retreats across Lilongwe and Blantyre, Malawi.",
};

const VALUE_ICONS: Record<ValueIcon, typeof Users> = {
    users: Users,
    play: Gamepad2,
    handshake: Handshake,
    growth: TrendingUp,
};

export default function AboutPage() {
    return (
        <>
            {/* Story */}
            <section className="border-b border-line py-14 lg:py-20">
                <div className="wrap grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                    <div>
                        <p className="font-meta text-[14px] text-lamp">Our mission and story</p>
                        <h1 className="mt-3 text-[length:clamp(2.4rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-tight text-balance">
                            From small game nights to big adventures
                        </h1>
                        <div className="mt-6 grid max-w-xl gap-4 text-[17px] text-muted">
                            {STORY.map((p) => (
                                <p key={p}>{p}</p>
                            ))}
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-md">
                        <div className="rotate-2 rounded-[22px] bg-cream p-2 shadow-[0_30px_50px_-22px_rgb(0_0_0/0.75)]">
                            <div className="relative aspect-4/3 overflow-hidden rounded-[15px]">
                                <Image
                                    src="/images/gle-group-photo.jpg"
                                    alt="A big group of MeepleMania guests together at the lake"
                                    fill
                                    sizes="(min-width: 1024px) 420px, 90vw"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Numbers */}
            <section aria-label="MeepleMania in numbers" className="border-b border-line py-12">
                <dl className="wrap grid gap-8 sm:grid-cols-4">
                    <div>
                        <dt className="font-meta text-[14px] text-muted">Founded in</dt>
                        <dd className="mt-1 text-5xl font-bold tracking-tight text-cream">2024</dd>
                    </div>
                    {STATS.map((s) => (
                        <div key={s.label}>
                            <dt className="font-meta text-[14px] text-muted">{s.label}</dt>
                            <dd className="mt-1 text-5xl font-bold tracking-tight text-cream">
                                <CountUp to={s.value} suffix={s.suffix} />
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            {/* Timeline */}
            <section aria-labelledby="journey-title" className="border-b border-line py-16 lg:py-24">
                <div className="wrap">
                    <h2
                        id="journey-title"
                        className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                    >
                        Our journey
                    </h2>
                    <ol className="mt-10 grid gap-8 md:grid-cols-3">
                        {TIMELINE.map((t) => (
                            <li key={t.title} className="relative border-t border-line-strong pt-6">
                                <span
                                    aria-hidden="true"
                                    className="absolute -top-1.5 left-0 size-3 rounded-full bg-lamp"
                                />
                                <p className="font-meta text-[15px] text-lamp">{t.when}</p>
                                <h3 className="mt-2 text-xl font-semibold">{t.title}</h3>
                                <p className="mt-2 text-[16px] text-muted">{t.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Values */}
            <section aria-labelledby="values-title" className="border-b border-line py-16 lg:py-24">
                <div className="wrap">
                    <h2
                        id="values-title"
                        className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                    >
                        What drives MeepleMania
                    </h2>
                    <p className="mt-2 max-w-xl text-[16.5px] text-muted">
                        The principles behind every event, retreat and community session we build.
                    </p>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {VALUES.map((v) => {
                            const Icon = VALUE_ICONS[v.icon];
                            return (
                                <div key={v.title} className="rounded-[22px] border border-line bg-plum p-6">
                                    <Icon className="size-6 text-lamp" aria-hidden="true" />
                                    <h3 className="mt-4 text-xl font-semibold">{v.title}</h3>
                                    <p className="mt-2 text-[15.5px] text-muted">{v.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section aria-labelledby="team-title" className="border-b border-line py-16 lg:py-24">
                <div className="wrap">
                    <h2
                        id="team-title"
                        className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                    >
                        Meet the team
                    </h2>
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {TEAM.map((m) => (
                            <article key={m.name} className="rounded-[22px] border border-line bg-plum p-6">
                                <div
                                    aria-hidden="true"
                                    className="flex size-14 items-center justify-center rounded-full border border-lamp/50 bg-lamp/10 font-meta text-lg font-semibold text-lamp"
                                >
                                    {m.initials}
                                </div>
                                <h3 className="mt-4 text-xl font-semibold">{m.name}</h3>
                                <p className="font-meta text-[14px] text-lamp">{m.role}</p>
                                <p className="mt-3 text-[15.5px] text-muted">{m.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community impact */}
            <section aria-labelledby="impact-title" className="border-b border-line py-16 lg:py-24">
                <div className="wrap">
                    <h2
                        id="impact-title"
                        className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                    >
                        Giving back through play
                    </h2>
                    <p className="mt-2 max-w-xl text-[16.5px] text-muted">
                        We use games and social gatherings to support young people and community wellbeing.
                    </p>
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {IMPACT.map((i) => (
                            <article key={i.title} className="border-t border-line-strong pt-5">
                                <h3 className="text-xl font-semibold">{i.title}</h3>
                                <p className="mt-2 text-[16px] text-muted">{i.text}</p>
                            </article>
                        ))}
                    </div>
                    <div className="mt-8">
                        <Pill href="/gallery" variant="ghost">
                            See photos from our events
                        </Pill>
                    </div>
                </div>
            </section>

            {/* Sister brand */}
            <section aria-labelledby="books-title" className="border-b border-line py-16 lg:py-24">
                <div className="wrap">
                    <div className="rounded-[28px] border border-line bg-plum p-8 sm:p-12">
                        <p className="font-meta text-[14px] text-lamp">Our sister brand</p>
                        <h2
                            id="books-title"
                            className="mt-2 text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                        >
                            MeepleMania Books
                        </h2>
                        <p className="mt-4 max-w-2xl text-[17px] text-muted">
                            MeepleMania Books makes beautifully designed coloring books for
                            kids, teens and adults. They are made for relaxation, mindfulness
                            and creative fun, at home or on a retreat.
                        </p>
                        <p className="mt-4 font-meta text-lg text-cream">
                            MWK 28,000 <span className="text-muted">(includes a full coloring pencil set)</span>
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Pill
                                href={whatsappLink("Hi MeepleMania, I would like to order a coloring book.")}
                                variant="wa"
                            >
                                Order on WhatsApp
                            </Pill>
                            <Pill href="https://instagram.com/meeplemaniabooksmw" variant="ghost">
                                @meeplemaniabooksmw
                            </Pill>
                        </div>
                    </div>
                </div>
            </section>

            {/* Work with us */}
            <section aria-labelledby="work-title" className="py-16 lg:py-24">
                <div className="wrap">
                    <h2
                        id="work-title"
                        className="max-w-xl text-[clamp(1.75rem,3.6vw,2.6rem)] font-semibold leading-[1.1] tracking-tight text-balance"
                    >
                        Want to work with us?
                    </h2>
                    <p className="mt-3 max-w-lg text-muted">
                        Planning a team-building day or a community project? Let us talk.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                        <Pill href="/corporate">Corporate packages</Pill>
                        <Pill href="/contact" variant="ghost">
                            Contact us
                        </Pill>
                    </div>
                </div>
            </section>
        </>
    );
}