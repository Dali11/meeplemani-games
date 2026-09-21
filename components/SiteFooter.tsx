import Image from "next/image";
import Link from "next/link";
import { SITE } from "../lib/site";


const COLUMNS = [
    {
        title: "Explore",
        links: [
            { href: "/events", label: "Events" },
            { href: "/events/the-great-lake-escape", label: "Great Lake Escape" },
            { href: "/corporate", label: "Corporate" },
        ],
    },
    {
        title: "Company",
        links: [
            { href: "/about", label: "About us" },
            { href: "/gallery", label: "Gallery" },
            { href: "/coloring-books", label: "Coloring books" },
            { href: "/contact", label: "Contact" },
        ],
    },
    {
        title: "Follow",
        links: [
            { href: SITE.instagram, label: "Instagram" },
            { href: SITE.facebook, label: "Facebook" },
            { href: `https://wa.me/${SITE.whatsapp}`, label: "WhatsApp" },
        ],
    },
];

export function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-line bg-[#0a0814] pb-10 pt-14">
            <div className="wrap">
                <div className="grid grid-cols-2 gap-9 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div className="col-span-2 lg:col-span-1">
                        <Image
                            src="/images/logo-cream.png"
                            alt="MeepleMania Games"
                            width={154}
                            height={46}
                            className="h-11.5 w-auto"
                        />
                        <p className="mt-3.5 max-w-sm text-[15.5px] text-muted">
                            Bringing people together through play, from casual game nights to
                            lake retreats.
                        </p>
                    </div>

                    {COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h2 className="mb-3 text-base font-semibold">{col.title}</h2>
                            <ul className="grid gap-2">
                                {col.links.map((link) => {
                                    const external = link.href.startsWith("http");
                                    return (
                                        <li key={link.href}>
                                            {external ? (

                                            <a    href = { link.href }
                          target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[15.5px] text-muted hover:text-cream"
                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                <Link
                                    href={link.href}
                                    className="text-[15.5px] text-muted hover:text-cream"
                                >
                                    {link.label}
                                </Link>
                      )}
                            </li>
                            );
                })}
                        </ul>
            </div>
          ))}
            </div>

            <div className="mt-10 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-line pt-5 text-sm text-dim">
                <span>&copy; 2024 to {year} MeepleMania Games.</span>
                <span>
                    Built by{" "}

                <a    href="https://dev.brandfletch.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-3 hover:text-cream"
                >
                    BrandFletch Dev Studio
                </a>
            </span>
        </div>
      </div >
    </footer >
  );
}