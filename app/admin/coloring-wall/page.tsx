import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { requireAdmin } from "@/lib/admin-auth";
import { listAllColoringSubmissions, type AdminColoringSubmissionRow } from "@/lib/admin-queries";
import { setSubmissionStatus } from "./actions";

export const metadata: Metadata = { title: "Coloring wall" };

const STATUS_LABEL: Record<string, string> = {
    published: "Published",
    draft: "Draft",
};

const STATUS_DOT: Record<string, string> = {
    published: "bg-mint",
    draft: "bg-lamp",
};

function credit(s: AdminColoringSubmissionRow) {
    if (s.childName && s.childAge) return `${s.childName}, age ${s.childAge}`;
    if (s.childName) return s.childName;
    return "No name given";
}

export default async function AdminColoringWallPage() {
    await requireAdmin();
    const rows = await listAllColoringSubmissions();

    return (
        <div className="wrap py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coloring wall</h1>
                    <p className="mt-1 text-muted">
                        {rows.length} {rows.length === 1 ? "photo" : "photos"} in total. Photos come
                        in over WhatsApp — add them here once you have one worth sharing.
                    </p>
                </div>
                <Link
                    href="/admin/coloring-wall/new"
                    className="inline-flex min-h-11 items-center rounded-full bg-lamp px-5 text-[15px] font-semibold text-[#1b1206] transition-colors hover:bg-lamp-bright"
                >
                    Add a photo
                </Link>
            </div>

            {rows.length === 0 ? (
                <p className="mt-10 rounded-2xl border border-dashed border-line-strong p-8 text-muted">
                    No photos yet. Add the first one to see it here.
                </p>
            ) : (
                <ul className="mt-8 grid gap-3">
                    {rows.map((s) => (
                        <li
                            key={s.id}
                            className="flex flex-col gap-3 rounded-2xl border border-line bg-plum p-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
                        >
                            <div className="flex min-w-0 items-center gap-3 sm:flex-1">
                                <span
                                    className={`size-2.5 shrink-0 rounded-full ${STATUS_DOT[s.status] ?? "bg-dim"}`}
                                    title={STATUS_LABEL[s.status] ?? s.status}
                                />
                                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-line bg-ink">
                                    <Image src={s.imageUrl} alt="" fill sizes="48px" className="object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <Link
                                        href={`/admin/coloring-wall/${s.id}`}
                                        className="font-semibold underline-offset-4 hover:underline"
                                    >
                                        {credit(s)}
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {(["published", "draft"] as const).map((st) => (
                                    <form key={st} action={setSubmissionStatus}>
                                        <input type="hidden" name="id" value={s.id} />
                                        <input type="hidden" name="status" value={st} />
                                        <button
                                            type="submit"
                                            disabled={s.status === st}
                                            className={`min-h-9 rounded-full border px-3.5 text-[14px] transition-colors ${s.status === st
                                                    ? "border-cream bg-cream font-medium text-[#1b1630]"
                                                    : "border-line-strong text-muted hover:text-cream"
                                                }`}
                                        >
                                            {STATUS_LABEL[st]}
                                        </button>
                                    </form>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}