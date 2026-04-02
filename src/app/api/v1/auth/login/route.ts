import { NextRequest, NextResponse } from "next/server";

import { withApiHandler } from "@/lib/api-handler";
import { apiError, apiSuccess, resolveRequestId } from "@/lib/api-response";
import {
  findAuthUserByEmail,
  isAuthDatabaseConfigured,
  recordFailedLoginAttempt,
  resetFailedLoginAttempts
} from "@/lib/auth-user.repository";
import { AUTH_COOKIE_NAME, AUTH_SESSION_TTL_SECONDS } from "@/lib/constants";
import { tryDevAuthLogin } from "@/lib/dev-auth-fallback";
import { logger } from "@/lib/observability/logger";
import { setRequestIdHeader } from "@/lib/observability/request-id";
import { withTrace } from "@/lib/observability/tracing";
import { verifyPassword } from "@/lib/password";
import { attachRateLimitHeaders, consumeRateLimit } from "@/lib/rate-limit";
import { getSafeRedirectPath } from "@/lib/security/redirect";
import { requireSameOrigin } from "@/lib/security/request-origin";
import { createSessionToken } from "@/lib/session";
import { loginSchema } from "@/modules/auth/validation";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;
const AUTH_RATE_LIMIT = {
  limit: 15,
  windowMs: 60_000
};

function prefersHtmlResponse(request: NextRequest): boolean {
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/html");
}

function buildRedirectUrl(request: NextRequest, path: string): URL {
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.host;
  const protocol =
    request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");

  return new URL(path, `${protocol}://${host}`);
}

function redirectWithRequestId(
  request: NextRequest,
  path: string,
  requestId: string
): NextResponse {
  const response = NextResponse.redirect(buildRedirectUrl(request, path), 303);
  setRequestIdHeader(response, requestId);
  return response;
}

async function parsePayload(request: NextRequest): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return request.json().catch(() => null);
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return null;
    }

    return {
      email: formData.get("email"),
      password: formData.get("password")
    };
  }

  return request.json().catch(() => null);
}

async function loginHandler(request: NextRequest): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const route = "/api/v1/auth/login";
  const wantsHtml = prefersHtmlResponse(request);
  const successRedirectPath = getSafeRedirectPath(request.nextUrl.searchParams.get("redirect"));

  const originError = requireSameOrigin(request, { requestId, route });
  if (originError) {
    return originError;
  }

  const sourceIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const loginRateLimit = consumeRateLimit(`auth:login:${sourceIp}`, AUTH_RATE_LIMIT);
  if (!loginRateLimit.allowed) {
    const message = "Too many attempts. Please retry in a minute.";
    if (wantsHtml) {
      return redirectWithRequestId(request, "/login?error=rate_limited", requestId);
    }

    const response = apiError({ code: "RATE_LIMITED", message }, { status: 429, requestId, route });
    attachRateLimitHeaders(response, loginRateLimit, AUTH_RATE_LIMIT.limit);
    return response;
  }

  return withTrace(
    "auth.login",
    async () => {
      const isDbConfigured = isAuthDatabaseConfigured();
      const allowDevFallback = process.env.ALLOW_DEMO_AUTH === "true";

      if (!isDbConfigured && !allowDevFallback) {
        if (wantsHtml) {
          return redirectWithRequestId(request, "/login?error=service_unavailable", requestId);
        }

        return apiError(
          {
            code: "AUTH_UNAVAILABLE",
            message: "Authentication is unavailable. Configure DATABASE_URL first."
          },
          { status: 503, requestId, route }
        );
      }

      const payload = await parsePayload(request);
      const parsed = loginSchema.safeParse(payload);

      if (!parsed.success) {
        if (wantsHtml) {
          return redirectWithRequestId(request, "/login?error=invalid_format", requestId);
        }

        return apiError(
          { code: "VALIDATION_ERROR", message: "Invalid credentials format" },
          { status: 400, requestId, route }
        );
      }

      let user: { id: string; name: string; email: string; role: "admin" | "user" } | null = null;

      if (isDbConfigured) {
        const authUser = await findAuthUserByEmail(parsed.data.email.toLowerCase());
        if (!authUser) {
          if (wantsHtml) {
            return redirectWithRequestId(request, "/login?error=invalid_credentials", requestId);
          }
          return apiError(
            { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
            { status: 401, requestId, route }
          );
        }

        if (authUser.lockedUntil && authUser.lockedUntil.getTime() > Date.now()) {
          if (wantsHtml) {
            return redirectWithRequestId(request, "/login?error=rate_limited", requestId);
          }
          return apiError(
            { code: "LOGIN_LOCKED", message: "Too many login attempts. Please try again later." },
            { status: 429, requestId, route }
          );
        }

        const passwordMatches = await verifyPassword(parsed.data.password, authUser.passwordHash);
        if (!passwordMatches) {
          const nextAttempts = authUser.failedLoginAttempts + 1;
          const lockUntil =
            nextAttempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCK_WINDOW_MS) : null;

          await recordFailedLoginAttempt(authUser, lockUntil);
          if (wantsHtml) {
            return redirectWithRequestId(request, "/login?error=invalid_credentials", requestId);
          }
          return apiError(
            { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
            { status: 401, requestId, route }
          );
        }

        await resetFailedLoginAttempts(authUser.id);
        user = {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          role: authUser.role
        };
      } else {
        const devAuth = await tryDevAuthLogin({
          email: parsed.data.email,
          password: parsed.data.password
        });
        if (!devAuth.user) {
          if (wantsHtml) {
            return redirectWithRequestId(request, "/login?error=invalid_credentials", requestId);
          }
          return apiError(
            {
              code: "INVALID_CREDENTIALS",
              message: devAuth.message ?? "Invalid email or password"
            },
            { status: devAuth.status, requestId, route }
          );
        }
        user = devAuth.user;
      }

      const token = await createSessionToken(
        { sub: user.id, name: user.name, email: user.email, role: user.role },
        AUTH_SESSION_TTL_SECONDS
      );
      const response = wantsHtml
        ? redirectWithRequestId(request, successRedirectPath, requestId)
        : apiSuccess({ user }, { requestId });

      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: AUTH_SESSION_TTL_SECONDS
      });

      attachRateLimitHeaders(response, loginRateLimit, AUTH_RATE_LIMIT.limit);
      logger.info("auth:login:success", { requestId, route, userId: user.id, role: user.role });

      return response;
    },
    { requestId, route }
  );
}

export const POST = withApiHandler<NextRequest>("/api/v1/auth/login", loginHandler);
