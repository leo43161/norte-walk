import type { Dictionary, Locale } from "@/lib/i18n";
import {
  getApiBase,
  isTrue,
  type Experience,
  type ExperienceImage,
  type ExperienceLanguage,
  type ExperienceListItem,
  type ExperienceSchedule,
  type I18nField,
  type Numeric,
} from "@/lib/api";

/**
 * Normaliza URL de imagen.
 * El PHP a veces manda paths relativos como `/public/img/...` (relativos a la
 * raíz del servidor donde corre el API) y a veces URLs absolutas. Para que
 * Next/Image y el HTML estático funcionen en cualquier deploy, prependeamos
 * el host del API base si el path es relativo.
 *
 * Convención observada: paths relativos arrancan con `/` o `public/`. URLs
 * absolutas arrancan con `http://` o `https://`.
 */
export function resolveImageUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = getApiBase().replace(/\/api\/?$/, ""); // sacar el /api del final
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${base}${path}`;
}

/** Formatea minutos como "1h 30m" / "45 min" / "2h". */
export function formatDuration(rawMinutes: Numeric | null | undefined, locale: Locale = "es"): string {
  if (rawMinutes === null || rawMinutes === undefined) return "";
  const total = Math.max(0, Math.round(Number(rawMinutes)));
  if (!Number.isFinite(total) || total === 0) return "";
  const h = Math.floor(total / 60);
  const m = total % 60;
  const minLabel = locale === "en" ? "min" : "min";
  if (h === 0) return `${m} ${minLabel}`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Formatea moneda con Intl, fallback simple si la combinación no es válida. */
function formatMoney(value: number, currency: string, locale: Locale): string {
  const intlLocale = locale === "pt" ? "pt-BR" : locale === "en" ? "en-US" : "es-AR";
  try {
    return new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: currency || "ARS",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency || "ARS"} ${Math.round(value).toLocaleString(intlLocale)}`;
  }
}

export interface PriceParts {
  /** Etiqueta principal — siempre presente. */
  label: string;
  /** Subtexto opcional ("Sugerido: $500–$2000"). */
  hint?: string;
}

/** Subset estructural usado por formatPrice (compatible con listado y detalle). */
type Priceable = Pick<ExperienceListItem, "type" | "price" | "price_min" | "price_max" | "currency">;

/** Devuelve label + hint del precio según `type` (free/paid) y la moneda. */
export function formatPrice(exp: Priceable, dict: Dictionary, locale: Locale): PriceParts {
  if (exp.type === "free") {
    const min = exp.price_min !== null ? Number(exp.price_min) : null;
    const max = exp.price_max !== null ? Number(exp.price_max) : null;
    const parts: string[] = [];
    if (min !== null && Number.isFinite(min)) parts.push(formatMoney(min, exp.currency, locale));
    if (max !== null && Number.isFinite(max)) parts.push(formatMoney(max, exp.currency, locale));
    const hint =
      parts.length > 0
        ? `${dict.price.from} ${parts.join(" — ")} ${dict.price.perPerson}`
        : undefined;
    return { label: dict.price.free, hint };
  }
  const value = exp.price !== null ? Number(exp.price) : null;
  if (value === null || !Number.isFinite(value)) {
    return { label: "—" };
  }
  return {
    label: formatMoney(value, exp.currency, locale),
    hint: dict.price.perPerson,
  };
}

/** Devuelve rating con 1 decimal, o null si no hay reseñas. */
export function formatRating(
  rating: Numeric | null | undefined,
  count: Numeric | null | undefined,
): { stars: number; label: string } | null {
  if (rating === null || rating === undefined) return null;
  const r = Number(rating);
  if (!Number.isFinite(r) || r <= 0) return null;
  const c = Number(count ?? 0);
  return {
    stars: r,
    label: `${r.toFixed(1)} · ${c.toLocaleString()}`,
  };
}

// ---------- Detalle ----------

/** Devuelve el campo i18n_<field> si existe y tiene valor; si no, el field raw. */
export function pickI18n(
  exp: Experience,
  field: I18nField,
): string | null {
  const i18nKey = `i18n_${field}` as const;
  const i18nValue = exp[i18nKey] as string | null | undefined;
  if (typeof i18nValue === "string" && i18nValue.length > 0) return i18nValue;
  const raw = exp[field as keyof Experience] as string | null | undefined;
  return raw ?? null;
}

/**
 * URL del cover del detalle.
 * En el detalle no viene `cover_image` (sólo en listado), hay que buscar
 * el `images[]` con `is_cover=1`. Fallback al primero por sort_order si
 * ninguno está marcado.
 */
export function getCoverImage(exp: Experience): string | null {
  if (exp.cover_image) return resolveImageUrl(exp.cover_image);
  if (!exp.images || exp.images.length === 0) return null;
  const cover = exp.images.find((img) => isTrue(img.is_cover));
  const pick = cover ?? sortImages(exp.images)[0];
  return pick ? resolveImageUrl(pick.url) : null;
}

/** Galería completa ordenada por sort_order; cover queda primero. */
export function getGalleryImages(exp: Experience): ExperienceImage[] {
  if (!exp.images || exp.images.length === 0) return [];
  const sorted = sortImages(exp.images);
  // cover primero
  return [...sorted].sort((a, b) => Number(isTrue(b.is_cover)) - Number(isTrue(a.is_cover)));
}

function sortImages(images: ExperienceImage[]): ExperienceImage[] {
  return [...images].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
}

