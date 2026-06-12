import SuggestionForm from "@/components/forms/SuggestionForm";
import GrainOverlay from "@/components/nw/GrainOverlay";
import Kicker from "@/components/nw/Kicker";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * Sección de anticipación del home (sólo en pre-lanzamiento).
 * Comunica "estamos por largar" y capta sugerencias + emails con el
 * SuggestionForm. Ancla #sugerencias (target del banner global).
 */
export default function PreLaunchSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.prelaunch;

  return (
    <section
      id="sugerencias"
      className="relative isolate scroll-mt-24 overflow-hidden bg-(--color-stone-800) text-(--color-bone-100)"
    >
      <GrainOverlay className="absolute inset-0 h-full w-full text-(--color-bone-100)" opacity={0.05} />
      <div
        aria-hidden
        className="absolute -right-24 -top-24 -z-0 h-80 w-80 rounded-full bg-(--color-accent-500)/15 blur-2xl"
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:py-20 md:grid-cols-2 md:items-center">
        {/* Copy */}
        <div>
          <Kicker text={t.homeKicker} tone="dark" />
          <h2 className="font-display mt-4 text-3xl leading-tight sm:text-[40px]">
            {t.homeTitle}
          </h2>
          <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-(--color-bone-100)/80">
            {t.homeBody}
          </p>
        </div>

        {/* Formulario */}
        <div className="rounded-3xl bg-(--color-surface) p-6 text-(--color-foreground) shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] sm:p-7">
          <SuggestionForm dict={dict} locale={locale} />
          <p className="mt-3 text-center text-xs text-(--color-muted)">{t.homeNote}</p>
        </div>
      </div>
    </section>
  );
}
