"use client";

import { useState } from "react";
import { Pill } from "./ui/Pill";
import { EventCard } from "./EventCard";
import type { EventCategory, EventItem } from "../lib/events";

type FilterValue = "all" | EventCategory;

const FILTERS: { value: FilterValue; label: string }[] = [
    { value: "all", label: "All" },
    { value: "game", label: "Game nights" },
    { value: "adventure", label: "Adventures" },
    { value: "corporate", label: "Corporate" },
];

export function UpcomingEvents({ events: allEvents }: { events: EventItem[] }) {
    const [filter, setFilter] = useState<FilterValue>("all");
    const events =
        filter === "all"
            ? allEvents
            : allEvents.filter((e) => e.category === filter);

    return (
        <section id="events" className="border-b border-line py-20 lg:py-24">
            <div className="wrap">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-cream sm:text-4xl">
                            Upcoming events
                        </h2>
                        <p className="mt-2 max-w-md text-muted">
                            Tap any event for details, then book on WhatsApp. Prices are in
                            Malawi Kwacha.
                        </p>
                    </div>

                    <div
                        role="group"
                        aria-label="Filter events by category"
                        className="flex flex-wrap gap-2"
                    >
                        {FILTERS.map((f) => {
                            const active = filter === f.value;
                            return (
                                <button
                                    key={f.value}
                                    type="button"
                                    onClick={() => setFilter(f.value)}
                                    aria-pressed={active}
                                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${active
                                        ? "border-transparent bg-cream text-ink"
                                        : "border-line-strong bg-white/5 text-muted hover:text-cream"
                                        }`}
                                >
                                    {f.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {events.length === 0 ? (
                    <p className="mt-12 text-muted">
                        Nothing in this category yet — check back soon or see all events.
                    </p>
                ) : (
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {events.map((event, i) => (
                            <div
                                key={event.slug}
                                className={`event-card-rise ${event.featured ? "md:col-span-2" : ""}`}
                                style={{ animationDelay: `${i * 90}ms` }}
                            >
                                <EventCard event={event} />
                            </div>
                        ))}

                        <div className="event-card-rise flex flex-col justify-center gap-3 rounded-3xl border border-dashed border-line-strong p-7">
                            <h3 className="text-lg font-bold text-cream">More on the way</h3>
                            <p className="text-sm text-muted">
                                Trivia nights, tournaments and community sessions are added as
                                soon as they are confirmed.
                            </p>
                            <Pill href="/events" variant="ghost" size="sm" className="w-fit">
                                See all events
                            </Pill>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}