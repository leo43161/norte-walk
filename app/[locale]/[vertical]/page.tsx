import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Kicker from "@/components/nw/Kicker";
import VerticalFilters from "@/components/VerticalFilters";
import { getExperiences, type ExperienceListItem, type Vertical } from "@/lib/api";
import { LOCALES, getDictionary, isLocale, type Locale } from "@/lib/i18n";

const VERTICALS: readonly Vertical[] = ["fwt", "adventure", "experience", "gastronomy"];

function isVertical(value: string): value is Vertical {
  return (VERTICALS as readonly string[]).includes(value);
}

interface VerticalPageProps {
  params: Promise<{ locale: string; vertical: string }>;
}

// ---------- generateStaticParams ----------

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    VERTICALS.map((vertical) => ({ locale, vertical })),
  );
}

// ---------- generateMetadata ----------

export async function generateMetadata({ params }: VerticalPageProps): Promise<Metadata> {
  const { locale: rawLocale, vertical: rawVertical } = await params;
  if (!isLocale(rawLocale) || !isVertical(rawVertical)) return {};
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const meta = dict.vertical[rawVertical];

  return {
    title: meta.title,
    description: meta.subtitle,
    alternates: {
      canonical: `/${locale}/${rawVertical}/`,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `/${l}/${rawVertical}/`]),
      ),
    },
    openGraph: {
      title: meta.title,
      description: meta.subtitle,
      locale,
      type: "website",
    },
  };
}

// ---------- Page ----------

async function loadVerticalItems(
  vertical: Vertical,
  locale: Locale,
): Promise<{ status: "ok" | "empty" | "error"; items: ExperienceListItem[] }> {
  try {
    const { items } = await getExperiences({ vertical, locale, limit: 200 });
    return { status: items.length > 0 ? "ok" : "empty", items };
  } catch (error) {
    console.error("[vertical] no se pudo cargar el catálogo:", error);
    return { status: "error", items: [] };
  }
}

export default async function VerticalListingPage({ params }: VerticalPageProps) {
  const { locale: rawLocale, vertical: rawVertical } = await params;
  if (!isLocale(rawLocale) || !isVertical(rawVertical)) notFound();
  const locale = rawLocale as Locale;
  const vertical = rawVertical;
  const dict = getDictionary(locale);
  const meta = dict.vertical[vertical];

  const { status, items } = await loadVerticalItems(vertical, locale);

  return (
    <>
      {/* Hero / breadcrumb */}
      <section className="bg-(--color-stone-800) text-(--color-bone-100)">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <nav className="mb-6 font-(family-name:--font-mono) text-[11px] tracking-[0.2em] text-(--color-bone-200)/70">
            <Link href={`/${locale}/`} className="uppercase hover:text-(--color-bone-100)">
              {dict.nav.home}
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="uppercase text-(--color-bone-100)">{dict.nav[vertical]}</span>
          </nav>
          <Kicker text={dict.nav[vertical]} tone="dark" />
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[1.05] sm:text-6xl">
            {meta.title}
          </h1>
          <p className="mt-5 max-w-2xl text-(--color-bone-200)/85">{meta.subtitle}</p>
        </div>
      </section>

      <section className="bg-(--color-background)">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          {status === "ok" && (
            <VerticalFilters items={items} locale={locale} dict={dict} />
          )}

          {status === "empty" && (
            <div className="mx-auto max-w-xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-10 text-center shadow-sm">
              <h2 className="font-display text-2xl text-(--color-foreground)">
                {dict.home.emptyTitle}
              </h2>
              <p className="mt-3 text-(--color-muted)">{dict.home.emptyBody}</p>
              <Link
                href={`/${locale}/`}
                className="mt-6 inline-block rounded-full bg-(--color-stone-700) px-5 py-2 text-sm font-semibold text-(--color-bone-100) hover:bg-(--color-stone-800)"
              >
                {dict.nav.home}
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="mx-auto max-w-xl rounded-2xl border border-(--color-accent-500)/30 bg-(--color-accent-500)/5 p-10 text-center">
              <h2 className="font-display text-2xl text-(--color-foreground)">
                {dict.home.errorTitle}
              </h2>
              <p className="mt-3 text-(--color-muted)">{dict.home.errorBody}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