/** Schedules activos filtrados por locale, ordenados por día y hora. */
export function getSchedulesForLocale(
  exp: Experience,
  locale: Locale,
): ExperienceSchedule[] {
  if (!exp.schedules) return [];
  return exp.schedules
    .filter((s) => s.locale === locale && (s.is_active === undefined || isTrue(s.is_active)))
    .sort((a, b) => {
      const dayDiff = Number(a.day_of_week) - Number(b.day_of_week);
      if (dayDiff !== 0) return dayDiff;
      return a.start_time.localeCompare(b.start_time);
    });
}

const WEEKDAY_LABELS: Record<Locale, string[]> = {
  // Convención SQL: 0=domingo, 1=lunes, ..., 6=sábado
  es: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  pt: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
};

export function weekdayLabel(dow: Numeric, locale: Locale): string {
  const idx = Math.max(0, Math.min(6, Math.round(Number(dow))));
  return WEEKDAY_LABELS[locale][idx];
}

/** "10:00:00" → "10:00". Si recibe algo inválido devuelve el input crudo. */
export function formatTime(time: string): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(time);
  if (!m) return time;
  return `${m[1].padStart(2, "0")}:${m[2]}`;
}

const DIFFICULTY_LABELS: Record<Locale, Record<Experience["difficulty"], string>> = {
  es: { easy: "Fácil", moderate: "Moderado", hard: "Difícil", expert: "Experto" },
  en: { easy: "Easy", moderate: "Moderate", hard: "Hard", expert: "Expert" },
  pt: { easy: "Fácil", moderate: "Moderado", hard: "Difícil", expert: "Especialista" },
};

export function difficultyLabel(d: Experience["difficulty"], locale: Locale): string {
  return DIFFICULTY_LABELS[locale][d] ?? d;
}

// Nombres "endónimos + traducción" para los idiomas que un guía puede hablar.
// Solo los más comunes para turismo en el norte argentino. Si el code no está
// mapeado, se muestra el código tal cual en mayúsculas (ej. "JA" para japonés).
const LANGUAGE_LABELS: Record<Locale, Record<string, string>> = {
  es: {
    es: "Español",
    en: "Inglés",
    pt: "Portugués",
    fr: "Francés",
    it: "Italiano",
    de: "Alemán",
  },
  en: {
    es: "Spanish",
    en: "English",
    pt: "Portuguese",
    fr: "French",
    it: "Italian",
    de: "German",
  },
  pt: {
    es: "Espanhol",
    en: "Inglês",
    pt: "Português",
    fr: "Francês",
    it: "Italiano",
    de: "Alemão",
  },
};

export function languageLabel(code: string, locale: Locale): string {
  const c = (code || "").trim().toLowerCase();
  return LANGUAGE_LABELS[locale][c] ?? c.toUpperCase();
}

// Bandera representativa por idioma de tour. Para "es" usamos 🇦🇷 (somos
// Argentina, no España); "pt" → 🇧🇷 porque el público es brasileño.
const LANGUAGE_FLAGS: Record<string, string> = {
  es: "🇦🇷",
  en: "🇬🇧",
  pt: "🇧🇷",
  fr: "🇫🇷",
  it: "🇮🇹",
  de: "🇩🇪",
};

export function languageFlag(code: string): string {
  return LANGUAGE_FLAGS[(code || "").trim().toLowerCase()] ?? "🌐";
}

/**
 * Parsea el CSV de idiomas que manda el listado ("es,en,pt") a códigos
 * únicos normalizados, preservando el orden.
 */
export function parseLanguagesCsv(csv: string | null | undefined): string[] {
  if (!csv) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of csv.split(",")) {
    const code = raw.trim().toLowerCase();
    if (!code || seen.has(code)) continue;
    seen.add(code);
    out.push(code);
  }
  return out;
}

/** Lista de idiomas única y ordenada por sort_order, lista para renderizar. */
export function getLanguagesForDisplay(exp: Experience): ExperienceLanguage[] {
  if (!exp.languages || exp.languages.length === 0) return [];
  const seen = new Set<string>();
  const unique: ExperienceLanguage[] = [];
  for (const l of exp.languages) {
    const code = (l.language_code || "").trim().toLowerCase();
    if (!code || seen.has(code)) continue;
    seen.add(code);
    unique.push({ ...l, language_code: code });
  }
  return unique.sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
}

/**
 * Construye URL wa.me con texto pre-armado.
 * El whatsapp_e164 viene con el `+` adelante ("+5493814001001"); wa.me lo
 * acepta sin el `+`.
 */
export function buildWhatsappUrl(args: { phone: string; message: string }): string {
  const phone = args.phone.replace(/[^0-9]/g, "");
  const text = encodeURIComponent(args.message);
  return `https://wa.me/${phone}?text=${text}`;
}

/** Mensaje pre-armado para el CTA directo de WhatsApp (sin lead trackeado). */
export function buildWhatsappMessage(args: {
  title: string;
  locale: Locale;
}): string {
  const { title, locale } = args;
  if (locale === "en") {
    return `Hi! I'm interested in "${title}" on NorteWalk. Could you share availability?`;
  }
  if (locale === "pt") {
    return `Olá! Tenho interesse em "${title}" no NorteWalk. Pode me passar a disponibilidade?`;
  }
  return `Hola! Me interesa "${title}" en NorteWalk. ¿Podés pasarme disponibilidad?`;
}

/** URL de Google Maps con coordenadas, o null si no hay lat/lng. */
export function buildMapsUrl(
  lat: Numeric | null | undefined,
  lng: Numeric | null | undefined,
): string | null {
  if (lat === null || lat === undefined || lng === null || lng === undefined) return null;
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;
  return `https://www.google.com/maps/search/?api=1&query=${la},${ln}`;
}
