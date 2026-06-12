import type { MetadataRoute } from "next";

import { DEFAULT_LOCALE } from "@/lib/i18n";

// Requerido por Next 16 con `output: "export"` para emitir
// `manifest.webmanifest` como archivo estático en build.
export const dynamic = "force-static";

/**
 * Web App Manifest — habilita instalación PWA y mejora cómo se ve NorteWalk
 * cuando se "agrega a inicio" en móviles. Los iconos los genera
 * `scripts/generate-icons.mjs` (símbolo de marca, verde + sol naranja).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NorteWalk — Free walking tours y experiencias en Tucumán",
    short_name: "NorteWalk",
    description:
      "Free walking tours, excursiones y experiencias en Tucumán con guías locales. Reservás tu cupo online en un minuto, sin tarjetas.",
    lang: DEFAULT_LOCALE,
    dir: "ltr",
    start_url: `/${DEFAULT_LOCALE}/`,
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#faf6ec",
    theme_color: "#40513b",
    categories: ["travel", "lifestyle", "navigation"],
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any", purpose: "any" },
      {
        src: "/web-app-manifest-192x192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-maskable-512x512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  };
}
