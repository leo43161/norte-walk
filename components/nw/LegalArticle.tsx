import Link from "next/link";

import type { Dictionary, Locale } from "@/lib/i18n";
import type { LegalDoc } from "@/lib/legal";

/**
 * Render compartido de las páginas legales (Términos / Privacidad).
 * Hero verde + tabla de contenidos con anclas + secciones. Aviso de borrador
 * (Julito revisa después) y CTA a Ayuda al cierre.
 */
export default function LegalArticle({
  title,
  doc,
  locale,
  dict,
}: {
  title: string;
  doc: LegalDoc;
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-(--color-stone-700) text-(--color-bone-100)">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 90% 10%, rgba(230,126,34,0.25), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
          <nav className="mb-4 text-sm font-medium text-(--color-bone-100)/70">
            <Link href={`/${locale}/`} className="hover:text-(--color-bone-100)">
              {dict.nav.home}
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-(--color-bone-100)">{title}</span>
          </nav>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-(--color-bone-100)/70">
            {dict.legal.updated}: {doc.updated}
          </p>
        </div>
      </section>

      <section className="bg-(--color-background)">
        <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          {/* Aviso (ej: traducción de cortesía en en/pt) */}
          {doc.notice && (
            <p className="mb-8 rounded-xl border border-(--color-accent-500)/25 bg-(--color-accent-500)/5 px-4 py-3 text-sm text-(--color-ink-700)">
              {doc.notice}
            </p>
          )}

          <p className="text-[16px] leading-relaxed text-(--color-ink-700)">{doc.intro}</p>

          {/* Tabla de contenidos */}
          <nav className="mt-8 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-(--color-muted)">
              {dict.legal.tocTitle}
            </p>
            <ol className="mt-3 space-y-1.5">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm font-medium text-(--color-accent-600) hover:text-(--color-accent-700) hover:underline"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Secciones */}
          <div className="mt-10 space-y-9">
            {doc.sections.map((s) => (
              <article key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-display text-xl text-(--color-foreground) sm:text-2xl">
                  {s.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {s.body.map((p, i) => (
                    <p key={i} className="leading-relaxed text-(--color-ink-700)">
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* CTA a Ayuda */}
          <div className="mt-12 rounded-2xl bg-(--color-bone-200)/60 px-6 py-6 text-center">
            <p className="text-sm text-(--color-ink-700)">{dict.help.subtitle}</p>
            <Link
              href={`/${locale}/ayuda/`}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-(--color-stone-700) px-5 py-2.5 text-sm font-semibold text-(--color-bone-100) transition-colors hover:bg-(--color-stone-800)"
            >
              {dict.help.kicker} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
