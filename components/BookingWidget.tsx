"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import Modal from "@/components/Modal";
import {
  ApiError,
  getAvailableDates,
  submitLead,
  type AvailableSlot,
  type LeadBody,
  type LeadResponse,
} from "@/lib/api";
import { formatTime, languageFlag, languageLabel } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/i18n";

/* =====================================================================
 * BookingWidget — reserva inline estilo free-walking-tour:
 *
 *   1. Participantes (adultos / niños) con counters.
 *   2. Idioma del tour (pills, según salidas activas).
 *   3. Calendario mensual con días disponibles.
 *   4. Horarios del día con cupos restantes.
 *   5. CTA "Reservar" → modal SOLO datos personales → confirmación
 *      con código de reserva. El guía contacta después para confirmar.
 *
 * Toda la disponibilidad llega de /catalog/available_dates (cupo real,
 * descontando reservas activas). El cupo se re-chequea en el POST: si el
 * horario se llenó entre medio, la API devuelve 409 y refrescamos.
 * ===================================================================== */

interface BookingWidgetProps {
  experienceId: number;
  maxPax: number;
  experienceTitle: string;
  providerName: string;
  meetingPoint: string | null;
  /** Etiqueta de precio ("A la gorra" o "$ 35.000"). */
  priceLabel: string;
  priceHint?: string;
  isFree: boolean;
  fallbackWhatsappUrl: string;
  locale: Locale;
  dict: Dictionary;
}

export default function BookingWidget(props: BookingWidgetProps) {
  return (
    <Suspense fallback={<WidgetSkeleton dict={props.dict} />}>
      <BookingWidgetInner {...props} />
    </Suspense>
  );
}

function WidgetSkeleton({ dict }: { dict: Dictionary }) {
  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm">
      <p className="text-sm text-(--color-muted)">{dict.common.loading}</p>
    </div>
  );
}

// ---------- Helpers de fecha (siempre en hora local del visitante) ----------

function localYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function firstOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function intlLocale(locale: Locale): string {
  return locale === "pt" ? "pt-BR" : locale === "en" ? "en-US" : "es-AR";
}

// ---------- Estado del flujo ----------

type Step = "widget" | "form" | "done";

