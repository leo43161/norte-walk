/* =====================================================================
 * NorteWalk — cliente del API público de catálogo.
 *
 * El backend PHP devuelve siempre el envelope:
 *   { status: number, message: string, data: T, meta?: { total?: number } }
 *
 * En errores 4xx el message es legible y se debe surface tal cual.
 *
 * MySQL devuelve TODO lo numérico como string ("150", "4.90", "0", "127").
 * Tanto enteros como decimales y flags. Los types lo reflejan como
 * `number | string` o `Numeric`. Al consumir, usar `Number(x)` siempre.
 * NUNCA `x === 1` ni `!!x` (el string "0" es truthy).
 * ===================================================================== */

import type { Locale } from "@/lib/i18n";

// ---------- Tipos del dominio ----------

export type Vertical = "fwt" | "adventure" | "experience" | "gastronomy";
export type Difficulty = "easy" | "moderate" | "hard" | "expert";
export type ExperienceType = "free" | "paid";

/** Flag boolean-like que MySQL serializa como "0"/"1" o 0/1. */
export type Flag = 0 | 1 | "0" | "1";

/** Numérico que MySQL serializa como string. */
export type Numeric = number | string;

export interface ExperienceImage {
  id?: Numeric;
  experience_id?: Numeric;
  url: string;
  alt_text: string | null;
  sort_order?: Numeric;
  is_cover: Flag;
  created_at?: string;
}

export interface ExperienceInclusion {
  id?: Numeric;
  experience_id?: Numeric;
  kind: "included" | "excluded";
  sort_order?: Numeric;
  text: string;
}

export interface ExperienceItineraryStep {
  id?: Numeric;
  experience_id?: Numeric;
  step_order: Numeric;
  title: string;
  description: string | null;
  duration_min: Numeric | null;
}

export interface ExperienceSchedule {
  id?: Numeric;
  experience_id?: Numeric;
  day_of_week: Numeric; // 0=domingo … 6=sábado (convención SQL)
  start_time: string;   // "HH:MM:SS"
  locale: Locale;
  capacity_hint?: Numeric | null;
  is_active?: Flag;
  valid_from?: string | null;
  valid_to?: string | null;
}

export interface Provider {
  id: Numeric;
  slug: string;
  business_name: string;
  contact_name: string;
  whatsapp_e164: string;
  city: string;
  bio: string | null;
  logo_url: string | null;
  // status NO se devuelve público — la API ya filtra inactivos.
}

/**
 * Item del listado público (`GET /catalog/experiences`).
 * Trae datos del provider flatten-eados (provider_id, provider_name, whatsapp_e164)
 * y un `cover_image` que puede venir como URL relativa al API o absoluta.
 * NO incluye long_desc, meeting_point, min_pax, etc — esos son del detalle.
 */
export interface ExperienceListItem {
  id: Numeric;
  slug: string;
  title: string;
  short_desc: string | null;
  vertical: Vertical;
  category: string;
  type: ExperienceType;
  price: Numeric | null;
  price_min: Numeric | null;
  price_max: Numeric | null;
  currency: string;
  duration_min: Numeric;
  difficulty: Difficulty;
  city: string;
  province: string;
  latitude: Numeric | null;
  longitude: Numeric | null;
  is_featured: Flag;
  external_rating: Numeric | null;
  external_reviews_count: Numeric;
  cover_image: string | null;
  // Provider flatten:
  provider_id: Numeric;
  provider_name: string;
  whatsapp_e164: string;
}

/**
 * Detalle público (`GET /catalog/experience?slug=`).
 *
 * Comparte muchos campos con el listado, pero hay diferencias verificadas
 * contra el endpoint real:
 *
 *  - NO trae `cover_image` (usar `images[]` con `is_cover=1` vía getCoverImage).
 *  - NO trae un `provider` anidado: viene flatten con `provider_slug`,
 *    `provider_status`, `provider_paid_until`, `provider_city`, `provider_name`,
 *    `whatsapp_e164`.
 *  - Trae versión raw + versión i18n (`title` + `i18n_title`, etc.) — preferir
 *    la i18n cuando exista (helper `pickI18n`).
 *  - `schedules` viene SIN filtrar por locale — filtrar manualmente.
 *  - Agrega `meta_title`/`meta_description` (+ versiones i18n) para SEO.
 */
export interface Experience {
  id: Numeric;
  slug: string;
  provider_id: Numeric;
  title: string;
  short_desc: string | null;
  long_desc: string | null;
  vertical: Vertical;
  category: string;
  type: ExperienceType;
  price: Numeric | null;
  price_min: Numeric | null;
  price_max: Numeric | null;
  currency: string;
  duration_min: Numeric;
  difficulty: Difficulty;
  meeting_point: string | null;
  city: string;
  province: string;
  country: string;
  latitude: Numeric | null;
  longitude: Numeric | null;
  min_pax: Numeric;
  max_pax: Numeric;
  min_age: Numeric;
  is_featured: Flag;
  external_rating: Numeric | null;
  external_reviews_count: Numeric;
  external_reviews_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  // Provider flatten:
  provider_name: string;
  provider_slug: string;
  whatsapp_e164: string;
  provider_city: string;
  provider_status?: string;
  provider_paid_until?: string;
  // Cover_image NO viene en detalle, pero el endpoint a veces lo manda en
  // listados unificados — opcional por las dudas.
  cover_image?: string | null;
  // i18n: campos traducidos según el locale del query param.
  i18n_title?: string | null;
  i18n_short_desc?: string | null;
  i18n_long_desc?: string | null;
  i18n_meeting_point?: string | null;
  i18n_meta_title?: string | null;
  i18n_meta_description?: string | null;
  // Timestamps (raw):
  created_at?: string;
  updated_at?: string;
  // Relaciones:
  images?: ExperienceImage[];
  inclusions?: ExperienceInclusion[];
  itinerary?: ExperienceItineraryStep[];
  schedules?: ExperienceSchedule[];
}

