import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin-auth";
import { listAllEvents, type AdminEventRow } from "@/lib/admin-queries";
import { setEventStatus } from "./actions";

export const metadata: Metadata = { title: "Events" };

const STATUS_LABEL: Record<string, string> = {
    published: "Published",
    draft: "Draft",
    archived: "Archived",
};

const STATUS_DOT: Record<string, string> = {
    published: "bg-mint",
    draft: "bg-lamp",
    archived: "bg-dim",
};

function whenLabel(e: AdminEventRow) {
    if (e.dateLabel) return e.dateLabel;
    return e.startsAt
        ? e.startsAt.toLocaleDateString("en-GB", { timeZone: "Africa/Blantyre", dateStyle: "medium" })
        : "No date set";
}

export default async function AdminEventsPage() {
    await requireAdmin();
    const eventRows = await listAllEvents();

    return (
        <div className="wrap py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Events</h1>
                    <p className="mt-1 text-muted">
                        {eventRows.length} {eventRows.length === 1 ? "event" : "events"} in total.
                    </p>
                </div>
                <Link
                    href="/admin/events/new"
                    className="inline-flex min-h-11 items-center rounded-full bg-lamp px-5 text-[15px] font-semibold text-[#1b1206] transition-colors hover:bg-lamp-bright"
                >
                    New event
                </Link>
            </div>

            {eventRows.length === 0 ? (
                <p className="mt-10 rounded-2xl border border-dashed border-line-strong p-8 text-muted">
                    No events yet. Create your first one to see it here.
                </p>
            ) : (
                <ul className="mt-8 grid gap-3">
                    {eventRows.map((e) => (
                        <li
                            key={e.id}
                            className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-plum p-4"
                        >
                            <span
                                className={`size-2.5 shrink-0 rounded-full ${STATUS_DOT[e.status] ?? "bg-dim"}`}
                                title={STATUS_LABEL[e.status] ?? e.status}
                            />
                            <div className="min-w-0 flex-1">
                                <Link
                                    href={`/admin/events/${e.id}`}
                                    className="font-semibold underline-offset-4 hover:underline"
                                >
                                    {e.title}
                                </Link>
                                <p className="mt-0.5 truncate text-[14.5px] text-muted">
                                    {e.category} | {whenLabel(e)} | {e.price ?? "No price set"}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {(["published", "draft", "archived"] as const).map((s) => (
                                    <form key={s} action={setEventStatus}>
                                        <input type="hidden" name="id" value={e.id} />
                                        <input type="hidden" name="status" value={s} />
                                        <button
                                            type="submit"
                                            disabled={e.status === s}
                                            className={`min-h-9 rounded-full border px-3.5 text-[14px] transition-colors ${e.status === s
                                                    ? "border-cream bg-cream font-medium text-[#1b1630]"
                                                    : "border-line-strong text-muted hover:text-cream"
                                                }`}
                                        >
                                            {STATUS_LABEL[s]}
                                        </button>
                                    </form>
                                ))}
                                {e.status === "published" && (

                                <a    href = {`/events/${e.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-9 rounded-full border border-line-strong px-3.5 py-1.5 text-[14px] text-muted transition-colors hover:text-cream"
                                >
                                View
                            </a>
                )}
                        </div>
            </li>
            ))}
        </ul>
    )
}
    </div >
  );
}