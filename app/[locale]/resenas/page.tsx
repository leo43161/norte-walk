import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import LegalArticle from "@/components/nw/LegalArticle";
import { LOCALES, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getReviews } from "@/lib/legal";
import { OG_LOCALE, SITE_NAME, buildBreadcrumb } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const title = dict.legal.reviewsTitle;
  return {
    title,
    description: getReviews(locale).intro.slice(0, 160),
    alternates: {
      canonical: `/${locale}/resenas/`,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}/resenas/`])),
        "x-default": "/es/resenas/",
      },
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title,
      url: `/${locale}/resenas/`,
      locale: OG_LOCALE[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function ReviewsPolicyPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const doc = getReviews(locale);

  const breadcrumb = buildBreadcrumb([
    { name: dict.nav.home, path: `/${locale}/` },
    { name: dict.legal.reviewsTitle, path: `/${locale}/resenas/` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <LegalArticle title={dict.legal.reviewsTitle} doc={doc} locale={locale} dict={dict} />
    </>
  );
}
