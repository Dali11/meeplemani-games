import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Handshake, Mail, MapPin, MessageCircle, Megaphone, Users } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Pill } from "@/components/ui/Pill";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Questions about events, corporate packages or partnerships? Message MeepleMania Games on WhatsApp or send us a message.",
};

// Lets a link like /contact?topic=partnership open the form with that topic chosen
const TOPIC_FROM_LINK: Record<string, string> = {
    booking: "Event booking",
    corporate: "Corporate team-building",
    partnership: "Partnership or sponsorship",
    media: "Media or press",
    coloring: "Event booking",
};

const PARTNERS = [
    {
        icon: Building2,
        title: "Venue partners",
        text: "Cafes, restaurants, lounges and hotels that want to host game nights and community pop-ups.",
    },
    {
        icon: MapPin,
        title: "Travel and hospitality",
        text: "Resorts, lakeside lodges and transport providers who want to team up on getaways like the Great Lake Escape.",
    },
    {
        icon: Megaphone,
        title: "Brand sponsors",
        text: "Companies and brands looking for hands-on engagement with a lively adult and corporate audience.",
    },
    {
        icon: Users,
        title: "Community partners",
        text: "Clubs, youth organisations and creators who want to grow board gaming in Malawi.",
    },
];

const SOCIALS = [
    { label: "Instagram", handle: "@meeplemaniagames", href: SITE.instagram },
    { label: "Facebook", handle: "@meeplemaniagamesmw", href: SITE.facebook },
    { label: "TikTok", handle: "@meeplemania0", href: SITE.tiktok },
];

export default async function ContactPage({
    searchParams,
}: {
    searchParams: Promise<{ topic?: string }>;
}) {
    const { topic } = await searchParams;
    const defaultTopic = topic ? TOPIC_FROM_LINK[topic] : undefined;

    return (
        <>
            <section className="border-b border-line py-14 lg:py-20">
                <div className="wrap">
                    <h1 className="text-[length:clamp(2.4rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-tight">
                        Get in touch
                    </h1>
                    <p className="mt-4 max-w-xl text-lg text-muted">
                        Questions about events, corporate packages or partnerships? We would
                        love to hear from you.
                    </p>

                    <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                        <div className="grid content-start gap-4">
                            <div className="rounded-[22px] border border-lamp/30 bg-lamp/5 p-6">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-wa/15">
                                        <MessageCircle className="size-5 text-wa" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h2 className="text-xl font-semibold">WhatsApp</h2>
                                        <p className="font-meta text-[15px] text-muted">{SITE.phoneDisplay}</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-[16px] text-muted">
                                    The quickest way to book, ask a question or get help.
                                </p>
                                <Pill
                                    href={whatsappLink("Hi MeepleMania, I have a question.")}
                                    variant="wa"
                                    className="mt-4"
                                >
                                    Chat on WhatsApp
                                </Pill>
                            </div>

                            <div className="rounded-[22px] border border-line bg-plum p-6">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-11 items-center justify-center rounded-xl border border-line-strong bg-white/5">
                                        <Mail className="size-5 text-lamp" aria-hidden="true" />
                                    </span>
                                    <div className="min-w-0">
                                        <h2 className="text-xl font-semibold">Email</h2>

                                        <a href={`mailto:${SITE.email}`}
                                            className="block break-all font-meta text-[15px] text-muted underline-offset-4 hover:text-cream hover:underline"
                                        >
                                            {SITE.email}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[22px] border border-line bg-plum p-6">
                                <h2 className="text-xl font-semibold">Follow us</h2>
                                <ul className="mt-3 divide-y divide-line">
                                    {SOCIALS.map((s) => (
                                        <li key={s.label}>

                                            <a href={s.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between gap-4 py-3 text-[16px] text-muted transition-colors hover:text-cream"
                                            >
                                                <span className="font-medium text-cream">{s.label}</span>
                                                <span className="font-meta text-[14.5px]">{s.handle}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-3 flex items-center gap-2 text-[15px] text-muted">
                                    <MapPin className="size-4 shrink-0 text-dim" aria-hidden="true" />
                                    Based in Lilongwe and Blantyre, Malawi
                                </p>
                            </div>
                        </div>

                        <div
                            id="message"
                            className="scroll-mt-24 rounded-[22px] border border-line bg-plum p-6 sm:p-8"
                        >
                            <h2 className="text-2xl font-semibold tracking-tight">Send us a message</h2>
                            <p className="mt-2 mb-6 text-[16px] text-muted">
                                We save your message and reply by email, phone or WhatsApp.
                            </p>
                            {/* The key restarts the form when the topic in the link changes */}
                            <ContactForm key={defaultTopic ?? "default"} defaultTopic={defaultTopic} />
                        </div>
                    </div>
                </div >
            </section >

            <section aria-labelledby="partner-title" className="py-16 lg:py-24">
                <div className="wrap">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <h2
                                id="partner-title"
                                className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                            >
                                Partner with MeepleMania
                            </h2>
                            <p className="mt-2 max-w-xl text-[16.5px] text-muted">
                                We are always looking to work with venues, hospitality brands
                                and sponsors who share our love of play.
                            </p>
                        </div>
                        <Link
                            href="/contact?topic=partnership#message"
                            className="inline-flex min-h-11 items-center rounded-full bg-lamp px-6 font-semibold text-[#1b1206] transition-colors hover:bg-lamp-bright"
                        >
                            Become a partner
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {PARTNERS.map((p) => (
                            <div key={p.title} className="rounded-[22px] border border-line bg-plum p-6">
                                <p.icon className="size-6 text-lamp" aria-hidden="true" />
                                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                                <p className="mt-2 text-[15.5px] text-muted">{p.text}</p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-10 flex items-center gap-2 text-[15px] text-dim">
                        <Handshake className="size-4 shrink-0" aria-hidden="true" />
                        Partnership messages go straight to the same inbox, so nothing gets lost.
                    </p>
                </div>
            </section>
        </>
    );
}