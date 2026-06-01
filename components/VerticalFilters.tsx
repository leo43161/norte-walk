"use client";

import { useMemo, useState } from "react";

import TourCard from "@/components/nw/TourCard";
import type { ExperienceListItem } from "@/lib/api";
import type { Dictionary, Locale } from "@/lib/i18n";

interface VerticalFiltersProps {
  items: ExperienceListItem[];
  locale: Locale;
  dict: Dictionary;
}

type TypeFilter = "all" | "free" | "paid";

/**
 * Filtros client-side sobre el dataset prerenderizado en build.
 *
 * En static export no podemos refetch del server con `?city=X&type=Y` —
 * todo el catálogo vino en el HTML inicial y se filtra en memoria.
 * Esto es OK mientras la vertical no supere ~500 items; si crece, conviene
 * paginar o partir por sub-vertical.
 */
export default function VerticalFilters({ items, locale, dict }: VerticalFiltersProps) {
  const cities = useMemo(() => {
    const unique = new Set(items.map((i) => i.city).filter(Boolean));
    return [...unique].sort();
  }, [items]);

  const [city, setCity] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (city && item.city !== city) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      return true;
    });
  }, [items, city, typeFilter]);

  const isFiltered = city !== "" || typeFilter !== "all";
  const count = filtered.length;
  const countLabel = count === 1
    ? dict.vertical.results.countOne
    : dict.vertical.results.countOther.replace("{n}", String(count));

  function clearFilters() {
    setCity("");
    setTypeFilter("all");
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-(--color-border) pb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="vf-city" className="text-xs font-medium uppercase tracking-wider text-(--color-muted)">
            {dict.vertical.filters.city}
          </label>
          <select
            id="vf-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-full border border-(--color-border) bg-white px-3 py-1.5 text-sm text-(--color-foreground) outline-none focus:border-(--color-stone-600) focus:ring-2 focus:ring-(--color-stone-300)"
          >
            <option value="">{dict.vertical.filters.cityAll}</option>
            {cities.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c.replace(/-/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="flex items-center gap-2">
          <legend className="sr-only">{dict.vertical.filters.type}</legend>
          <span className="text-xs font-medium uppercase tracking-wider text-(--color-muted)">
            {dict.vertical.filters.type}
          </span>
          <div className="flex gap-1.5">
            <TypeChip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
              {dict.vertical.filters.typeAll}
            </TypeChip>
            <TypeChip active={typeFilter === "free"} onClick={() => setTypeFilter("free")}>
              {dict.vertical.filters.typeFree}
            </TypeChip>
            <TypeChip active={typeFilter === "paid"} onClick={() => setTypeFilter("paid")}>
              {dict.vertical.filters.typePaid}
            </TypeChip>
          </div>
        </fieldset>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-(--color-muted)">{countLabel}</span>
          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium uppercase tracking-wider text-(--color-accent-600) hover:text-(--color-accent-700) hover:underline"
            >
              {dict.vertical.filters.clear}
            </button>
          )}
        </div>
      </div>

      {/* Grid o empty */}
      {filtered.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-(--color-foreground)">
            {dict.vertical.results.emptyTitle}
          </h2>
          <p className="mt-3 text-(--color-muted)">{dict.vertical.results.emptyBody}</p>
          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-full bg-(--color-stone-700) px-5 py-2 text-sm font-semibold text-(--color-bone-100) hover:bg-(--color-stone-800)"
            >
              {dict.vertical.filters.clear}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exp, idx) => (
            <TourCard key={exp.id} exp={exp} locale={locale} dict={dict} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function TypeChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-(--color-stone-700) px-3 py-1.5 text-xs font-semibold text-(--color-bone-100)"
          : "rounded-full border border-(--color-border) bg-white px-3 py-1.5 text-xs font-medium text-(--color-ink-700) hover:border-(--color-stone-600) hover:text-(--color-stone-800)"
      }
    >
      {children}
    </button>
  );
}
