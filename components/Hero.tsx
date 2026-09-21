"use client";

import Image from "next/image";
import { Pill } from "./ui/Pill";
import { whatsappLink } from "../lib/site";
import GlitchText from "./GlitchText";
import LightRays from "./LightRays";

const STACK_PHOTOS = [
    {
        src: "/images/bg-gallery-hero.jpg",
        alt: "Friends playing a board game around a table",
        label: "Game nights",
        rotate: -7,
        tx: -34,
        ty: 14,
        z: 10,
    },
    {
        src: "/images/gle-boat-trip.jpg",
        alt: "Group paddling a boat on Lake Malawi",
        label: "Lake retreats",
        rotate: 0,
        tx: 0,
        ty: 0,
        z: 30,
    },
    {
        src: "/images/gallery-new-02.jpg",
        alt: "Group holding a community mental health awareness sign",
        label: "Community",
        rotate: 6,
        tx: 34,
        ty: 22,
        z: 20,
    },
];

export function Hero() {
    return (
        <section className="relative overflow-hidden border-b border-line">
            <div className="absolute inset-0 z-0">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#ffffff"
                    raysSpeed={0.8}
                    lightSpread={0.75}
                    rayLength={3.0}
                    pulsating={false}
                    fadeDistance={1.5}
                    saturation={0.7}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0.015}
                    distortion={0.01}
                />
            </div>
            <div className="wrap relative z-10 grid gap-14 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
                <div>
                    <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-cream sm:text-6xl lg:text-[3.75rem]">
                        Where Malawi comes to{" "}
                        <GlitchText
                            speed={1.0}
                            enableShadows
                            enableOnHover={false}
                            className="glitch-inline"
                        >
                            play
                        </GlitchText>
                    </h1>

                    <p className="mt-6 max-w-md text-lg text-muted">
                        Board game nights in Lilongwe and Blantyre, team days for your
                        company, and a long weekend on Lake Malawi.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">

                    <a   href="#events"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-transparent bg-lamp px-5.5 font-semibold text-[#1b1206] transition-colors hover:bg-lamp-bright active:translate-y-px"
                    >
                        See upcoming events
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                    </a>

                    <Pill
                        variant="wa"
                        href={whatsappLink("Hi MeepleMania! I want to book an event.")}
                    >
                        Chat on WhatsApp
                    </Pill>
                </div>
            </div>

            <div className="relative mx-auto h-[22rem] w-full max-w-md sm:h-[26rem]">
                {STACK_PHOTOS.map((photo, i) => (
                    <div
                        key={photo.label}
                        className="hero-photo absolute left-1/2 top-1/2 aspect-[4/5] w-[68%] overflow-hidden rounded-2xl border-4 border-cream/90 shadow-2xl"
                        style={
                            {
                                zIndex: photo.z,
                                animationDelay: `${i * 130}ms`,
                                "--rot": `${photo.rotate}deg`,
                                "--tx": `${photo.tx}%`,
                                "--ty": `${photo.ty}%`,
                            } as React.CSSProperties
                        }
                    >
                        <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes="(min-width: 1024px) 24rem, 70vw"
                            className="object-cover"
                            priority={i === 1}
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-cream backdrop-blur-sm">
                            {photo.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </section >
  );
}