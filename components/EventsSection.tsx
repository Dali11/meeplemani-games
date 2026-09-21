import { getPublishedEvents } from "@/lib/queries";
import { toCardData } from "@/lib/event-view";
import { EventsGrid } from "@/components/events/EventsGrid";

export async function EventsSection() {
    const rows = await getPublishedEvents();
    const events = rows.map(toCardData);

    // The first event that has a real future date becomes the large card
    const now = Date.now();
    const featured = events.find(
        (e) => e.startsAt !== null && new Date(e.startsAt).getTime() > now,
    );

    return (
        <section
            id="events"
            aria-labelledby="events-title"
            className="wrap py-16 lg:py-24"
        >
            <div className="mb-8">
                <h2
                    id="events-title"
                    className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                >
                    Upcoming events
                </h2>
                <p className="mt-2 max-w-xl text-[16.5px] text-muted">
                    Tap any event for details, then book on WhatsApp. Prices are in Malawi
                    Kwacha.
                </p>
            </div>
            <EventsGrid events={events} featuredSlug={featured?.slug ?? null} />
        </section>
    );
}