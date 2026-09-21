"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type GalleryPhoto = {
    id: string;
    title: string;
    tag: string | null;
    imageUrl: string;
};

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
    const [filter, setFilter] = useState("All");
    const [index, setIndex] = useState(0);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const touchStartX = useRef<number | null>(null);

    const tags = [
        "All",
        ...Array.from(
            new Set(photos.map((p) => p.tag).filter((t): t is string => !!t)),
        ),
    ];
    const visible =
        filter === "All" ? photos : photos.filter((p) => p.tag === filter);
    const current = visible[index];

    function open(i: number) {
        setIndex(i);
        document.body.style.overflow = "hidden";
        dialogRef.current?.showModal();
    }

    function close() {
        dialogRef.current?.close();
    }

    function step(delta: number) {
        if (visible.length === 0) return;
        setIndex((i) => (i + delta + visible.length) % visible.length);
    }

    if (photos.length === 0) {
        return (
            <p className="rounded-2xl border border-dashed border-line-strong p-8 text-muted">
                Photos are on the way. Check back soon.
            </p>
        );
    }

    return (
        <div>
            <div
                role="group"
                aria-label="Filter photos"
                className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
            >
                {tags.map((t) => (
                    <button
                        key={t}
                        type="button"
                        aria-pressed={filter === t}
                        onClick={() => setFilter(t)}
                        className={`min-h-10 shrink-0 rounded-full border px-4 text-[15px] transition-colors ${filter === t
                                ? "border-cream bg-cream font-medium text-[#1b1630]"
                                : "border-line-strong text-muted hover:border-white/35 hover:text-cream"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <p className="mb-4 font-meta text-[13.5px] text-dim" aria-live="polite">
                {visible.length} {visible.length === 1 ? "photo" : "photos"}
            </p>

            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {visible.map((photo, i) => (
                    <li key={photo.id}>
                        <button
                            type="button"
                            onClick={() => open(i)}
                            aria-label={`View photo: ${photo.title}`}
                            className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-plum text-left"
                        >
                            <Image
                                src={photo.imageUrl}
                                alt=""
                                fill
                                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/85 via-transparent to-transparent to-60%"
                            />
                            <span className="absolute inset-x-0 bottom-0 p-3">
                                {photo.tag && (
                                    <span className="font-meta text-[12px] text-lamp">{photo.tag}</span>
                                )}
                                <span className="block text-[15px] font-semibold leading-tight">
                                    {photo.title}
                                </span>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            <dialog
                ref={dialogRef}
                aria-label="Photo viewer"
                onClose={() => {
                    document.body.style.overflow = "";
                }}
                onKeyDown={(e) => {
                    if (e.key === "ArrowRight") step(1);
                    if (e.key === "ArrowLeft") step(-1);
                }}
                className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-cream backdrop:bg-black/90"
            >
                <div
                    className="flex h-full flex-col items-center justify-center gap-4 p-4 sm:p-8"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) close();
                    }}
                    onTouchStart={(e) => {
                        touchStartX.current = e.touches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                        if (touchStartX.current === null) return;
                        const dx = e.changedTouches[0].clientX - touchStartX.current;
                        touchStartX.current = null;
                        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
                    }}
                >
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Close photo viewer"
                        className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                    >
                        <X className="size-5" aria-hidden="true" />
                    </button>

                    {visible.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => step(-1)}
                                aria-label="Previous photo"
                                className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:left-5"
                            >
                                <ChevronLeft className="size-6" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => step(1)}
                                aria-label="Next photo"
                                className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:right-5"
                            >
                                <ChevronRight className="size-6" aria-hidden="true" />
                            </button>
                        </>
                    )}

                    {current && (
                        <>
                            {/* A plain img keeps small photos crisp instead of stretching them */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={current.imageUrl}
                                alt={current.title}
                                className="max-h-[76dvh] max-w-full rounded-xl object-contain"
                            />
                            <p className="text-center">
                                <span className="block text-lg font-semibold">{current.title}</span>
                                <span className="font-meta text-[14px] text-muted">
                                    {current.tag ? `${current.tag} | ` : ""}
                                    {index + 1} of {visible.length}
                                </span>
                            </p>
                        </>
                    )}
                </div>
            </dialog>
        </div>
    );
}