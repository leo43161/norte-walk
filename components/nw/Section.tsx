/**
 * Wrapper de sección con padding y contenedor consistentes.
 * Acepta un tone para mapear al background correspondiente.
 */
type Tone = "bone" | "bone-2" | "stone" | "surface";

interface SectionProps {
  children: React.ReactNode;
  tone?: Tone;
  /** id útil para anchors (#how-it-works, #why) */
  id?: string;
  className?: string;
  /** padding vertical compacto (default false → py-20 sm:py-24) */
  compact?: boolean;
}

const TONE_BG: Record<Tone, string> = {
  bone: "bg-(--color-bone-100)",
  "bone-2": "bg-(--color-bone-200)",
  stone: "bg-(--color-stone-800) text-(--color-bone-100)",
  surface: "bg-(--color-surface)",
};

export default function Section({
  children,
  tone = "bone",
  id,
  className = "",
  compact = false,
}: SectionProps) {
  const padding = compact ? "py-14 sm:py-16" : "py-20 sm:py-24";
  return (
    <section
      id={id}
      className={`relative isolate ${TONE_BG[tone]} ${className}`}
    >
      <div className={`mx-auto max-w-6xl px-6 ${padding}`}>{children}</div>
    </section>
  );
}
