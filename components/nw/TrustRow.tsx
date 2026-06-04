import type { Dictionary } from "@/lib/i18n";

interface TrustRowProps {
  dict: Dictionary;
  /** Cantidad real de experiencias activas (pasada desde el server). */
  experienceCount: number;
  /** Color de texto base. Default light para usar sobre el hero verde. */
  tone?: "light" | "dark";
}

/**
 * Fila de confianza debajo del buscador del hero.
 * Cada item es un chip con un check verde-claro/naranja — cercano y tranquilizador.
 */
export default function TrustRow({ dict, experienceCount, tone = "light" }: TrustRowProps) {
  const textColor = tone === "light" ? "text-(--color-bone-100)/90" : "text-(--color-stone-700)";
  const items = [
    experienceCount > 0
      ? dict.trust.itemExperiences.replace("{n}", String(experienceCount))
      : null,
    dict.trust.itemLicensed,
    dict.trust.itemWhatsapp,
    dict.trust.itemNoPayment,
  ].filter((x): x is string => Boolean(x));
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm font-medium ${textColor}`}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-1.5">
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0 text-(--color-accent-400)"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
