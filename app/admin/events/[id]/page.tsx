import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getEventById } from "@/lib/admin-queries";
import { deleteEvent } from "../actions";

export const metadata: Metadata = { title: "Edit event" };

const PROTECTED_SLUGS = ["corporate-team-building"];

export default async function EditEventPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ created?: string }>;
}) {
    await requireAdmin();

    const { id } = await params;
    const { created } = await searchParams;
    const event = await getEventById(id);
    if (!event) notFound();

    const canDelete = !PROTECTED_SLUGS.includes(event.slug);

    return (
        <div className="wrap py-10">
            <Link href="/admin/events" className="text-[15px] text-muted transition-colors hover:text-cream">
                &larr; All events
            </Link>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
                {event.status === "published" && (

                <a    href = {`/events/${event.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] text-lamp underline underline-offset-4"
                >
                View live page
            </a>
        )}
        </div>

      {
        created === "1" && (
            <p role="status" className="mt-4 max-w-3xl rounded-xl border border-mint/40 bg-mint/10 px-4 py-3 text-[15px]">
                Event created.
            </p>
        )
    }

    <div className="mt-8 max-w-3xl">
        <EventForm
            defaults={{
                id: event.id,
                title: event.title,
                slug: event.slug,
                description: event.description,
                location: event.location ?? "",
                dateLabel: event.dateLabel ?? "",
                startsAt: event.startsAt,
                category: event.category ?? "",
                price: event.price ?? "",
                priceNote: event.priceNote ?? "",
                imageUrl: event.imageUrl ?? "",
                highlights: event.highlights ?? [],
                schedule: event.schedule ?? [],
                faq: event.faq ?? [],
                galleryImages: event.galleryImages ?? [],
                status: event.status,
                sortOrder: event.sortOrder,
            }}
        />

        {canDelete ? (
            <details className="mt-8 border-t border-line pt-6 text-[14px]">
                <summary className="w-fit cursor-pointer list-none text-dim transition-colors hover:text-pink [&::-webkit-details-marker]:hidden">
                    Delete this event
                </summary>
                <form action={deleteEvent} className="mt-3 flex items-center gap-3">
                    <input type="hidden" name="id" value={event.id} />
                    <span className="text-muted">This removes it from the site. This cannot be undone.</span>
                    <button
                        type="submit"
                        className="rounded-full border border-pink/60 px-4 py-1.5 text-pink transition-colors hover:bg-pink/10"
                    >
                        Yes, delete it
                    </button>
                </form>
            </details>
        ) : (
            <p className="mt-8 border-t border-line pt-6 text-[14px] text-dim">
                This event supplies the FAQ on the Corporate page, so it cannot be deleted. Set it to Archived instead if you want to hide it.
            </p>
        )}
    </div>
    </div >
  );
}