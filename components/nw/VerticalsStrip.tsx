import Image from "next/image";
import Link from "next/link";

import Kicker from "@/components/nw/Kicker";
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
  fwt: "linear-gradient(135deg, #55694d, #36462f)",
  adventure: "linear-gradient(135deg, #4a6d6a, #2f4744)",
  experience: "linear-gradient(135deg, #ef9540, #d35400)",
  gastronomy: "linear-gradient(135deg, #d96a3a, #93380a)",
};

const EMOJI: Record<Vertical, string> = {
  fwt: "🚶",
  adventure: "🥾",
  experience: "✨",
  gastronomy: "🥟",
};

/**
 * Strip con las 4 verticales de NorteWalk, pegada al hero. El visitante
 * entiende qué ofrece la marca sin scrollear. FWT ocupa el doble (es la
 * marca madre). Tono cálido y cercano.
 */
export default function VerticalsStrip({ locale, dict, entries }: VerticalsStripProps) {
  return (
    <section aria-label={dict.home.verticalsKicker} className="relative bg-(--color-bone-100)">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker text={dict.home.verticalsKicker} />
            <h2 className="font-display mt-3 text-3xl text-(--color-stone-800) sm:text-[34px]">
              {dict.home.verticalsTitle}
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-(--color-stone-500)">
            {dict.home.verticalsSubtitle}
          </p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
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
  const countLabel =
    entry.count === 1
      ? dict.home.verticalsCountOne
      : dict.home.verticalsCountOther.replace("{n}", String(entry.count));

  return (
    <Link
      href={`/${locale}/${entry.path}/`}
      className={`group relative isolate flex h-[220px] flex-col justify-end overflow-hidden rounded-[20px] p-5 text-(--color-bone-100) shadow-[0_12px_30px_-18px_rgba(40,51,31,0.5)] transition-transform duration-300 hover:-translate-y-1.5 sm:h-[240px] ${
        featured ? "lg:col-span-2 lg:h-[268px]" : "lg:col-span-1 lg:h-[268px]"
      }`}
    >
      {entry.thumbnail ? (
        <Image
          src={entry.thumbnail}
          alt={label}
          fill
          sizes={featured ? "(max-width: 1024px) 100vw, 40vw" : "(max-width: 1024px) 50vw, 20vw"}
          className="-z-20 object-cover transition-transform duration-500 group-hover:scale-[1.05]"
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
        className="absolute inset-0 -z-10 bg-gradient-to-t from-(--color-stone-900)/90 via-(--color-stone-900)/35 to-transparent"
      />

      {featured && (
        <span className="absolute right-3 top-3 rounded-full bg-(--color-accent-500) px-3 py-1 text-[11px] font-bold text-white shadow-sm">
          {dict.home.verticalsFeaturedTag}
        </span>
      )}

      <span aria-hidden className="mb-1.5 text-2xl">
        {EMOJI[entry.vertical]}
      </span>
      <h3 className="font-display text-2xl leading-tight sm:text-[26px]">{label}</h3>
      <p className="mt-1 text-[13.5px] leading-snug text-(--color-bone-100)/90">{entry.tagline}</p>
      <div className="mt-3 flex items-center justify-between text-[13px] font-semibold">
        <span className="rounded-full bg-(--color-bone-100)/15 px-2.5 py-0.5 text-(--color-bone-100)">
          {countLabel}
        </span>
        <span className="text-(--color-accent-300) opacity-0 transition-opacity group-hover:opacity-100">
          {dict.home.verticalsCta} →
        </span>
      </div>
    </Link>
  );
}
