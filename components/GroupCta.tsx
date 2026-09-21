import Image from "next/image";
import { Pill } from "./ui/Pill";
import { SITE, whatsappLink } from "../lib/site";

export function GroupCta() {
    return (
        <section className="py-20 lg:py-24">
            <div className="wrap">
                <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-plum via-plum to-ink p-8 sm:p-12 lg:p-16">
                    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16">
                        <div>
                            <h2 className="text-3xl font-bold leading-tight text-cream sm:text-4xl">
                                Got a group and a date in mind?
                            </h2>
                            <p className="mt-4 max-w-md text-muted">
                                Message us on WhatsApp and we will help you choose a game
                                night, a team day or a weekend away.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Pill
                                    variant="wa"
                                    href={whatsappLink(
                                        "Hi MeepleMania! I have a group and I'm looking for the right experience."
                                    )}
                                >
                                    Message {SITE.phoneDisplay}
                                </Pill>
                                <Pill variant="ghost" href={`mailto:${SITE.email}`}>
                                    Email us
                                </Pill>
                            </div>
                        </div>

                        <div className="relative mx-auto aspect-[4/5] w-full max-w-xs">
                            <div className="absolute inset-0 rotate-3 overflow-hidden rounded-2xl border-4 border-cream/90 shadow-2xl">
                                <Image
                                    src="/images/bg-gallery-hero.jpg"
                                    alt="Friends gathered around a tabletop board game"
                                    fill
                                    sizes="(min-width: 1024px) 22rem, 70vw"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}