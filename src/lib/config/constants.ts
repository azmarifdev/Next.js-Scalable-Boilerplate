export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? "Next.js-Boilerplate-PostgresQL-Drizzle";
export const API_VERSION = "v1";
export const API_PREFIX = `/api/${API_VERSION}`;

export const AUTH_COOKIE_NAME = "auth_token";

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (!value?.trim()) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const AUTH_SESSION_TTL_SECONDS = parsePositiveInteger(
  process.env.AUTH_SESSION_TTL_SECONDS,
  60 * 60 * 24
);
