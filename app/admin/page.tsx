import type { Metadata } from "next";
import Link from "next/link";
import { deleteInquiry, updateInquiryStatus } from "@/app/admin/actions";
import {
  countByStatus,
  listInquiries,
  STATUSES,
  type InquiryRow,
  type InquiryStatus,
} from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Inbox" };

type SearchParams = {
  status?: string;
  kind?: string;
  q?: string;
  limit?: string;
};

const PAGE = 30;

const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  done: "Done",
};

const STATUS_DOT: Record<InquiryStatus, string> = {
  new: "bg-lamp",
  contacted: "bg-lake",
  done: "bg-mint",
};

const DETAIL_LABEL: Record<string, string> = {
  format: "Format",
  teamSize: "Team size",
  location: "Where",
  date: "Preferred date",
  budget: "Budget",
  topic: "Topic",
};

function timeAgo(date: Date) {
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function fullDate(date: Date) {
  return date.toLocaleString("en-GB", {
    timeZone: "Africa/Blantyre",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** A WhatsApp link. Local Malawi numbers that start with 0 get the 265 country code. */
function whatsappUrl(phone: string | null) {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (!phone.trim().startsWith("+") && digits.startsWith("0") && digits.length === 10) {
    digits = `265${digits.slice(1)}`;
  }
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

function summaryLine(row: InquiryRow) {
  const d = row.details ?? {};
  if (row.kind === "quote") {
    return [d.format, d.teamSize ? `${d.teamSize} people` : "", d.location]
      .filter(Boolean)
      .join(", ");
  }
  return d.topic ?? "Message";
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const status = (STATUSES as readonly string[]).includes(params.status ?? "")
    ? (params.status as InquiryStatus)
    : undefined;
  const kind =
    params.kind === "quote" || params.kind === "contact" ? params.kind : undefined;
  const q = (params.q ?? "").trim().slice(0, 80) || undefined;
  const limit = Math.min(Math.max(Number(params.limit) || PAGE, PAGE), 300);

  const [rows, counts] = await Promise.all([
    listInquiries({ status, kind, q, limit }),
    countByStatus(),
  ]);
  const total = counts.new + counts.contacted + counts.done;

  function link(next: Partial<SearchParams>) {
    const merged = { status, kind, q, ...next };
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (value) search.set(key, String(value));
    }
    const text = search.toString();
    return text ? `/admin?${text}` : "/admin";
  }

  const tabs: { label: string; value: InquiryStatus | undefined; count: number }[] = [
    { label: "All", value: undefined, count: total },
    { label: "New", value: "new", count: counts.new },
    { label: "Contacted", value: "contacted", count: counts.contacted },
    { label: "Done", value: "done", count: counts.done },
  ];

  return (
    <div className="wrap py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="mt-1 text-muted">
            {counts.new > 0
              ? `${counts.new} new ${counts.new === 1 ? "request" : "requests"} waiting for a reply.`
              : "No new requests. You are all caught up."}
          </p>
        </div>

        <form method="get" action="/admin" role="search" className="flex w-full gap-2 sm:w-auto">
          {status && <input type="hidden" name="status" value={status} />}
          {kind && <input type="hidden" name="kind" value={kind} />}
          <label htmlFor="q" className="sr-only">
            Search requests
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search name, company, email..."
            className="min-w-0 flex-1 rounded-full border border-line-strong bg-white/5 px-4 py-2 text-[15px] text-cream placeholder:text-dim focus:border-lamp focus:outline-none sm:w-64 sm:flex-none"
          />
          <button
            type="submit"
            className="rounded-full border border-line-strong px-4 py-2 text-[15px] text-muted transition-colors hover:text-cream"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = status === tab.value;
            return (
              <Link
                key={tab.label}
                href={link({ status: tab.value, limit: undefined })}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-[15px] transition-colors ${active
                    ? "border-cream bg-cream font-medium text-[#1b1630]"
                    : "border-line-strong text-muted hover:text-cream"
                  }`}
              >
                {tab.label}
                <span className="font-meta text-[13px] opacity-70">{tab.count}</span>
              </Link>
            );
          })}
        </nav>

        <nav aria-label="Filter by type" className="flex gap-2 text-[14px]">
          {[
            { label: "All types", value: undefined },
            { label: "Quotes", value: "quote" },
            { label: "Messages", value: "contact" },
          ].map((k) => (
            <Link
              key={k.label}
              href={link({ kind: k.value as SearchParams["kind"], limit: undefined })}
              aria-current={kind === k.value ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 transition-colors ${kind === k.value ? "bg-white/10 text-cream" : "text-muted hover:text-cream"
                }`}
            >
              {k.label}
            </Link>
          ))}
        </nav>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line-strong p-8 text-muted">
          {q || status || kind
            ? "Nothing matches these filters."
            : "No requests yet. New quote requests and messages from the website appear here."}
        </p>
      ) : (
        <ul className="mt-6 grid gap-3">
          {rows.map((row: InquiryRow) => {
            const current = (STATUSES as readonly string[]).includes(row.status)
              ? (row.status as InquiryStatus)
              : "new";
            const details = Object.entries(row.details ?? {}).filter(([, v]) => v);
            const wa = whatsappUrl(row.phone);

            return (
              <li key={row.id}>
                <details className="group rounded-2xl border border-line bg-plum open:border-line-strong">
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-4 [&::-webkit-details-marker]:hidden">
                    <span
                      className={`size-2.5 shrink-0 rounded-full ${STATUS_DOT[current]}`}
                      title={STATUS_LABEL[current]}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-semibold">{row.name}</span>
                        {row.company && (
                          <span className="text-muted">{row.company}</span>
                        )}
                        <span className="rounded-full border border-line-strong px-2 py-0.5 font-meta text-[12px] text-muted">
                          {row.kind === "quote" ? "Quote" : "Message"}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-[14.5px] text-muted">
                        {summaryLine(row)}
                      </span>
                    </span>
                    <span
                      className="shrink-0 text-right font-meta text-[13px] text-dim"
                      title={fullDate(row.createdAt)}
                    >
                      {timeAgo(row.createdAt)}
                    </span>
                  </summary>

                  <div className="border-t border-line p-4 sm:p-6">
                    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                      <div>
                        <dt className="font-meta text-[13px] text-dim">Email</dt>
                        <dd>
                          {row.email ? (

                            <a href={`mailto:${row.email}`}
                              className="break-all underline underline-offset-4"
                            >
                              {row.email}
                            </a>
                          ) : (
                            <span className="text-dim">Not given</span>
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-meta text-[13px] text-dim">Phone</dt>
                        <dd>
                          {row.phone ? (

                            <a href={`tel:${row.phone.replace(/\s/g, "")}`}
                              className="underline underline-offset-4"
                            >
                              {row.phone}
                            </a>
                          ) : (
                            <span className="text-dim">Not given</span>
                          )}
                        </dd>
                      </div>
                      {details.map(([key, value]) => (
                        <div key={key}>
                          <dt className="font-meta text-[13px] text-dim">
                            {DETAIL_LABEL[key] ?? key}
                          </dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                      <div>
                        <dt className="font-meta text-[13px] text-dim">Received</dt>
                        <dd>{fullDate(row.createdAt)}</dd>
                      </div>
                    </dl>

                    {row.message && (
                      <div className="mt-5">
                        <p className="font-meta text-[13px] text-dim">Message</p>
                        <p className="mt-1 max-w-2xl whitespace-pre-wrap text-[16px]">
                          {row.message}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
                      {row.email && (

                        <a href={`mailto:${row.email}?subject=${encodeURIComponent(
                          "Your MeepleMania Games enquiry",
                        )}`}
                          className="inline-flex min-h-10 items-center rounded-full bg-lamp px-5 text-[15px] font-semibold text-[#1b1206] transition-colors hover:bg-lamp-bright"
                        >
                          Reply by email
                        </a>
                      )}
                      {wa && (

                        <a href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center rounded-full bg-wa px-5 text-[15px] font-semibold text-[#04210f] transition-colors hover:brightness-110"
                        >
                          Open WhatsApp
                        </a>
                      )}

                      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                        <span className="font-meta text-[13px] text-dim">Mark as</span>
                        {STATUSES.map((s) => (
                          <form key={s} action={updateInquiryStatus}>
                            <input type="hidden" name="id" value={row.id} />
                            <input type="hidden" name="status" value={s} />
                            <button
                              type="submit"
                              disabled={current === s}
                              className={`min-h-9 rounded-full border px-3.5 text-[14px] transition-colors ${current === s
                                  ? "border-cream bg-cream font-medium text-[#1b1630]"
                                  : "border-line-strong text-muted hover:text-cream"
                                }`}
                            >
                              {STATUS_LABEL[s]}
                            </button>
                          </form>
                        ))}
                      </div>
                    </div>

                    <details className="mt-4 text-[14px]">
                      <summary className="w-fit cursor-pointer list-none text-dim transition-colors hover:text-pink [&::-webkit-details-marker]:hidden">
                        Delete this request
                      </summary>
                      <form action={deleteInquiry} className="mt-3 flex items-center gap-3">
                        <input type="hidden" name="id" value={row.id} />
                        <span className="text-muted">This cannot be undone.</span>
                        <button
                          type="submit"
                          className="rounded-full border border-pink/60 px-4 py-1.5 text-pink transition-colors hover:bg-pink/10"
                        >
                          Yes, delete it
                        </button>
                      </form>
                    </details>
                  </div >
                </details >
              </li >
            );
          })}
        </ul >
      )}

      {
        rows.length === limit && (
          <div className="mt-6">
            <Link
              href={link({ limit: String(limit + PAGE) })}
              className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-5 text-[15px] text-muted transition-colors hover:text-cream"
            >
              Show more
            </Link>
          </div>
        )
      }
    </div >
  );
}