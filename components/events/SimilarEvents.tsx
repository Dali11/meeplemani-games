"use client";

import { useSavedEvents } from "@/lib/use-saved-events";
import type { EventCardData } from "@/lib/event-view";
import { EventCard } from "./EventCard";

export function SimilarEvents({ events }: { events: EventCardData[] }) {
    const { saved, toggle } = useSavedEvents();

    if (events.length === 0) return null;

    return (
        <section aria-labelledby="similar-events-title" className="mt-14 border-t border-line pt-12">
            <h2 id="similar-events-title" className="text-2xl font-semibold tracking-tight">
                Similar events
            </h2>
            <div className="mt-6 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <EventCard
                        key={event.slug}
                        event={event}
                        saved={saved.includes(event.slug)}
                        onToggleSaved={toggle}
                    />
                ))}
            </div>
        </section>
    );
}