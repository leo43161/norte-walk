import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js) adaptado a Next.js.
 *
 * Se activa seteando `NEXT_PUBLIC_GA_ID` (el Measurement ID que te da Google,
 * formato `G-XXXXXXXXXX`) en el entorno de build. Si no está seteado, no
 * renderiza nada (no carga GA en local/preview).
 *
 * Usa next/script con strategy "afterInteractive": el snippet se inyecta en
 * cliente, compatible con el export estático.
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  // Sólo en producción: evita mandar tráfico de dev/preview a GA.
  if (!gaId || process.env.NODE_ENV !== "production") return null;

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
