import type { Metadata } from "next";
import { DM_Sans, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * Sistema tipográfico Paseo Norte (Selva & Brasa):
 *  - Display (titulares): Fraunces — serif variable opsz 9–144, weight 300–600,
 *    SOFT axis. Cursiva del axis SOLO para acentos de marca.
 *  - Body: DM Sans — sans humana, peso 400/500/600/700.
 *  - Mono: Geist Mono — datos, kickers, coordenadas, badges.
 */
// Fraunces variable: sin `weight` para activar el axis variable de Next.
// Los axes opsz (9–144) y SOFT (los seteamos via font-variation-settings en
// .font-display y .italic-accent). Se pueden cargar styles italic + normal.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NorteWalk — Caminá el Norte",
    template: "%s · NorteWalk",
  },
  description:
    "Tours guiados, caminatas a la gorra y experiencias auténticas en el Norte argentino. Reservás directo por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-(--color-background) text-(--color-foreground)">
        {children}
      </body>
    </html>
  );
}
