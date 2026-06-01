/**
 * Kicker recurrente del sistema Paseo Norte.
 *
 * Formato: [barra horizontal] · número · texto
 * Mono uppercase, tracking abierto, color stone-2 (light) o accent (dark).
 *
 * Ej: `<Kicker number="03" text="Tours destacados" />`
 *     → "—— 03 · TOURS DESTACADOS"
 */
interface KickerProps {
  /** Número en formato "01", "02", etc. Opcional. */
  number?: string;
  text: string;
  /** "light" sobre fondos claros (default) | "dark" sobre fondos oscuros */
  tone?: "light" | "dark";
  className?: string;
}

export default function Kicker({ number, text, tone = "light", className = "" }: KickerProps) {
  const color = tone === "dark" ? "text-(--color-bone-200)/80" : "text-(--color-stone-500)";
  const barColor = "bg-(--color-accent-500)";
  return (
    <div
      className={`flex items-center gap-3 font-(family-name:--font-mono) text-[11px] uppercase tracking-[0.25em] ${color} ${className}`}
    >
      <span aria-hidden className={`h-px w-7 ${barColor}`} />
      {number && <span>{number}</span>}
      {number && <span aria-hidden className="opacity-50">·</span>}
      <span>{text}</span>
    </div>
  );
}
