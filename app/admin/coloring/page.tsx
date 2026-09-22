import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin-auth";
import { listAllColoringCategories, type AdminColoringCategoryRow } from "@/lib/admin-queries";
import { setColoringStatus } from "./actions";


export const metadata: Metadata = { title: "Coloring books" };

const STATUS_LABEL: Record<string, string> = {
    published: "Published",
    draft: "Draft",
};

const STATUS_DOT: Record<string, string> = {
    published: "bg-mint",
    draft: "bg-lamp",
};

function subtitle(c: AdminColoringCategoryRow) {
    return c.downloadUrl ? "PDF ready" : "No PDF yet";
}

export default async function AdminColoringPage() {
    await requireAdmin();
    const rows = await listAllColoringCategories();

    return (
        <div className="wrap py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coloring books</h1>
                    <p className="mt-1 text-muted">
                        {rows.length} {rows.length === 1 ? "category" : "categories"} in total.
                    </p>
                </div>
                <Link
                    href="/admin/coloring/new"
                    className="inline-flex min-h-11 items-center rounded-full bg-lamp px-5 text-[15px] font-semibold text-[#1b1206] transition-colors hover:bg-lamp-bright"
                >
                    New category
                </Link>
            </div>

            {rows.length === 0 ? (
                <p className="mt-10 rounded-2xl border border-dashed border-line-strong p-8 text-muted">
                    No coloring categories yet. Create your first one to see it here.
                </p>
            ) : (
                <ul className="mt-8 grid gap-3">
                    {rows.map((c) => (
                        <li
                            key={c.id}
                            className="flex flex-col gap-3 rounded-2xl border border-line bg-plum p-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
                        >
                            <div className="flex min-w-0 items-center gap-3 sm:flex-1">
                                <span
                                    className={`size-2.5 shrink-0 rounded-full ${STATUS_DOT[c.status] ?? "bg-dim"}`}
                                    title={STATUS_LABEL[c.status] ?? c.status}
                                />
                                <div className="min-w-0 flex-1">
                                    <Link
                                        href={`/admin/coloring/${c.id}`}
                                        className="font-semibold underline-offset-4 hover:underline"
                                    >
                                        {c.title}
                                    </Link>
                                    <p className="mt-0.5 truncate text-[14.5px] text-muted">{subtitle(c)}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {(["published", "draft"] as const).map((s) => (
                                    <form key={s} action={setColoringStatus}>
                                        <input type="hidden" name="id" value={c.id} />
                                        <input type="hidden" name="status" value={s} />
                                        <button
                                            type="submit"
                                            disabled={c.status === s}
                                            className={`min-h-9 rounded-full border px-3.5 text-[14px] transition-colors ${c.status === s
                                                    ? "border-cream bg-cream font-medium text-[#1b1630]"
                                                    : "border-line-strong text-muted hover:text-cream"
                                                }`}
                                        >
                                            {STATUS_LABEL[s]}
                                        </button>
                                    </form>
                                ))}
                                {c.status === "published" && (

                                <a    href = "/coloring-books"
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