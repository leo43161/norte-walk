import Link from "next/link";
import { notFound } from "next/navigation";

import ExperienceCard from "@/components/ExperienceCard";
import { getExperiences, isTrue, type ExperienceListItem } from "@/lib/api";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

interface LocaleHomePageProps {
  params: Promise<{ locale: string }>;
}

interface HomeSection {
  kind: "featured" | "topRated";
  items: ExperienceListItem[];
}

async function loadHomeSection(locale: Locale): Promise<{
  status: "ok" | "empty" | "error";
  section?: HomeSection;
}> {
  try {
    const { items } = await getExperiences({ locale, limit: 24 });
    if (items.length === 0) return { status: "empty" };

    const featured = items.filter((e) => isTrue(e.is_featured));
    if (featured.length >= 3) {
      return { status: "ok", section: { kind: "featured", items: featured.slice(0, 6) } };
    }

    // Fallback: si hay menos de 3 destacados, mostrar top-rated por external_rating.
    const ranked = [...items].sort(
      (a, b) => Number(b.external_rating ?? 0) - Number(a.external_rating ?? 0),
    );
    return { status: "ok", section: { kind: "topRated", items: ranked.slice(0, 6) } };
  } catch (error) {
    console.error("[home] no se pudo cargar el catálogo:", error);
    return { status: "error" };
  }
}

export default async function LocaleHomePage({ params }: LocaleHomePageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  const { status, section } = await loadHomeSection(locale);

  return (
    <>
      <section className="bg-(--color-brand-green-800) text-(--color-brand-cream-100)">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <p className="mb-3 text-sm uppercase tracking-widest text-(--color-brand-orange-400)">
            Tucumán · Argentina
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            {dict.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-(--color-brand-cream-300)">
            {dict.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/experience/`}
              className="rounded-full bg-(--color-brand-orange-500) px-6 py-3 text-sm font-semibold text-(--color-brand-green-900) hover:bg-(--color-brand-orange-600) transition-colors"
            >
              {dict.hero.ctaPrimary}
            </Link>
            <Link
              href={`/${locale}/fwt/`}
              className="rounded-full border border-(--color-brand-cream-300)/40 px-6 py-3 text-sm font-semibold text-(--color-brand-cream-100) hover:bg-(--color-brand-cream-100)/10 transition-colors"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-(--color-background)">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          {status === "ok" && section && (
            <>
              <header className="mb-10 max-w-2xl">
                <h2 className="text-3xl font-semibold text-(--color-foreground)">
                  {section.kind === "featured"
                    ? dict.home.featuredTitle
                    : dict.home.topRatedTitle}
                </h2>
                <p className="mt-3 text-(--color-muted)">
                  {section.kind === "featured"
                    ? dict.home.featuredSubtitle
                    : dict.home.topRatedSubtitle}
                </p>
              </header>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((exp) => (
                  <ExperienceCard key={exp.id} exp={exp} locale={locale} dict={dict} />
                ))}
              </div>
            </>
          )}

          {status === "empty" && (
            <div className="mx-auto max-w-xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-10 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-(--color-foreground)">
                {dict.home.emptyTitle}
              </h2>
              <p className="mt-3 text-(--color-muted)">{dict.home.emptyBody}</p>
            </div>
          )}

          {status === "error" && (
            <div className="mx-auto max-w-xl rounded-2xl border border-(--color-brand-orange-500)/30 bg-(--color-brand-orange-500)/5 p-10 text-center">
              <h2 className="text-2xl font-semibold text-(--color-foreground)">
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
