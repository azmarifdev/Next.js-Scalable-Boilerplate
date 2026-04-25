import { env } from "@/lib/config/env";

const fallbackUrl = "http://localhost:3000";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: "Production-ready Next.js-Boilerplate-PostgresQL-Drizzle",
  url: env.NEXT_PUBLIC_SITE_URL || fallbackUrl,
  locales: ["en", "bn"] as const,
  defaultLocale: "en" as const
};
