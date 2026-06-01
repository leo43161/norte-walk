/**
 * Silueta de dos cordilleras superpuestas para el fondo del hero.
 *
 * Inspirada en el Aconquija y los cerros previos del valle Calchaquí.
 * `preserveAspectRatio="none"` estira al ancho del contenedor sin
 * deformar significativamente (el SVG tiene proporción aprox correcta).
 *
 * Pensada para `position: absolute; bottom: 0; left: 0; right: 0`.
 */
interface SilhouetteProps {
  className?: string;
  /** Color del trazo / fill (las dos capas usan el mismo color con opacidad distinta). */
  fill?: string;
  opacity?: number;
}

export default function Silhouette({
  className,
  fill = "currentColor",
  opacity = 0.45,
}: SilhouetteProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      {/* Cordillera del fondo (más alta, opacidad media) */}
      <path
        d="M -20 320 L -20 200 L 80 130 L 180 175 L 280 90 L 380 145 L 500 60 L 620 130 L 760 70 L 880 150 L 1020 80 L 1160 170 L 1290 110 L 1440 175 L 1460 320 Z"
        fill={fill}
        opacity="0.55"
      />
      {/* Cordillera del frente (más baja, opacidad plena) */}
      <path
        d="M -20 320 L -20 250 L 60 220 L 160 260 L 260 195 L 380 240 L 500 195 L 620 245 L 760 200 L 880 250 L 1020 215 L 1160 255 L 1300 215 L 1440 245 L 1460 320 Z"
        fill={fill}
      />
    </svg>
  );
}
