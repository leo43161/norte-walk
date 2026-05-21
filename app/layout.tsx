import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NorteWalk — Experiencias y guías en Tucumán",
    template: "%s · NorteWalk",
  },
  description:
    "Caminatas, aventuras y experiencias auténticas en Tucumán con guías locales. Reservá directo por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-(--color-background) text-(--color-foreground)">
        {children}
      </body>
    </html>
  );
}
