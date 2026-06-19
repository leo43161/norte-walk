"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

import { useCookieConsent } from "@/components/CookieConsent";

/**
 * Microsoft Clarity (session replays + heatmaps).
 *
 * Se activa cuando se cumplen TRES condiciones:
 *  - `CLARITY_ID` está seteado (el Project ID de Clarity, Settings > Overview),
 *  - el build es de producción (no manda tráfico de dev/preview a Clarity),
 *  - el visitante aceptó las cookies de analítica (consentimiento opt-in).
 *
 * El paquete `@microsoft/clarity` es 100% client-side: inicializamos en un
 * efecto, compatible con el export estático.
 */
export default function ClarityAnalytics() {
  const { consent } = useCookieConsent();
  const projectId = process.env.CLARITY_ID;

  useEffect(() => {
    if (!projectId || process.env.NODE_ENV !== "production") return;
    if (consent !== "granted") return;
    Clarity.init(projectId);
  }, [projectId, consent]);

  return null;
}
