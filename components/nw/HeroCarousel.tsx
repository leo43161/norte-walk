"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export interface HeroSlide {
  src: string;
  alt: string;
  /** Etiqueta corta superpuesta (ej: nombre del tour). Opcional. */
  caption?: string;
  /** Sub-etiqueta (ej: "Caminata a la gorra · San Miguel de Tucumán"). */
  meta?: string;
  /** Link destino del slide. Si no hay, el slide no es clickeable. */
  href?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  /** Intervalo de auto-rotación en ms. Default 4500. */
  intervalMs?: number;
  /** Aria-label del bloque (para lectores de pantalla). */
  ariaLabel?: string;
}

/**
 * Carrusel del hero. Crossfade entre slides, auto-rotación, dots para
 * navegación manual. Pausa al hover/focus. Si no hay slides válidos,
 * renderea un placeholder con gradiente.
 *
 * Diseño: aspect ratio 4:5 en mobile (vertical), 4:3 en desktop, sostenido
 * por el contenedor — la imagen llena con object-cover.
 */
export default function HeroCarousel({
  slides,
  intervalMs = 4500,
  ariaLabel = "Galería de experiencias",
}: HeroCarouselProps) {
  const safeSlides = slides.filter((s) => s.src);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setIndex((prev) => (safeSlides.length === 0 ? 0 : (prev + 1) % safeSlides.length));
  }, [safeSlides.length]);

  useEffect(() => {
    if (paused || safeSlides.length < 2) return;
    timerRef.current = setInterval(advance, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advance, intervalMs, paused, safeSlides.length]);

  if (safeSlides.length === 0) {
    return (
      <div
        aria-hidden
        className="relative h-full w-full overflow-hidden rounded-[18px]"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.55 0.10 145), oklch(0.30 0.08 145))",
        }}
      />
    );
  }

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="relative h-full w-full overflow-hidden rounded-[24px] bg-(--color-stone-900) shadow-[0_28px_70px_-26px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {safeSlides.map((slide, i) => {
        const active = i === index;
        const SlideInner = (
          <>
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={i === 0}
              className="object-cover"
            />
            {/* overlay para legibilidad de caption */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
            />
            {(slide.caption || slide.meta) && (
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                {slide.meta && (
                  <p className="text-[13px] font-semibold text-(--color-accent-300)">
                    {slide.meta}
                  </p>
                )}
                {slide.caption && (
                  <p className="font-display mt-1.5 text-2xl leading-tight text-(--color-bone-100) sm:text-[26px]">
                    {slide.caption}
                  </p>
                )}
              </div>
            )}
          </>
        );

        return (
          <div
            key={`${slide.src}-${i}`}
            aria-hidden={!active}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: active ? 1 : 0, pointerEvents: active ? "auto" : "none" }}
          >
            {slide.href ? (
              <Link href={slide.href} className="absolute inset-0 block" tabIndex={active ? 0 : -1}>
                {SlideInner}
              </Link>
            ) : (
              SlideInner
            )}
          </div>
        );
      })}

      {/* Dots (sólo si hay 2+ slides) */}
      {safeSlides.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-(--color-stone-900)/40 px-3 py-2 backdrop-blur">
          {safeSlides.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Ir al slide ${i + 1}`}
                aria-current={active ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={
                  active
                    ? "h-1.5 w-5 rounded-full bg-(--color-accent-400) transition-all"
                    : "h-1.5 w-1.5 rounded-full bg-(--color-bone-100)/55 transition-all hover:bg-(--color-bone-100)/80"
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
