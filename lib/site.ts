export const SITE = {
    name: "MeepleMania Games",
    whatsapp: "265989989600",
    phoneDisplay: "+265 989 989 600",
    email: "meeplemaniagames2024@gmail.com",
    instagram: "https://instagram.com/meeplemaniagames",
    facebook: "https://facebook.com/meeplemaniagamesmw",
    tiktok: "https://www.tiktok.com/@meeplemania0",
} as const;

export const NAV_LINKS = [
    { href: "/events", label: "Events" },
    { href: "/corporate", label: "Corporate" },
    { href: "/coloring-books", label: "Coloring books" },
    { href: "/about", label: "About" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
] as const;

/** Builds a WhatsApp link with a pre-filled message */
export function whatsappLink(message: string) {
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}