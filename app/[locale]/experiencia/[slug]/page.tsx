import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BookingPanel from "@/components/BookingPanel";
import {
  ApiError,
  getExperience,
  getExperiences,
  isTrue,
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
  formatTime,
  getCoverImage,
  getGalleryImages,
  getSchedulesForLocale,
  pickI18n,
  weekdayLabel,
} from "@/lib/format";
import { LOCALES, getDictionary, isLocale, type Locale } from "@/lib/i18n";

interface DetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// ---------- generateStaticParams ----------

export async function generateStaticParams() {
  try {
    const { items } = await getExperiences({ limit: 200 });
    return LOCALES.flatMap((locale) =>
      items.map((exp) => ({ locale, slug: exp.slug })),
    );
  } catch (error) {
    console.error("[detail] generateStaticParams falló (XAMPP off?):", error);
    return [];
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

  return {
    title,
    description: description ?? undefined,
    alternates: {
      canonical: `/${locale}/experiencia/${exp.slug}/`,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `/${l}/experiencia/${exp.slug}/`]),
      ),
    },
    openGraph: {
      title,
      description: description ?? undefined,
      images: cover ? [cover] : undefined,
      locale,
      type: "website",
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
  const extraImages = gallery.filter((img) => !isTrue(img.is_cover)).slice(0, 4);
  const price = formatPrice(exp, dict, locale);
  const duration = formatDuration(exp.duration_min, locale);
  const difficulty = difficultyLabel(exp.difficulty, locale);
  const rating = formatRating(exp.external_rating, exp.external_reviews_count);
  const mapsUrl = buildMapsUrl(exp.latitude, exp.longitude);
  const schedules = getSchedulesForLocale(exp, locale);

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: title,
    description: shortDesc ?? longDesc ?? undefined,
    image: cover ?? undefined,
    touristType: verticalLabel,
    offers:
      exp.type === "paid" && exp.price !== null
        ? {
            "@type": "Offer",
            price: String(exp.price),
            priceCurrency: exp.currency || "ARS",
            availability: "https://schema.org/InStock",
          }
        : undefined,
    aggregateRating:
      rating && Number(exp.external_reviews_count) > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: rating.stars,
            reviewCount: Number(exp.external_reviews_count),
          }
        : undefined,
    provider: {
      "@type": "Organization",
      name: exp.provider_name,
    },
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-(--color-bone-100)/60 border-b border-(--color-border)">
        <div className="mx-auto max-w-6xl px-6 py-3 text-sm">
          <Link href={`/${locale}/`} className="text-(--color-muted) hover:text-(--color-foreground)">
            {dict.nav.home}
          </Link>
          <span className="mx-2 text-(--color-ink-300)">/</span>
          <Link
            href={`/${locale}/${exp.vertical}/`}
            className="text-(--color-muted) hover:text-(--color-foreground)"
          >
            {verticalLabel}
          </Link>
          <span className="mx-2 text-(--color-ink-300)">/</span>
          <span className="text-(--color-foreground)">{title}</span>
        </div>
      </nav>

      {/* Hero con cover */}
      <section className="bg-(--color-stone-800) text-(--color-bone-100)">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1fr_1.3fr] md:items-center md:py-20">
          <div>
            <p className="mb-4 font-(family-name:--font-mono) text-[11px] uppercase tracking-[0.25em] text-(--color-accent-400)">
              {verticalLabel} · {exp.category}
            </p>
            <h1 className="font-display text-4xl leading-[1.1] sm:text-5xl">{title}</h1>
            {shortDesc && (
              <p className="mt-5 text-lg text-(--color-bone-300)">{shortDesc}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              {duration && (
                <span className="rounded-full bg-(--color-bone-100)/10 px-3 py-1">
                  {duration}
                </span>
              )}
              <span className="rounded-full bg-(--color-bone-100)/10 px-3 py-1 capitalize">
                {difficulty}
              </span>
              <span className="rounded-full bg-(--color-bone-100)/10 px-3 py-1 capitalize">
                {exp.city.replace(/-/g, " ")}
              </span>
              {rating && (
                <span className="inline-flex items-center gap-1 rounded-full bg-(--color-accent-500)/15 px-3 py-1 text-(--color-bone-100)">
                  <span className="text-(--color-accent-400)" aria-hidden>★</span>
                  {rating.label}
                </span>
              )}
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-(--color-stone-700) shadow-lg">
            {cover ? (
              <Image
                src={cover}
                alt={title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-(--color-bone-300)/40">
                NorteWalk
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Galería extra */}
      {extraImages.length > 0 && (
        <section className="bg-(--color-background)">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {extraImages.map((img, idx) => {
                const url = img.url.startsWith("http")
                  ? img.url
                  : getCoverImage({ ...exp, images: [img] }) ?? "";
                return (
                  <div
                    key={img.id ?? `${img.url}-${idx}`}
                    className="relative aspect-square overflow-hidden rounded-xl bg-(--color-stone-100)"
                  >
                    {url && (
                      <Image
                        src={url}
                        alt={img.alt_text ?? title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Cuerpo */}
      <section className="bg-(--color-background)">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.6fr_1fr] md:py-16">
          {/* Izquierda: contenido */}
          <div className="space-y-12">
            {longDesc && (
              <article>
                <h2 className="font-display mb-5 text-3xl text-(--color-foreground)">
                  {dict.detail.description}
                </h2>
                <p className="whitespace-pre-line text-(--color-ink-700) leading-relaxed">
                  {longDesc}
                </p>
              </article>
            )}

            {exp.itinerary && exp.itinerary.length > 0 && (
              <article>
                <h2 className="font-display mb-6 text-3xl text-(--color-foreground)">
                  {dict.detail.itinerary}
                </h2>
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
                          <p className="mt-0.5 text-xs uppercase tracking-wider text-(--color-accent-500)">
                            {formatDuration(step.duration_min, locale)}
                          </p>
                        )}
                        {step.description && (
                          <p className="mt-2 text-sm text-(--color-muted)">{step.description}</p>
                        )}
                      </li>
                    ))}
                </ol>
              </article>
            )}

            {exp.inclusions && exp.inclusions.length > 0 && (
              <article className="grid gap-6 md:grid-cols-2">
                <InclusionList
                  title={dict.detail.included}
                  items={exp.inclusions.filter((i) => i.kind === "included")}
                  variant="included"
                />
                <InclusionList
                  title={dict.detail.notIncluded}
                  items={exp.inclusions.filter((i) => i.kind === "excluded")}
                  variant="excluded"
                />
              </article>
            )}

            {meetingPoint && (
              <article>
                <h2 className="font-display mb-3 text-3xl text-(--color-foreground)">
                  {dict.detail.meetingPoint}
                </h2>
                <p className="text-(--color-ink-700)">{meetingPoint}</p>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-(--color-accent-600) hover:text-(--color-accent-700) hover:underline"
                  >
                    {dict.detail.viewOnMap} →
                  </a>
                )}
              </article>
            )}
          </div>

          {/* Derecha: aside */}
          <aside className="space-y-4 md:sticky md:top-6 md:self-start">
            {/* Provider + precio */}
            <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-(--color-muted)">
                {dict.detail.provider}
              </p>
              <p className="mt-1 text-lg font-semibold text-(--color-foreground)">
                {exp.provider_name}
              </p>
              <p className="text-sm text-(--color-muted) capitalize">
                {exp.provider_city.replace(/-/g, " ")}
              </p>
              <div className="mt-5 border-t border-(--color-border) pt-5">
                <p className="text-2xl font-bold text-(--color-foreground)">{price.label}</p>
                {price.hint && <p className="text-sm text-(--color-muted)">{price.hint}</p>}
              </div>

              <dl className="mt-5 space-y-3 border-t border-(--color-border) pt-5 text-sm">
                {duration && <InfoRow label={dict.detail.duration} value={duration} />}
                <InfoRow label={dict.detail.difficulty} value={difficulty} />
                {groupSize && <InfoRow label={dict.detail.groupSize} value={groupSize} />}
                <InfoRow label={dict.detail.minAge} value={minAgeLabel} />
              </dl>

              <div className="mt-5 border-t border-(--color-border) pt-5">
                <p className="text-xs uppercase tracking-widest text-(--color-muted)">
                  {dict.detail.schedule}
                </p>
                {schedules.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 text-sm text-(--color-ink-700)">
                    {schedules.map((s) => (
                      <li key={s.id ?? `${s.day_of_week}-${s.start_time}`}>
                        <span className="font-medium">{weekdayLabel(s.day_of_week, locale)}</span>
                        <span className="ml-2 text-(--color-muted)">
                          {formatTime(s.start_time)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-(--color-muted)">{dict.detail.noSchedule}</p>
                )}
              </div>
            </div>

            {/* Trigger del modal de reserva + sticky mobile CTA */}
            <BookingPanel
              experienceId={Number(exp.id)}
              minPax={minPax}
              maxPax={maxPax}
              fallbackWhatsappUrl={wa}
              locale={locale}
              dict={dict}
              priceLabel={price.label}
              recap={
                <div className="flex h-full flex-col gap-5">
                  {cover && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-(--color-stone-700)">
                      <Image
                        src={cover}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 28rem"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-(--color-accent-400)">
                      {verticalLabel} · {exp.category}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold leading-tight text-(--color-bone-100)">
                      {title}
                    </h3>
                  </div>
                  <div className="rounded-xl bg-(--color-stone-900)/40 p-4">
                    <p className="text-2xl font-bold">{price.label}</p>
                    {price.hint && (
                      <p className="text-xs text-(--color-bone-300)">{price.hint}</p>
                    )}
                  </div>
                  <dl className="space-y-2.5 text-sm text-(--color-bone-300)">
                    {duration && (
                      <RecapRow label={dict.detail.duration} value={duration} />
                    )}
                    <RecapRow label={dict.detail.difficulty} value={difficulty} />
                    {groupSize && (
                      <RecapRow label={dict.detail.groupSize} value={groupSize} />
                    )}
                    <RecapRow label={dict.detail.minAge} value={minAgeLabel} />
                  </dl>
                  {meetingPoint && (
                    <div className="border-t border-(--color-bone-100)/15 pt-4">
                      <p className="text-xs uppercase tracking-widest text-(--color-accent-400)">
                        {dict.detail.meetingPoint}
                      </p>
                      <p className="mt-1 text-sm text-(--color-bone-100)">
                        {meetingPoint}
                      </p>
                      {mapsUrl && (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-xs font-medium text-(--color-accent-400) hover:text-(--color-accent-300) hover:underline"
                        >
                          {dict.detail.viewOnMap} →
                        </a>
                      )}
                    </div>
                  )}
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-1 rounded-full border border-(--color-bone-100)/30 px-4 py-2 text-xs font-medium text-(--color-bone-100) transition-colors hover:bg-(--color-bone-100)/10"
                  >
                    {dict.booking.askOnly} →
                  </a>
                </div>
              }
            />
          </aside>
        </div>
      </section>

      {/* Schema.org JSON-LD (la sticky mobile CTA la maneja BookingPanel) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

// ---------- Subcomponentes ----------

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-(--color-muted)">{label}</dt>
      <dd className="font-medium text-(--color-foreground) text-right">{value}</dd>
    </div>
  );
}

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-(--color-bone-300)/70">{label}</dt>
      <dd className="font-semibold text-(--color-bone-100) text-right">{value}</dd>
    </div>
  );
}

function InclusionList({
  title,
  items,
  variant,
}: {
  title: string;
  items: Experience["inclusions"] extends (infer T)[] | undefined ? T[] : never;
  variant: "included" | "excluded";
}) {
  if (!items || items.length === 0) return null;
  const sorted = [...items].sort(
    (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
  );
  const icon = variant === "included" ? "✓" : "✕";
  const iconColor =
    variant === "included" ? "text-(--color-stone-600)" : "text-(--color-accent-700)";
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-(--color-foreground)">{title}</h3>
      <ul className="space-y-2 text-sm text-(--color-ink-700)">
        {sorted.map((item, i) => (
          <li key={item.id ?? `${variant}-${i}`} className="flex items-start gap-2">
            <span aria-hidden className={`mt-0.5 font-bold ${iconColor}`}>
              {icon}
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
