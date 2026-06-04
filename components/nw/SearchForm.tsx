"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Vertical } from "@/lib/api";
import type { Dictionary, Locale } from "@/lib/i18n";

interface SearchFormProps {
  locale: Locale;
  dict: Dictionary;
  /** Ciudades sugeridas del catálogo real (pasadas desde el server). */
  cities: string[];
}

/**
 * Buscador horizontal del hero. 3 campos sobre una tarjeta clara con
 * separadores hairline entre ellos. Submit redirige a la página de la
 * vertical elegida con `?city=X&date=Y` como querystring (que VerticalFilters
 * puede levantar más adelante para pre-filtrar).
 *
 * El "tipo" es required — sin él no sabemos a qué listado mandar.
 */
export default function SearchForm({ locale, dict, cities }: SearchFormProps) {
  const router = useRouter();
  const [city, setCity] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [vertical, setVertical] = useState<Vertical | "">("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!vertical) return;
    const qs = new URLSearchParams();
    if (city) qs.set("city", city);
    if (date) qs.set("date", date);
    const query = qs.toString();
    router.push(`/${locale}/${vertical}/${query ? `?${query}` : ""}`);
  }

  // Fecha mínima = hoy (local).
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <form
      onSubmit={onSubmit}
      className="
        grid gap-0 overflow-hidden rounded-[20px] bg-white p-2 shadow-[0_24px_60px_-24px_rgba(40,51,31,0.5)]
        sm:grid-cols-[1.1fr_1fr_1.1fr_auto] sm:items-stretch
      "
    >
      {/* Destino */}
      <label className="group flex min-w-0 flex-col gap-1 rounded-2xl px-4 py-3 transition-colors hover:bg-(--color-bone-100)">
        <span className="text-xs font-semibold text-(--color-stone-500)">
          {dict.search.destinationLabel}
        </span>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full min-w-0 truncate bg-transparent text-[15px] font-medium text-(--color-stone-800) outline-none"
        >
          <option value="">{dict.search.destinationAll}</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
            </option>
          ))}
        </select>
      </label>

      {/* Fecha */}
      <label className="group flex min-w-0 flex-col gap-1 rounded-2xl px-4 py-3 transition-colors hover:bg-(--color-bone-100) sm:border-l sm:border-(--color-border)">
        <span className="text-xs font-semibold text-(--color-stone-500)">
          {dict.search.dateLabel}
        </span>
        <input
          type="date"
          min={minDate}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full min-w-0 bg-transparent text-[15px] font-medium text-(--color-stone-800) outline-none"
        />
      </label>

      {/* Tipo */}
      <label className="group flex min-w-0 flex-col gap-1 rounded-2xl px-4 py-3 transition-colors hover:bg-(--color-bone-100) sm:border-l sm:border-(--color-border)">
        <span className="text-xs font-semibold text-(--color-stone-500)">
          {dict.search.typeLabel}
        </span>
        <select
          required
          value={vertical}
          onChange={(e) => setVertical(e.target.value as Vertical | "")}
          className="w-full min-w-0 truncate bg-transparent text-[15px] font-medium text-(--color-stone-800) outline-none"
        >
          <option value="">{dict.search.typePlaceholder}</option>
          <option value="fwt">{dict.nav.fwt}</option>
          <option value="adventure">{dict.nav.adventure}</option>
          <option value="experience">{dict.nav.experience}</option>
          <option value="gastronomy">{dict.nav.gastronomy}</option>
        </select>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={!vertical}
        className="
          m-1 flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-(--color-accent-500) px-6 py-4
          text-[15px] font-semibold text-white transition-colors
          hover:bg-(--color-accent-600) disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        {dict.search.submit}
      </button>
    </form>
  );
}
