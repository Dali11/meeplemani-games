import type { Metadata } from "next";
import { Pill } from "@/components/ui/Pill";

import { getColoringCategories, getColoringSubmissions } from "@/lib/queries";
import { whatsappLink } from "@/lib/site";
import { MasterpieceWall } from "@/components/coloring/MasterpieceWall";
import { ColoringCatalog } from "@/components/coloring/ColoringCatalog";

export const metadata: Metadata = {
    title: "Coloring books",
    description:
        "Free printable coloring pages for kids, inspired by MeepleMania game nights, Lake Malawi adventures and our Kids Fun Day events.",
};

// Refresh from the database at most every 5 minutes
export const revalidate = 300;

const STEPS = [
    {
        number: 1,
        title: "Download",
        text: "Tap a ready set above to grab the PDF — no sign-up needed.",
    },
    {
        number: 2,
        title: "Print",
        text: "Works on any home printer. Card stock holds up best for younger colorists.",
    },
    {
        number: 3,
        title: "Color & show us",
        text: "Send us a photo — we love adding pages to the wall below.",
    },
];

export default async function ColoringBooksPage() {
    const [categories, submissions] = await Promise.all([
        getColoringCategories().catch(() => []),
        getColoringSubmissions().catch(() => []),
    ]);

    const downloadableCount = categories.filter((c) => c.downloadUrl).length;

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
                        Pick a favorite
                    </h2>
                    <p className="mt-2 max-w-xl text-[16.5px] text-muted">
                        {categories.length > 0
                            ? "All free to download — more sets added after every event."
                            : "Coloring pages are on the way. Check back soon."}
                    </p>

                    {categories.length > 0 && (
                        <div className="mt-8">
                            <ColoringCatalog categories={categories} downloadableCount={downloadableCount} />
                        </div>
                    )}
                </div>
            </section>

            <section aria-labelledby="how-title" className="border-b border-line py-16 lg:py-24">
                <div className="wrap">
                    <h2
                        id="how-title"
                        className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                    >
                        How it works
                    </h2>

                    <div className="mt-8 grid gap-5 sm:grid-cols-3">
                        {STEPS.map((step) => (
                            <div key={step.number} className="rounded-[22px] border border-line bg-plum p-6">
                                <span className="flex size-9 items-center justify-center rounded-full border border-lamp/40 bg-lamp/10 font-meta text-[15px] font-semibold text-lamp">
                                    {step.number}
                                </span>
                                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                                <p className="mt-2 text-[15.5px] text-muted">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <MasterpieceWall photos={submissions} />

            <section className="py-16 lg:py-20">
                <div className="wrap">
                    <h2 className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight">
                        Two ways to get more
                    </h2>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                        <div className="flex flex-col items-start gap-4 rounded-[28px] border border-line bg-plum p-8">
                            <div>
                                <h3 className="text-xl font-semibold tracking-tight">
                                    Printed copies at your event
                                </h3>
                                <p className="mt-2 text-[16px] text-muted">
                                    We bring printed coloring books and crayons to Kids Fun Days and
                                    family events. Message us to arrange a set for your next one.
                                </p>
                            </div>
                            <Pill
                                href={whatsappLink(
                                    "Hi MeepleMania, I'd like printed coloring books for an event.",
                                )}
                                variant="wa"
                            >
                                Ask on WhatsApp
                            </Pill>
                        </div>

                        <div className="flex flex-col items-start gap-4 rounded-[28px] border border-line bg-plum p-8">
                            <div>
                                <h3 className="text-xl font-semibold tracking-tight">
                                    Book a coloring corner
                                </h3>
                                <p className="mt-2 text-[16px] text-muted">
                                    A staffed coloring table for your party, school event or corporate
                                    family day — sets, crayons and a helper included.
                                </p>
                            </div>
                            <Pill href="/contact?topic=coloring#message" variant="lamp">
                                Get a quote
                            </Pill>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}