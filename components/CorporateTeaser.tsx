import Image from "next/image";
import { Pill } from "./ui/Pill";
import { whatsappLink } from "../lib/site";
import { CORPORATE_TIERS } from "../lib/corporate-content";

export function CorporateTeaser() {
    return (
        <section className="border-b border-line py-20 lg:py-24">
            <div className="wrap grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl lg:aspect-auto lg:h-full lg:min-h-[28rem]">
                    <Image
                        src="/images/gallery-corporate-teambuilding.jpg"
                        alt="A company team celebrating with medals after a MeepleMania team-building tournament"
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                    />
                </div>

                <div>
                    <h2 className="text-3xl font-bold leading-tight text-cream sm:text-4xl">
                        Team days your staff will talk about on Monday
                    </h2>
                    <p className="mt-4 max-w-lg text-muted">
                        We bring the games, the facilitators and the prizes. Your team
                        brings the rivalry. Sessions run at your office or a partner
                        venue.
                    </p>

                    <dl className="mt-8 divide-y divide-line border-t border-line">
                        {CORPORATE_TIERS.map((tier) => (
                            <div
                                key={tier.label}
                                className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6"
                            >
                                <dt className="font-semibold text-cream">{tier.label}</dt>
                                <dd className="text-muted">{tier.description}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-8">
                        <Pill
                            href={whatsappLink(
                                "Hi MeepleMania! I'd like a quote for a corporate team-building day."
                            )}
                        >
                            Request a quote
                        </Pill>
                        <p className="mt-3 text-sm text-dim">
                            Pricing is quoted for each team.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}