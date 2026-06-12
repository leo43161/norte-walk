import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import Kicker from "@/components/nw/Kicker";
import VerticalFilters from "@/components/VerticalFilters";
import { getExperiences, type ExperienceListItem, type Vertical } from "@/lib/api";
import { LOCALES, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import {
  OG_LOCALE,
  SITE_NAME,
  buildBreadcrumb,
  buildItemList,
} from "@/lib/seo";

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
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}/${rawVertical}/`])),
        "x-default": `/es/${rawVertical}/`,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: meta.title,
      description: meta.subtitle,
      url: `/${locale}/${rawVertical}/`,
      locale: OG_LOCALE[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.subtitle,
      images: ["/og-image.png"],
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

  const breadcrumb = buildBreadcrumb([
    { name: dict.nav.home, path: `/${locale}/` },
    { name: dict.nav[vertical], path: `/${locale}/${vertical}/` },
  ]);
  const itemList =
    status === "ok" && items.length > 0
      ? buildItemList(
          meta.title,
          items.map((it) => ({
            name: it.title,
            path: `/${locale}/experiencia/${it.slug}/`,
          })),
        )
      : null;

  return (
    <>
      <JsonLd data={itemList ? [breadcrumb, itemList] : [breadcrumb]} />

      {/* Hero / breadcrumb */}
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
          <nav className="mb-5 text-sm font-medium text-(--color-bone-100)/70">
            <Link href={`/${locale}/`} className="hover:text-(--color-bone-100)">
              {dict.nav.home}
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-(--color-bone-100)">{dict.nav[vertical]}</span>
          </nav>
          <Kicker text={dict.nav[vertical]} tone="dark" />
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">
            {meta.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] text-(--color-bone-100)/85">{meta.subtitle}</p>
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
