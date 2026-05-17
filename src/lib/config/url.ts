const DEFAULT_LOCAL_PROTOCOL = "http";
const DEFAULT_LOCAL_HOST = "localhost";
const DEFAULT_LOCAL_PORT = "3000";

interface LocalOriginOptions {
  host?: string;
}

function normalizeOrigin(value: string): string {
  return new URL(value).origin;
}

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function withProtocol(value: string): string {
  return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
}

export function getLocalAppOrigin(options: LocalOriginOptions = {}): string {
  const protocol = process.env.APP_PROTOCOL?.trim() || DEFAULT_LOCAL_PROTOCOL;
  const host = options.host ?? process.env.APP_HOST?.trim() ?? DEFAULT_LOCAL_HOST;
  const port = process.env.PORT?.trim() || DEFAULT_LOCAL_PORT;
  const shouldIncludePort =
    port && !((protocol === "http" && port === "80") || (protocol === "https" && port === "443"));

  return normalizeOrigin(`${protocol}://${host}${shouldIncludePort ? `:${port}` : ""}`);
}

export function getConfiguredSiteOrigin(): string | null {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return normalizeOrigin(configured);
  }

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProductionUrl) {
    return normalizeOrigin(withProtocol(vercelProductionUrl));
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return normalizeOrigin(withProtocol(vercelUrl));
  }

  return null;
}

export function getSiteOrigin(): string {
  return getConfiguredSiteOrigin() ?? getLocalAppOrigin();
}
