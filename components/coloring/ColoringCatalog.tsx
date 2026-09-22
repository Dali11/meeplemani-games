"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ColoringCategoryRow } from "@/db/schema";

const FALLBACK_IMAGE = "/images/bg-home-hero.jpg";

type SortKey = "featured" | "newest" | "az";

const SORTS: { value: SortKey; label: string }[] = [
    { value: "newest", label: "Sort: Newest first" },
    { value: "featured", label: "Sort: Featured" },
    { value: "az", label: "Sort: A to Z" },
];

const DIFFICULTY_LABEL: Record<string, string> = {
    easy: "Easy",
    medium: "Medium",
    detailed: "Detailed",
};

const DIFFICULTY_DOTS: Record<string, number> = {
    easy: 1,
    medium: 2,
    detailed: 3,
};

function DownloadIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-4.5 shrink-0"
            fill="none"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 4v11m0 0-4-4m4 4 4-4" />
            <path d="M4 17.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" />
        </svg>
    );
}

function HeartIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-4.5"
            fill={filled ? "currentColor" : "none"}
            strokeWidth={1.8}
            aria-hidden="true"
        >
            <path d="M12 20.5s-7.5-4.6-9.7-9.2C.8 7.7 2.4 4.3 5.7 3.6c2-.4 4 .5 5.3 2.3.4.5 1.6.5 2 0 1.3-1.8 3.3-2.7 5.3-2.3 3.3.7 4.9 4.1 3.4 7.7-2.2 4.6-9.7 9.2-9.7 9.2Z" />
        </svg>
    );
}

function DifficultyPips({ difficulty }: { difficulty: string | null }) {
    if (!difficulty || !(difficulty in DIFFICULTY_DOTS)) return null;
    const filled = DIFFICULTY_DOTS[difficulty];

    return (
        <span className="inline-flex items-center gap-1.5" title={DIFFICULTY_LABEL[difficulty]}>
            <span className="flex items-center gap-0.5">
                {[1, 2, 3].map((i) => (
                    <span
                        key={i}
                        className={`size-1.5 rounded-full ${i <= filled ? "bg-cream" : "bg-white/15"}`}
                    />
                ))}
            </span>
            {DIFFICULTY_LABEL[difficulty]}
        </span>
    );
}

function priceLabel(priceMwk: number | null) {
    if (!priceMwk || priceMwk <= 0) return "Free";
    return `MWK ${priceMwk.toLocaleString("en-US")}`;
}

