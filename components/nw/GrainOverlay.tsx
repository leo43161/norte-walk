/**
 * Overlay de grano sobre fondos oscuros — agrega textura sutil sin pesar la página.
 *
 * Usa `feTurbulence` SVG con `mix-blend-mode: overlay` y opacidad muy baja.
 * Inline (no asset), no requiere request, viaja en el HTML estático.
 *
 * El brief pide grain en TODOS los bloques oscuros (hero, cómo funciona, footer).
 */
interface GrainOverlayProps {
  className?: string;
  /** Opacidad del overlay. Default 0.07 — el límite antes que se note como ruido. */
  opacity?: number;
}

export default function GrainOverlay({ className, opacity = 0.07 }: GrainOverlayProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ mixBlendMode: "overlay", opacity, pointerEvents: "none" }}
    >
      <filter id="nw-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#nw-grain)" />
    </svg>
  );
}
