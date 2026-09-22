import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import { hasSession } from "@/lib/admin-auth";


export const metadata: Metadata = {
    title: { default: "Admin", template: "%s | Admin" },
    robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const signedIn = await hasSession();

    return (
        <div className="min-h-dvh">
            <div className="border-b border-line bg-plum/60">
                <div className="wrap flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 sm:h-14 sm:py-0">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <span className="font-semibold">MeepleMania admin</span>
                        {signedIn && (
                            <nav aria-label="Admin" className="flex gap-4 text-[15px]">
                                <Link href="/admin" className="text-cream">
                                    Inbox
                                </Link>
                                <Link href="/admin/events" className="text-cream">
                                    Events
                                </Link>
                                <Link href="/admin/coloring" className="text-cream">
                                    Coloring books
                                </Link>
                                <Link href="/admin/coloring-wall" className="text-cream">
                                    Coloring wall
                                </Link>
                            </nav>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-[15px] text-muted transition-colors hover:text-cream">
                            View site
                        </Link>
                        {signedIn && (
                            <form action={logout}>
                                <button
                                    type="submit"
                                    className="rounded-full border border-line-strong px-4 py-1.5 text-[14px] text-muted transition-colors hover:text-cream"
                                >
                                    Log out
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
}