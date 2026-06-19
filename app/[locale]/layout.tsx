import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Analytics from "@/components/Analytics";
import ClarityAnalytics from "@/components/Clarity";
import { CookieBanner } from "@/components/CookieConsent";
import JsonLd from "@/components/JsonLd";
import LocaleLangSetter from "@/components/LocaleLangSetter";
import Footer from "@/components/nw/Footer";
import PreLaunchBanner from "@/components/nw/PreLaunchBanner";
import TopNav from "@/components/nw/TopNav";
import { PRELAUNCH } from "@/lib/launch";
import { LOCALES, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import {
  KEYWORDS,
  OG_LOCALE,
  SITE_NAME,
  buildOrganization,
  buildWebSite,
} from "@/lib/seo";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const ogImage = {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: `${SITE_NAME} — ${dict.hero.kicker}`,
  };
  return {
    title: { default: dict.hero.title, template: `%s · NorteWalk` },
    description: dict.hero.subtitle,
    keywords: KEYWORDS[locale],
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}/`])),
        "x-default": "/es/",
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: dict.hero.title,
      description: dict.hero.subtitle,
      url: `/${locale}/`,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.hero.title,
      description: dict.hero.subtitle,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <JsonLd data={[buildOrganization(locale), buildWebSite(locale)]} />
      <LocaleLangSetter locale={locale} />
      {PRELAUNCH && <PreLaunchBanner locale={locale} dict={dict} />}
      <TopNav locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} />
      <CookieBanner locale={locale} dict={dict} />
      <Analytics />
      <ClarityAnalytics />
    </>
  );
}
