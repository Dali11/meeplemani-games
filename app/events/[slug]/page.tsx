import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pill } from "@/components/ui/Pill";
import { getEventBySlug, getPublishedEvents } from "@/lib/queries";
import { whatsappLink } from "@/lib/site";

// Refresh from the database at most every 5 minutes
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    try {
        const rows = await getPublishedEvents();
        return rows.map((e) => ({ slug: e.slug }));
    } catch {
        // If the database is unreachable during a build, pages are made on first visit instead
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) return { title: "Event not found" };

    return {
        title: event.title,
        description: event.description,
        openGraph: {
            title: event.title,
            description: event.description,
            images: event.imageUrl ? [event.imageUrl] : undefined,
        },
    };
}

const iconProps = {
    fill: "none",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

function PinIcon() {
    return (
        <svg viewBox="0 0 24 24" className="size-4.5 shrink-0 stroke-dim" {...iconProps} aria-hidden="true">
            <path d="M12 21s-7-6.2-7-11.3A7 7 0 0 1 19 9.7C19 14.8 12 21 12 21Z" />
            <circle cx="12" cy="9.7" r="2.5" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg viewBox="0 0 24 24" className="size-4.5 shrink-0 stroke-dim" {...iconProps} aria-hidden="true">
            <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
    );
}

function TicketIcon() {
    return (
        <svg viewBox="0 0 24 24" className="size-4.5 shrink-0 stroke-dim" {...iconProps} aria-hidden="true">
            <path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3Z" />
            <path d="M14 6v12" strokeDasharray="2 2.5" />
        </svg>
    );
}

export default async function EventPage({ params }: Props) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) notFound();

    const highlights = event.highlights ?? [];
    const schedule = event.schedule ?? [];
    const faq = event.faq ?? [];
    const gallery = event.galleryImages ?? [];

    return (
        <article className="wrap py-10 lg:py-16">
            <Link
                href="/events"
                className="inline-flex items-center gap-2 text-[15px] text-muted transition-colors hover:text-cream"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                All events
            </Link>

            <header className="mt-6 max-w-3xl">
                {event.category && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/5 px-3 py-1 font-meta text-[13px] text-cream">
                        <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: event.categoryColor ?? "#f5a524" }}
                        />
                        {event.category}
                    </span>
                )}
                <h1 className="mt-4 text-[length:clamp(2.2rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-balance">
                    {event.title}
                </h1>
                <p className="mt-4 text-lg text-muted">{event.description}</p>
            </header>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-14">
                <div className="space-y-14">
                    {highlights.length > 0 && (
                        <section aria-labelledby="highlights-title">
                            <h2 id="highlights-title" className="text-2xl font-semibold tracking-tight">
                                What is included
                            </h2>
                            <ul className="mt-5 grid gap-3.5 sm:grid-cols-2">
                                {highlights.map((item) => (
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
                        </section>
                    )}

                    {schedule.length > 0 && (
                        <section aria-labelledby="schedule-title">
                            <h2 id="schedule-title" className="text-2xl font-semibold tracking-tight">
                                The plan
                            </h2>
                            <div className="mt-5 border-b border-line">
                                {schedule.map((day) => (
                                    <div
                                        key={day.day}
                                        className="grid gap-2 border-t border-line py-5 sm:grid-cols-[150px_1fr] sm:gap-6"
                                    >
                                        <h3 className="text-lg font-semibold">{day.day}</h3>
                                        <ul className="list-disc space-y-1.5 pl-5 text-[16.5px] text-muted marker:text-dim">
                                            {day.items.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {gallery.length > 0 && (
                        <section aria-labelledby="gallery-title">
                            <h2 id="gallery-title" className="text-2xl font-semibold tracking-tight">
                                Photos
                            </h2>
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                {gallery.map((src) => (
                                    <div
                                        key={src}
                                        className="relative aspect-4/3 overflow-hidden rounded-2xl bg-plum"
                                    >
                                        <Image
                                            src={src}
                                            alt=""
                                            fill
                                            sizes="(min-width: 1024px) 300px, 45vw"
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {faq.length > 0 && (
                        <section aria-labelledby="faq-title">
                            <h2 id="faq-title" className="text-2xl font-semibold tracking-tight">
                                Questions
                            </h2>
                            <div className="mt-5 border-b border-line">
                                {faq.map((item) => (
                                    <details key={item.q} className="group border-t border-line py-4">
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                                            {item.q}
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="size-5 shrink-0 stroke-muted transition-transform group-open:rotate-180"
                                                fill="none"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <path d="M6 9l6 6 6-6" />
                                            </svg>
                                        </summary>
                                        <p className="mt-3 max-w-2xl text-[16.5px] text-muted">{item.a}</p>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <aside className="order-first rounded-[22px] border border-line bg-plum p-5 lg:sticky lg:top-24 lg:order-none">
                    {event.imageUrl && (
                        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-ink">
                            <Image
                                src={event.imageUrl}
                                alt=""
                                fill
                                priority
                                sizes="(min-width: 1024px) 340px, 92vw"
                                className="object-cover"
                            />
                        </div>
                    )}

                    <dl className="mt-5 space-y-3 font-meta text-[15px] text-muted">
                        {event.location && (
                            <div className="flex items-center gap-2.5">
                                <dt className="sr-only">Where</dt>
                                <PinIcon />
                                <dd>{event.location}</dd>
                            </div>
                        )}
                        {event.dateLabel && (
                            <div className="flex items-center gap-2.5">
                                <dt className="sr-only">When</dt>
                                <CalendarIcon />
                                <dd>{event.dateLabel}</dd>
                            </div>
                        )}
                        {event.price && (
                            <div className="flex items-center gap-2.5">
                                <dt className="sr-only">Price</dt>
                                <TicketIcon />
                                <dd className="text-cream">{event.price}</dd>
                            </div>
                        )}
                    </dl>

                    {event.priceNote && (
                        <p className="mt-2 pl-7 font-meta text-[13.5px] text-muted">
                            {event.priceNote}
                        </p>
                    )}

                    <div className="mt-6 grid gap-3">
                        <Pill
                            href={whatsappLink(
                                `Hi MeepleMania, I want to book ${event.title}${event.dateLabel ? ` (${event.dateLabel})` : ""
                                }.`,
                            )}
                            className="w-full"
                        >
                            Reserve on WhatsApp
                        </Pill>
                        <Pill
                            href={whatsappLink(
                                `Hi MeepleMania, I have a question about ${event.title}.`,
                            )}
                            variant="ghost"
                            className="w-full"
                        >
                            Ask a question
                        </Pill>
                    </div>
                </aside>
            </div>
        </article>
    );
}