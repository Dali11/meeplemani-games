"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Shows its content on the public site, and hides it inside /admin */
export function PublicOnly({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    if (pathname.startsWith("/admin")) return null;
    return <>{children}</>;
}