export interface ProviderWithExperiences extends Provider {
  experiences?: ExperienceListItem[];
}

/** Campos i18n disponibles en el detalle de experiencia. */
export type I18nField =
  | "title"
  | "short_desc"
  | "long_desc"
  | "meeting_point"
  | "meta_title"
  | "meta_description";

// ---------- Envelope ----------

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  meta?: { total?: Numeric } & Record<string, unknown>;
}

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// ---------- Lead ----------

export interface LeadBody {
  experience_id: number;
  tourist_name: string;
  tourist_phone: string;
  desired_date: string; // YYYY-MM-DD
  pax: number;
  // opcionales:
  desired_time?: string;
  tourist_email?: string;
  preferred_locale?: Locale;
  message?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface LeadResponse {
  /** Lead id viene como string (MySQL), normalizá con Number() si lo necesitás como int. */
  lead_id: Numeric;
  whatsapp_url: string;
}

/**
 * Fecha disponible para reservar (return de `available_dates`).
 * El PHP no devuelve un `string[]` plano — devuelve la metadata del schedule
 * que originó la fecha (capacity_hint, start_time, locale), útil para
 * pre-cargar el horario en el form cuando el usuario elige una fecha.
 */
export interface AvailableDate {
  schedule_id: Numeric;
  available_date: string;  // "YYYY-MM-DD"
  dow_check: Numeric;
  start_time: string;       // "HH:MM:SS"
  locale: Locale;
  capacity_hint: Numeric | null;
}

// ---------- Fetch helpers ----------

function apiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_BASE no está definido. Verificá .env.local.");
  }
  return base.replace(/\/$/, "");
}

/** Expone el base del API para helpers de URL (ej. resolveImageUrl). */
export function getApiBase(): string {
  return apiBase();
}

function buildUrl(path: string, query: Record<string, unknown> = {}): string {
  const url = new URL(`${apiBase()}${path}`);
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === "") continue;
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

async function unwrap<T>(res: Response): Promise<T> {
  let payload: ApiResponse<T> | { message?: string } | undefined;
  try {
    payload = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(res.status, `Respuesta no-JSON del API (${res.status})`);
  }

  if (!res.ok) {
    const msg = (payload as { message?: string })?.message ?? `Error HTTP ${res.status}`;
    throw new ApiError(res.status, msg);
  }

  return (payload as ApiResponse<T>).data;
}

async function unwrapWithMeta<T>(res: Response): Promise<{ data: T; meta: ApiResponse<T>["meta"] }> {
  let payload: ApiResponse<T> | undefined;
  try {
    payload = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(res.status, `Respuesta no-JSON del API (${res.status})`);
  }

  if (!res.ok) {
    const msg = (payload as { message?: string } | undefined)?.message ?? `Error HTTP ${res.status}`;
    throw new ApiError(res.status, msg);
  }

  return { data: payload!.data, meta: payload!.meta };
}

// ---------- Endpoints ----------

export interface ExperiencesQuery {
  city?: string;
  vertical?: Vertical;
  category?: string;
  type?: ExperienceType;
  locale?: Locale;
  limit?: number;
  offset?: number;
}

/** GET /catalog/experiences — usado en BUILD para prerenderear listados. */
export async function getExperiences(
  query: ExperiencesQuery = {},
): Promise<{ items: ExperienceListItem[]; total: number }> {
  const url = buildUrl("/catalog/experiences", {
    locale: "es",
    limit: 24,
    offset: 0,
    ...query,
  });
  const res = await fetch(url);
  const { data, meta } = await unwrapWithMeta<ExperienceListItem[]>(res);
  return { items: data ?? [], total: Number(meta?.total ?? data?.length ?? 0) };
}

/** GET /catalog/experience?slug=… — detalle. Usado en BUILD. */
export async function getExperience(
  slug: string,
  locale: Locale = "es",
): Promise<Experience> {
  const url = buildUrl("/catalog/experience", { slug, locale });
  const res = await fetch(url);
  return unwrap<Experience>(res);
}

/** GET /catalog/provider?slug=… — usado en BUILD. */
export async function getProvider(slug: string): Promise<ProviderWithExperiences> {
  const url = buildUrl("/catalog/provider", { slug });
  const res = await fetch(url);
  return unwrap<ProviderWithExperiences>(res);
}

/** GET /catalog/available_dates — usado en CLIENTE (calendar reactivo). */
export async function getAvailableDates(params: {
  experience_id: number;
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD (rango <= 60 días)
  locale?: Locale;
}): Promise<AvailableDate[]> {
  const url = buildUrl("/catalog/available_dates", params);
  const res = await fetch(url);
  return unwrap<AvailableDate[]>(res);
}

/** POST /catalog/lead — usado en CLIENTE. Redirigir el browser a whatsapp_url. */
export async function submitLead(body: LeadBody): Promise<LeadResponse> {
  const url = buildUrl("/catalog/lead");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<LeadResponse>(res);
}

// ---------- Helpers de dominio ----------

/** True si una flag MySQL (0/1 o "0"/"1") representa verdadero. */
export function isTrue(flag: Flag | undefined | null): boolean {
  if (flag === undefined || flag === null) return false;
  return Number(flag) === 1;
}
