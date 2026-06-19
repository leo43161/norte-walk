import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import LegalArticle from "@/components/nw/LegalArticle";
import { LOCALES, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getContentPolicy } from "@/lib/legal";
import { OG_LOCALE, SITE_NAME, buildBreadcrumb } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const title = dict.legal.contentTitle;
  return {
    title,
    description: getContentPolicy(locale).intro.slice(0, 160),
    alternates: {
      canonical: `/${locale}/contenido/`,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}/contenido/`])),
        "x-default": "/es/contenido/",
      },
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title,
      url: `/${locale}/contenido/`,
      locale: OG_LOCALE[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function ContentPolicyPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const doc = getContentPolicy(locale);

  const breadcrumb = buildBreadcrumb([
    { name: dict.nav.home, path: `/${locale}/` },
    { name: dict.legal.contentTitle, path: `/${locale}/contenido/` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <LegalArticle title={dict.legal.contentTitle} doc={doc} locale={locale} dict={dict} />
    </>
  );
}
