import Link from "next/link";
import { notFound } from "next/navigation";

import FaqSection from "@/components/nw/FaqSection";
import GrainOverlay from "@/components/nw/GrainOverlay";
import Hero from "@/components/nw/Hero";
import PreLaunchSection from "@/components/nw/PreLaunchSection";
import type { HeroSlide } from "@/components/nw/HeroCarousel";
import Kicker from "@/components/nw/Kicker";
import Section from "@/components/nw/Section";
import TourCard from "@/components/nw/TourCard";
import VerticalsStrip from "@/components/nw/VerticalsStrip";
import { getExperiences, isTrue, type ExperienceListItem, type Vertical } from "@/lib/api";
import { resolveImageUrl } from "@/lib/format";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { PRELAUNCH } from "@/lib/launch";

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

const VERTICAL_EMOJI: Record<Vertical, string> = {
  fwt: "🚶",
  adventure: "🥾",
  experience: "✨",
  gastronomy: "🥟",
};

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
    const verticalLabel = dict.nav[it.vertical];
    const meta = [`${VERTICAL_EMOJI[it.vertical]} ${verticalLabel}`, cityLabel]
      .filter(Boolean)
      .join(" · ");
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
      {/* 01 · HERO */}
      <Hero
        locale={locale}
        dict={dict}
        cities={cities}
        experienceCount={total}
        slides={slides}
      />

      {/* 01b · PRE-LANZAMIENTO — anticipación + sugerencias (sólo en beta) */}
      {PRELAUNCH && <PreLaunchSection locale={locale} dict={dict} />}

      {/* 02 · QUÉ OFRECE NORTEWALK */}
      <VerticalsStrip locale={locale} dict={dict} entries={verticalEntries} />

      {/* 03 · TOURS DESTACADOS */}
      <Section tone="bone-2" compact>
        {status === "ok" && (
          <>
            <header className="mb-9 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <Kicker text={dict.home.featuredTitle} />
                <h2 className="font-display mt-3 text-3xl text-(--color-stone-800) sm:text-4xl">
                  {dict.home.featuredTitle}
                </h2>
                <p className="mt-3 text-[15px] text-(--color-stone-500)">
                  {dict.home.featuredSubtitle}
                </p>
              </div>
              <Link
                href={`/${locale}/fwt/`}
                className="inline-flex items-center gap-2 rounded-full bg-(--color-accent-500) px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--color-accent-600)"
              >
                {dict.home.featuredCta} →
              </Link>
            </header>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((exp, idx) => (
                <TourCard key={exp.id} exp={exp} locale={locale} dict={dict} index={idx} />
              ))}
            </div>
          </>
        )}

        {status === "empty" && (
          <div className="mx-auto max-w-xl rounded-[20px] border border-(--color-border) bg-white p-10 text-center shadow-sm">
            <h2 className="font-display text-2xl text-(--color-stone-800)">{dict.home.emptyTitle}</h2>
            <p className="mt-3 text-(--color-stone-500)">{dict.home.emptyBody}</p>
          </div>
        )}

        {status === "error" && (
          <div className="mx-auto max-w-xl rounded-[20px] border border-(--color-accent-500)/30 bg-(--color-accent-500)/5 p-10 text-center">
            <h2 className="font-display text-2xl text-(--color-stone-800)">{dict.home.errorTitle}</h2>
            <p className="mt-3 text-(--color-stone-500)">{dict.home.errorBody}</p>
          </div>
        )}
      </Section>

      {/* 04 · CÓMO FUNCIONA — panel verde de marca, cálido */}
      <section
        id="how-it-works"
        className="relative isolate overflow-hidden bg-(--color-stone-700) text-(--color-bone-100)"
      >
        <GrainOverlay
          className="absolute inset-0 h-full w-full text-(--color-bone-100)"
          opacity={0.04}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Kicker text={dict.home.howKicker} tone="dark" />
            <h2 className="font-display mt-4 text-3xl leading-tight sm:text-[40px]">
              {dict.home.howTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15.5px] text-(--color-bone-100)/80">
              {dict.home.whySubtitle}
            </p>
          </div>

          <ol className="mt-12 grid gap-5 sm:grid-cols-3">
            <HowStep emoji="👀" number="1" title={dict.home.howStep1Title} body={dict.home.howStep1Body} />
            <HowStep emoji="💬" number="2" title={dict.home.howStep2Title} body={dict.home.howStep2Body} />
            <HowStep emoji="🌄" number="3" title={dict.home.howStep3Title} body={dict.home.howStep3Body} />
          </ol>

          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/fwt/`}
              className="inline-flex items-center gap-2 rounded-full bg-(--color-accent-500) px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-(--color-accent-600)"
            >
              {dict.home.howCta} →
            </Link>
          </div>
        </div>
      </section>

      {/* 05 · POR QUÉ NORTEWALK — confianza, cálido sobre crema */}
      <Section tone="bone" compact>
        <div className="mx-auto max-w-2xl text-center">
          <Kicker text={dict.home.whyKicker} />
          <h2 className="font-display mt-4 text-3xl text-(--color-stone-800) sm:text-4xl">
            {dict.home.whyTitle}
          </h2>
          <p className="mt-3 text-[15px] text-(--color-stone-500)">{dict.home.whySubtitle}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <WhyCard emoji="🪪" title={dict.home.why1Title} body={dict.home.why1Body} />
          <WhyCard emoji="📱" title={dict.home.why2Title} body={dict.home.why2Body} />
          <WhyCard emoji="🤝" title={dict.home.why3Title} body={dict.home.why3Body} />
          <WhyCard emoji="🏔️" title={dict.home.why4Title} body={dict.home.why4Body} />
        </div>
      </Section>

      {/* 05c · SOBRE NORTEWALK — acceso a la página "Nosotros" */}
      <section className="bg-(--color-background)">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
          <div className="relative isolate overflow-hidden rounded-[28px] bg-(--color-stone-700) px-8 py-12 text-(--color-bone-100) sm:px-12 sm:py-14">
            <GrainOverlay
              className="absolute inset-0 h-full w-full text-(--color-bone-100)"
              opacity={0.04}
            />
            <div className="relative max-w-2xl">
              <Kicker text={dict.home.aboutKicker} tone="dark" />
              <h2 className="font-display mt-4 text-3xl leading-tight sm:text-4xl">
                {dict.home.aboutTitle}
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-(--color-bone-100)/80">
                {dict.home.aboutBody}
              </p>
              <Link
                href={`/${locale}/nosotros/`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-(--color-accent-500) px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-(--color-accent-600)"
              >
                {dict.home.aboutCta} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 05b · FAQ — contenido SEO + FAQPage schema */}
      <FaqSection dict={dict} />

      {/* 06 · CIERRE — banda cálida con CTA */}
      <section className="bg-(--color-bone-100)">
        <div className="mx-auto max-w-6xl px-6 pb-16 sm:pb-20">
          <div className="relative isolate overflow-hidden rounded-[28px] bg-(--color-accent-500) px-8 py-12 text-center text-white shadow-[0_24px_60px_-28px_rgba(211,84,0,0.7)] sm:px-12 sm:py-14">
            <h2 className="font-display text-3xl leading-tight sm:text-[38px]">
              {dict.home.ctaBandTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[16px] text-white/90">
              {dict.home.ctaBandBody}
            </p>
            <Link
              href={`/${locale}/fwt/`}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-bold text-(--color-accent-600) shadow-sm transition-transform hover:-translate-y-0.5"
            >
              {dict.home.ctaBandCta} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ---------- Subcomponentes ----------

function HowStep({
  emoji,
  number,
  title,
  body,
}: {
  emoji: string;
  number: string;
  title: string;
  body: string;
}) {
  return (
    <li className="rounded-[20px] bg-(--color-bone-100)/8 p-6 ring-1 ring-inset ring-(--color-bone-100)/12">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-11 w-11 items-center justify-center rounded-full bg-(--color-accent-500) text-xl"
        >
          {emoji}
        </span>
        <span className="font-display text-2xl text-(--color-accent-300)">{number}</span>
      </div>
      <h3 className="font-display mt-4 text-xl">{title}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-(--color-bone-100)/80">{body}</p>
    </li>
  );
}

function WhyCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="rounded-[20px] bg-white p-6 shadow-[0_10px_30px_-20px_rgba(40,51,31,0.45)] ring-1 ring-(--color-border) transition-transform duration-300 hover:-translate-y-1">
      <span
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-accent-500)/12 text-2xl"
      >
        {emoji}
      </span>
      <h3 className="font-display mt-4 text-lg text-(--color-stone-800)">{title}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-(--color-stone-500)">{body}</p>
    </div>
  );
}
