import { apiError } from "@/lib/api-response";

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

export function requireSameOrigin(
  request: Request,
  options: { requestId?: string; route?: string }
): Response | null {
  const origin = normalizeOrigin(request.headers.get("origin"));
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const requestOrigin = host ? `${proto}://${host}` : null;

  if (!origin || !requestOrigin) {
    // Allow non-browser/internal clients that do not set Origin.
    return null;
  }

  const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
  if (!normalizedRequestOrigin || normalizedRequestOrigin !== origin) {
    return apiError(
      { code: "FORBIDDEN_ORIGIN", message: "Cross-origin request rejected" },
      { status: 403, requestId: options.requestId, route: options.route }
    );
  }

  return null;
}
