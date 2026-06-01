import Image from "next/image";
import Link from "next/link";

import type { Vertical } from "@/lib/api";
import type { Dictionary, Locale } from "@/lib/i18n";

interface VerticalEntry {
  vertical: Vertical;
  /** Path interno del listado (sin locale). Ej: "fwt", "adventure". */
  path: string;
  /** Cantidad de experiencias disponibles. */
  count: number;
  /** Cover real de algún tour de esa vertical. Null → fallback gradient. */
  thumbnail?: string | null;
  /** Tagline corto traducido para esa vertical. */
  tagline: string;
}

interface VerticalsStripProps {
  locale: Locale;
  dict: Dictionary;
  entries: VerticalEntry[];
}

const GRADIENTS: Record<Vertical, string> = {
  fwt: "linear-gradient(135deg, oklch(0.55 0.10 145), oklch(0.35 0.08 145))",
  adventure: "linear-gradient(135deg, oklch(0.45 0.12 235), oklch(0.30 0.10 220))",
  experience: "linear-gradient(135deg, oklch(0.70 0.13 70), oklch(0.50 0.15 50))",
  gastronomy: "linear-gradient(135deg, oklch(0.55 0.15 30), oklch(0.40 0.13 25))",
};

/**
 * Strip horizontal con las 4 verticales de NorteWalk. Aparece pegada al hero
 * — el visitante entiende qué ofrece la marca sin necesidad de scrollear.
 *
 * Layout desktop (lg+): grid de 5 columnas, FWT ocupa 2 (es la marca madre).
 * Tablet: 2x2. Mobile: stacked.
 *
 * Cada card usa una imagen real del catálogo cuando hay, sino gradient
 * fallback. Nada de aspect 4:5 cinematográfico — height fija y compacta.
 */
export default function VerticalsStrip({ locale, dict, entries }: VerticalsStripProps) {
  return (
    <section
      aria-label={dict.home.verticalsKicker}
      className="relative bg-(--color-bone-100)"
    >
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-(family-name:--font-mono) text-[11px] uppercase tracking-[0.22em] text-(--color-accent-600)">
              {dict.home.verticalsKicker}
            </p>
            <h2 className="font-display mt-2 text-3xl text-(--color-stone-800) sm:text-[34px]">
              {dict.home.verticalsTitle}
            </h2>
          </div>
          <p className="max-w-md text-sm text-(--color-stone-500)">
            {dict.home.verticalsSubtitle}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {entries.map((entry, idx) => (
            <VerticalCard
              key={entry.vertical}
              entry={entry}
              locale={locale}
              dict={dict}
              featured={idx === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function VerticalCard({
  entry,
  locale,
  dict,
  featured,
}: {
  entry: VerticalEntry;
  locale: Locale;
  dict: Dictionary;
  featured: boolean;
}) {
  const label = dict.nav[entry.vertical];
  const countLabel = entry.count === 1
    ? dict.home.verticalsCountOne
    : dict.home.verticalsCountOther.replace("{n}", String(entry.count));

  return (
    <Link
      href={`/${locale}/${entry.path}/`}
      className={`group relative isolate flex h-[220px] flex-col justify-end overflow-hidden rounded-[14px] p-5 text-(--color-bone-100) transition-transform duration-300 hover:-translate-y-1 sm:h-[240px] ${
        featured ? "lg:col-span-2 lg:h-[260px]" : "lg:col-span-1 lg:h-[260px]"
      }`}
    >
      {/* Imagen real (si hay) */}
      {entry.thumbnail ? (
        <Image
          src={entry.thumbnail}
          alt={label}
          fill
          sizes={featured ? "(max-width: 1024px) 100vw, 40vw" : "(max-width: 1024px) 50vw, 20vw"}
          className="-z-20 object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-20"
          style={{ background: GRADIENTS[entry.vertical] }}
        />
      )}
      {/* Overlay para legibilidad */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-(--color-stone-900)/85 via-(--color-stone-900)/35 to-transparent"
      />

      {featured && (
        <div className="absolute right-3 top-3 rounded-full bg-(--color-accent-500) px-2.5 py-1 font-(family-name:--font-mono) text-[10px] font-medium uppercase tracking-[0.18em] text-white">
          {dict.home.verticalsFeaturedTag}
        </div>
      )}

      <h3 className="font-display text-2xl leading-tight sm:text-[26px]">
        {label}
      </h3>
      <p className="mt-1 text-[13px] text-(--color-bone-200)/90">
        {entry.tagline}
      </p>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="font-(family-name:--font-mono) uppercase tracking-[0.18em] text-(--color-bone-100)/85">
          {countLabel}
        </span>
        <span className="font-(family-name:--font-mono) uppercase tracking-[0.18em] text-(--color-accent-300) opacity-0 transition-opacity group-hover:opacity-100">
          {dict.home.verticalsCta} →
        </span>
      </div>
    </Link>
  );
}
