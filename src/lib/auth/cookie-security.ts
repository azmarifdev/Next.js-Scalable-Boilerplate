import { getSiteOrigin } from "@/lib/config/url";

export function shouldUseSecureCookies(): boolean {
  const siteUrl = getSiteOrigin();
  const isHttps = siteUrl.startsWith("https://");

  return process.env.NODE_ENV === "production" || isHttps;
}
