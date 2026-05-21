import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import LocaleLangSetter from "@/components/LocaleLangSetter";
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
      <header className="border-b border-(--color-border) bg-(--color-brand-green-800) text-(--color-brand-cream-100)">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href={`/${locale}/`} className="font-semibold tracking-tight text-lg">
            NorteWalk
          </Link>
          <ul className="hidden gap-6 text-sm sm:flex">
            <li>
              <Link href={`/${locale}/fwt/`} className="hover:text-(--color-brand-orange-400)">
                {dict.nav.fwt}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/adventure/`}
                className="hover:text-(--color-brand-orange-400)"
              >
                {dict.nav.adventure}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/experience/`}
                className="hover:text-(--color-brand-orange-400)"
              >
                {dict.nav.experience}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/gastronomy/`}
                className="hover:text-(--color-brand-orange-400)"
              >
                {dict.nav.gastronomy}
              </Link>
            </li>
          </ul>
          <ul className="flex gap-3 text-xs uppercase tracking-wider">
            {LOCALES.map((l) => (
              <li key={l}>
                <Link
                  href={`/${l}/`}
                  aria-current={l === locale ? "page" : undefined}
                  className={
                    l === locale
                      ? "text-(--color-brand-orange-400) font-semibold"
                      : "opacity-70 hover:opacity-100"
                  }
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-(--color-border) bg-(--color-brand-cream-200)/40 text-(--color-muted)">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NorteWalk · Tucumán, Argentina</p>
          <p>{dict.locale.name}</p>
        </div>
      </footer>
    </>
  );
}
