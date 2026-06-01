/**
 * Logo de NorteWalk extraído del HTML de identidad.
 *
 * Símbolo: 3 picos de montaña (línea crema) + sol (círculo naranja) sobre
 * un cuadro verde-norte. ViewBox original 500×500, fondo `stone-800`.
 *
 * Variants:
 *  - "full"  → logo + wordmark a la derecha (default)
 *  - "mark"  → solo el símbolo cuadrado
 *  - "wordmark" → solo el texto
 *
 * Props:
 *  - tone: "color" (paleta de marca) | "mono-light" (todo crema, para fondos oscuros) | "mono-dark" (todo verde, para fondos claros)
 *  - size: alto en px del símbolo (el ancho se calcula proporcional)
 */
interface LogoProps {
  variant?: "full" | "mark" | "wordmark";
  tone?: "color" | "mono-light" | "mono-dark";
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export default function NorteWalkLogo({
  variant = "full",
  tone = "color",
  size = 32,
  className,
  ariaLabel = "NorteWalk",
}: LogoProps) {
  const colors =
    tone === "color"
      ? { bg: "#00000000", sun: "#E67E22", mountain: "#E5D9B6", word: "currentColor" }
      : tone === "mono-light"
        ? { bg: "transparent", sun: "currentColor", mountain: "currentColor", word: "currentColor" }
        : { bg: "transparent", sun: "#40513B", mountain: "#40513B", word: "#40513B" };

  const Mark = (
    <svg
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      aria-hidden={variant === "full"}
      role={variant === "mark" ? "img" : undefined}
      aria-label={variant === "mark" ? ariaLabel : undefined}
      style={{ flexShrink: 0 }}
    >
      <rect width="500" height="500" rx="80" fill={colors.bg} />
      <circle cx="349.678" cy="140.613" r="40.211" fill={colors.sun} />
      <path
        d="M 24.889 403.536 L 148.617 217.945 L 241.414 295.274 L 318.745 202.477 L 457.94 403.536"
        stroke={colors.mountain}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeWidth={28}
      />
    </svg>
  );

  if (variant === "mark") {
    return <span className={className}>{Mark}</span>;
  }

  if (variant === "wordmark") {
    return (
      <span
        className={className}
        style={{ fontFamily: "var(--font-display), Georgia, serif", letterSpacing: "-0.01em" }}
        aria-label={ariaLabel}
      >
        NorteWalk
      </span>
    );
  }

  // full
  return (
    <span
      className={className}
      role="img"
      aria-label={ariaLabel}
      style={{ display: "inline-flex", alignItems: "center", gap: size * 0.35 }}
    >
      {Mark}
      <span
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          color: colors.word,
          fontSize: size * 0.66,
          fontWeight: 500,
          letterSpacing: "-0.015em",
          lineHeight: 1,
        }}
      >
        NorteWalk
      </span>
    </span>
  );
}
