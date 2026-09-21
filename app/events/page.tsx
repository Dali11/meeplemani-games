import type { Metadata } from "next";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { getUpcomingEvents } from "@/lib/queries";

export const metadata: Metadata = {
    title: "Events",
    description:
        "Board game nights, team building and lake retreats across Lilongwe and Blantyre, Malawi.",
};

// Refresh from the database at most every 5 minutes
export const revalidate = 300;

export default async function EventsPage() {
    const events = await getUpcomingEvents();

    return <UpcomingEvents events={events} />;
}