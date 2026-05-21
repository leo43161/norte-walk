import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// Requerido por Next 16 con `output: "export"` para que robots.txt se
// genere en build como archivo estático.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /_next/ contiene el bundle y chunks — bloquearlo evita indexar JS
        // pero ojo: Google necesita acceder a CSS/JS para renderear, así que
        // sólo bloqueamos la zona privada.
        disallow: ["/_next/static/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
