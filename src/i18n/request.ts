import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { i18nConfig } from "@/i18n/config";

type Locale = (typeof i18nConfig.locales)[number];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const selectedLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = i18nConfig.locales.includes(selectedLocale as Locale)
    ? (selectedLocale as Locale)
    : i18nConfig.defaultLocale;

  return {
    locale,
    messages: (await import(`@/i18n/messages/${locale}.json`)).default
  };
});
