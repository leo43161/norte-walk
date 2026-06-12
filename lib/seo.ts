/* =====================================================================
 * NorteWalk — capa de SEO: constantes de marca + constructores de Schema.org.
 *
 * Centraliza todo lo que alimenta `<JsonLd>` y la metadata de Next para que
 * las páginas queden limpias y el structured data sea consistente entre rutas.
 * Todas las URLs que entran a JSON-LD deben ser ABSOLUTAS (los crawlers no
 * resuelven relativas en JSON-LD) → usar `absoluteUrl()`.
 * ===================================================================== */

import { SITE_URL } from "@/lib/site";
import { LOCALES, type Locale } from "@/lib/i18n";

export const SITE_NAME = "NorteWalk";

/** Node ids estables para enlazar el grafo de Schema.org entre scripts. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Convierte un path del sitio en URL absoluta para JSON-LD / OG. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** og:locale por idioma (Tucumán es Argentina → es_AR, no es_ES). */
export const OG_LOCALE: Record<Locale, string> = {
  es: "es_AR",
  en: "en_US",
  pt: "pt_BR",
};

/** Descripción corta de marca por idioma (para Organization/WebSite). */
const ORG_DESCRIPTION: Record<Locale, string> = {
  es: "Plataforma de free walking tours, excursiones y experiencias en Tucumán con guías locales habilitados. Reservás tu cupo online en un minuto, sin tarjetas.",
  en: "Free walking tours, excursions and experiences in Tucumán with licensed local guides. Book your spot online in a minute, no cards.",
  pt: "Free walking tours, excursões e experiências em Tucumán com guias locais credenciados. Reserve seu lugar online em um minuto, sem cartões.",
};

const ORG_SLOGAN: Record<Locale, string> = {
  es: "Conocé Tucumán caminando, con guías de acá.",
  en: "Get to know Tucumán on foot, with local guides.",
  pt: "Conheça Tucumán a pé, com guias daqui.",
};

/** Keywords por idioma — orientadas a las búsquedas que queremos liderar. */
export const KEYWORDS: Record<Locale, string[]> = {
  es: [
    "free walking tour Tucumán",
    "FWT Tucumán",
    "caminatas a la gorra Tucumán",
    "experiencias Tucumán",
    "excursiones Tucumán",
    "tours Tucumán",
    "qué hacer en Tucumán",
    "guías turísticos Tucumán",
    "city tour Tucumán",
    "turismo Tucumán",
    "norte argentino",
  ],
  en: [
    "free walking tour Tucumán",
    "Tucumán tours",
    "things to do in Tucumán",
    "Tucumán experiences",
    "Tucumán excursions",
    "Tucumán city tour",
    "local guides Tucumán",
    "northern Argentina tours",
  ],
  pt: [
    "free walking tour Tucumán",
    "tours em Tucumán",
    "o que fazer em Tucumán",
    "experiências em Tucumán",
    "excursões em Tucumán",
    "passeios em Tucumán",
    "guias locais Tucumán",
    "norte argentino",
  ],
};

/** Zonas que cubre la plataforma (areaServed de la Organization). */
function areaServed() {
  return [
    { "@type": "City", name: "San Miguel de Tucumán" },
    { "@type": "AdministrativeArea", name: "Tucumán" },
    { "@type": "AdministrativeArea", name: "Norte Argentino" },
    { "@type": "Country", name: "Argentina" },
  ];
}

/**
 * Organization (+ TravelAgency) de NorteWalk. Va en TODAS las páginas para que
 * Google consolide la entidad de marca. `@id` permite que WebSite y los
 * productos la referencien sin repetir el objeto entero.
 */
export function buildOrganization(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "TravelAgency"],
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: "NorteWalk Tucumán",
    url: absoluteUrl(`/${locale}/`),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/web-app-manifest-512x512.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl("/og-image.png"),
    description: ORG_DESCRIPTION[locale],
    slogan: ORG_SLOGAN[locale],
    knowsLanguage: [...LOCALES],
    areaServed: areaServed(),
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Miguel de Tucumán",
      addressRegion: "Tucumán",
      addressCountry: "AR",
    },
  };
}

/** WebSite — describe el sitio como tal y enlaza al publisher (Organization). */
export function buildWebSite(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: absoluteUrl(`/${locale}/`),
    description: ORG_DESCRIPTION[locale],
    inLanguage: [...LOCALES],
    publisher: { "@id": ORG_ID },
  };
}

export interface Crumb {
  name: string;
  /** Path del sitio (relativo) o URL absoluta. */
  path: string;
}

/** BreadcrumbList — alimenta el breadcrumb rich result de Google. */
export function buildBreadcrumb(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export interface ListEntry {
  name: string;
  path: string;
}

/** ItemList — para las páginas de listado por vertical (carrusel de Google). */
export function buildItemList(name: string, entries: ListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: entries.length,
    itemListElement: entries.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(e.path),
      name: e.name,
    })),
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/** FAQPage — debe reflejar un FAQ visible en la página (política de Google). */
export function buildFaqPage(entries: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: { "@type": "Answer", text: e.answer },
    })),
  };
}

export interface ExperienceSchemaInput {
  url: string; // path relativo de la experiencia
  name: string;
  description?: string | null;
  images: string[]; // URLs absolutas
  touristType?: string;
  languages: string[]; // ISO codes
  providerName: string;
  city?: string;
  isFree: boolean;
  price: number | null;
  currency: string;
  ratingValue?: number | null;
  reviewCount?: number | null;
  itinerary?: { name: string; description?: string | null }[];
}

/**
 * TouristTrip — entidad principal del detalle de experiencia. Enriquecida con
 * provider, oferta (gratis = price 0), rating, itinerario e idiomas para que
 * Google entienda la salida como un producto turístico reservable.
 */
export function buildExperienceSchema(input: ExperienceSchemaInput) {
  const url = absoluteUrl(input.url);
  const hasRating =
    input.ratingValue != null &&
    input.ratingValue > 0 &&
    input.reviewCount != null &&
    input.reviewCount > 0;

  const offerPrice = input.isFree ? "0" : input.price != null ? String(input.price) : null;

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name: input.name,
    description: input.description ?? undefined,
    url,
    image: input.images.length > 0 ? input.images : undefined,
    touristType: input.touristType,
    inLanguage: input.languages.length > 0 ? input.languages : undefined,
    provider: {
      "@type": "Organization",
      name: input.providerName,
      areaServed: input.city ? { "@type": "City", name: input.city } : undefined,
    },
    isPartOf: { "@id": WEBSITE_ID },
    offers:
      offerPrice != null
        ? {
            "@type": "Offer",
            price: offerPrice,
            priceCurrency: input.currency || "ARS",
            availability: "https://schema.org/InStock",
            url,
            ...(input.isFree ? { description: "A la gorra / tip-based" } : {}),
          }
        : undefined,
    aggregateRating: hasRating
      ? {
          "@type": "AggregateRating",
          ratingValue: Number(input.ratingValue),
          reviewCount: Number(input.reviewCount),
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    itinerary:
      input.itinerary && input.itinerary.length > 0
        ? {
            "@type": "ItemList",
            numberOfItems: input.itinerary.length,
            itemListElement: input.itinerary.map((step, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "TouristAttraction",
                name: step.name,
                description: step.description ?? undefined,
              },
            })),
          }
        : undefined,
  };
}
