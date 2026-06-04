import Link from "next/link";

import GrainOverlay from "@/components/nw/GrainOverlay";
import HeroCarousel, { type HeroSlide } from "@/components/nw/HeroCarousel";
import SearchForm from "@/components/nw/SearchForm";
import TrustRow from "@/components/nw/TrustRow";
import type { Dictionary, Locale } from "@/lib/i18n";

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
  cities: string[];
  experienceCount: number;
  /** Slides reales del catálogo para el carrusel del hero. */
  slides: HeroSlide[];
}

/**
 * Hero "Norte Cálido": texto + buscador a la izquierda, carrusel a la derecha.
 *
 * Fondo verde de marca (cálido, no negro) con un glow naranja alegre. El copy
 * es cercano y la tipografía Poppins le saca el aire editorial.
 */
export default function Hero({ locale, dict, cities, experienceCount, slides }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden text-(--color-bone-100)">
      {/* Capa 1: verde de marca, tibio */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30"
        style={{
          background:
            "linear-gradient(160deg, #40513b 0%, #4a5c42 55%, #36462f 100%)",
        }}
      />
      {/* Capa 2: glow naranja cálido, bien presente (alegría) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 88% 12%, rgba(230,126,34,0.38), transparent 62%)",
        }}
      />
      {/* Capa 3: grain sutil */}
      <GrainOverlay
        className="absolute inset-0 -z-10 h-full w-full text-(--color-bone-100)"
        opacity={0.045}
      />

      {/* Contenido */}
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:grid-cols-12 lg:gap-12 lg:pt-28 lg:pb-24">
        {/* Columna izquierda: copy + buscador */}
        <div className="lg:col-span-7 lg:order-1 order-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-(--color-bone-100)/10 px-4 py-2 text-sm font-semibold text-(--color-accent-300) ring-1 ring-inset ring-(--color-bone-100)/15">
            <span aria-hidden>🌄</span>
            {dict.hero.kicker}
          </span>

          <h1 className="font-display mt-5 text-[40px] leading-[1.05] sm:text-[56px] lg:text-[64px]">
            {dict.hero.titleLine1}
            <br />
            <span className="italic-accent">{dict.hero.titleLine2}</span>
          </h1>

          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-(--color-bone-100)/85 sm:text-[17px]">
            {dict.hero.subtitle}
          </p>

          <div className="mt-7 max-w-3xl">
            <SearchForm locale={locale} dict={dict} cities={cities} />
          </div>

          {/* Link secundario cercano */}
          <Link
            href="#how-it-works"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-(--color-bone-100)/80 transition-colors hover:text-(--color-accent-300)"
          >
            {dict.hero.ctaSecondary} →
          </Link>

          <div className="mt-6 max-w-3xl">
            <TrustRow dict={dict} experienceCount={experienceCount} tone="light" />
          </div>
        </div>

        {/* Columna derecha: carrusel visual */}
        <div className="lg:col-span-5 lg:order-2 order-1 flex">
          <div className="relative aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-auto lg:min-h-[520px]">
            <HeroCarousel slides={slides} ariaLabel={dict.hero.galleryLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
