import Image from "next/image";
import { Pill } from "./ui/Pill";
import { RECENT_NIGHTS_CAPTION, RECENT_NIGHTS_PREVIEW } from "../lib/gallery";

export function RecentGallery() {
    const [large, ...small] = RECENT_NIGHTS_PREVIEW;

    return (
        <section className="border-b border-line py-20 lg:py-24">
            <div className="wrap">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <h2 className="text-3xl font-bold text-cream sm:text-4xl">
                        From our recent nights
                    </h2>
                    <Pill href="/gallery" variant="ghost" size="sm">
                        Open the gallery
                    </Pill>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr]">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-auto sm:h-full sm:min-h-[22rem]">
                        <Image
                            src={large.src}
                            alt={large.alt}
                            fill
                            sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {small.map((image) => (
                            <div
                                key={image.src}
                                className="relative aspect-[4/3] overflow-hidden rounded-3xl"
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 25vw, 50vw"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <p className="mt-6 max-w-2xl text-muted">{RECENT_NIGHTS_CAPTION}</p>
            </div>
        </section>
    );
}