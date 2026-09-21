"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, whatsappLink } from "../lib/site";
import { Pill } from "./ui/Pill";

export function SiteHeader() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    // Close the mobile menu with the Escape key
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const bookLink = whatsappLink("Hi MeepleMania Games! I want to book an event.");

    return (
        <header className="sticky top-0 z-50 border-b border-line bg-ink/75 pt-[env(safe-area-inset-top)] backdrop-blur-md">
            <div className="wrap">
                <div className="flex h-17 items-center justify-between gap-6">
                    <Link
                        href="/"
                        aria-label="MeepleMania Games, home"
                        className="shrink-0"
                        onClick={() => setOpen(false)}
                    >
                        <Image
                            src="/images/logo-cream.png"
                            alt="MeepleMania Games"
                            width={141}
                            height={42}
                            priority
                            className="h-10.5 w-auto"
                        />
                    </Link>

                    <nav aria-label="Main" className="hidden items-center gap-1.5 lg:flex">
                        {NAV_LINKS.map((link) => {
                            const active = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={active ? "page" : undefined}
                                    className={`rounded-full px-3 py-2 text-[15px] transition-colors hover:bg-white/5 hover:text-cream ${active ? "text-cream" : "text-muted"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-2.5">
                        <div className="hidden lg:block">
                            <Pill href={bookLink} size="sm">
                                Book on WhatsApp
                            </Pill>
                        </div>

                        <button
                            type="button"
                            className="flex size-11 items-center justify-center rounded-xl border border-line-strong bg-white/5 lg:hidden"
                            aria-expanded={open}
                            aria-controls="mobile-menu"
                            aria-label={open ? "Close menu" : "Open menu"}
                            onClick={() => setOpen((v) => !v)}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                aria-hidden="true"
                            >
                                {open ? (
                                    <path d="M6 6l12 12M18 6L6 18" />
                                ) : (
                                    <path d="M4 7h16M4 12h16M4 17h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {open && (
                    <div id="mobile-menu" className="border-t border-line pb-5 pt-2 lg:hidden">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="block border-b border-line py-3 text-lg text-cream"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-4">
                            <Pill href={bookLink} className="w-full">
                                Book on WhatsApp
                            </Pill>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}