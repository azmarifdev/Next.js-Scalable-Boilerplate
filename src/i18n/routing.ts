import { defineRouting } from "next-intl/routing";

export const locales = ["en", "bn", "es", "fr", "de", "hi", "ja", "ar"] as const;
export const defaultLocale = "bn";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "never"
});
