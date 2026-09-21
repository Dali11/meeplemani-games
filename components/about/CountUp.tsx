"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up to a number the first time it scrolls into view. Shows the final number straight away for people who prefer less motion. */
export function CountUp({
    to,
    suffix = "",
    duration = 1400,
}: {
    to: number;
    suffix?: string;
    duration?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const [value, setValue] = useState(to);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let frame = 0;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                const start = performance.now();
                const tick = (now: number) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setValue(Math.round(to * eased));
                    if (progress < 1) frame = requestAnimationFrame(tick);
                };
                frame = requestAnimationFrame(tick);
            },
            { threshold: 0.6 },
        );
        observer.observe(el);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [to, duration]);

    return (
        <span ref={ref}>
            {value}
            {suffix}
        </span>
    );
}