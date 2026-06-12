import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JoinForm from "@/components/forms/JoinForm";
import JsonLd from "@/components/JsonLd";
import Kicker from "@/components/nw/Kicker";
import { LOCALES, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { OG_LOCALE, SITE_NAME, buildBreadcrumb } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.join.metaTitle,
    description: dict.join.metaDescription,
    alternates: {
      canonical: `/${locale}/sumate/`,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}/sumate/`])),
        "x-default": "/es/sumate/",
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: dict.join.metaTitle,
      description: dict.join.metaDescription,
      url: `/${locale}/sumate/`,
      locale: OG_LOCALE[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: dict.join.metaTitle }],
    },
  };
}

export default async function JoinPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const t = dict.join;

  const benefits = [
    { emoji: "🌎", title: t.benefit1Title, body: t.benefit1Body },
    { emoji: "🗓️", title: t.benefit2Title, body: t.benefit2Body },
    { emoji: "💵", title: t.benefit3Title, body: t.benefit3Body },
  ];

  const breadcrumb = buildBreadcrumb([
    { name: dict.nav.home, path: `/${locale}/` },
    { name: t.metaTitle, path: `/${locale}/sumate/` },
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
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:py-16 md:grid-cols-[1fr_1.1fr]">
          {/* Beneficios */}
          <div>
            <h2 className="font-display text-2xl text-(--color-stone-800)">{t.benefitsTitle}</h2>
            <ul className="mt-5 space-y-4">
              {benefits.map((b) => (
                <li
                  key={b.title}
                  className="flex gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-[0_10px_30px_-24px_rgba(40,51,31,0.5)]"
                >
                  <span
                    aria-hidden
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-(--color-accent-500)/12 text-2xl"
                  >
                    {b.emoji}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-(--color-stone-800)">{b.title}</h3>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-(--color-stone-500)">
                      {b.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Formulario */}
          <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 shadow-[0_18px_44px_-26px_rgba(40,51,31,0.45)] sm:p-7">
            <h2 className="font-display text-2xl text-(--color-stone-800)">{t.formTitle}</h2>
            <div className="mt-5">
              <JoinForm dict={dict} locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
