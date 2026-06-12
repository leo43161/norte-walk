import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HelpForm from "@/components/forms/HelpForm";
import JsonLd from "@/components/JsonLd";
import Kicker from "@/components/nw/Kicker";
import { LOCALES, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { OG_LOCALE, SITE_NAME, buildBreadcrumb } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

/**
 * WhatsApp de contacto general de NorteWalk (no el de un guía). Opcional:
 * setear NEXT_PUBLIC_CONTACT_WHATSAPP (formato E.164, ej. +5493810000000).
 * Si está vacío, la página muestra solo el formulario.
 */
const CONTACT_WHATSAPP = (process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? "").replace(/[^0-9]/g, "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.help.metaTitle,
    description: dict.help.metaDescription,
    alternates: {
      canonical: `/${locale}/ayuda/`,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}/ayuda/`])),
        "x-default": "/es/ayuda/",
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: dict.help.metaTitle,
      description: dict.help.metaDescription,
      url: `/${locale}/ayuda/`,
      locale: OG_LOCALE[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: dict.help.metaTitle }],
    },
  };
}

export default async function HelpPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const t = dict.help;

  const breadcrumb = buildBreadcrumb([
    { name: dict.nav.home, path: `/${locale}/` },
    { name: t.metaTitle, path: `/${locale}/ayuda/` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-(--color-stone-700) text-(--color-bone-100)">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 90% 10%, rgba(230,126,34,0.28), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-18">
          <Kicker text={t.kicker} tone="dark" />
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] text-(--color-bone-100)/85">{t.subtitle}</p>
        </div>
      </section>

      <section className="bg-(--color-background)">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 sm:py-16 md:grid-cols-[1.3fr_0.7fr]">
          {/* Formulario */}
          <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 shadow-[0_18px_44px_-26px_rgba(40,51,31,0.45)] sm:p-7">
            <HelpForm dict={dict} locale={locale} />
          </div>

          {/* Contacto directo */}
          <aside className="md:pt-2">
            <div className="rounded-2xl bg-(--color-bone-200)/60 p-6">
              <h2 className="font-display text-lg text-(--color-stone-800)">{t.directTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-(--color-stone-500)">{t.directBody}</p>
              {CONTACT_WHATSAPP && (
                <a
                  href={`https://wa.me/${CONTACT_WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-(--color-whatsapp) px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-(--color-whatsapp-hover)"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
