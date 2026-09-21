import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Pill } from "@/components/ui/Pill";
import { getGalleryImages } from "@/lib/queries";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
    title: "Gallery",
    description:
        "Photos and videos from MeepleMania game nights, retreats, tournaments and community events in Malawi.",
};

// Refresh from the database at most every 5 minutes
export const revalidate = 300;

const VIDEOS = [
    { src: "/images/gallery-video-1.mp4", poster: "/images/gallery-kuwala-night.jpg" },
    { src: "/images/gallery-video-2.mp4", poster: "/images/gallery-tournament.jpg" },
    { src: "/images/gallery-video-3.mp4", poster: "/images/gallery-community.jpg" },
    { src: "/images/gallery-video-4.mp4", poster: "/images/gallery-valentines.jpg" },
];

export default async function GalleryPage() {
    const rows = await getGalleryImages().catch(() => []);
    const photos = rows.map((r) => ({
        id: r.id,
        title: r.title,
        tag: r.tag,
        imageUrl: r.imageUrl,
    }));

    return (
        <>
            <section className="border-b border-line py-14 lg:py-20">
                <div className="wrap">
                    <p className="font-meta text-[14px] text-lamp">Moments that matter</p>
                    <h1 className="mt-3 text-[length:clamp(2.4rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-tight">
                        Photo and event gallery
                    </h1>
                    <p className="mt-4 max-w-xl text-lg text-muted">
                        Game nights, retreats, tournaments and community days. See what
                        MeepleMania is all about.
                    </p>

                    <div className="mt-12">
                        <GalleryGrid photos={photos} />
                    </div>
                </div>
            </section>

            <section aria-labelledby="videos-title" className="border-b border-line py-16 lg:py-24">
                <div className="wrap">
                    <h2
                        id="videos-title"
                        className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                    >
                        In motion
                    </h2>
                    <p className="mt-2 max-w-xl text-[16.5px] text-muted">
                        Catch the energy of our events. Videos only load when you press
                        play, so they will not use your data until then.
                    </p>
                    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {VIDEOS.map((v) => (
                            <video
                                key={v.src}
                                controls
                                playsInline
                                preload="none"
                                poster={v.poster}
                                aria-label="Video from a MeepleMania event"
                                className="aspect-3/4 w-full rounded-2xl bg-black object-contain"
                            >
                                <source src={v.src} type="video/mp4" />
                            </video>
                        ))}
                    </div>
                </div>
            </section>

            <section aria-labelledby="join-title" className="py-16 lg:py-24">
                <div className="wrap">
                    <div className="rounded-[28px] border border-lamp/30 bg-plum p-8 sm:p-12">
                        <h2
                            id="join-title"
                            className="max-w-xl text-[clamp(1.75rem,3.6vw,2.6rem)] font-semibold leading-[1.1] tracking-tight text-balance"
                        >
                            Want to be in the next gallery?
                        </h2>
                        <p className="mt-3 max-w-lg text-muted">
                            Join our next board game event, retreat or tournament and make
                            some memories with us.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Pill href="/events#events">Explore upcoming events</Pill>
                            <Pill
                                href={whatsappLink("Hi MeepleMania, I would like to join your next event.")}
                                variant="wa"
                            >
                                Book a spot on WhatsApp
                            </Pill>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}