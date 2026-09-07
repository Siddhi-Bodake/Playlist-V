import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Baloo_2, Caveat } from "next/font/google";
import { site } from "@/data/site";
import { PlayerProvider } from "@/lib/player-context";
import { SecretsProvider } from "@/lib/secrets-context";
import { PWARegister } from "@/components/layout/PWARegister";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { StickyNote } from "@/components/notes/StickyNote";
import { HiddenCorner } from "@/components/layout/HiddenCorner";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Bold, blocky display face for the "Visshuu Ki Playlist" headline — the
// thick poster/meme-style look (like "पापा के जमाने के गाने"), not a thin
// script face. Devanagari subset kept in case Hindi copy is ever added here.
const headlineDisplay = Baloo_2({
  variable: "--font-hindi",
  subsets: ["devanagari", "latin"],
  weight: ["700", "800"],
});

// Bubbly handwritten face for the personal letter — a real note, not a
// formal one.
const handwritten = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://for-vishuu.vercel.app"),
  title: site.displayName,
  description: site.description,
  applicationName: site.displayName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: site.name,
  },
  openGraph: {
    title: site.social.ogTitle,
    description: site.social.ogDescription,
    type: "website",
    siteName: site.displayName,
  },
  twitter: {
    card: "summary_large_image",
    title: site.social.ogTitle,
    description: site.social.ogDescription,
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#150c22",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${headlineDisplay.variable} ${handwritten.variable} h-full`}
    >
      <body className="min-h-full overflow-x-hidden bg-background font-sans text-foreground antialiased">
        <SecretsProvider>
          <PlayerProvider>
            <OfflineBanner />
            {children}
            <StickyNote />
            <HiddenCorner />
          </PlayerProvider>
        </SecretsProvider>
        <PWARegister />
      </body>
    </html>
  );
}
