import type { Metadata, Viewport } from "next";
import { Outfit, Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { cn } from "@/lib/utils";
import { PublicOnly } from "@/components/PublicOnly";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://meeplemania-games.vercel.app"),
  title: {
    default:
      "MeepleMania Games | Board Games, Game Nights & Team Building in Malawi",
    template: "%s | MeepleMania Games",
  },
  description:
    "Board game nights, team building and lake retreats across Lilongwe and Blantyre, Malawi.",
  openGraph: {
    type: "website",
    siteName: "MeepleMania Games",
    locale: "en_MW",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0b1a",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(outfit.variable, spaceGrotesk.variable, "font-sans", geist.variable)}>
      <body className="min-h-dvh">

        <a href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-lamp focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
        >
        Skip to main content
      </a>
        <PublicOnly>
          <SiteHeader />
        </PublicOnly>
        <main id="main">{children}</main>
        <PublicOnly>
          <SiteFooter />
        </PublicOnly>
    </body>
    </html >
  );
}