import Link from "next/link";
import { notFound } from "next/navigation";

import GrainOverlay from "@/components/nw/GrainOverlay";
import Hero from "@/components/nw/Hero";
import type { HeroSlide } from "@/components/nw/HeroCarousel";
import Kicker from "@/components/nw/Kicker";
import Section from "@/components/nw/Section";
import TourCard from "@/components/nw/TourCard";
import VerticalsStrip from "@/components/nw/VerticalsStrip";
import { getExperiences, isTrue, type ExperienceListItem, type Vertical } from "@/lib/api";
import { resolveImageUrl } from "@/lib/format";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

interface LocaleHomePageProps {
  params: Promise<{ locale: string }>;
}

interface HomeData {
  status: "ok" | "empty" | "error";
  /** Items destacados (curados o ranked fallback). */
  featured: ExperienceListItem[];
  /** Todo el catálogo cargado (para alimentar verticals strip y slides). */
  all: ExperienceListItem[];
  cities: string[];
  total: number;
}

async function loadHomeData(locale: Locale): Promise<HomeData> {
  try {
    const { items, total } = await getExperiences({ locale, limit: 24 });
    const cities = [...new Set(items.map((i) => i.city).filter(Boolean))].sort();
    if (items.length === 0) {
      return { status: "empty", featured: [], all: [], cities: [], total: 0 };
    }
    const flagged = items.filter((e) => isTrue(e.is_featured));
    const featured =
      flagged.length >= 3
        ? flagged.slice(0, 8)
        : [...items]
            .sort((a, b) => Number(b.external_rating ?? 0) - Number(a.external_rating ?? 0))
            .slice(0, 8);
    return { status: "ok", featured, all: items, cities, total };
  } catch (error) {
    console.error("[home] no se pudo cargar el catálogo:", error);
    return { status: "error", featured: [], all: [], cities: [], total: 0 };
  }
}

const VERTICAL_ORDER: Vertical[] = ["fwt", "adventure", "experience", "gastronomy"];

/**
 * Construye los slides del carrusel del hero. Prioriza items con cover,
 * limita a 5 para no inflar el peso inicial.
 */
function buildHeroSlides(
  items: ExperienceListItem[],
  dict: ReturnType<typeof getDictionary>,
  locale: Locale,
): HeroSlide[] {
  const slides: HeroSlide[] = [];
  for (const it of items.filter((x) => Boolean(x.cover_image)).slice(0, 5)) {
    const src = resolveImageUrl(it.cover_image);
    if (!src) continue;
    const cityLabel = it.city
      ? it.city.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
      : "";
    const verticalLabel = dict.nav[it.vertical].toUpperCase();
    const meta = [verticalLabel, cityLabel].filter(Boolean).join(" · ");
    slides.push({
      src,
      alt: it.title,
      caption: it.title,
      meta,
      href: `/${locale}/experiencia/${it.slug}/`,
    });
  }
  return slides;
}

