import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import LegalArticle from "@/components/nw/LegalArticle";
import { LOCALES, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getTerms } from "@/lib/legal";
import { OG_LOCALE, SITE_NAME, buildBreadcrumb } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const title = dict.legal.termsTitle;
  return {
    title,
    description: getTerms(locale).intro.slice(0, 160),
    alternates: {
      canonical: `/${locale}/terminos/`,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}/terminos/`])),
        "x-default": "/es/terminos/",
      },
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title,
      url: `/${locale}/terminos/`,
      locale: OG_LOCALE[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const doc = getTerms(locale);

  const breadcrumb = buildBreadcrumb([
    { name: dict.nav.home, path: `/${locale}/` },
    { name: dict.legal.termsTitle, path: `/${locale}/terminos/` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <LegalArticle title={dict.legal.termsTitle} doc={doc} locale={locale} dict={dict} />
    </>
  );
}
