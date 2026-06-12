"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import Modal from "@/components/Modal";

export interface GalleryItem {
  url: string;
  alt: string;
}

interface ExperienceGalleryProps {
  images: GalleryItem[];
  title: string;
  viewAllLabel: string;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
  photoOfLabel: string;
}

/**
 * Mosaico tipo GuruWalk:
 *  - 1 imagen grande a la izq + 4 chicas a la der en grid 2x2 (desktop).
 *  - 1 grande en mobile, con botón "Ver todas las fotos (N)".
 *  - Click en cualquier imagen abre el lightbox con la galería completa.
 */
export default function ExperienceGallery({
  images,
  title,
  viewAllLabel,
  closeLabel,
  prevLabel,
  nextLabel,
  photoOfLabel,
}: ExperienceGalleryProps) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const total = images.length;

  const openAt = useCallback((idx: number) => {
    setActiveIdx(idx);
    setOpen(true);
  }, []);

  const goPrev = useCallback(
    () => setActiveIdx((i) => (i - 1 + total) % total),
    [total],
  );
  const goNext = useCallback(
    () => setActiveIdx((i) => (i + 1) % total),
    [total],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext]);

  if (total === 0) return null;

  const main = images[0];
  // Cada miniatura guarda el índice REAL que abre en el lightbox.
  const realThumbs = images.slice(1, 5).map((item, i) => ({ item, realIdx: i + 1 }));
  const fillCount = 4 - realThumbs.length;
  // Con 1–2 fotos repetimos la principal para no dejar huecos en el mosaico.
  // Esos rellenos apuntan al índice 0 (la principal): así el click abre una
  // foto que existe en vez de un índice fuera de rango (que crasheaba).
  const filledThumbs =
    fillCount > 0
      ? [
          ...realThumbs,
          ...Array.from({ length: fillCount }, () => ({ item: main, realIdx: 0 })),
        ]
      : realThumbs;
  const extraCount = Math.max(0, total - 5);
  const active = images[activeIdx] ?? main;

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative">
          <div className="grid h-[260px] gap-2 overflow-hidden rounded-2xl sm:h-[360px] md:h-[460px] md:grid-cols-2">
            {/* Imagen principal — clickable */}
            <button
              type="button"
              onClick={() => openAt(0)}
              className="group relative h-full w-full overflow-hidden bg-(--color-stone-700)"
            >
              <Image
                src={main.url}
                alt={main.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </button>

            {/* Grid 2x2 desktop */}
            <div className="hidden grid-cols-2 grid-rows-2 gap-2 md:grid">
              {filledThumbs.map(({ item: img, realIdx }, idx) => {
                const isLast = idx === filledThumbs.length - 1;
                const showCount = isLast && extraCount > 0;
                return (
                  <button
                    key={`${img.url}-${idx}`}
                    type="button"
                    onClick={() => openAt(realIdx)}
                    className="group relative h-full w-full overflow-hidden bg-(--color-stone-700)"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                    {showCount && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-lg font-semibold text-white">
                        +{extraCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botón "Ver todas las fotos" */}
          {total > 1 && (
            <button
              type="button"
              onClick={() => openAt(0)}
              className="
                absolute bottom-4 right-4 z-10
                inline-flex items-center gap-2 rounded-full
                bg-white/95 px-4 py-2 text-xs font-semibold
                text-(--color-foreground) shadow-md ring-1 ring-black/5
                transition-colors hover:bg-white
              "
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              {viewAllLabel.replace("{n}", String(total))}
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        ariaLabelledBy="gallery-modal-title"
        closeLabel={closeLabel}
      >
        <div className="flex h-full min-h-[80vh] flex-col bg-(--color-stone-900) text-(--color-bone-100)">
          <header className="flex items-center justify-between px-6 pt-5">
            <h2 id="gallery-modal-title" className="text-sm font-semibold">
              {title}
            </h2>
            <span className="text-xs text-(--color-bone-300)/80">
              {photoOfLabel
                .replace("{i}", String(activeIdx + 1))
                .replace("{n}", String(total))}
            </span>
          </header>

          <div className="relative flex flex-1 items-center justify-center px-2 py-4 sm:px-12">
            <button
              type="button"
              onClick={goPrev}
              aria-label={prevLabel}
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-6"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="relative h-[60vh] w-full max-w-5xl">
              <Image
                key={active.url}
                src={active.url}
                alt={active.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={goNext}
              aria-label={nextLabel}
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-6"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          {/* Tira de miniaturas */}
          <div className="flex gap-2 overflow-x-auto px-6 pb-6">
            {images.map((img, idx) => (
              <button
                key={`${img.url}-thumb-${idx}`}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md transition-opacity ${
                  idx === activeIdx
                    ? "opacity-100 ring-2 ring-(--color-accent-500)"
                    : "opacity-60 hover:opacity-90"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