function CategoryTile({ category }: { category: ColoringCategoryRow }) {
    const [liked, setLiked] = useState(false);
    const comingSoon = !category.downloadUrl;
    const isFree = !category.priceMwk || category.priceMwk <= 0;

    const metaLine = [category.ageRange, category.pageCount ? `${category.pageCount} pages` : null]
        .filter(Boolean)
        .join(" · ");

    return (
        <div className="group flex flex-col">
            <div
                className={`relative aspect-square overflow-hidden rounded-[20px] border border-line bg-plum ${comingSoon ? "opacity-60" : ""
                    }`}
            >
                <Image
                    src={category.imageUrl ?? FALLBACK_IMAGE}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 280px, 45vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />

                {category.badge && !comingSoon && (
                    <span
                        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[12.5px] font-semibold ${category.badge === "popular" ? "bg-pink text-[#2b0e1e]" : "bg-lamp text-[#1b1206]"
                            }`}
                    >
                        {category.badge === "popular" ? "Popular" : "New"}
                    </span>
                )}

                <button
                    type="button"
                    onClick={() => setLiked((v) => !v)}
                    aria-pressed={liked}
                    aria-label={liked ? "Remove from favorites" : "Save as a favorite"}
                    className={`absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-line-strong bg-ink/60 backdrop-blur transition-colors hover:bg-ink/80 ${liked ? "text-pink" : "text-cream/80"
                        }`}
                >
                    <HeartIcon filled={liked} />
                </button>

                {!comingSoon && (
                    <Link
                        href={category.downloadUrl!}
                        className="absolute inset-x-0 bottom-0 flex min-h-11 translate-y-full items-center justify-center gap-2 bg-cream text-[15px] font-semibold text-[#1b1630] transition-transform duration-200 group-hover:translate-y-0 group-focus-within:translate-y-0"
                    >
                        <DownloadIcon />
                        Quick download
                    </Link>
                )}
            </div>

            <div className="mt-3 flex items-start justify-between gap-3">
                <h3 className="text-[16.5px] font-semibold leading-snug tracking-tight">{category.title}</h3>
                {!comingSoon && (
                    <span className={`shrink-0 text-[15px] font-semibold ${isFree ? "text-mint" : "text-lamp"}`}>
                        {priceLabel(category.priceMwk)}
                    </span>
                )}
            </div>

            {metaLine || category.difficulty ? (
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-muted">
                    {metaLine}
                    {metaLine && category.difficulty ? <span className="text-dim">·</span> : null}
                    <DifficultyPips difficulty={category.difficulty} />
                </p>
            ) : null}

            <p className="mt-1 text-[13.5px] font-medium text-dim">
                {comingSoon ? "Coming soon" : "Ready to print"}
            </p>
        </div>
    );
}

export function ColoringCatalog({
    categories,
    downloadableCount,
}: {
    categories: ColoringCategoryRow[];
    downloadableCount: number;
}) {
    const ageOptions = useMemo(() => {
        const seen = new Set<string>();
        for (const c of categories) if (c.ageRange) seen.add(c.ageRange);
        return Array.from(seen);
    }, [categories]);

    const [ageFilter, setAgeFilter] = useState<string>("all");
    const [sort, setSort] = useState<SortKey>("newest");

    const visible = useMemo(() => {
        const filtered =
            ageFilter === "all" ? categories : categories.filter((c) => c.ageRange === ageFilter);

        const sorted = [...filtered];
        if (sort === "newest") {
            sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sort === "az") {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            sorted.sort((a, b) => a.sortOrder - b.sortOrder);
        }
        return sorted;
    }, [categories, ageFilter, sort]);

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-[14.5px] text-dim">
                        {categories.length} {categories.length === 1 ? "set" : "sets"}
                    </span>
                    <button
                        type="button"
                        onClick={() => setAgeFilter("all")}
                        className={`min-h-9 rounded-full border px-3.5 text-[14px] transition-colors ${ageFilter === "all"
                                ? "border-lamp text-lamp"
                                : "border-line-strong text-muted hover:text-cream"
                            }`}
                    >
                        All ages
                    </button>
                    {ageOptions.map((age) => (
                        <button
                            key={age}
                            type="button"
                            onClick={() => setAgeFilter(age)}
                            className={`min-h-9 rounded-full border px-3.5 text-[14px] transition-colors ${ageFilter === age
                                    ? "border-lamp text-lamp"
                                    : "border-line-strong text-muted hover:text-cream"
                                }`}
                        >
                            {age}
                        </button>
                    ))}
                </div>

                <label className="text-[14px] text-muted">
                    <span className="sr-only">Sort sets</span>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="min-h-9 rounded-full border border-line-strong bg-white/5 px-3.5 pr-8 text-[14px] text-cream [color-scheme:dark] [&>option]:bg-plum [&>option]:text-cream"
                    >
                        {SORTS.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {visible.length === 0 ? (
                <p className="mt-8 rounded-2xl border border-dashed border-line-strong p-8 text-muted">
                    No sets match that age range yet.
                </p>
            ) : (
                <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                    {visible.map((category) => (
                        <CategoryTile key={category.id} category={category} />
                    ))}
                </div>
            )}

            {downloadableCount >= 2 && (
                <div className="mt-10 flex flex-col items-start gap-4 rounded-[22px] border border-line bg-plum px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[15.5px]">
                        <span className="font-semibold">{downloadableCount} sets</span>{" "}
                        <span className="text-muted">ready to download now</span>
                    </p>
                    <a
                        href="/api/coloring/download-all"
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-lamp px-6 text-[15px] font-semibold text-[#1b1206] transition-colors hover:bg-lamp-bright"
                    >
                        Download all {downloadableCount} (ZIP)
                    </a>
                </div>
            )}
        </div>
    );
}