import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BookingWidget from "@/components/BookingWidget";
import ExperienceGallery, { type GalleryItem } from "@/components/ExperienceGallery";
import JsonLd from "@/components/JsonLd";
import WaitlistCard from "@/components/WaitlistCard";
import {
  ApiError,
  getExperience,
  getExperiences,
  type Experience,
} from "@/lib/api";
import {
  buildMapsUrl,
  buildWhatsappMessage,
  buildWhatsappUrl,
  difficultyLabel,
  formatDuration,
  formatPrice,
  formatRating,
  getCoverImage,
  getGalleryImages,
  getLanguagesForDisplay,
  languageLabel,
  pickI18n,
  resolveImageUrl,
} from "@/lib/format";
import { LOCALES, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { PRELAUNCH } from "@/lib/launch";
import {
  OG_LOCALE,
  SITE_NAME,
  buildBreadcrumb,
  buildExperienceSchema,
} from "@/lib/seo";

interface DetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// ---------- generateStaticParams ----------

export async function generateStaticParams() {
  try {
    const { items } = await getExperiences({ limit: 200 });
    if (items.length === 0) {
      throw new Error(
        `Catalog vacío. API_BASE=${process.env.API_BASE ?? "(undefined)"}`,
      );
    }
    return LOCALES.flatMap((locale) =>
      items.map((exp) => ({ locale, slug: exp.slug })),
    );
  } catch (error) {
    console.error(
      `[detail] generateStaticParams falló. API_BASE=${process.env.API_BASE ?? "(undefined)"} ->`,
      error,
    );
    throw error;
  }
}

// ---------- generateMetadata ----------

async function fetchExperienceSafe(slug: string, locale: Locale): Promise<Experience | null> {
  try {
    return await getExperience(slug, locale);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const exp = await fetchExperienceSafe(slug, locale);
  if (!exp) return {};

  const title = pickI18n(exp, "meta_title") ?? pickI18n(exp, "title") ?? exp.title;
  const description =
    pickI18n(exp, "meta_description") ?? pickI18n(exp, "short_desc") ?? exp.short_desc ?? undefined;
  const cover = getCoverImage(exp);

  const ogImages = cover
    ? [{ url: cover, alt: title }]
    : [{ url: "/og-image.png", width: 1200, height: 630, alt: title }];

  return {
    title,
    description: description ?? undefined,
    alternates: {
      canonical: `/${locale}/experiencia/${exp.slug}/`,
      languages: {
        ...Object.fromEntries(
          LOCALES.map((l) => [l, `/${l}/experiencia/${exp.slug}/`]),
        ),
        "x-default": `/es/experiencia/${exp.slug}/`,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description: description ?? undefined,
      url: `/${locale}/experiencia/${exp.slug}/`,
      images: ogImages,
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? undefined,
      images: cover ? [cover] : ["/og-image.png"],
    },
  };
}

// ---------- Page ----------

export default async function ExperienceDetailPage({ params }: DetailPageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  const exp = await fetchExperienceSafe(slug, locale);
  if (!exp) notFound();

  const title = pickI18n(exp, "title") ?? exp.title;
  const shortDesc = pickI18n(exp, "short_desc");
  const longDesc = pickI18n(exp, "long_desc");
  const meetingPoint = pickI18n(exp, "meeting_point");
  const cover = getCoverImage(exp);
  const gallery = getGalleryImages(exp);
  const price = formatPrice(exp, dict, locale);
  const duration = formatDuration(exp.duration_min, locale);
  const difficulty = difficultyLabel(exp.difficulty, locale);
  const rating = formatRating(exp.external_rating, exp.external_reviews_count);
  const mapsUrl = buildMapsUrl(exp.latitude, exp.longitude);
  const languages = getLanguagesForDisplay(exp);

  // Items para la galería: si no hay imágenes, mostramos solo el cover.
  const galleryItems: GalleryItem[] = (() => {
    const items: GalleryItem[] = [];
    for (const img of gallery) {
      const url = resolveImageUrl(img.url);
      if (url) items.push({ url, alt: img.alt_text ?? title });
    }
    if (items.length === 0 && cover) items.push({ url: cover, alt: title });
    return items;
  })();

  const minPax = Number(exp.min_pax);
  const maxPax = Number(exp.max_pax);
  const minAge = Number(exp.min_age);
  const groupSize =
    Number.isFinite(minPax) && Number.isFinite(maxPax) && (minPax > 0 || maxPax > 0)
      ? dict.detail.groupSizeValue
          .replace("{min}", String(minPax))
          .replace("{max}", String(maxPax))
      : null;
  const minAgeLabel =
    Number.isFinite(minAge) && minAge > 0
      ? dict.detail.minAgeYears.replace("{n}", String(minAge))
      : dict.detail.minAgeNone;

  const wa = buildWhatsappUrl({
    phone: exp.whatsapp_e164,
    message: buildWhatsappMessage({ title, locale }),
  });

  const verticalLabel = dict.nav[exp.vertical as keyof typeof dict.nav] ?? exp.vertical;

  const includedItems = exp.inclusions?.filter((i) => i.kind === "included") ?? [];
  const excludedItems = exp.inclusions?.filter((i) => i.kind === "excluded") ?? [];

  const breadcrumbLd = buildBreadcrumb([
    { name: dict.nav.home, path: `/${locale}/` },
    { name: verticalLabel, path: `/${locale}/${exp.vertical}/` },
    { name: title, path: `/${locale}/experiencia/${exp.slug}/` },
  ]);

  const tripLd = buildExperienceSchema({
    url: `/${locale}/experiencia/${exp.slug}/`,
    name: title,
    description: shortDesc ?? longDesc,
    images: galleryItems.map((g) => g.url),
    touristType: verticalLabel,
    languages: languages.map((l) => l.language_code),
    providerName: exp.provider_name,
    city: exp.city.replace(/-/g, " "),
    isFree: exp.type === "free",
    price: exp.price !== null ? Number(exp.price) : null,
    currency: exp.currency,
    ratingValue: exp.external_rating !== null ? Number(exp.external_rating) : null,
    reviewCount: Number(exp.external_reviews_count),
    itinerary: exp.itinerary
      ? [...exp.itinerary]
          .sort((a, b) => Number(a.step_order) - Number(b.step_order))
          .map((s) => ({ name: s.title, description: s.description }))
      : undefined,
  });

  return (
    <>
      {/* Galería arriba — full bleed sutil con padding lateral */}
      <section className="bg-(--color-background) pt-4 sm:pt-6">
        <ExperienceGallery
          images={galleryItems}
          title={title}
          viewAllLabel={dict.detail.galleryViewAll}
          closeLabel={dict.detail.galleryClose}
          prevLabel={dict.detail.galleryPrev}
          nextLabel={dict.detail.galleryNext}
          photoOfLabel={dict.detail.galleryPhotoOf}
        />
      </section>

      {/* Breadcrumb */}
      <nav className="bg-(--color-background)">
        <div className="mx-auto max-w-6xl px-4 pb-2 pt-5 text-xs sm:px-6 sm:text-sm">
          <Link
            href={`/${locale}/`}
            className="text-(--color-muted) hover:text-(--color-foreground)"
          >
            {dict.nav.home}
          </Link>
          <span className="mx-1.5 text-(--color-ink-300)">/</span>
          <Link
            href={`/${locale}/${exp.vertical}/`}
            className="text-(--color-muted) hover:text-(--color-foreground)"
          >
            {verticalLabel}
          </Link>
          <span className="mx-1.5 text-(--color-ink-300)">/</span>
          <span className="text-(--color-foreground)">{title}</span>
        </div>
      </nav>

      {/* Cuerpo: título + contenido a la izq, sidebar de precio a la der */}
      <section className="bg-(--color-background) pb-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-6 sm:px-6 md:grid-cols-[1.6fr_1fr] md:py-10">
          {/* Izquierda */}
          <div className="space-y-8">
            {/* Header de título */}
            <header>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-(--color-bone-200) px-3 py-1 text-[12px] font-semibold capitalize text-(--color-stone-700)">
                {verticalLabel} · {exp.category}
              </span>
              <h1 className="font-display text-3xl leading-tight text-(--color-foreground) sm:text-4xl">
                {title}
              </h1>

              {/* Rating + idiomas + duración row */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-(--color-ink-700)">
                {rating && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-(--color-sun-300)/60 px-3 py-1 text-xs font-semibold text-(--color-foreground)">
                    <span className="text-(--color-accent-600)" aria-hidden>★</span>
                    {rating.label}
                  </span>
                )}
                {duration && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-(--color-muted)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    {duration}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs capitalize text-(--color-muted)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  {exp.city.replace(/-/g, " ")}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs capitalize text-(--color-muted)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M3 18l6-6 4 4 8-8" />
                  </svg>
                  {difficulty}
                </span>
              </div>

              {languages.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--color-muted)"
                    aria-hidden
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 8h14" />
                      <path d="M10 5v3" />
                      <path d="M7 8c0 4 3 7 6 9" />
                      <path d="M14 8c0 4-3 7-6 9" />
                      <path d="M13 14l4 7" />
                      <path d="M21 21l-2-4" />
                      <path d="M15 18h6" />
                    </svg>
                    <span className="sr-only">{dict.detail.languages}</span>
                  </span>
                  <ul className="flex flex-wrap gap-1.5" aria-label={dict.detail.languages}>
                    {languages.map((l) => (
                      <li
                        key={l.id ?? l.language_code}
                        className="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-bone-200)/60 px-2.5 py-0.5 text-xs font-medium text-(--color-ink-700)"
                      >
                        {languageLabel(l.language_code, locale)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {shortDesc && (
                <p className="mt-5 text-base leading-relaxed text-(--color-ink-700)">
                  {shortDesc}
                </p>
              )}
            </header>

            {/* Policy card */}
            <div className="rounded-xl border border-(--color-border) bg-(--color-bone-200)/50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-(--color-accent-500)/15 text-(--color-accent-600)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-(--color-foreground)">
                    {dict.detail.cancellation}
                  </p>
                  <p className="mt-0.5 text-(--color-muted)">
                    {dict.detail.cancellationNonRefundable}
                  </p>
                </div>
              </div>
            </div>

            {/* Qué incluye */}
            {(includedItems.length > 0 || excludedItems.length > 0) && (
              <Card>
                <SectionHeader title={dict.detail.included} />
                <div className="grid gap-6 md:grid-cols-2">
                  <InclusionList
                    items={includedItems}
                    variant="included"
                  />
                  {excludedItems.length > 0 && (
                    <InclusionList
                      title={dict.detail.notIncluded}
                      items={excludedItems}
                      variant="excluded"
                    />
                  )}
                </div>
              </Card>
            )}

            {/* Descripción */}
            {longDesc && (
              <Card>
                <SectionHeader title={dict.detail.description} />
                <p className="whitespace-pre-line leading-relaxed text-(--color-ink-700)">
                  {longDesc}
                </p>
              </Card>
            )}

            {/* Itinerario */}
            {exp.itinerary && exp.itinerary.length > 0 && (
              <Card>
                <SectionHeader title={dict.detail.itinerary} />
                <ol className="relative space-y-6 border-l-2 border-(--color-stone-200) pl-6">
                  {[...exp.itinerary]
                    .sort((a, b) => Number(a.step_order) - Number(b.step_order))
                    .map((step) => (
                      <li key={step.id ?? step.step_order} className="relative">
                        <span className="absolute -left-[33px] flex h-6 w-6 items-center justify-center rounded-full bg-(--color-stone-600) text-xs font-bold text-(--color-bone-100)">
                          {Number(step.step_order)}
                        </span>
                        <h3 className="font-semibold text-(--color-foreground)">{step.title}</h3>
                        {step.duration_min !== null && step.duration_min !== undefined && (
                          <p className="mt-0.5 text-xs font-semibold text-(--color-accent-600)">
                            {formatDuration(step.duration_min, locale)}
                          </p>
                        )}
                        {step.description && (
                          <p className="mt-2 text-sm text-(--color-muted)">{step.description}</p>
                        )}
                      </li>
                    ))}
                </ol>
              </Card>
            )}

            {/* Punto de encuentro */}
            {meetingPoint && (
              <Card>
                <SectionHeader title={dict.detail.meetingPoint} />
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-(--color-accent-500)/15 text-(--color-accent-600)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-(--color-foreground)">{meetingPoint}</p>
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-(--color-accent-600) hover:text-(--color-accent-700) hover:underline"
                      >
                        {dict.detail.viewOnMap} →
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Info adicional */}
            <Card>
              <SectionHeader title={dict.detail.info} />
              <ul className="space-y-2 text-sm text-(--color-ink-700)">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-(--color-accent-500)" />
                  <span>{dict.detail.shortInfo}</span>
                </li>
                {duration && (
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-(--color-accent-500)" />
                    <span>
                      <strong>{dict.detail.duration}:</strong> {duration}
                    </span>
                  </li>
                )}
                {groupSize && (
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-(--color-accent-500)" />
                    <span>
                      <strong>{dict.detail.groupSize}:</strong> {groupSize}
                    </span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-(--color-accent-500)" />
                  <span>
                    <strong>{dict.detail.minAge}:</strong> {minAgeLabel}
                  </span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Aside derecha: widget de reserva inline */}
          <aside className="space-y-4 md:sticky md:top-6 md:self-start">
            <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-[0_18px_44px_-26px_rgba(40,51,31,0.45)]">
              <div className="px-5 py-5 sm:px-6">
                {PRELAUNCH ? (
                  <WaitlistCard
                    experienceTitle={title}
                    slug={exp.slug}
                    priceLabel={price.label}
                    priceHint={price.hint}
                    isFree={exp.type === "free"}
                    fallbackWhatsappUrl={wa}
                    locale={locale}
                    dict={dict}
                  />
                ) : (
                  <BookingWidget
                    experienceId={Number(exp.id)}
                    maxPax={maxPax}
                    experienceTitle={title}
                    providerName={exp.provider_name}
                    meetingPoint={meetingPoint}
                    priceLabel={price.label}
                    priceHint={price.hint}
                    isFree={exp.type === "free"}
                    fallbackWhatsappUrl={wa}
                    locale={locale}
                    dict={dict}
                  />
                )}
              </div>

              {/* Guía a cargo */}
              <div className="border-t border-(--color-border) bg-(--color-bone-200)/40 px-5 py-4 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                  {dict.detail.provider}
                </p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-(--color-foreground)">
                      {exp.provider_name}
                    </p>
                    <p className="text-xs capitalize text-(--color-muted)">
                      {exp.provider_city.replace(/-/g, " ")}
                    </p>
                  </div>
                  {languages.length > 0 && (
                    <p className="text-right text-xs text-(--color-muted)">
                      {languages
                        .map((l) => languageLabel(l.language_code, locale))
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Schema.org JSON-LD: breadcrumb + experiencia (TouristTrip) */}
      <JsonLd data={[breadcrumbLd, tripLd]} />
    </>
  );
}

// ---------- Subcomponentes ----------

function Card({ children }: { children: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm sm:p-7">
      {children}
    </article>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="font-display mb-5 text-2xl text-(--color-foreground)">
      {title}
    </h2>
  );
}

function InclusionList({
  title,
  items,
  variant,
}: {
  title?: string;
  items: Experience["inclusions"] extends (infer T)[] | undefined ? T[] : never;
  variant: "included" | "excluded";
}) {
  if (!items || items.length === 0) return null;
  const sorted = [...items].sort(
    (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
  );
  const isIncluded = variant === "included";
  return (
    <div>
      {title && (
        <h3 className="mb-3 text-base font-semibold text-(--color-foreground)">
          {title}
        </h3>
      )}
      <ul className="space-y-2.5 text-sm text-(--color-ink-700)">
        {sorted.map((item, i) => (
          <li key={item.id ?? `${variant}-${i}`} className="flex items-start gap-2.5">
            <span
              aria-hidden
              className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                isIncluded
                  ? "bg-(--color-stone-600)/15 text-(--color-stone-600)"
                  : "bg-(--color-accent-500)/15 text-(--color-accent-700)"
              }`}
            >
              {isIncluded ? "✓" : "✕"}
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
