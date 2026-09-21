"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, MapPin, Calendar, CircleDollarSign } from "lucide-react";
import { Pill } from "./ui/Pill";
import {
    CATEGORY_BADGE_CLASS,
    CATEGORY_LABEL,
    daysUntil,
    type EventItem,
} from "../lib/events";

function SaveButton({ label }: { label: string }) {
    const [saved, setSaved] = useState(false);
    return (
        <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${label} from saved` : `Save ${label}`}
            className="relative z-10 flex size-9 items-center justify-center rounded-full bg-ink/60 text-cream backdrop-blur-sm transition-colors hover:bg-ink/80"
        >
            <Heart size={18} className={saved ? "fill-current" : ""} />
        </button>
    );
}

export function EventCard({ event }: { event: EventItem }) {
    const countdown = daysUntil(event.startsAt);

    if (event.featured) {
        return (
            <div className="group relative grid overflow-hidden rounded-3xl border border-line bg-surface transition-transform duration-300 hover:-translate-y-1 md:col-span-2 md:grid-cols-2">
                <div className="relative min-h-64 overflow-hidden md:min-h-full">
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span
                        className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_BADGE_CLASS[event.category]}`}
                    >
                        {CATEGORY_LABEL[event.category]}
                    </span>
                </div>

                <div className="flex flex-col justify-center gap-4 p-7">
                    <div className="flex items-start justify-between gap-3">
                        <p className="flex items-center gap-1.5 text-sm text-muted">
                            <MapPin size={15} /> {event.location}
                        </p>
                        <SaveButton label={event.title} />
                    </div>

                    <h3 className="text-2xl font-bold text-cream sm:text-3xl">
                        {event.title}
                    </h3>

                    {event.description && (
                        <p className="text-[15px] text-muted">{event.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted">
                        <span className="flex items-center gap-1.5">
                            <Calendar size={15} /> {event.dateLabel}
                        </span>
                        {countdown && (
                            <span className="rounded-full bg-lamp/15 px-2.5 py-1 text-xs font-medium text-lamp">
                                {countdown}
                            </span>
                        )}
                    </div>

                    <div>
                        <p className="text-xl font-bold text-cream">{event.price}</p>
                        {event.priceNote && (
                            <p className="text-sm text-muted">{event.priceNote}</p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 pt-1">
                        <Pill href={`/events/${event.slug}#reserve`} size="sm">
                            Reserve a spot
                        </Pill>
                        <Pill href={`/events/${event.slug}`} variant="ghost" size="sm">
                            View details
                        </Pill>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-transform duration-300 hover:-translate-y-1">
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                    className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_BADGE_CLASS[event.category]}`}
                >
                    {CATEGORY_LABEL[event.category]}
                </span>
                <div className="absolute right-3 top-3">
                    <SaveButton label={event.title} />
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="flex items-center gap-1.5 text-sm text-muted">
                    <MapPin size={15} /> {event.location}
                </p>
                <h3 className="text-lg font-bold text-cream">
                    <Link
                        href={`/events/${event.slug}`}
                        className="static after:absolute after:inset-0"
                    >
                        {event.title}
                    </Link>
                </h3>
                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-sm text-muted">
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> {event.dateLabel}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <CircleDollarSign size={14} /> {event.price}
                    </span>
                </div>
            </div>
        </div>
    );
}