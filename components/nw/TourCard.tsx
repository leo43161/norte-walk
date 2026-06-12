import Image from "next/image";
import Link from "next/link";

import type { ExperienceListItem } from "@/lib/api";
import type { Dictionary, Locale } from "@/lib/i18n";
import {
  difficultyLabel,
  formatDuration,
  formatPrice,
  formatRating,
  languageFlag,
  languageLabel,
  parseLanguagesCsv,
  resolveImageUrl,
} from "@/lib/format";

interface TourCardProps {
  exp: ExperienceListItem;
  locale: Locale;
  dict: Dictionary;
  /** Índice 0-based del grid (ya no se muestra, se mantiene por compatibilidad). */
  index?: number;
}

/**
 * Tarjeta de tour "Norte Cálido".
 *
 * Tarjeta blanca contenida, redondeada y con sombra suave que se levanta al
 * hover — se siente como una invitación, no como una lámina de revista.
 *  - Imagen 4:3 arriba, badge de precio redondo + chip de categoría.
 *  - Título Poppins, datos legibles (duración · dificultad · ciudad).
 *  - Rating con estrellita naranja.
 */
export default function TourCard({ exp, locale, dict }: TourCardProps) {
  const cover = resolveImageUrl(exp.cover_image);
  const price = formatPrice(exp, dict, locale);
  const duration = formatDuration(exp.duration_min, locale);
  const rating = formatRating(exp.external_rating, exp.external_reviews_count);
  const verticalLabel = dict.nav[exp.vertical];

  // Idiomas reservables (salidas activas); fallback a los del guía.
  const languages = parseLanguagesCsv(
    exp.schedule_locales_csv || exp.languages_csv,
  );

  // Datos legibles: "2h 30m · Fácil · Tucumán"
  const dataLine = [
    duration,
    exp.difficulty && difficultyLabel(exp.difficulty, locale),
    exp.city && exp.city.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
  ]
    .filter(Boolean)
    .join("  ·  ");

  // Gradient placeholder por vertical (cuando no hay cover)
  const gradient: Record<typeof exp.vertical, string> = {
    fwt: "linear-gradient(135deg, #55694d, #36462f)",
    adventure: "linear-gradient(135deg, #4a6d6a, #2f4744)",
    experience: "linear-gradient(135deg, #ef9540, #d35400)",
    gastronomy: "linear-gradient(135deg, #d96a3a, #93380a)",
  };

  return (
    <Link
      href={`/${locale}/experiencia/${exp.slug}/`}
      className="group flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_10px_30px_-18px_rgba(40,51,31,0.45)] ring-1 ring-(--color-border) transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_rgba(40,51,31,0.5)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-(--color-stone-200)">
        {cover ? (
          <Image
            src={cover}
            alt={exp.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[450ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: gradient[exp.vertical] }}
            aria-hidden
          />
        )}

        {/* Chip de categoría arriba-izq */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-(--color-stone-700) shadow-sm backdrop-blur">
          {verticalLabel}
        </span>

        {/* Precio arriba-der */}
        <span className="absolute right-3 top-3 rounded-full bg-(--color-accent-500) px-3 py-1 text-xs font-bold text-white shadow-sm">
          {exp.type === "free" ? dict.price.free : price.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-[19px] leading-snug text-(--color-stone-800) transition-colors group-hover:text-(--color-accent-600)">
          {exp.title}
        </h3>
        {dataLine && (
          <p className="text-[13px] font-medium text-(--color-stone-500)">{dataLine}</p>
        )}

        {/* Idiomas disponibles del tour */}
        {languages.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label={dict.detail.languages}>
            {languages.map((code) => (
              <li
                key={code}
                className="inline-flex items-center gap-1 rounded-full bg-(--color-bone-200)/80 px-2 py-0.5 text-[11px] font-semibold text-(--color-stone-700)"
              >
                <span aria-hidden>{languageFlag(code)}</span>
                {languageLabel(code, locale)}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
          {rating ? (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-(--color-stone-700)">
              <span className="text-(--color-accent-500)" aria-hidden>
                ★
              </span>
              <span>{rating.label}</span>
            </p>
          ) : (
            <span />
          )}
          <span className="text-[13px] font-bold text-(--color-accent-600) transition-transform duration-300 group-hover:translate-x-0.5">
            {dict.booking.stickyCta} →
          </span>
        </div>
      </div>
    </Link>
  );
}
