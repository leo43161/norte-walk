import Link from "next/link";

import { CookieSettingsButton } from "@/components/CookieConsent";
import NorteWalkLogo from "@/components/NorteWalkLogo";
import GrainOverlay from "@/components/nw/GrainOverlay";
import type { Dictionary, Locale } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Footer "Norte Cálido". Verde profundo con grain sutil.
 * 4 columnas: Marca + tagline / Tours / Para guías / Legal.
 * Firma cercana ("Hecho con cariño en el norte") en vez de coordenadas mono.
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
      <GrainOverlay className="absolute inset-0 h-full w-full text-(--color-bone-100)" opacity={0.05} />
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Marca + tagline */}
          <div>
            <NorteWalkLogo variant="full" tone="mono-light" size={34} />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-(--color-bone-100)/75">
              {dict.hero.subtitle}
            </p>
            <Link
              href={`/${locale}/nosotros/`}
              className="mt-4 inline-block text-[15px] font-semibold text-(--color-accent-300) transition-colors hover:text-(--color-accent-200)"
            >
              {dict.footer.about} →
            </Link>
          </div>

          {/* Tours */}
          <FooterCol title={dict.footer.toursTitle}>
            {tours.map((t) => (
              <li key={t.key}>
                <Link
                  href={t.href}
                  className="text-(--color-bone-100)/80 transition-colors hover:text-(--color-accent-300)"
                >
                  {dict.nav[t.key]}
                </Link>
              </li>
            ))}
          </FooterCol>

          {/* Para guías */}
          <FooterCol title={dict.footer.guidesTitle}>
            <li>
              <FooterLink href={`/${locale}/sumate/`}>{dict.footer.guidesRegister}</FooterLink>
            </li>
            <li>
              <FooterLink href={`/${locale}/ayuda/`}>{dict.footer.guidesHelp}</FooterLink>
            </li>
          </FooterCol>

          {/* Legal */}
          <FooterCol title={dict.footer.legalTitle}>
            <li>
              <FooterLink href={`/${locale}/terminos/`}>{dict.footer.legalTerms}</FooterLink>
            </li>
            <li>
              <FooterLink href={`/${locale}/privacidad/`}>{dict.footer.legalPrivacy}</FooterLink>
            </li>
            <li>
              <FooterLink href={`/${locale}/cancelacion/`}>{dict.footer.legalCancellation}</FooterLink>
            </li>
            <li>
              <FooterLink href={`/${locale}/resenas/`}>{dict.footer.legalReviews}</FooterLink>
            </li>
            <li>
              <FooterLink href={`/${locale}/contenido/`}>{dict.footer.legalContent}</FooterLink>
            </li>
          </FooterCol>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-(--color-bone-100)/12 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-(--color-bone-100)/60">
            ♥ {dict.footer.madeIn}
          </p>
          <div className="flex items-center gap-4 text-(--color-bone-100)/50">
            <CookieSettingsButton label={dict.cookies.settings} />
            <span>© {new Date().getFullYear()} NorteWalk</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-bold text-(--color-accent-300)">{title}</p>
      <ul className="mt-4 space-y-2.5 text-[15px]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-(--color-bone-100)/80 transition-colors hover:text-(--color-accent-300)"
    >
      {children}
    </Link>
  );
}
