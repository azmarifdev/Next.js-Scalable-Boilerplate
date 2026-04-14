import { appConfig } from "@/lib/config/app-config";
import { API_PREFIX } from "@/lib/config/constants";
import { env } from "@/lib/config/env";

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
  const hasApiPrefix = normalized === API_PREFIX || normalized.startsWith(`${API_PREFIX}/`);

  if (hasApiPrefix) {
    if (!base) {
      return normalized;
    }

    return `${base}${normalized}`;
  }

  if (!base) {
    return `${API_PREFIX}${normalized}`;
  }

  return `${base}${API_PREFIX}${normalized}`;
}

export function getGraphqlEndpoint(): string {
  if (appConfig.backendMode === "internal") {
    return "/graphql";
  }

  const base = getApiBaseUrl();
  if (!base) {
    return "/graphql";
  }

  return `${base}/graphql`;
}

export function assertExternalApiBaseUrlConfigured(): void {
  if (appConfig.backendMode !== "external") {
    return;
  }

  const base = env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is required when NEXT_PUBLIC_BACKEND_MODE=external");
  }
}
