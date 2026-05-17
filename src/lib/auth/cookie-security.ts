export function shouldUseSecureCookies(): boolean {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const isHttps = siteUrl.startsWith("https://");

  return process.env.NODE_ENV === "production" || isHttps;
}
