/**
 * Host absoluto del sitio (sin trailing slash).
 * Lo usan sitemap.ts y robots.ts para emitir URLs absolutas.
 * Fallback al puerto dev por si la var no está seteada — el build no falla,
 * pero el sitemap deployado tendría URLs locales: revisar en prod.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001").replace(/\/$/, "");
