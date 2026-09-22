import Image from "next/image";
import type { ColoringSubmissionRow } from "@/db/schema";
import { Pill } from "@/components/ui/Pill";
import { whatsappLink } from "@/lib/site";

function credit(s: ColoringSubmissionRow) {
    if (s.childName && s.childAge) return `${s.childName}, age ${s.childAge}`;
    if (s.childName) return s.childName;
    return null;
}

export function MasterpieceWall({ photos }: { photos: ColoringSubmissionRow[] }) {
    return (
        <section aria-labelledby="wall-title" className="border-b border-line py-16 lg:py-24">
            <div className="wrap">
                <h2
                    id="wall-title"
                    className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                >
                    Show us your masterpiece
                </h2>
                <p className="mt-2 max-w-xl text-[16.5px] text-muted">
                    Colored pages from our Kids Fun Days — sent in by families like yours.
                </p>

                {photos.length > 0 && (
                    <div className="mt-10 flex flex-wrap gap-6">
                        {photos.map((photo, i) => (
                            <figure
                                key={photo.id}
                                className={`w-40 shrink-0 rounded-[6px] bg-cream p-3 pb-5 shadow-lg sm:w-44 ${i % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]"
                                    }`}
                            >
                                <div className="relative aspect-square overflow-hidden bg-plum">
                                    <Image
                                        src={photo.imageUrl}
                                        alt={credit(photo) ?? "A colored-in page from a MeepleMania event"}
                                        fill
                                        sizes="176px"
                                        className="object-cover"
                                    />
                                </div>
                                {credit(photo) && (
                                    <figcaption className="mt-3 text-center font-meta text-[13.5px] text-[#3a3352]">
                                        {credit(photo)}
                                    </figcaption>
                                )}
                            </figure>
                        ))}
                    </div>
                )}

                <p className="mt-10 text-[15.5px] text-muted">
                    <span className="font-semibold text-cream">Want yours here?</span> Send a photo on{" "}
                    <Pill
                        href={whatsappLink(
                            "Hi MeepleMania, here's a photo of my child's colored page for your wall!",
                        )}
                        variant="wa"
                        size="sm"
                        className="ml-1 align-middle"
                    >
                        WhatsApp
                    </Pill>{" "}
                    and we&apos;ll add it after our next event.
                </p>
            </div>
        </section>
    );
}