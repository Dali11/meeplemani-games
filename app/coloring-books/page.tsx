import type { Metadata } from "next";
import Image from "next/image";
import { Pill } from "@/components/ui/Pill";

import { whatsappLink } from "@/lib/site";
import { COLORING_CATEGORIES } from "@/db/coloring-books";

export const metadata: Metadata = {
    title: "Coloring books",
    description:
        "Free printable coloring pages for kids, inspired by MeepleMania game nights, Lake Malawi adventures and our Kids Fun Day events.",
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

export default function ColoringBooksPage() {
    return (
        <>
            <section className="border-b border-line py-14 lg:py-20">
                <div className="wrap">
                    <p className="font-meta text-[14px] text-lamp">For our youngest players</p>
                    <h1 className="mt-3 text-[length:clamp(2.4rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-tight">
                        Coloring books
                    </h1>
                    <p className="mt-4 max-w-xl text-lg text-muted">
                        Free printable coloring pages inspired by our game nights, lake
                        adventures and Kids Fun Day events. Print a set at home, or ask us
                        for physical copies at your next event.
                    </p>
                </div>
            </section>

            <section aria-labelledby="categories-title" className="border-b border-line py-16 lg:py-24">
                <div className="wrap">
                    <h2
                        id="categories-title"
                        className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                    >
                        Pick a set
                    </h2>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {COLORING_CATEGORIES.map((category) => (
                            <div
                                key={category.slug}
                                className="flex flex-col overflow-hidden rounded-[22px] border border-line bg-plum"
                            >
                                <div className="relative aspect-4/3 bg-ink">
                                    <Image
                                        src={category.image}
                                        alt=""
                                        fill
                                        sizes="(min-width: 1024px) 280px, 45vw"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col gap-3 p-5">
                                    <div>
                                        <h3 className="text-lg font-semibold tracking-tight">
                                            {category.title}
                                        </h3>
                                        <p className="mt-1.5 text-[15px] text-muted">
                                            {category.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-2">
                                        {category.downloadUrl ? (
                                            <Pill
                                                href={category.downloadUrl}
                                                variant="ghost"
                                                size="sm"
                                                className="w-full"
                                            >
                                                <DownloadIcon />
                                                Download PDF
                                            </Pill>
                                        ) : (
                                            <span className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-dashed border-line-strong px-4.5 text-[15px] text-dim">
                                                Coming soon
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-20">
                <div className="wrap flex flex-col items-start gap-5 rounded-[28px] border border-line bg-plum p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Want printed copies at your event?
                        </h2>
                        <p className="mt-2 max-w-lg text-[16.5px] text-muted">
                            We bring printed coloring books and crayons to Kids Fun Days and
                            family events. Message us to arrange a set for your next one.
                        </p>
                    </div>
                    <Pill
                     href={whatsappLink("Hi MeepleMania, I'd like printed coloring books for an event.")}
                        variant="wa"
                        className="w-full lg:w-auto"
                    >
                        Ask on WhatsApp
                    </Pill>
                </div>
            </section>
        </>
    );
}