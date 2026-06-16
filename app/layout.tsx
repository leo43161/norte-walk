import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, Poppins } from "next/font/google";
import "./globals.css";

import Analytics from "@/components/Analytics";
import ClarityAnalytics from "@/components/Clarity";
import { SITE_URL } from "@/lib/site";
import { KEYWORDS, SITE_NAME } from "@/lib/seo";

/**
 * Sistema tipográfico "Norte Cálido":
 *  - Display (titulares): Poppins — geométrica redondeada, cercana y amigable.
 *    Reemplaza a Fraunces para sacarle el aire "editorial/libro" a la página.
 *  - Body: DM Sans — sans humana y muy legible.
 *  - Logo: Fraunces — SOLO para el wordmark del logo (el usuario quiere
 *    conservar la tipografía del logo). Vive en --font-logo, así cambiar los
 *    titulares no toca la marca.
 */
const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Fraunces estático sólo para el logo (wordmark). Sin axes ni italic: no hace falta.
const fraunces = Fraunces({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NorteWalk — Free walking tours y experiencias en Tucumán",
    template: "%s · NorteWalk",
  },
  description:
    "Free walking tours, excursiones y experiencias en Tucumán con guías locales habilitados. Elegís fecha e idioma y reservás tu cupo online en un minuto, sin tarjetas.",
  applicationName: SITE_NAME,
  keywords: KEYWORDS.es,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "travel",
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "NorteWalk — Free walking tours y experiencias en Tucumán",
    description:
      "Reservá free walking tours, excursiones y experiencias en Tucumán con guías locales. Online, en un minuto y sin tarjetas.",
    url: SITE_URL,
    locale: "es_AR",
    alternateLocale: ["en_US", "pt_BR"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NorteWalk — Free walking tours y experiencias en Tucumán",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NorteWalk — Free walking tours y experiencias en Tucumán",
    description:
      "Free walking tours, excursiones y experiencias en Tucumán con guías locales. Reservá online, sin tarjetas.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#40513b",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${dmSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-(--color-background) text-(--color-foreground)">
        {children}
        <Analytics />
        <ClarityAnalytics />
      </body>
    </html>
  );
}
