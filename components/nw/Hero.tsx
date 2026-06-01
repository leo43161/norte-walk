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
 * Hero split: texto + buscador a la izquierda, carrusel visual a la derecha.
 *
 * El carrusel muestra tours reales del catálogo, así el visitante entiende
 * inmediatamente qué ofrece NorteWalk (FWT en el Norte argentino) sin scroll.
 *
 * En mobile el carrusel va arriba del texto. En desktop se reparten ~ 55/45.
 */
export default function Hero({ locale, dict, cities, experienceCount, slides }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden text-(--color-bone-100)">
      {/* Capa 1: gradient base más simple, menos cinematográfico */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30"
        style={{
          background:
            "linear-gradient(160deg, #1f2d1f 0%, #2a3a26 60%, #1a2418 100%)",
        }}
      />
      {/* Capa 2: radial cálido brasa, más presente */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 85% 15%, rgba(196,90,50,0.28), transparent 60%)",
        }}
      />
      {/* Capa 3: grain sutil */}
      <GrainOverlay
        className="absolute inset-0 -z-10 h-full w-full text-(--color-bone-100)"
        opacity={0.05}
      />

      {/* Contenido */}
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pt-28 pb-16 sm:pt-32 sm:pb-20 lg:grid-cols-12 lg:gap-12 lg:pt-32 lg:pb-24">
        {/* Columna izquierda: copy + buscador */}
        <div className="lg:col-span-7 lg:order-1 order-2">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-(--color-accent-500)/15 px-3.5 py-1.5 ring-1 ring-inset ring-(--color-accent-400)/30">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-(--color-accent-400)" />
            <span className="font-(family-name:--font-mono) text-[11px] uppercase tracking-[0.22em] text-(--color-accent-300)">
              {dict.hero.kicker}
            </span>
          </div>

          <h1 className="font-display mt-5 text-[44px] leading-[0.98] sm:text-6xl lg:text-[72px]">
            {dict.hero.titleLine1}
            <br />
            <span className="italic-accent">{dict.hero.titleLine2}</span>
          </h1>

          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-(--color-bone-200)/90 sm:text-base">
            {dict.hero.subtitle}
          </p>

          <div className="mt-7 max-w-3xl">
            <SearchForm locale={locale} dict={dict} cities={cities} />
          </div>

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
