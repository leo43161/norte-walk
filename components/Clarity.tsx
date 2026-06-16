"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

/**
 * Microsoft Clarity (session replays + heatmaps).
 *
 * Se activa seteando `NEXT_PUBLIC_CLARITY_ID` (el Project ID que te da Clarity
 * en Settings > Overview) en el entorno de build. Si no está seteado, no hace
 * nada (no carga Clarity en local/preview).
 *
 * El paquete `@microsoft/clarity` es 100% client-side: inicializamos en un
 * efecto, compatible con el export estático.
 */
export default function ClarityAnalytics() {
  const projectId = process.env.CLARITY_ID;

  useEffect(() => {
    // Sólo en producción: evita mandar tráfico de dev/preview a Clarity.
    if (!projectId || process.env.NODE_ENV !== "production") return;
    Clarity.init(projectId);
  }, [projectId]);

  return null;
}
