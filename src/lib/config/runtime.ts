import { appConfig } from "@/lib/config/app-config";
import { API_PREFIX } from "@/lib/constants";
import { env } from "@/lib/env";

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getApiBaseUrl(): string {
  if (appConfig.backendMode === "internal") {
    return "";
  }

  const configuredBase = env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!configuredBase) {
    return "";
  }

  return trimTrailingSlash(configuredBase);
}

export function resolveApiEndpoint(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getApiBaseUrl();

  if (!base) {
    return `${API_PREFIX}${normalized}`;
  }

  return `${base}${API_PREFIX}${normalized}`;
}

export function getGraphqlEndpoint(): string {
  const base = getApiBaseUrl();
  return base ? `${base}/graphql` : "/graphql";
}
