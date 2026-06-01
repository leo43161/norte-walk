"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { DEFAULT_LOCALE, getDictionary, isLocale, type Locale } from "@/lib/i18n";

/**
 * No-found para slugs de experiencia que ya no existen en la API.
 *
 * Es un Client Component para leer el locale real con `useParams()` y mostrar
 * el copy en el idioma correcto — el equivalente Server Component no recibe
 * params en static export.
 *
 * Trade-off: durante el initial paint (antes que hidrate el JS) el browser
 * ya tiene el HTML emitido en build, que sólo conoce un locale. Next emite
 * un HTML por cada locale del slug X que sí prerenderiza, pero para slugs
 * inexistentes no hay HTML prerenderizado — el fallback es la versión inglesa
 * que generó Next. Por eso usamos client component: para arreglar el copy
 * apenas hidrata.
 */
export default function ExperienceNotFound() {
  const params = useParams();
  const rawLocale = typeof params.locale === "string" ? params.locale : DEFAULT_LOCALE;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return (
    <section className="bg-(--color-background)">
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="font-display text-4xl text-(--color-foreground)">
          {dict.detail.notFoundTitle}
        </h1>
        <p className="mt-4 max-w-md text-(--color-muted)">{dict.detail.notFoundBody}</p>
        <Link
          href={`/${locale}/`}
          className="mt-8 rounded-full bg-(--color-stone-700) px-6 py-3 text-sm font-semibold text-(--color-bone-100) hover:bg-(--color-stone-800) transition-colors"
        >
          {dict.detail.notFoundCta}
        </Link>
      </div>
    </section>
  );
}
