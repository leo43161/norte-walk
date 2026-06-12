/**
 * Estado de lanzamiento de NorteWalk.
 *
 * En PRE-LANZAMIENTO el sitio sigue navegable e indexable (bueno para SEO),
 * pero:
 *  - se muestra un banner global de "pre-lanzamiento / beta",
 *  - el botón "Reservar" de cada experiencia se reemplaza por una lista de
 *    espera ("Avisame cuando abra") en vez de tomar reservas reales,
 *  - el home suma una sección de anticipación + formulario de sugerencias.
 *
 * Para LANZAR: setear `NEXT_PUBLIC_PRELAUNCH=false` en el entorno de build y
 * rebuild (export estático). Por defecto está ENCENDIDO.
 *
 * Es `NEXT_PUBLIC_*` para que el valor quede inlineado también en los
 * componentes cliente del bundle estático.
 */
export const PRELAUNCH =
  (process.env.NEXT_PUBLIC_PRELAUNCH ?? "true").toLowerCase() !== "false";
