import Image from "next/image";
import Link from "next/link";

import type { ExperienceListItem } from "@/lib/api";
import type { Dictionary, Locale } from "@/lib/i18n";
import { formatDuration, formatPrice, formatRating, resolveImageUrl } from "@/lib/format";

interface ExperienceCardProps {
  exp: ExperienceListItem;
  locale: Locale;
  dict: Dictionary;
}

const VERTICAL_LABELS: Record<ExperienceListItem["vertical"], keyof Dictionary["nav"]> = {
  fwt: "fwt",
  adventure: "adventure",
  experience: "experience",
  gastronomy: "gastronomy",
};

export default function ExperienceCard({ exp, locale, dict }: ExperienceCardProps) {
  const cover = resolveImageUrl(exp.cover_image);
  const price = formatPrice(exp, dict, locale);
  const duration = formatDuration(exp.duration_min, locale);
  const rating = formatRating(exp.external_rating, exp.external_reviews_count);
  const verticalKey = VERTICAL_LABELS[exp.vertical];
  const verticalLabel = dict.nav[verticalKey];

  return (
    <Link
      href={`/${locale}/experiencia/${exp.slug}/`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-(--color-surface) shadow-sm ring-1 ring-(--color-border) transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-(--color-brand-green-100)">
        {cover ? (
          <Image
            src={cover}
            alt={exp.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-(--color-brand-green-600)">
            <span className="text-sm uppercase tracking-widest opacity-60">NorteWalk</span>
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-(--color-brand-green-900)/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-(--color-brand-cream-100) backdrop-blur">
          {verticalLabel}
        </div>
        {exp.type === "free" && (
          <div className="absolute right-3 top-3 rounded-full bg-(--color-brand-orange-500) px-3 py-1 text-xs font-bold uppercase tracking-wider text-(--color-brand-green-900)">
            {dict.price.free}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold leading-snug text-(--color-foreground) group-hover:text-(--color-brand-green-700)">
          {exp.title}
        </h3>
        {exp.short_desc && (
          <p className="line-clamp-2 text-sm text-(--color-muted)">{exp.short_desc}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-(--color-muted)">
          <span className="capitalize">{exp.city.replace(/-/g, " ")}</span>
          {duration && (
            <>
              <span aria-hidden>·</span>
              <span>{duration}</span>
            </>
          )}
          {rating && (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1 text-(--color-foreground)">
                <span aria-hidden className="text-(--color-brand-orange-500)">★</span>
                {rating.label}
              </span>
            </>
          )}
        </div>

        <div className="flex items-baseline justify-between border-t border-(--color-border) pt-3">
          <div>
            <p className="text-base font-bold text-(--color-foreground)">{price.label}</p>
            {price.hint && <p className="text-xs text-(--color-muted)">{price.hint}</p>}
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-(--color-brand-orange-500) group-hover:text-(--color-brand-orange-700)">
            {dict.common.viewMore} →
          </span>
        </div>
      </div>
    </Link>
  );
}
