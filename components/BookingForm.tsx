"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  ApiError,
  getAvailableDates,
  submitLead,
  type AvailableDate,
  type LeadBody,
} from "@/lib/api";
import { formatTime } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/i18n";

interface BookingFormProps {
  experienceId: number;
  minPax: number;
  maxPax: number;
  fallbackWhatsappUrl: string;
  locale: Locale;
  dict: Dictionary;
}

/**
 * Form de reserva → /catalog/lead → redirect a WhatsApp con lead trackeado.
 *
 * Suspense wrapper afuera porque `useSearchParams` lo exige en Next 16.
 * El fallback es el form en estado deshabilitado, así no salta el layout.
 */
export default function BookingForm(props: BookingFormProps) {
  return (
    <Suspense fallback={<BookingFormSkeleton dict={props.dict} />}>
      <BookingFormInner {...props} />
    </Suspense>
  );
}

function BookingFormSkeleton({ dict }: { dict: Dictionary }) {
  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm">
      <p className="text-sm text-(--color-muted)">{dict.common.loading}</p>
    </div>
  );
}

// ---------- Core ----------

function localYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  pax: string;
  date: string;
  time: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  pax: "2",
  date: "",
  time: "",
  message: "",
};

function BookingFormInner({
  experienceId,
  minPax,
  maxPax,
  fallbackWhatsappUrl,
  locale,
  dict,
}: BookingFormProps) {
  const searchParams = useSearchParams();

  // UTMs capturados de la URL (sólo presentes si la visita viene de campaña).
  const utms = useMemo(() => {
    const pick = (k: string) => searchParams.get(k) || undefined;
    return {
      utm_source: pick("utm_source"),
      utm_medium: pick("utm_medium"),
      utm_campaign: pick("utm_campaign"),
      utm_content: pick("utm_content"),
      utm_term: pick("utm_term"),
    };
  }, [searchParams]);

  // Rango fijo: hoy → hoy + 60 días.
  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    const max = new Date();
    max.setDate(max.getDate() + 60);
    return { minDate: localYmd(today), maxDate: localYmd(max) };
  }, []);

  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [datesStatus, setDatesStatus] = useState<"loading" | "ok" | "empty" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    setDatesStatus("loading");
    getAvailableDates({
      experience_id: experienceId,
      from: minDate,
      to: maxDate,
      locale,
    })
      .then((data) => {
        if (cancelled) return;
        const sorted = [...data].sort((a, b) =>
          a.available_date.localeCompare(b.available_date),
        );
        setAvailableDates(sorted);
        setDatesStatus(sorted.length > 0 ? "ok" : "empty");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("[booking] available_dates falló:", error);
        setDatesStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [experienceId, minDate, maxDate, locale]);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function pickDateChip(d: AvailableDate) {
    setForm((prev) => ({
      ...prev,
      date: d.available_date,
      time: d.start_time.slice(0, 5),
    }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const body: LeadBody = {
        experience_id: experienceId,
        tourist_name: form.name.trim(),
        tourist_phone: form.phone.trim(),
        desired_date: form.date,
        pax: Number(form.pax),
        preferred_locale: locale,
        source: "nortewalk.com",
        ...(form.time && { desired_time: form.time }),
        ...(form.email && { tourist_email: form.email.trim() }),
        ...(form.message && { message: form.message.trim() }),
        ...utms,
      };
      const res = await submitLead(body);
      setSuccessUrl(res.whatsapp_url);
      window.location.href = res.whatsapp_url;
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : String(error);
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- Success state ----------
  if (successUrl) {
    return (
      <div className="rounded-2xl border border-(--color-brand-green-300) bg-(--color-brand-green-100)/60 p-6">
        <p className="text-sm font-semibold text-(--color-brand-green-800)">
          {dict.booking.successTitle}
        </p>
        <p className="mt-2 text-sm text-(--color-ink-700)">{dict.booking.successBody}</p>
        <a
          href={successUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-(--color-whatsapp) px-5 py-2 text-sm font-bold text-white hover:bg-(--color-whatsapp-hover)"
        >
          {dict.booking.successOpenLink}
        </a>
      </div>
    );
  }

  // ---------- Form ----------
  const paxMin = Math.max(1, minPax || 1);
  const paxMax = Math.max(paxMin, maxPax || 20);

  return (
    <form
      id="booking-form"
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm"
      noValidate
    >
      <div>
        <h3 className="text-lg font-semibold text-(--color-foreground)">
          {dict.booking.title}
        </h3>
        <p className="mt-1 text-sm text-(--color-muted)">{dict.booking.intro}</p>
      </div>

      {/* Chips de fechas con cupo */}
      <DateChips
        status={datesStatus}
        dates={availableDates}
        selected={form.date}
        onPick={pickDateChip}
        locale={locale}
        dict={dict}
      />

      {/* Fecha + hora */}
      <div className="grid grid-cols-2 gap-3">
        <Field label={dict.booking.date} htmlFor="bf-date" required>
          <input
            id="bf-date"
            type="date"
            required
            min={minDate}
            max={maxDate}
            value={form.date}
            onChange={(e) => setField("date", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={dict.booking.time} htmlFor="bf-time">
          <input
            id="bf-time"
            type="time"
            value={form.time}
            onChange={(e) => setField("time", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label={dict.booking.pax} htmlFor="bf-pax" required>
        <input
          id="bf-pax"
          type="number"
          required
          min={paxMin}
          max={paxMax}
          value={form.pax}
          onChange={(e) => setField("pax", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={dict.booking.name} htmlFor="bf-name" required>
        <input
          id="bf-name"
          type="text"
          required
          autoComplete="name"
          placeholder={dict.booking.namePlaceholder}
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field
        label={dict.booking.phone}
        htmlFor="bf-phone"
        hint={dict.booking.phoneHint}
        required
      >
        <input
          id="bf-phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+54 9 ..."
          value={form.phone}
          onChange={(e) => setField("phone", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={dict.booking.email} htmlFor="bf-email" hint={dict.booking.emailOptional}>
        <input
          id="bf-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field
        label={dict.booking.message}
        htmlFor="bf-message"
        hint={dict.booking.messageOptional}
      >
        <textarea
          id="bf-message"
          rows={3}
          placeholder={dict.booking.messagePlaceholder}
          value={form.message}
          onChange={(e) => setField("message", e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {submitError && (
        <div
          role="alert"
          className="rounded-xl border border-(--color-brand-orange-500)/30 bg-(--color-brand-orange-500)/5 p-3 text-sm"
        >
          <p className="font-semibold text-(--color-brand-orange-700)">
            {dict.booking.errorTitle}
          </p>
          <p className="mt-1 text-(--color-ink-700)">{submitError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-(--color-whatsapp) px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-(--color-whatsapp-hover) disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? dict.booking.submitting : dict.booking.submit}
      </button>

      <p className="text-center text-xs text-(--color-muted)">
        <a
          href={fallbackWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-(--color-foreground)"
        >
          {dict.booking.askOnly}
        </a>
      </p>
    </form>
  );
}

// ---------- Subcomponentes ----------

const inputClass =
  "block w-full rounded-lg border border-(--color-border) bg-white px-3 py-2 text-sm text-(--color-foreground) shadow-xs outline-none focus:border-(--color-brand-green-600) focus:ring-2 focus:ring-(--color-brand-green-300)";

function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 flex items-baseline justify-between text-xs font-medium text-(--color-ink-700)"
      >
        <span>
          {label}
          {required && <span className="ml-0.5 text-(--color-brand-orange-600)">*</span>}
        </span>
        {hint && <span className="text-(--color-muted) font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function DateChips({
  status,
  dates,
  selected,
  onPick,
  locale,
  dict,
}: {
  status: "loading" | "ok" | "empty" | "error";
  dates: AvailableDate[];
  selected: string;
  onPick: (d: AvailableDate) => void;
  locale: Locale;
  dict: Dictionary;
}) {
  if (status === "loading") {
    return <p className="text-xs text-(--color-muted)">{dict.booking.loadingDates}</p>;
  }
  if (status === "empty" || status === "error") {
    return <p className="text-xs text-(--color-muted)">{dict.booking.noAvailableDates}</p>;
  }
  const intlLocale = locale === "pt" ? "pt-BR" : locale === "en" ? "en-US" : "es-AR";
  const fmt = new Intl.DateTimeFormat(intlLocale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const top = dates.slice(0, 8);
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-(--color-ink-700)">
        {dict.booking.availableDatesLabel}
      </p>
      <div className="flex flex-wrap gap-2">
        {top.map((d) => {
          const date = new Date(`${d.available_date}T00:00:00`);
          const active = selected === d.available_date;
          return (
            <button
              key={`${d.schedule_id}-${d.available_date}`}
              type="button"
              onClick={() => onPick(d)}
              className={
                active
                  ? "rounded-full bg-(--color-brand-green-700) px-3 py-1.5 text-xs font-semibold text-(--color-brand-cream-100)"
                  : "rounded-full border border-(--color-border) bg-white px-3 py-1.5 text-xs font-medium text-(--color-ink-700) hover:border-(--color-brand-green-600) hover:text-(--color-brand-green-800)"
              }
            >
              <span className="capitalize">{fmt.format(date)}</span>
              <span className="ml-1 text-[10px] opacity-70">{formatTime(d.start_time)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
