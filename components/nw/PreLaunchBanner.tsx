import Link from "next/link";

import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * Banda global de pre-lanzamiento. Comunica que NorteWalk está por abrir y
 * lleva al formulario de sugerencias/aviso del home (#sugerencias).
 *
 * Cálida (crema/sol) para diferenciarse de la barra verde de navegación que
 * va justo debajo. Sólo se monta cuando PRELAUNCH está activo (lo decide el
 * layout que la renderiza).
 */
export default function PreLaunchBanner({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div className="relative z-40 bg-(--color-sun-300) text-(--color-stone-800)">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center sm:px-6">
        <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-(--color-stone-800) px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-(--color-sun-300)">
          <span aria-hidden className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-(--color-accent-400)" />
          {dict.prelaunch.badge}
        </span>
        <p className="text-[13px] font-medium leading-snug">
          {dict.prelaunch.bannerText}{" "}
          <Link
            href={`/${locale}/#sugerencias`}
            className="font-bold text-(--color-accent-700) underline decoration-2 underline-offset-2 hover:text-(--color-accent-800)"
          >
            {dict.prelaunch.bannerCta} →
          </Link>
        </p>
      </div>
    </div>
  );
}
