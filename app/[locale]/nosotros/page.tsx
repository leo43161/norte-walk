import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import GrainOverlay from "@/components/nw/GrainOverlay";
import JsonLd from "@/components/JsonLd";
import { getAbout } from "@/lib/about";
import { LOCALES, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { OG_LOCALE, SITE_NAME, buildBreadcrumb } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const about = getAbout(locale);
  return {
    title: about.metaTitle,
    description: about.metaDescription,
    alternates: {
      canonical: `/${locale}/nosotros/`,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}/nosotros/`])),
        "x-default": "/es/nosotros/",
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: about.metaTitle,
      description: about.metaDescription,
      url: `/${locale}/nosotros/`,
      locale: OG_LOCALE[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: about.metaTitle }],
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const about = getAbout(locale);

  const breadcrumb = buildBreadcrumb([
    { name: dict.nav.home, path: `/${locale}/` },
    { name: about.metaTitle, path: `/${locale}/nosotros/` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-(--color-stone-700) text-(--color-bone-100)">
        <GrainOverlay
          className="absolute inset-0 h-full w-full text-(--color-bone-100)"
          opacity={0.04}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 90% 10%, rgba(230,126,34,0.28), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <nav className="mb-4 text-sm font-medium text-(--color-bone-100)/70">
            <Link href={`/${locale}/`} className="hover:text-(--color-bone-100)">
              {dict.nav.home}
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-(--color-bone-100)">{about.metaTitle}</span>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-wide text-(--color-accent-300)">
            {about.kicker}
          </p>
          <h1 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
            {about.headline}
          </h1>
        </div>
      </section>

      {/* Secciones de texto */}
      <section className="bg-(--color-background)">
        <div className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
          <div className="space-y-12">
            {about.sections.map((s) => (
              <article key={s.title}>
                <h2 className="font-display text-2xl text-(--color-foreground) sm:text-3xl">
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-[16px] leading-relaxed text-(--color-ink-700)">
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="bg-(--color-bone-100)">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
          <h2 className="font-display text-center text-2xl text-(--color-stone-800) sm:text-3xl">
            {about.pillarsTitle}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {about.pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-[20px] bg-white p-7 shadow-[0_10px_30px_-20px_rgba(40,51,31,0.45)] ring-1 ring-(--color-border)"
              >
                <span
                  aria-hidden
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-accent-500)/12 text-2xl"
                >
                  {p.icon}
                </span>
                <h3 className="font-display mt-4 text-lg text-(--color-stone-800)">{p.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-(--color-stone-500)">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA de cierre */}
      <section className="bg-(--color-bone-100)">
        <div className="mx-auto max-w-6xl px-6 pb-16 sm:pb-20">
          <div className="relative isolate overflow-hidden rounded-[28px] bg-(--color-accent-500) px-8 py-12 text-center text-white shadow-[0_24px_60px_-28px_rgba(211,84,0,0.7)] sm:px-12 sm:py-14">
            <h2 className="font-display text-3xl leading-tight sm:text-[38px]">{about.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-[16px] text-white/90">{about.ctaBody}</p>
            <Link
              href={`/${locale}/fwt/`}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-bold text-(--color-accent-600) shadow-sm transition-transform hover:-translate-y-0.5"
            >
              {about.ctaButton} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
