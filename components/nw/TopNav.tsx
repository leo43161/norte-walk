import Link from "next/link";

import NorteWalkLogo from "@/components/NorteWalkLogo";
import { LOCALES, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

interface TopNavProps {
  locale: Locale;
  dict: Dictionary;
  /** Si la nav está sobre un hero oscuro, evita el border+blur sólido. */
  transparent?: boolean;
}

/**
 * Nav superior. Sticky con backdrop-blur sobre fondos claros; transparente
 * absoluta cuando está sobre el hero atmosférico (props.transparent).
 *
 * Items según el brief: Tours (FWT) · Aventura · Experiencias · Gastronomía.
 * Locale switcher en mono uppercase a la derecha. No incluye "Sumate como guía"
 * (omitido en esta pasada por decisión de scope).
 */
export default function TopNav({ locale, dict, transparent = false }: TopNavProps) {
  const items = [
    { key: "fwt" as const, href: `/${locale}/fwt/` },
    { key: "adventure" as const, href: `/${locale}/adventure/` },
    { key: "experience" as const, href: `/${locale}/experience/` },
    { key: "gastronomy" as const, href: `/${locale}/gastronomy/` },
  ];

  const wrapperClass = transparent
    ? "absolute top-0 inset-x-0 z-30 text-(--color-bone-100)"
    : "sticky top-0 z-30 border-b border-(--color-stone-700)/30 bg-(--color-stone-800)/95 text-(--color-bone-100) backdrop-blur-md";

  return (
    <header className={wrapperClass}>
      <nav className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-5">
        <Link
          href={`/${locale}/`}
          className="text-(--color-bone-100) transition-opacity hover:opacity-80"
        >
          <NorteWalkLogo variant="full" tone="color" size={32} ariaLabel="NorteWalk · Inicio" />
        </Link>
        <ul className="hidden gap-7 text-sm md:flex">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="text-(--color-bone-100)/80 transition-colors hover:text-(--color-accent-300)"
              >
                {dict.nav[item.key]}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="ml-auto flex items-center gap-1 font-(family-name:--font-mono) text-[11px] uppercase">
          {LOCALES.map((l, idx) => (
            <li key={l} className="flex items-center">
              {idx > 0 && <span className="mx-1 text-(--color-bone-300)/30">·</span>}
              <Link
                href={`/${l}/`}
                aria-current={l === locale ? "page" : undefined}
                className={
                  l === locale
                    ? "text-(--color-accent-400) font-medium"
                    : "text-(--color-bone-200)/60 transition-colors hover:text-(--color-bone-100)"
                }
              >
                {l}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
