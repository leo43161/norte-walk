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
 * Nav superior "Norte Cálido". Barra verde de marca (cálida, no negra) con
 * links amigables y un botón naranja de reserva para empujar la acción.
 *
 * El logo va en tone="color" porque la barra es verde: las montañas crema y
 * el sol naranja se leen perfecto sobre ese fondo.
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
    : "sticky top-0 z-30 border-b border-(--color-bone-100)/10 bg-(--color-stone-700)/95 text-(--color-bone-100) backdrop-blur-md";

  return (
    <header className={wrapperClass}>
      <nav className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-4">
        <Link
          href={`/${locale}/`}
          className="text-(--color-bone-100) transition-opacity hover:opacity-80"
        >
          <NorteWalkLogo variant="full" tone="color" size={34} ariaLabel="NorteWalk · Inicio" />
        </Link>
        <ul className="hidden gap-7 text-[15px] font-medium md:flex">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="text-(--color-bone-100)/85 transition-colors hover:text-(--color-accent-300)"
              >
                {dict.nav[item.key]}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`/${locale}/nosotros/`}
              className="text-(--color-bone-100)/85 transition-colors hover:text-(--color-accent-300)"
            >
              {dict.nav.about}
            </Link>
          </li>
        </ul>

        <div className="ml-auto flex items-center gap-4">
          {/* Selector de idioma, amigable */}
          <ul className="flex items-center gap-1 text-[13px] font-semibold uppercase">
            {LOCALES.map((l, idx) => (
              <li key={l} className="flex items-center">
                {idx > 0 && <span className="mx-0.5 text-(--color-bone-100)/25">·</span>}
                <Link
                  href={`/${l}/`}
                  aria-current={l === locale ? "page" : undefined}
                  className={
                    l === locale
                      ? "text-(--color-accent-300)"
                      : "text-(--color-bone-100)/55 transition-colors hover:text-(--color-bone-100)"
                  }
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA naranja: empuja a ver/reservar caminatas */}
          <Link
            href={`/${locale}/fwt/`}
            className="hidden rounded-full bg-(--color-accent-500) px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--color-accent-600) sm:inline-flex"
          >
            {dict.hero.ctaPrimary}
          </Link>
        </div>
      </nav>
    </header>
  );
}