export default async function LocaleHomePage({ params }: LocaleHomePageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  const { status, featured, all, cities, total } = await loadHomeData(locale);

  const slides = buildHeroSlides(featured.length ? featured : all, dict, locale);

  const verticalEntries = VERTICAL_ORDER.map((vertical) => {
    const itemsOfVertical = all.filter((i) => i.vertical === vertical);
    const withCover = itemsOfVertical.find((i) => Boolean(i.cover_image));
    return {
      vertical,
      path: vertical,
      count: itemsOfVertical.length,
      thumbnail: withCover ? resolveImageUrl(withCover.cover_image) : null,
      tagline: dict.vertical[vertical].subtitle,
    };
  });

  return (
    <>
      {/* 01 · HERO con carrusel real */}
      <Hero
        locale={locale}
        dict={dict}
        cities={cities}
        experienceCount={total}
        slides={slides}
      />

      {/* 02 · QUÉ OFRECE NORTEWALK — visible sin scroll, marca FWT primero */}
      <VerticalsStrip locale={locale} dict={dict} entries={verticalEntries} />

      {/* 03 · TOURS DESTACADOS */}
      <Section tone="bone-2" compact>
        {status === "ok" && (
          <>
            <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <Kicker number="03" text={dict.home.featuredTitle.toUpperCase()} tone="light" />
                <h2 className="font-display mt-4 text-3xl text-(--color-stone-800) sm:text-4xl">
                  {dict.home.featuredTitle}
                </h2>
                <p className="mt-3 text-(--color-stone-500)">{dict.home.featuredSubtitle}</p>
              </div>
              <Link
                href={`/${locale}/fwt/`}
                className="inline-flex items-center gap-2 rounded-full bg-(--color-accent-500) px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-(--color-accent-600)"
              >
                {dict.home.featuredCta} →
              </Link>
            </header>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((exp, idx) => (
                <TourCard key={exp.id} exp={exp} locale={locale} dict={dict} index={idx} />
              ))}
            </div>
          </>
        )}

        {status === "empty" && (
          <div className="mx-auto max-w-xl rounded-[14px] border border-(--color-border) bg-(--color-surface) p-10 text-center shadow-sm">
            <h2 className="font-display text-2xl text-(--color-stone-800)">
              {dict.home.emptyTitle}
            </h2>
            <p className="mt-3 text-(--color-stone-500)">{dict.home.emptyBody}</p>
          </div>
        )}

        {status === "error" && (
          <div className="mx-auto max-w-xl rounded-[14px] border border-(--color-accent-500)/30 bg-(--color-accent-500)/5 p-10 text-center">
            <h2 className="font-display text-2xl text-(--color-stone-800)">
              {dict.home.errorTitle}
            </h2>
            <p className="mt-3 text-(--color-stone-500)">{dict.home.errorBody}</p>
          </div>
        )}
      </Section>

      {/* 04 · CÓMO FUNCIONA + POR QUÉ — fusionados, mucho más compacto */}
      <section
        id="how-it-works"
        className="relative isolate overflow-hidden bg-(--color-stone-800) text-(--color-bone-100)"
      >
        <GrainOverlay
          className="absolute inset-0 h-full w-full text-(--color-bone-100)"
          opacity={0.05}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Kicker number="04" text={dict.home.howKicker} tone="dark" className="mb-4" />
              <h2 className="font-display text-3xl leading-tight sm:text-[40px]">
                {dict.home.howTitle}
              </h2>
              <p className="mt-4 max-w-md text-[15px] text-(--color-bone-200)/80">
                {dict.home.whySubtitle}
              </p>
              <Link
                href={`/${locale}/fwt/`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-(--color-accent-500) px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-(--color-accent-600)"
              >
                {dict.home.howCta} →
              </Link>
            </div>
            <ol className="lg:col-span-7 space-y-7">
              <HowStep number="01" title={dict.home.howStep1Title} body={dict.home.howStep1Body} />
              <HowStep number="02" title={dict.home.howStep2Title} body={dict.home.howStep2Body} />
              <HowStep number="03" title={dict.home.howStep3Title} body={dict.home.howStep3Body} last />
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}

// ---------- Subcomponentes ----------

function HowStep({
  number,
  title,
  body,
  last,
}: {
  number: string;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <li
      className={
        last
          ? "grid items-start gap-4 sm:grid-cols-[auto_1fr] sm:gap-6"
          : "grid items-start gap-4 border-b border-(--color-bone-100)/12 pb-7 sm:grid-cols-[auto_1fr] sm:gap-6"
      }
    >
      <span
        aria-hidden
        className="font-display text-[44px] leading-none text-(--color-accent-400) sm:text-[56px]"
      >
        {number}
      </span>
      <div className="max-w-xl">
        <h3 className="font-display text-2xl leading-tight">{title}</h3>
        <p className="mt-2 text-[14.5px] text-(--color-bone-200)/80">{body}</p>
      </div>
    </li>
  );
}
