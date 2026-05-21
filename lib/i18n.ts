import esDict from "@/messages/es.json";
import enDict from "@/messages/en.json";
import ptDict from "@/messages/pt.json";

export const LOCALES = ["es", "en", "pt"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

export type Dictionary = typeof esDict;

const DICTS: Record<Locale, Dictionary> = {
  es: esDict,
  en: enDict,
  pt: ptDict,
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
}
