"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

// The WebGL code loads only in the browser, and only when it is needed
const LightRays = dynamic(() => import("./LightRays"), { ssr: false });

function useMedia(query: string) {
    return useSyncExternalStore(
        (onChange) => {
            const mq = window.matchMedia(query);
            mq.addEventListener("change", onChange);
            return () => mq.removeEventListener("change", onChange);
        },
        () => window.matchMedia(query).matches,
        () => false,
    );
}

function useSaveData() {
    return useSyncExternalStore(
        () => () => { },
        () => {
            const nav = navigator as Navigator & {
                connection?: { saveData?: boolean };
            };
            return nav.connection?.saveData === true;
        },
        () => false,
    );
}

export function HeroRays() {
    const reduceMotion = useMedia("(prefers-reduced-motion: reduce)");
    const hasMouse = useMedia("(pointer: fine)");
    const saveData = useSaveData();

    // People who asked for less motion or less data just see the plain dark hero
    if (reduceMotion || saveData) return null;

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]"
        >
            <LightRays
                raysOrigin="top-center"
                raysColor="#ffffff"
                raysSpeed={1}
                lightSpread={0.5}
                rayLength={3}
                followMouse={hasMouse}
                mouseInfluence={0.1}
                noiseAmount={0}
                distortion={0}
                pulsating={false}
                fadeDistance={1}
                saturation={1}
            />
        </div>
    );
}