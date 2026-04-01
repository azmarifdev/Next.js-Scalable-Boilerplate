import { env } from "@/lib/env";

const fallbackUrl = "http://localhost:3000";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: "Production-ready Next.js starter template",
  url: env.NEXT_PUBLIC_SITE_URL || fallbackUrl,
  locales: ["en", "bn"] as const,
  defaultLocale: "en" as const
};
