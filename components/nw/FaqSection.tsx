import JsonLd from "@/components/JsonLd";
import Kicker from "@/components/nw/Kicker";
import Section from "@/components/nw/Section";
import type { Dictionary } from "@/lib/i18n";
import { buildFaqPage } from "@/lib/seo";

/**
 * FAQ del home. Cumple doble función:
 *  - Contenido visible que captura búsquedas informacionales
 *    ("qué es un free walking tour", "excursiones en Tucumán", etc.).
 *  - Fuente única del FAQPage JSON-LD (Google exige que el schema refleje un
 *    FAQ visible en la página) → mismo `dict.faq.items` alimenta ambos.
 *
 * Acordeón nativo con <details>/<summary>: accesible y sin JS, ideal para el
 * export estático.
 */
export default function FaqSection({ dict }: { dict: Dictionary }) {
  const items = dict.faq.items;
  const faqLd = buildFaqPage(items.map((it) => ({ question: it.q, answer: it.a })));

  return (
    <Section tone="bone-2" compact>
      <JsonLd data={faqLd} />
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <header className="md:sticky md:top-24 md:self-start">
          <Kicker text={dict.faq.kicker} />
          <h2 className="font-display mt-4 text-3xl text-(--color-stone-800) sm:text-4xl">
            {dict.faq.title}
          </h2>
          <p className="mt-3 text-[15px] text-(--color-stone-500)">{dict.faq.subtitle}</p>
        </header>

        <ul className="space-y-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="overflow-hidden rounded-2xl border border-(--color-border) bg-white shadow-[0_10px_30px_-24px_rgba(40,51,31,0.5)]"
            >
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-[17px] text-(--color-stone-800) marker:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-(--color-accent-500)/12 text-(--color-accent-600) transition-transform duration-300 group-open:rotate-45"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="px-5 pb-5 text-[15px] leading-relaxed text-(--color-stone-500)">
                  {item.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
