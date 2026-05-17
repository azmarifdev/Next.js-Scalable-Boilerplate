import { env } from "@/lib/config/env";
import { getSiteOrigin } from "@/lib/config/url";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: "Production-ready Next.js Boilerplate with PostgreSQL and Drizzle ORM.",
  url: getSiteOrigin(),
  locales: ["en", "bn"] as const,
  defaultLocale: "bn" as const
};
