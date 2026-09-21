import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "lamp" | "ghost" | "wa";
type Size = "md" | "sm";

const base =
    "inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-colors active:translate-y-px";

const variants: Record<Variant, string> = {
    lamp: "border-transparent bg-lamp text-[#1b1206] hover:bg-lamp-bright",
    ghost: "border-line-strong bg-white/5 text-cream hover:bg-white/10",
    wa: "border-transparent bg-wa text-[#04210f] hover:brightness-110",
};

const sizes: Record<Size, string> = {
    md: "min-h-11 px-5.5 text-base",
    sm: "min-h-10 px-4.5 text-[15px]",
};

type PillProps = {
    href: string;
    variant?: Variant;
    size?: Size;
    className?: string;
    children: ReactNode;
};

/** A pill-shaped button. Internal paths use Next's Link; http, mailto and tel links use a normal <a>. */
export function Pill({
    href,
    variant = "lamp",
    size = "md",
    className = "",
    children,
}: PillProps) {
    const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
    const isExternal = /^(https?:|mailto:|tel:)/.test(href);

    if (isExternal) {
        const isWeb = href.startsWith("http");
        return (

        <a href = { href }
        className = { classes }
        {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {}) }
      >
            { children }
      </a >
    );
    }

    return (
        <Link href={href} className={classes}>
            {children}
        </Link>
    );
}