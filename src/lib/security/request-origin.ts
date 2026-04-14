import { apiError } from "@/lib/utils/api-response";

function normalizeOrigin(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function isLoopbackHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "::1"
  );
}

function parseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function requireSameOrigin(
  request: Request,
  options: { requestId?: string; route?: string }
): Response | null {
  const origin = normalizeOrigin(request.headers.get("origin"));
  const requestOrigin = normalizeOrigin(request.url);

  if (!origin || !requestOrigin) {
    // Allow non-browser/internal clients that do not set Origin.
    return null;
  }

  if (requestOrigin === origin) {
    return null;
  }

  const requestOriginUrl = parseUrl(requestOrigin);
  const originUrl = parseUrl(origin);
  const sameLoopbackOrigin =
    requestOriginUrl &&
    originUrl &&
    isLoopbackHost(requestOriginUrl.hostname) &&
    isLoopbackHost(originUrl.hostname);

  if (!sameLoopbackOrigin) {
    return apiError(
      { code: "FORBIDDEN_ORIGIN", message: "Cross-origin request rejected" },
      { status: 403, requestId: options.requestId, route: options.route }
    );
  }

  return null;
}
