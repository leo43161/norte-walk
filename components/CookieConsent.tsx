"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * Consentimiento de cookies (opt-in).
 *
 * La analítica (Google Analytics + Microsoft Clarity) NO se carga hasta que el
 * visitante acepta explícitamente. La elección se guarda en localStorage; el
 * banner solo aparece la primera vez (o si se reabre desde el pie de página).
 *
 * Implementado como un store externo + `useSyncExternalStore`: maneja bien el
 * export estático (el snapshot de servidor es "ssr", así que el banner nunca
 * queda en el HTML prerenderizado) y sincroniza entre pestañas vía `storage`.
 *
 * `Analytics` y `Clarity` consumen `useCookieConsent()` y solo inicializan
 * cuando `consent === "granted"`.
 */

export type CookieChoice = "granted" | "denied";
const STORAGE_KEY = "nw_cookie_consent";

/** "ssr" durante prerender/hidratación; en cliente: la elección real o "none". */
type Snapshot = "ssr" | CookieChoice | "none";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== "undefined") window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Snapshot {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : "none";
  } catch {
    return "none";
  }
}

function getServerSnapshot(): Snapshot {
  return "ssr";
}

function setChoice(choice: CookieChoice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* localStorage no disponible: la elección no persiste, pero no rompe. */
  }
  emit();
}

function clearChoice() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
  emit();
}

export interface CookieConsentValue {
  /** null = el visitante todavía no eligió. */
  consent: CookieChoice | null;
  /** true cuando ya estamos en cliente (no en el prerender). */
  ready: boolean;
  choose: (choice: CookieChoice) => void;
  /** Reabre el banner (olvida la elección guardada). */
  reopen: () => void;
}

export function useCookieConsent(): CookieConsentValue {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = snapshot !== "ssr";
  const consent = snapshot === "granted" || snapshot === "denied" ? snapshot : null;
  return { consent, ready, choose: setChoice, reopen: clearChoice };
}

/**
 * Banner de consentimiento. Se renderiza en el layout de cada locale; solo
 * aparece cuando ya estamos en cliente y el visitante todavía no eligió.
 */
export function CookieBanner({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { consent, ready, choose } = useCookieConsent();
  if (!ready || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label={dict.cookies.title}
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-(--color-bone-100)/10 bg-(--color-stone-900) px-5 py-4 text-(--color-bone-100) shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] sm:flex-row sm:items-center sm:gap-6 sm:px-5 sm:py-4">
        <div className="flex-1">
          <p className="font-display text-base text-(--color-bone-100)">{dict.cookies.title}</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-(--color-bone-100)/75">
            {dict.cookies.body}{" "}
            <Link
              href={`/${locale}/privacidad/#cookies`}
              className="font-semibold text-(--color-accent-300) underline-offset-2 hover:underline"
            >
              {dict.cookies.moreLink}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-full px-4 py-2 text-sm font-semibold text-(--color-bone-100)/80 ring-1 ring-inset ring-(--color-bone-100)/25 transition-colors hover:bg-(--color-bone-100)/10"
          >
            {dict.cookies.reject}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-full bg-(--color-accent-500) px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--color-accent-600)"
          >
            {dict.cookies.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Botón/enlace para reabrir el aviso de cookies (va en el pie de página).
 */
export function CookieSettingsButton({ label }: { label: string }) {
  const { reopen } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={reopen}
      className="text-(--color-bone-100)/80 transition-colors hover:text-(--color-accent-300)"
    >
      {label}
    </button>
  );
}
