import type { MetadataRoute } from "next";

import { getExperiences, type Vertical } from "@/lib/api";
import { LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

// Requerido por Next 16 con `output: "export"` para que el sitemap.xml se
// genere en build como archivo estático.
export const dynamic = "force-static";

const VERTICALS: readonly Vertical[] = ["fwt", "adventure", "experience", "gastronomy"];

/**
 * Genera el sitemap.xml estático en `out/sitemap.xml`.
 *
 * Estructura:
 *  - 3 entries de home (una por locale).
 *  - 12 entries de verticales (4 × 3 locales).
 *  - N×3 entries de detalle (experiencias × locales).
 *
 * Cada entry incluye `alternates.languages` con las 3 versiones por idioma,
 * que es lo que Google usa para entender hreflang en sitemap.
 *
 * Si XAMPP/API está abajo durante el build, fail-soft: el sitemap se genera
 * sin las experiencias y el build no rompe.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const langs = (path: (locale: string) => string) =>
    Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}${path(l)}`]));

  // --- Home por locale ---
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: langs((l) => `/${l}/`) },
    });
  }

  // --- Verticales × locales ---
  for (const locale of LOCALES) {
    for (const v of VERTICALS) {
      entries.push({
        url: `${SITE_URL}/${locale}/${v}/`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: langs((l) => `/${l}/${v}/`) },
      });
    }
  }

  // --- Experiencias × locales ---
  try {
    const { items } = await getExperiences({ limit: 500 });
    for (const exp of items) {
      for (const locale of LOCALES) {
        entries.push({
          url: `${SITE_URL}/${locale}/experiencia/${exp.slug}/`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
          alternates: { languages: langs((l) => `/${l}/experiencia/${exp.slug}/`) },
        });
      }
    }
  } catch (error) {
    console.error("[sitemap] falló fetch de experiencias, sitemap queda sin /experiencia/*:", error);
  }

  return entries;
}
