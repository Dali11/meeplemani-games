"use client";

import { useState } from "react";
import { Pill } from "@/components/ui/Pill";
import { whatsappLink } from "@/lib/site";
import { useSavedEvents } from "@/lib/use-saved-events";
import type { EventCardData } from "@/lib/event-view";
import { EventCard, FeatureEventCard } from "./EventCard";

type Props = {
    events: EventCardData[];
    /** The event shown as the large card, chosen on the server */
    featuredSlug: string | null;
};

export function EventsGrid({ events, featuredSlug }: Props) {
    const [filter, setFilter] = useState("All");
    const { saved, toggle } = useSavedEvents();

    if (events.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-line-strong p-8">
                <h3 className="text-xl font-semibold">New events are on the way</h3>
                <p className="mt-2 max-w-lg text-muted">
                    Nothing is listed right now. Message us on WhatsApp and we will tell
                    you what is coming up.
                </p>
                <Pill
                    className="mt-5"
                    href={whatsappLink("Hi MeepleMania, what events are coming up?")}
                >
                    Ask on WhatsApp
                </Pill>
            </div>
        );
    }

    const categories = [
        "All",
        ...Array.from(
            new Set(events.map((e) => e.category).filter((c): c is string => !!c)),
        ),
    ];

    const featured = events.find((e) => e.slug === featuredSlug);
    const ordered = featured
        ? [featured, ...events.filter((e) => e.slug !== featured.slug)]
        : events;
    const visible =
        filter === "All" ? ordered : ordered.filter((e) => e.category === filter);

    return (
        <div>
            <div
                role="group"
                aria-label="Filter events"
                className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
            >
                {categories.map((c) => (
                    <button
                        key={c}
                        type="button"
                        aria-pressed={filter === c}
                        onClick={() => setFilter(c)}
                        className={`min-h-10 shrink-0 rounded-full border px-4 text-[15px] transition-colors ${filter === c
                                ? "border-cream bg-cream font-medium text-[#1b1630]"
                                : "border-line-strong text-muted hover:border-white/35 hover:text-cream"
                            }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((event) =>
                    event.slug === featuredSlug ? (
                        <FeatureEventCard
                            key={event.slug}
                            event={event}
                            saved={saved.includes(event.slug)}
                            onToggleSaved={toggle}
                        />
                    ) : (
                        <EventCard
                            key={event.slug}
                            event={event}
                            saved={saved.includes(event.slug)}
                            onToggleSaved={toggle}
                        />
                    ),
                )}

                {filter === "All" && (
                    <div className="flex flex-col items-start justify-center gap-3.5 self-start rounded-2xl border-[1.5px] border-dashed border-line-strong bg-white/2 p-7 lg:aspect-4/3">
                        <h3 className="text-[22px] font-semibold">More on the way</h3>
                        <p className="text-muted">
                            Trivia nights, tournaments and community sessions are added as
                            soon as they are confirmed.
                        </p>
                        <Pill size="sm" variant="ghost" href="/events">
                            See all events
                        </Pill>
                    </div>
                )}
            </div>
        </div>
    );
}