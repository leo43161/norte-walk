"use client";

import { useState } from "react";

import { submitWaitlist } from "@/lib/api";
import type { Dictionary, Locale } from "@/lib/i18n";
import {
  Field,
  FormError,
  Honeypot,
  SubmitButton,
  inputClass,
  readTracking,
} from "@/components/forms/ui";

/* =====================================================================
 * WaitlistCard — reemplaza al BookingWidget durante el PRE-LANZAMIENTO.
 * En vez de tomar una reserva real (todavía no hay FWT cargado), capta el
 * interés: "Avisame cuando abra". Mantiene el header de precio y el contacto
 * directo con el guía por WhatsApp.
 * ===================================================================== */

interface WaitlistCardProps {
  experienceTitle: string;
  /** slug de la experiencia → se guarda como `ref` del lead de waitlist. */
  slug: string;
  priceLabel: string;
  priceHint?: string;
  isFree: boolean;
  fallbackWhatsappUrl: string;
  locale: Locale;
  dict: Dictionary;
}

export default function WaitlistCard({
  experienceTitle,
  slug,
  priceLabel,
  priceHint,
  isFree,
  fallbackWhatsappUrl,
  locale,
  dict,
}: WaitlistCardProps) {
  const t = dict.waitlist;
  const f = dict.forms;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    if (!email.trim() && !phone.trim()) {
      setError(f.errorGeneric);
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      await submitWaitlist({
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        ref: slug,
        subject: experienceTitle,
        locale,
        hp,
        ...readTracking(),
      });
      setStatus("done");
    } catch {
      setStatus("idle");
      setError(f.errorGeneric);
    }
  }

  return (
    <div id="booking" className="scroll-mt-24">
      {/* Header de precio (mismo lenguaje visual que el BookingWidget) */}
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
            {isFree ? dict.booking.priceFreeKicker : dict.price.from}
          </p>
          <p className="mt-0.5 text-[26px] font-bold leading-tight text-(--color-stone-800)">
            {priceLabel}
          </p>
          {priceHint && <p className="text-xs text-(--color-muted)">{priceHint}</p>}
        </div>
        <span className="rounded-full bg-(--color-accent-500)/12 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-(--color-accent-700)">
          {dict.prelaunch.badge}
        </span>
      </div>

      {status === "done" ? (
        <div className="mt-5 rounded-2xl border border-(--color-stone-300)/70 bg-(--color-stone-100)/60 p-5 text-center">
          <div
            aria-hidden
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-(--color-stone-600)/15 text-2xl"
          >
            ✓
          </div>
          <h3 className="font-display mt-3 text-lg text-(--color-stone-800)">{t.doneTitle}</h3>
          <p className="mt-1.5 text-sm text-(--color-stone-500)">{t.doneBody}</p>
          <a
            href={fallbackWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-(--color-whatsapp) px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-(--color-whatsapp-hover)"
          >
            {dict.waitlist.askGuide}
          </a>
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-xl bg-(--color-stone-100) px-4 py-3.5">
            <p className="font-display text-base text-(--color-stone-800)">{t.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-(--color-stone-600)">{t.body}</p>
          </div>

          <form onSubmit={onSubmit} className="relative mt-4 space-y-3" noValidate>
            <Honeypot value={hp} onChange={setHp} />
            <Field label={f.email} htmlFor="wl-email">
              <input
                id="wl-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={f.emailPlaceholder}
                autoComplete="email"
                className={inputClass}
              />
            </Field>
            <Field label={f.phone} htmlFor="wl-phone" hint={f.optional}>
              <input
                id="wl-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={f.phonePlaceholder}
                autoComplete="tel"
                className={inputClass}
              />
            </Field>
            {error && <FormError message={error} />}
            <SubmitButton submitting={status === "sending"} idleLabel={t.cta} busyLabel={f.sending} />
          </form>

          <p className="mt-3 text-center text-xs text-(--color-muted)">
            <a
              href={fallbackWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-(--color-foreground)"
            >
              {t.askGuide}
            </a>
          </p>
        </>
      )}
    </div>
  );
}
