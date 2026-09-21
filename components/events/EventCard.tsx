"use client";

import Image from "next/image";
import Link from "next/link";
import { Pill } from "@/components/ui/Pill";
import { whatsappLink } from "@/lib/site";
import { useDaysUntil } from "@/lib/use-saved-events";
import type { EventCardData } from "@/lib/event-view";

type CardProps = {
    event: EventCardData;
    saved: boolean;
    onToggleSaved: (slug: string) => void;
};

const icon = {
    fill: "none",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

function PinIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-3.75 shrink-0 stroke-dim"
            {...icon}
            aria-hidden="true"
        >
            <path d="M12 21s-7-6.2-7-11.3A7 7 0 0 1 19 9.7C19 14.8 12 21 12 21Z" />
            <circle cx="12" cy="9.7" r="2.5" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-3.75 shrink-0 stroke-dim"
            {...icon}
            aria-hidden="true"
        >
            <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
    );
}

function TicketIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-3.75 shrink-0 stroke-dim"
            {...icon}
            aria-hidden="true"
        >
            <path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3Z" />
            <path d="M14 6v12" strokeDasharray="2 2.5" />
        </svg>
    );
}

function HeartButton({ event, saved, onToggleSaved }: CardProps) {
    return (
        <button
            type="button"
            aria-pressed={saved}
            aria-label={`Save ${event.title}`}
            onClick={() => onToggleSaved(event.slug)}
            className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-ink/60 backdrop-blur-sm transition-colors hover:bg-ink/80"
        >
            <svg
                viewBox="0 0 24 24"
                className={`size-4.25 stroke-2 ${saved ? "fill-pink stroke-pink" : "fill-none stroke-cream"
                    }`}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M12 20.5s-7.5-4.4-9.3-9.2C1.5 8 3.4 4.8 6.6 4.8c1.9 0 3.4 1 4.4 2.6 1-1.6 2.5-2.6 4.4-2.6 3.2 0 5.1 3.2 3.9 6.5-1.8 4.8-7.3 9.2-7.3 9.2Z" />
            </svg>
        </button>
    );
}

function CategoryTag({ event }: { event: EventCardData }) {
    if (!event.category) return null;
    return (
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 font-meta text-[12.5px] font-semibold text-cream backdrop-blur-sm">
            <span
                className="size-2 rounded-full"
                style={{ backgroundColor: event.categoryColor ?? "#f5a524" }}
            />
            {event.category}
        </span>
    );
}

function Photo({ event, sizes }: { event: EventCardData; sizes: string }) {
    return (
        <>
            {event.imageUrl && (
                <Image
                    src={event.imageUrl}
                    alt=""
                    fill
                    sizes={sizes}
                    className="object-cover"
                />
            )}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/60 to-transparent to-45%"
            />
            <CategoryTag event={event} />
        </>
    );
}

function isPending(text: string | null) {
    return !text || /coming soon/i.test(text);
}

export function EventCard(props: CardProps) {
    const { event } = props;
    return (
        <article className="relative flex min-w-0 flex-col gap-3.5">
            <Link
                href={`/events/${event.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="relative block aspect-4/3 overflow-hidden rounded-2xl bg-plum"
            >
                <Photo
                    event={event}
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw"
                />
            </Link>
            <HeartButton {...props} />

            {event.location && (
                <p className="flex items-center gap-1.75 font-meta text-[13.5px] text-muted">
                    <PinIcon />
                    {event.location}
                </p>
            )}

            <h3 className="text-xl font-semibold leading-tight">
                <Link
                    href={`/events/${event.slug}`}
                    className="underline-offset-4 hover:underline"
                >
                    {event.title}
                </Link>
            </h3>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-meta text-[13.5px] text-muted">
                {event.dateLabel && (
                    <span
                        className={`inline-flex items-center gap-1.75 ${isPending(event.dateLabel) ? "text-dim" : ""
                            }`}
                    >
                        <CalendarIcon />
                        {event.dateLabel}
                    </span>
                )}
                {event.dateLabel && event.price && (
                    <i className="h-3.5 w-px bg-line-strong" aria-hidden="true" />
                )}
                {event.price && (
                    <span
                        className={`inline-flex items-center gap-1.75 ${isPending(event.price) ? "text-dim" : ""
                            }`}
                    >
                        <TicketIcon />
                        {event.price}
                    </span>
                )}
            </div>
        </article>
    );
}

export function FeatureEventCard(props: CardProps) {
    const { event } = props;
    const days = useDaysUntil(event.startsAt);
    const countdown =
        days === null || days < 1
            ? null
            : days === 1
                ? "Tomorrow"
                : `${days} days to go`;

    return (
        <article className="relative flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-line bg-plum sm:col-span-2 md:flex-row">
            <Link
                href={`/events/${event.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="relative block aspect-4/3 md:aspect-auto md:min-h-85 md:w-[46%] md:shrink-0"
            >
                <Photo event={event} sizes="(min-width: 768px) 420px, 92vw" />
            </Link>
            <HeartButton {...props} />

            <div className="flex flex-1 flex-col gap-3.5 p-5.5 md:p-7">
                {event.location && (
                    <p className="flex items-center gap-1.75 font-meta text-[13.5px] text-muted">
                        <PinIcon />
                        {event.location}
                    </p>
                )}
                <h3 className="text-[clamp(1.6rem,2.7vw,2rem)] font-semibold leading-[1.12] tracking-tight">
                    <Link
                        href={`/events/${event.slug}`}
                        className="underline-offset-4 hover:underline"
                    >
                        {event.title}
                    </Link>
                </h3>
                <p className="text-[16.5px] text-muted">{event.description}</p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-meta text-[13.5px] text-muted">
                    {event.dateLabel && (
                        <span className="inline-flex items-center gap-1.75">
                            <CalendarIcon />
                            {event.dateLabel}
                        </span>
                    )}
                    {countdown && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-lamp/40 bg-lamp/15 py-1 pl-2.5 pr-3 text-[#ffd9a1]">
                            <span className="size-1.75 rounded-full bg-lamp" />
                            {countdown}
                        </span>
                    )}
                </div>

                {event.price && (
                    <p className="text-2xl font-semibold leading-tight">
                        {event.price}
                        {event.priceNote && (
                            <small className="mt-0.5 block font-meta text-[13.5px] font-normal text-muted">
                                {event.priceNote}
                            </small>
                        )}
                    </p>
                )}

                <div className="mt-auto flex flex-wrap gap-2.5 pt-1.5">
                    <Pill
                        size="sm"
                        href={whatsappLink(`Hi MeepleMania, I want to book ${event.title}.`)}
                    >
                        Reserve a spot
                    </Pill>
                    <Pill size="sm" variant="ghost" href={`/events/${event.slug}`}>
                        View details
                    </Pill>
                </div>
            </div>
        </article>
    );
}