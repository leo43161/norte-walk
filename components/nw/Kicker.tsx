/**
 * Etiqueta-pastilla amigable del sistema "Norte Cálido".
 *
 * Antes era un kicker editorial en mono mayúsculas con tracking ancho
 * ("—— 03 · TOURS DESTACADOS"), que sonaba técnico. Ahora es un chip
 * redondeado, cercano, con un puntito naranja.
 *
 * El prop `number` se mantiene por compatibilidad con los llamadores, pero
 * ya no se muestra (sacamos la numeración editorial).
 */
interface KickerProps {
  /** @deprecated ya no se renderiza — se mantiene por compatibilidad. */
  number?: string;
  text: string;
  /** "light" sobre fondos claros (default) | "dark" sobre fondos oscuros */
  tone?: "light" | "dark";
  className?: string;
}

export default function Kicker({ text, tone = "light", className = "" }: KickerProps) {
  const styles =
    tone === "dark"
      ? "bg-(--color-bone-100)/10 text-(--color-bone-100)"
      : "bg-(--color-accent-500)/12 text-(--color-accent-700)";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${styles} ${className}`}
    >
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-(--color-accent-500)" />
      {text}
    </span>
  );
}
