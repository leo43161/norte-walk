import type { Dictionary } from "@/lib/i18n";

interface TrustRowProps {
  dict: Dictionary;
  /** Cantidad real de experiencias activas (pasada desde el server). */
  experienceCount: number;
  /** Color de texto base. Default bone-200 para usar sobre el hero stone. */
  tone?: "light" | "dark";
}

/**
 * Trust row debajo del buscador del hero.
 * 4 items separados por cuadrados accent 4×4.
 * Copy real basado en el catálogo, sin inflar números.
 */
export default function TrustRow({ dict, experienceCount, tone = "light" }: TrustRowProps) {
  const textColor = tone === "light" ? "text-(--color-bone-200)/80" : "text-(--color-stone-500)";
  // Si no hay experiencias todavía, saltamos el primer item — no queda bien
  // un "0 experiencias activas".
  const items = [
    experienceCount > 0
      ? dict.trust.itemExperiences.replace("{n}", String(experienceCount))
      : null,
    dict.trust.itemLicensed,
    dict.trust.itemWhatsapp,
    dict.trust.itemNoPayment,
  ].filter((x): x is string => Boolean(x));
  return (
    <ul
      className={`flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] ${textColor}`}
    >
      {items.map((item, idx) => (
        <li key={item} className="flex items-center gap-5">
          {idx > 0 && (
            <span
              aria-hidden
              className="inline-block h-1 w-1 bg-(--color-accent-500)"
            />
          )}
          <span className="font-medium">{item}</span>
        </li>
      ))}
    </ul>
  );
}
