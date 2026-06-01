/**
 * Pattern decorativo de montañas para fondos.
 *
 * Inspirado en el símbolo del logo (3 picos) — se repite horizontalmente
 * formando una cordillera estilizada. Pensado para ir absoluto al fondo
 * del hero, con baja opacidad, sin competir con el copy.
 *
 * Render: SVG inline (no asset externo) para que viaje con el HTML estático
 * sin requests adicionales. `preserveAspectRatio="none"` permite estirar
 * libremente al ancho del contenedor.
 */
interface HeroPatternProps {
  className?: string;
  /** Color de las líneas de las montañas. Default: cream (para fondos verde-norte). */
  stroke?: string;
  /** Opacidad del pattern entero. */
  opacity?: number;
}

export default function HeroPattern({
  className,
  stroke = "currentColor",
  opacity = 0.18,
}: HeroPatternProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 500"
      preserveAspectRatio="xMidYEnd slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      {/* Cordillera grande del fondo */}
      <path
        d="M -50 450 L 120 280 L 240 360 L 380 200 L 520 320 L 680 220 L 820 340 L 980 240 L 1140 360 L 1300 260 L 1490 380 L 1490 500 L -50 500 Z"
        fill={stroke}
        opacity="0.35"
      />
      {/* Línea de cordillera media */}
      <path
        d="M -50 480 L 180 340 L 320 410 L 480 270 L 620 380 L 800 290 L 960 400 L 1120 310 L 1300 420 L 1490 320"
        stroke={stroke}
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* Sol/luna a la derecha */}
      <circle cx="1180" cy="120" r="42" stroke={stroke} strokeWidth="2.5" fill="none" opacity="0.5" />
      {/* Líneas topográficas a la izquierda */}
      <g stroke={stroke} strokeWidth="1" fill="none" opacity="0.3">
        <path d="M 100 100 Q 240 120 360 100 T 580 110" />
        <path d="M 80 140 Q 240 165 380 140 T 600 150" />
        <path d="M 60 180 Q 240 210 400 180 T 620 195" />
      </g>
    </svg>
  );
}
