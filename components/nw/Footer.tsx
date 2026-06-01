import Link from "next/link";

import NorteWalkLogo from "@/components/NorteWalkLogo";
import GrainOverlay from "@/components/nw/GrainOverlay";
import type { Dictionary, Locale } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Footer Selva & Brasa. Stone-900 con grain overlay.
 * 4 columnas: Marca + tagline / Tours / Para guías / Legal.
 * Barra inferior con coords mono y copyright.
 *
 * "Para guías" y "Legal" son enlaces a anchor placeholders por ahora — no
 * existen las rutas, pero el footer queda preparado.
 */
export default function Footer({ locale, dict }: FooterProps) {
  const tours = [
    { key: "fwt" as const, href: `/${locale}/fwt/` },
    { key: "adventure" as const, href: `/${locale}/adventure/` },
    { key: "experience" as const, href: `/${locale}/experience/` },
    { key: "gastronomy" as const, href: `/${locale}/gastronomy/` },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-(--color-stone-900) text-(--color-bone-200)">
      <GrainOverlay className="absolute inset-0 h-full w-full text-(--color-bone-100)" opacity={0.06} />
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Marca + tagline */}
          <div>
            <NorteWalkLogo variant="full" tone="mono-light" size={32} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-(--color-bone-200)/70">
              {dict.hero.subtitle}
            </p>
          </div>

          {/* Tours */}
          <div>
            <p className="font-(family-name:--font-mono) text-[11px] uppercase tracking-[0.25em] text-(--color-accent-400)">
              {dict.footer.toursTitle}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {tours.map((t) => (
                <li key={t.key}>
                  <Link
                    href={t.href}
                    className="text-(--color-bone-100)/80 transition-colors hover:text-(--color-bone-100)"
                  >
                    {dict.nav[t.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Para guías */}
          <div>
            <p className="font-(family-name:--font-mono) text-[11px] uppercase tracking-[0.25em] text-(--color-accent-400)">
              {dict.footer.guidesTitle}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="text-(--color-bone-100)/80">{dict.footer.guidesRegister}</li>
              <li className="text-(--color-bone-100)/80">{dict.footer.guidesHelp}</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-(family-name:--font-mono) text-[11px] uppercase tracking-[0.25em] text-(--color-accent-400)">
              {dict.footer.legalTitle}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="text-(--color-bone-100)/80">{dict.footer.legalTerms}</li>
              <li className="text-(--color-bone-100)/80">{dict.footer.legalPrivacy}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-(--color-bone-100)/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="font-(family-name:--font-mono) uppercase tracking-widest text-(--color-bone-200)/50">
            26°50′S · 65°12′O · Tucumán
          </p>
          <p className="text-(--color-bone-200)/50">
            © {new Date().getFullYear()} NorteWalk · {dict.footer.madeIn}
          </p>
        </div>
      </div>
    </footer>
  );
}
