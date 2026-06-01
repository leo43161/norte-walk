import Image from "next/image";
import Link from "next/link";

import type { ExperienceListItem } from "@/lib/api";
import type { Dictionary, Locale } from "@/lib/i18n";
import {
  difficultyLabel,
  formatDuration,
  formatPrice,
  formatRating,
  resolveImageUrl,
} from "@/lib/format";

interface TourCardProps {
  exp: ExperienceListItem;
  locale: Locale;
  dict: Dictionary;
  /** Índice 0-based del grid — se renderea como "01", "02", etc. */
  index?: number;
}

/**
 * Tarjeta editorial Paseo Norte.
 *
 *  - Aspect 4:5 (más vertical que mi viejo 4:3)
 *  - "01" numerado top-left mono semitransparente
 *  - Badge "GRATIS" o "$ 25.000" top-right mono uppercase
 *  - Título Fraunces 22px
 *  - Datos mono "4H · TREKKING · TUCUMÁN"
 *  - Rating con estrella accent
 *  - Hover: image scale 1.03, transition 400ms
 *
 * Cuando no hay cover, fallback a gradient OKLCH por vertical (no "NorteWalk" text).
 */
export default function TourCard({ exp, locale, dict, index = 0 }: TourCardProps) {
  const cover = resolveImageUrl(exp.cover_image);
  const price = formatPrice(exp, dict, locale);
  const duration = formatDuration(exp.duration_min, locale);
  const rating = formatRating(exp.external_rating, exp.external_reviews_count);
  const verticalLabel = dict.nav[exp.vertical];
  const number = String(index + 1).padStart(2, "0");

  // Datos mono compactos: "4H · MODERADO · TUCUMÁN"
  const dataLine = [
    duration && duration.toUpperCase(),
    exp.difficulty && difficultyLabel(exp.difficulty, locale).toUpperCase(),
    exp.city && exp.city.replace(/-/g, " ").toUpperCase(),
  ]
    .filter(Boolean)
    .join(" · ");

  // Gradient OKLCH placeholder según vertical
  const gradient: Record<typeof exp.vertical, string> = {
    fwt: "linear-gradient(135deg, oklch(0.55 0.10 145), oklch(0.35 0.08 145))",
    adventure: "linear-gradient(135deg, oklch(0.45 0.12 235), oklch(0.30 0.10 220))",
    experience: "linear-gradient(135deg, oklch(0.70 0.13 70), oklch(0.50 0.15 50))",
    gastronomy: "linear-gradient(135deg, oklch(0.55 0.15 30), oklch(0.40 0.13 25))",
  };

  return (
    <Link
      href={`/${locale}/experiencia/${exp.slug}/`}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[14px] bg-(--color-stone-200)">
        {cover ? (
          <Image
            src={cover}
            alt={exp.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: gradient[exp.vertical] }}
            aria-hidden
          />
        )}

        {/* Numerado top-left */}
        <div className="absolute left-4 top-4 font-(family-name:--font-mono) text-xs uppercase tracking-[0.18em] text-(--color-bone-100) opacity-50">
          {number}
        </div>

        {/* Precio top-right */}
        <div className="absolute right-4 top-4 rounded-md bg-(--color-stone-900)/85 px-2.5 py-1 font-(family-name:--font-mono) text-[11px] uppercase tracking-[0.15em] text-(--color-bone-100) backdrop-blur">
          {exp.type === "free" ? dict.price.freeBadge : price.label}
        </div>

        {/* Vertical label bottom-left */}
        <div className="absolute bottom-4 left-4 font-(family-name:--font-mono) text-[11px] uppercase tracking-[0.18em] text-(--color-bone-100)">
          {verticalLabel}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <h3 className="font-display text-[22px] leading-[1.1] text-(--color-stone-800) transition-colors group-hover:text-(--color-accent-600)">
          {exp.title}
        </h3>
        {dataLine && (
          <p className="font-(family-name:--font-mono) text-[11px] uppercase tracking-[0.15em] text-(--color-stone-500)">
            {dataLine}
          </p>
        )}
        {rating && (
          <p className="flex items-center gap-1.5 text-xs text-(--color-stone-700)">
            <span className="text-(--color-accent-500)" aria-hidden>
              ★
            </span>
            <span>{rating.label}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
