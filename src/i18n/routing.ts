import { defineRouting } from "next-intl/routing";

export const locales = ["en", "bn"] as const;
export const defaultLocale = "bn";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "never"
});
