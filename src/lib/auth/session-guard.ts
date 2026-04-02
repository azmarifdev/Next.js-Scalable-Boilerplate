import { cookies } from "next/headers";

import { apiError } from "@/lib/api-response";
import { hasPermission } from "@/lib/auth/rbac";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { verifySessionToken } from "@/lib/session";
import type { Permission } from "@/types/auth";

type SessionPayload = Awaited<ReturnType<typeof verifySessionToken>>;

type RequireSessionResult =
  | { session: NonNullable<SessionPayload>; response: null }
  | { session: null; response: ReturnType<typeof apiError> };

function getCookieFromHeader(header: string | null, key: string): string | null {
  if (!header) {
    return null;
  }

  const cookie = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${key}=`));

  if (!cookie) {
    return null;
  }

  return cookie.slice(key.length + 1);
}

export async function requireSession(options: {
  request?: Request;
  requestId?: string;
  route?: string;
}): Promise<RequireSessionResult> {
  const token =
    getCookieFromHeader(options.request?.headers.get("cookie") ?? null, AUTH_COOKIE_NAME) ??
    (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return {
      session: null,
      response: apiError(
        { code: "UNAUTHORIZED", message: "Authentication required" },
        { status: 401, requestId: options.requestId, route: options.route }
      )
    };
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return {
      session: null,
      response: apiError(
        { code: "INVALID_SESSION", message: "Session is invalid or expired" },
        { status: 401, requestId: options.requestId, route: options.route }
      )
    };
  }

  return {
    session,
    response: null
  };
}

export function requirePermission(
  role: string,
  permission: Permission,
  options: { requestId?: string; route?: string }
) {
  if (role !== "admin" && role !== "user") {
    return apiError(
      { code: "FORBIDDEN", message: "User role is not supported" },
      { status: 403, requestId: options.requestId, route: options.route }
    );
  }

  if (!hasPermission(role, permission)) {
    return apiError(
      { code: "FORBIDDEN", message: "You do not have permission to access this resource" },
      { status: 403, requestId: options.requestId, route: options.route }
    );
  }

  return null;
}
