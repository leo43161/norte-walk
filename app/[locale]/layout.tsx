import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LocaleLangSetter from "@/components/LocaleLangSetter";
import Footer from "@/components/nw/Footer";
import TopNav from "@/components/nw/TopNav";
import { LOCALES, getDictionary, isLocale, type Locale } from "@/lib/i18n";

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
  return {
    title: { default: dict.hero.title, template: `%s · NorteWalk` },
    description: dict.hero.subtitle,
    alternates: {
      canonical: `/${locale}/`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/`])),
    },
    openGraph: {
      title: dict.hero.title,
      description: dict.hero.subtitle,
      locale,
      type: "website",
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
      <LocaleLangSetter locale={locale} />
      <TopNav locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
