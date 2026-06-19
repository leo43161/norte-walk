"use client";

import Script from "next/script";

import { useCookieConsent } from "@/components/CookieConsent";

/**
 * Google Analytics 4 (gtag.js) adaptado a Next.js.
 *
 * Se activa cuando se cumplen TRES condiciones:
 *  - `NEXT_PUBLIC_GA_ID` está seteado (Measurement ID `G-XXXXXXXXXX`),
 *  - el build es de producción (no manda tráfico de dev/preview a GA),
 *  - el visitante aceptó las cookies de analítica (consentimiento opt-in).
 *
 * Si falta cualquiera, no renderiza nada → GA no se carga.
 */
export default function Analytics() {
  const { consent } = useCookieConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId || process.env.NODE_ENV !== "production") return null;
  if (consent !== "granted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