interface PersonalForm {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

const EMPTY_PERSONAL: PersonalForm = { name: "", surname: "", email: "", phone: "" };

function BookingWidgetInner({
  experienceId,
  maxPax,
  experienceTitle,
  providerName,
  meetingPoint,
  priceLabel,
  priceHint,
  isFree,
  fallbackWhatsappUrl,
  locale,
  dict,
}: BookingWidgetProps) {
  const t = dict.booking;
  const searchParams = useSearchParams();

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

  // ---------- Disponibilidad (hoy → +60 días) ----------
  const { fromYmd, toYmd } = useMemo(() => {
    const today = new Date();
    const max = new Date();
    max.setDate(max.getDate() + 60);
    return { fromYmd: localYmd(today), toYmd: localYmd(max) };
  }, []);

  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [slotsStatus, setSlotsStatus] = useState<"loading" | "ok" | "empty" | "error">("loading");

  const loadSlots = useCallback(() => {
    let cancelled = false;
    setSlotsStatus("loading");
    getAvailableDates({ experience_id: experienceId, from: fromYmd, to: toYmd })
      .then((data) => {
        if (cancelled) return;
        setSlots(data);
        setSlotsStatus(data.length > 0 ? "ok" : "empty");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("[booking] available_dates falló:", error);
        setSlotsStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [experienceId, fromYmd, toYmd]);

  useEffect(() => loadSlots(), [loadSlots]);

  // ---------- Selección ----------
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [langFilter, setLangFilter] = useState<string>("all");
  const [monthCursor, setMonthCursor] = useState<Date>(() => firstOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  const paxTotal = adults + children;
  const paxCap = Math.max(1, maxPax || 20);

  // Idiomas con salidas reales (para los pills)
  const tourLanguages = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of slots) {
      if (!seen.has(s.locale)) {
        seen.add(s.locale);
        out.push(s.locale);
      }
    }
    return out.sort();
  }, [slots]);

  // Al cargar slots: si el idioma de la página tiene salidas, pre-filtrar.
  useEffect(() => {
    if (slotsStatus !== "ok") return;
    setLangFilter((prev) => {
      if (prev !== "all") return prev;
      return prev; // mantenemos "all" — el visitante ve todo y elige
    });
  }, [slotsStatus]);

  const filteredSlots = useMemo(
    () => (langFilter === "all" ? slots : slots.filter((s) => s.locale === langFilter)),
    [slots, langFilter],
  );

  const slotsByDate = useMemo(() => {
    const map = new Map<string, AvailableSlot[]>();
    for (const s of filteredSlots) {
      const arr = map.get(s.available_date);
      if (arr) arr.push(s);
      else map.set(s.available_date, [s]);
    }
    return map;
  }, [filteredSlots]);

  // Si el filtro/selección quedan inconsistentes, limpiar selección.
  useEffect(() => {
    if (selectedDate && !slotsByDate.has(selectedDate)) {
      setSelectedDate(null);
      setSelectedScheduleId(null);
      return;
    }
    if (selectedDate && selectedScheduleId) {
      const daySlots = slotsByDate.get(selectedDate) ?? [];
      if (!daySlots.some((s) => String(s.schedule_id) === selectedScheduleId)) {
        setSelectedScheduleId(null);
      }
    }
  }, [slotsByDate, selectedDate, selectedScheduleId]);

  const daySlots = selectedDate ? (slotsByDate.get(selectedDate) ?? []) : [];
  const selectedSlot =
    selectedDate && selectedScheduleId
      ? (daySlots.find((s) => String(s.schedule_id) === selectedScheduleId) ?? null)
      : null;

  const spotsLeft =
    selectedSlot && selectedSlot.spots_left !== null ? Number(selectedSlot.spots_left) : null;
  const overCapacity = spotsLeft !== null && paxTotal > spotsLeft;
  const canReserve = Boolean(selectedSlot) && paxTotal >= 1 && !overCapacity;

  const spotsLabel = useCallback(
    (n: number) => (n === 1 ? t.spotsLeftOne : t.spotsLeft.replace("{n}", String(n))),
    [t],
  );

  // ---------- Flujo modal ----------
  const [step, setStep] = useState<Step>("widget");
  const [personal, setPersonal] = useState<PersonalForm>(EMPTY_PERSONAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<LeadResponse | null>(null);

  const modalOpen = step === "form" || step === "done";

  function closeModal() {
    if (submitting) return;
    if (step === "done") {
      // Reserva hecha: reset de selección + refresh de cupos.
      setSelectedDate(null);
      setSelectedScheduleId(null);
      setPersonal(EMPTY_PERSONAL);
      setResult(null);
      loadSlots();
    }
    setStep("widget");
    setSubmitError(null);
  }

  function setField<K extends keyof PersonalForm>(key: K, value: string) {
    setPersonal((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSlot || !selectedDate) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const body: LeadBody = {
        experience_id: experienceId,
        schedule_id: Number(selectedSlot.schedule_id),
        desired_date: selectedDate,
        tourist_name: personal.name.trim(),
        tourist_surname: personal.surname.trim(),
        tourist_phone: personal.phone.trim(),
        tourist_email: personal.email.trim(),
        pax_adults: adults,
        pax_children: children,
        preferred_locale: selectedSlot.locale,
        source: "nortewalk.com",
        ...utms,
      };
      const res = await submitLead(body);
      setResult(res);
      setStep("done");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setSubmitError(t.errorFull);
        loadSlots();
      } else {
        const msg = error instanceof Error ? error.message : String(error);
        setSubmitError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- Labels de resumen ----------
  const fmtDateLong = useMemo(
    () =>
      new Intl.DateTimeFormat(intlLocale(locale), {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [locale],
  );
  const summaryDate = selectedDate
    ? fmtDateLong.format(new Date(`${selectedDate}T00:00:00`))
    : null;
  const paxLabel = [
    `${adults} ${adults === 1 ? t.adultOne : t.adultOther}`,
    children > 0 ? `${children} ${children === 1 ? t.childOne : t.childOther}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div id="booking" className="scroll-mt-24">
      {/* ====== Header precio ====== */}
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
            {isFree ? t.priceFreeKicker : dict.price.from}
          </p>
          <p className="mt-0.5 text-[26px] font-bold leading-tight text-(--color-stone-800)">
            {priceLabel}
          </p>
          {priceHint && <p className="text-xs text-(--color-muted)">{priceHint}</p>}
        </div>
        <span className="rounded-full bg-(--color-stone-100) px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-(--color-stone-700)">
          {t.instantBadge}
        </span>
      </div>

      <div className="mt-5 space-y-5">
        {/* ====== 1 · Participantes ====== */}
        <section>
          <WidgetLabel text={t.participants} />
          <div className="mt-2 space-y-2.5 rounded-xl border border-(--color-border) bg-white p-3.5">
            <CounterRow
              label={t.adults}
              hint={t.adultsHint}
              value={adults}
              min={1}
              max={paxCap - children}
              onChange={setAdults}
              decLabel={t.counterLess}
              incLabel={t.counterMore}
            />
            <CounterRow
              label={t.children}
              hint={t.childrenHint}
              value={children}
              min={0}
              max={paxCap - adults}
              onChange={setChildren}
              decLabel={t.counterLess}
              incLabel={t.counterMore}
            />
          </div>
        </section>

        {/* ====== 2 · Idioma ====== */}
        {tourLanguages.length > 1 && (
          <section>
            <WidgetLabel text={t.language} />
            <div className="mt-2 flex flex-wrap gap-2">
              <LangPill
                active={langFilter === "all"}
                onClick={() => setLangFilter("all")}
                label={t.allLanguages}
              />
              {tourLanguages.map((code) => (
                <LangPill
                  key={code}
                  active={langFilter === code}
                  onClick={() => setLangFilter(code)}
                  flag={languageFlag(code)}
                  label={languageLabel(code, locale)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ====== 3 · Calendario ====== */}
        <section>
          <WidgetLabel text={t.selectDate} />
          {slotsStatus === "loading" && (
            <p className="mt-2 text-sm text-(--color-muted)">{t.loadingDates}</p>
          )}
          {slotsStatus === "empty" && (
            <p className="mt-2 text-sm text-(--color-muted)">{t.noAvailableDates}</p>
          )}
          {slotsStatus === "error" && (
            <div className="mt-2 text-sm">
              <p className="text-(--color-muted)">{t.errorDates}</p>
              <button
                type="button"
                onClick={() => loadSlots()}
                className="mt-1 font-semibold text-(--color-accent-600) underline hover:text-(--color-accent-700)"
              >
                {dict.common.retry}
              </button>
            </div>
          )}
          {slotsStatus === "ok" && (
            <div className="mt-2">
              <CalendarMonth
                monthCursor={monthCursor}
                onMonthChange={setMonthCursor}
                slotsByDate={slotsByDate}
                selectedDate={selectedDate}
                onPickDate={(d) => {
                  setSelectedDate(d);
                  setSelectedScheduleId(null);
                  // Si hay un solo horario ese día, autoseleccionarlo.
                  const ds = slotsByDate.get(d) ?? [];
                  if (ds.length === 1) setSelectedScheduleId(String(ds[0].schedule_id));
                }}
                locale={locale}
                minYmd={fromYmd}
                maxYmd={toYmd}
                prevLabel={t.monthPrev}
                nextLabel={t.monthNext}
              />
            </div>
          )}
        </section>

        {/* ====== 4 · Horarios del día ====== */}
        {selectedDate && daySlots.length > 0 && (
          <section>
            <WidgetLabel text={t.selectTime} />
            <div className="mt-2 space-y-2">
              {daySlots.map((s) => {
                const id = String(s.schedule_id);
                const left = s.spots_left !== null ? Number(s.spots_left) : null;
                const full = left !== null && left <= 0;
                const active = selectedScheduleId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={full}
                    onClick={() => setSelectedScheduleId(active ? null : id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                      active
                        ? "border-(--color-stone-700) bg-(--color-stone-700) text-white shadow-sm"
                        : full
                          ? "cursor-not-allowed border-(--color-border) bg-(--color-bone-200)/40 opacity-60"
                          : "border-(--color-border) bg-white hover:border-(--color-stone-600)"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`text-base font-bold tabular-nums ${active ? "text-white" : "text-(--color-stone-800)"}`}>
                        {formatTime(s.start_time)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          active
                            ? "bg-white/15 text-white"
                            : "bg-(--color-bone-200) text-(--color-stone-700)"
                        }`}
                      >
                        <span aria-hidden>{languageFlag(s.locale)}</span>
                        {languageLabel(s.locale, locale)}
                      </span>
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        full
                          ? "text-(--color-accent-700)"
                          : active
                            ? "text-white/85"
                            : left !== null && left <= 4
                              ? "text-(--color-accent-600)"
                              : "text-(--color-muted)"
                      }`}
                    >
                      {full ? t.spotsFull : left !== null ? spotsLabel(left) : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ====== Resumen + aviso de cupo ====== */}
        {selectedSlot && summaryDate && (
          <div className="rounded-xl bg-(--color-stone-100) px-4 py-3 text-sm text-(--color-stone-800)">
            <p className="font-semibold capitalize">
              {summaryDate} · {formatTime(selectedSlot.start_time)}
            </p>
            <p className="mt-0.5 text-(--color-stone-600)">
              {languageFlag(selectedSlot.locale)} {languageLabel(selectedSlot.locale, locale)} ·{" "}
              {paxLabel}
            </p>
          </div>
        )}
        {overCapacity && spotsLeft !== null && (
          <p role="alert" className="text-sm font-semibold text-(--color-accent-700)">
            {t.tooManyPax.replace("{spots}", spotsLabel(spotsLeft).toLowerCase())}
          </p>
        )}

        {/* ====== 5 · CTA ====== */}
        <div>
          <button
            type="button"
            disabled={!canReserve}
            onClick={() => setStep("form")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-(--color-accent-500) px-5 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(211,84,0,0.65)] transition-all hover:bg-(--color-accent-600) disabled:cursor-not-allowed disabled:bg-(--color-ink-300) disabled:shadow-none"
          >
            {canReserve ? t.reserveCta : t.reserveCtaDisabled}
          </button>
          <p className="mt-2.5 text-center text-xs text-(--color-muted)">{t.noPaymentNote}</p>
          <p className="mt-3 text-center text-xs text-(--color-muted)">
            <a
              href={fallbackWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-(--color-foreground)"
            >
              {t.askOnly}
            </a>
          </p>
        </div>
      </div>

      {/* ====== Sticky CTA mobile ====== */}
      <a
        href="#booking"
        className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-center gap-2 rounded-full bg-(--color-accent-500) px-5 py-3.5 text-[15px] font-bold text-white shadow-lg md:hidden"
      >
        {t.stickyCta} · {priceLabel}
      </a>

      {/* ====== Modal: datos personales / confirmación ====== */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        ariaLabelledBy="booking-modal-title"
        size="sm"
        closeLabel={t.close}
      >
        {step === "form" && selectedSlot && summaryDate && (
          <form onSubmit={onSubmit} className="p-6 sm:p-8" noValidate>
            <h2
              id="booking-modal-title"
              className="font-display text-2xl text-(--color-stone-800)"
            >
              {t.formTitle}
            </h2>
            <p className="mt-1 text-sm text-(--color-muted)">{t.formSubtitle}</p>

            {/* Resumen compacto de lo elegido */}
            <div className="mt-4 rounded-xl bg-(--color-stone-100) px-4 py-3 text-sm">
              <p className="font-semibold text-(--color-stone-800)">{experienceTitle}</p>
              <p className="mt-0.5 capitalize text-(--color-stone-600)">
                {summaryDate} · {formatTime(selectedSlot.start_time)} ·{" "}
                {languageFlag(selectedSlot.locale)} {languageLabel(selectedSlot.locale, locale)}
              </p>
              <p className="text-(--color-stone-600)">{paxLabel}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Field label={t.firstName} htmlFor="bw-name" required>
                <input
                  id="bw-name"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder={t.firstNamePlaceholder}
                  value={personal.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label={t.lastName} htmlFor="bw-surname" required>
                <input
                  id="bw-surname"
                  type="text"
                  required
                  autoComplete="family-name"
                  placeholder={t.lastNamePlaceholder}
                  value={personal.surname}
                  onChange={(e) => setField("surname", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mt-3 space-y-3">
              <Field label={t.email} htmlFor="bw-email" required>
                <input
                  id="bw-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tu@email.com"
                  value={personal.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label={t.phone} htmlFor="bw-phone" hint={t.phoneHint} required>
                <input
                  id="bw-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+54 9 ..."
                  value={personal.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            {submitError && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-(--color-accent-500)/30 bg-(--color-accent-500)/5 p-3 text-sm"
              >
                <p className="font-semibold text-(--color-accent-700)">{t.errorTitle}</p>
                <p className="mt-1 text-(--color-ink-700)">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-(--color-accent-500) px-5 py-3.5 text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-(--color-accent-600) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? t.submitting : t.submit}
            </button>
            <p className="mt-3 text-center text-xs text-(--color-muted)">{t.privacyNote}</p>
          </form>
        )}

        {step === "done" && result && (
          <div className="p-6 text-center sm:p-8">
            <div
              aria-hidden
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-(--color-stone-600)/15 text-3xl"
            >
              ✅
            </div>
            <h2
              id="booking-modal-title"
              className="font-display mt-4 text-2xl text-(--color-stone-800)"
            >
              {t.doneTitle}
            </h2>
            <p className="mt-1 text-sm text-(--color-muted)">{t.doneSubtitle}</p>

            <div className="mt-5 rounded-xl border-2 border-dashed border-(--color-stone-300) bg-(--color-stone-100)/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                {t.doneCode}
              </p>
              <p className="mt-0.5 text-2xl font-bold tracking-widest text-(--color-stone-800)">
                {result.booking_code}
              </p>
            </div>

            <dl className="mt-5 space-y-2 rounded-xl bg-white p-4 text-left text-sm ring-1 ring-(--color-border)">
              <SummaryRow label={t.doneTour} value={result.experience_title} />
              <SummaryRow
                label={dict.detail.schedule}
                value={`${fmtDateLong.format(new Date(`${result.desired_date}T00:00:00`))}${
                  result.desired_time ? ` · ${formatTime(result.desired_time)}` : ""
                }`}
                capitalize
              />
              <SummaryRow
                label={t.language}
                value={`${languageFlag(result.tour_locale)} ${languageLabel(result.tour_locale, locale)}`}
              />
              <SummaryRow label={t.participants} value={paxLabel} />
              {meetingPoint && (
                <SummaryRow label={dict.detail.meetingPoint} value={meetingPoint} />
              )}
            </dl>

            <p className="mt-5 text-sm leading-relaxed text-(--color-ink-700)">
              {t.doneNext.replace("{provider}", providerName)}
            </p>

            <div className="mt-6 space-y-2.5">
              <a
                href={result.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-(--color-whatsapp) px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-(--color-whatsapp-hover)"
              >
                {t.doneWhatsapp}
              </a>
              <button
                type="button"
                onClick={closeModal}
                className="flex w-full items-center justify-center rounded-full border border-(--color-border) bg-white px-5 py-3 text-sm font-semibold text-(--color-stone-700) transition-colors hover:bg-(--color-bone-200)"
              >
                {t.doneClose}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// =====================================================================
// Subcomponentes
// =====================================================================

const inputClass =
  "block w-full rounded-lg border border-(--color-border) bg-white px-3 py-2.5 text-sm text-(--color-foreground) shadow-xs outline-none focus:border-(--color-stone-600) focus:ring-2 focus:ring-(--color-stone-300)";

function WidgetLabel({ text }: { text: string }) {
  return (
    <p className="text-[13px] font-bold uppercase tracking-wide text-(--color-stone-700)">
      {text}
    </p>
  );
}

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
          {required && <span className="ml-0.5 text-(--color-accent-600)">*</span>}
        </span>
        {hint && <span className="font-normal text-(--color-muted)">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function CounterRow({
  label,
  hint,
  value,
  min,
  max,
  onChange,
  decLabel,
  incLabel,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  decLabel: string;
  incLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-(--color-stone-800)">{label}</p>
        {hint && <p className="text-xs text-(--color-muted)">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        <CounterButton
          ariaLabel={`${decLabel} ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          symbol="−"
        />
        <span className="w-6 text-center text-base font-bold tabular-nums text-(--color-stone-800)">
          {value}
        </span>
        <CounterButton
          ariaLabel={`${incLabel} ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          symbol="+"
        />
      </div>
    </div>
  );
}

function CounterButton({
  ariaLabel,
  disabled,
  onClick,
  symbol,
}: {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  symbol: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-(--color-accent-500) text-lg font-bold text-(--color-accent-600) transition-colors hover:bg-(--color-accent-500) hover:text-white disabled:cursor-not-allowed disabled:border-(--color-ink-200) disabled:text-(--color-ink-300) disabled:hover:bg-transparent"
    >
      {symbol}
    </button>
  );
}

function LangPill({
  active,
  onClick,
  flag,
  label,
}: {
  active: boolean;
  onClick: () => void;
  flag?: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
        active
          ? "border-(--color-stone-700) bg-(--color-stone-700) text-white"
          : "border-(--color-border) bg-white text-(--color-ink-700) hover:border-(--color-stone-600)"
      }`}
    >
      {flag && <span aria-hidden>{flag}</span>}
      {label}
    </button>
  );
}

// ---------- Calendario ----------

function CalendarMonth({
  monthCursor,
  onMonthChange,
  slotsByDate,
  selectedDate,
  onPickDate,
  locale,
  minYmd,
  maxYmd,
  prevLabel,
  nextLabel,
}: {
  monthCursor: Date;
  onMonthChange: (d: Date) => void;
  slotsByDate: Map<string, AvailableSlot[]>;
  selectedDate: string | null;
  onPickDate: (ymd: string) => void;
  locale: Locale;
  minYmd: string;
  maxYmd: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const intl = intlLocale(locale);

  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat(intl, { month: "long", year: "numeric" }).format(monthCursor),
    [intl, monthCursor],
  );

  // Cabecera Lu…Do (semana arranca lunes). 2024-01-01 fue lunes.
  const weekdayHeads = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(intl, { weekday: "short" });
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(2024, 0, 1 + i)).replace(".", "").slice(0, 3),
    );
  }, [intl]);

  // Celdas del mes: huecos iniciales + días.
  const cells = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // getDay(): 0=domingo. Convertimos a índice lunes-first (0=lunes).
    const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
    const list: ({ ymd: string; day: number } | null)[] = [];
    for (let i = 0; i < firstDow; i++) list.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const ymd = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      list.push({ ymd, day: d });
    }
    return list;
  }, [monthCursor]);

  const canPrev = useMemo(() => {
    const prev = addMonths(monthCursor, -1);
    const lastOfPrev = new Date(prev.getFullYear(), prev.getMonth() + 1, 0);
    return localYmd(lastOfPrev) >= minYmd;
  }, [monthCursor, minYmd]);

  const canNext = useMemo(() => {
    const next = addMonths(monthCursor, 1);
    return localYmd(next) <= maxYmd;
  }, [monthCursor, maxYmd]);

  return (
    <div className="rounded-xl border border-(--color-border) bg-white p-3.5">
      {/* Nav de mes */}
      <div className="flex items-center justify-between">
        <MonthNavButton
          ariaLabel={prevLabel}
          disabled={!canPrev}
          onClick={() => onMonthChange(addMonths(monthCursor, -1))}
          symbol="‹"
        />
        <p className="text-sm font-bold capitalize text-(--color-stone-800)">{monthLabel}</p>
        <MonthNavButton
          ariaLabel={nextLabel}
          disabled={!canNext}
          onClick={() => onMonthChange(addMonths(monthCursor, 1))}
          symbol="›"
        />
      </div>

      {/* Grid */}
      <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
        {weekdayHeads.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="text-[11px] font-bold uppercase text-(--color-muted)"
          >
            {w}
          </span>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <span key={`empty-${i}`} />;
          const hasSlots = slotsByDate.has(cell.ymd);
          const isSelected = selectedDate === cell.ymd;
          return (
            <span key={cell.ymd} className="flex justify-center py-0.5">
              <button
                type="button"
                disabled={!hasSlots}
                onClick={() => onPickDate(cell.ymd)}
                aria-pressed={isSelected}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                  isSelected
                    ? "bg-(--color-accent-500) font-bold text-white shadow-sm"
                    : hasSlots
                      ? "bg-(--color-stone-100) font-semibold text-(--color-stone-800) hover:bg-(--color-stone-200)"
                      : "cursor-default text-(--color-ink-300)"
                }`}
              >
                {cell.day}
                {hasSlots && !isSelected && (
                  <span
                    aria-hidden
                    className="absolute bottom-1 h-1 w-1 rounded-full bg-(--color-stone-600)"
                  />
                )}
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function MonthNavButton({
  ariaLabel,
  disabled,
  onClick,
  symbol,
}: {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  symbol: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-(--color-border) text-lg text-(--color-stone-700) transition-colors hover:border-(--color-stone-600) hover:bg-(--color-stone-100) disabled:cursor-not-allowed disabled:opacity-35"
    >
      {symbol}
    </button>
  );
}

function SummaryRow({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="flex-shrink-0 text-(--color-muted)">{label}</dt>
      <dd
        className={`text-right font-semibold text-(--color-stone-800) ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
