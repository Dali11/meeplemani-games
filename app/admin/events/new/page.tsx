import type { Metadata } from "next";
import Link from "next/link";
import { EventForm } from "@/components/admin/EventForm";
import { requireAdmin } from "@/lib/admin-auth";
import { emptyEventForm } from "@/lib/event-form";

export const metadata: Metadata = { title: "New event" };

export default async function NewEventPage() {
    await requireAdmin();

    return (
        <div className="wrap py-10">
            <Link href="/admin/events" className="text-[15px] text-muted transition-colors hover:text-cream">
                &larr; All events
            </Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">New event</h1>
            <div className="mt-8 max-w-3xl">
                <EventForm
                    defaults={{
                        ...emptyEventForm,
                        startsAt: null,
                        highlights: [],
                        schedule: [],
                        faq: [],
                        galleryImages: [],
                        organizerTags: [],
                        sortOrder: null,
                    }}
                />
            </div>
        </div>
    );
}