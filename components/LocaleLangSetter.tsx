"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Actualiza `<html lang>` al locale real de la ruta.
 * Necesario porque el static export emite el root layout con `lang="es"`
 * fijo (Server Component, no recibe params), pero las páginas /en/ y /pt/
 * deben anunciar su locale correcto para SEO y a11y.
 */
export default function LocaleLangSetter({ locale }: { locale: Locale }) {
  useEffect(() => {
    if (typeof document !== "undefined" && document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
}
