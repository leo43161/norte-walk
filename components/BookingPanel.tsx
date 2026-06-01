"use client";

import { useState } from "react";

import BookingForm from "@/components/BookingForm";
import Modal from "@/components/Modal";
import type { Dictionary, Locale } from "@/lib/i18n";

interface BookingPanelProps {
  experienceId: number;
  minPax: number;
  maxPax: number;
  fallbackWhatsappUrl: string;
  locale: Locale;
  dict: Dictionary;
  /** Etiqueta visible al lado del título del trigger (precio formateado). */
  priceLabel: string;
  /** Recap server-rendered de la experiencia, mostrado a la izq dentro del modal. */
  recap: React.ReactNode;
}

/**
 * Orquesta los triggers (aside button + sticky mobile) y el modal con el form.
 *
 * Por qué los dos triggers viven en este componente:
 *  - El estado `open` es local al island; los dos botones lo comparten sin
 *    necesidad de levantar estado al detail page (que es Server Component).
 *  - El sticky usa `position: fixed`, así que su posición en el DOM no importa
 *    — puede vivir tranquilo dentro del aside.
 */
export default function BookingPanel({
  experienceId,
  minPax,
  maxPax,
  fallbackWhatsappUrl,
  locale,
  dict,
  priceLabel,
  recap,
}: BookingPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger del aside (desktop + mobile) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          flex w-full items-center justify-center gap-2
          rounded-full bg-(--color-whatsapp) px-5 py-3
          text-sm font-bold text-white shadow-sm
          transition-colors hover:bg-(--color-whatsapp-hover)
        "
      >
        {dict.booking.title}
      </button>

      {/* Sticky mobile CTA (sólo mobile, fixed bottom) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          fixed inset-x-3 bottom-3 z-40
          flex items-center justify-center gap-2
          rounded-full bg-(--color-whatsapp) px-5 py-3
          text-sm font-bold text-white shadow-lg
          md:hidden
        "
      >
        {dict.booking.title} · {priceLabel}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        ariaLabelledBy="booking-modal-title"
        closeLabel={dict.locale.code === "en" ? "Close" : dict.locale.code === "pt" ? "Fechar" : "Cerrar"}
      >
        <div className="grid gap-0 md:grid-cols-[1fr_1.1fr]">
          <aside className="bg-(--color-stone-800) text-(--color-bone-100) p-6 md:p-8">
            {recap}
          </aside>
          <div className="p-6 md:p-8">
            <h2
              id="booking-modal-title"
              className="mb-4 text-xl font-semibold text-(--color-foreground)"
            >
              {dict.booking.title}
            </h2>
            <BookingForm
              experienceId={experienceId}
              minPax={minPax}
              maxPax={maxPax}
              fallbackWhatsappUrl={fallbackWhatsappUrl}
              locale={locale}
              dict={dict}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
