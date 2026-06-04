import type { Metadata } from "next";
import { DM_Sans, Fraunces, Poppins } from "next/font/google";
import "./globals.css";

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
  title: {
    default: "NorteWalk — Conocé Tucumán caminando",
    template: "%s · NorteWalk",
  },
  description:
    "Free walking tours y experiencias en Tucumán con guías locales que aman mostrar su tierra. Reservás en un toque por WhatsApp, sin tarjetas ni vueltas.",
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
      </body>
    </html>
  );
}
