import { NextRequest, NextResponse } from "next/server";

import {
  AuthEmailExistsError,
  createAuthUser,
  findAuthUserByEmail,
  isAuthDatabaseConfigured
} from "@/lib/auth/auth-user.repository";
import { shouldUseSecureCookies } from "@/lib/auth/cookie-security";
import { hashPassword } from "@/lib/auth/password";
import { createSessionToken } from "@/lib/auth/session";
import { AUTH_COOKIE_NAME, AUTH_SESSION_TTL_SECONDS } from "@/lib/config/constants";
import { setRequestIdHeader } from "@/lib/observability/request-id";
import { withTrace } from "@/lib/observability/tracing";
import { getSafeRedirectPath } from "@/lib/security/redirect";
import { requireSameOrigin } from "@/lib/security/request-origin";
import { apiError, apiSuccess, resolveRequestId } from "@/lib/utils/api-response";
import { registerSchema } from "@/modules/auth/auth.schema";

import { requireInternalBackend, withApiHandler } from "../route-utils";

function prefersHtmlResponse(request: NextRequest): boolean {
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/html");
}

function buildRedirectUrl(request: NextRequest, path: string): URL {
  const originHeader = request.headers.get("origin");
  return new URL(path, originHeader ?? request.nextUrl.origin);
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
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password")
    };
  }

  return request.json().catch(() => null);
}

async function registerHandler(request: NextRequest): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const route = "/api/v1/auth/register";
  const backendError = requireInternalBackend({ requestId, route });
  if (backendError) {
    return backendError;
  }
  const wantsHtml = prefersHtmlResponse(request);
  const successRedirectPath = getSafeRedirectPath(request.nextUrl.searchParams.get("redirect"));

  const originError = requireSameOrigin(request, { requestId, route });
  if (originError) {
    return originError;
  }

  return withTrace(
    "auth.register",
    async () => {
      if (!isAuthDatabaseConfigured()) {
        if (wantsHtml) {
          return redirectWithRequestId(request, "/register?error=service_unavailable", requestId);
        }

        return apiError(
          {
            code: "AUTH_UNAVAILABLE",
            message: "Registration is unavailable. Configure DATABASE_URL first."
          },
          { status: 503, requestId, route }
        );
      }

      const payload = await parsePayload(request);
      const parsed = registerSchema.safeParse(payload);

      if (!parsed.success) {
        if (wantsHtml) {
          return redirectWithRequestId(request, "/register?error=invalid_format", requestId);
        }

        return apiError(
          { code: "VALIDATION_ERROR", message: "Invalid registration data" },
          { status: 400, requestId, route }
        );
      }

      const existingUser = await findAuthUserByEmail(parsed.data.email.toLowerCase());
      if (existingUser) {
        if (wantsHtml) {
          return redirectWithRequestId(request, "/register?error=email_exists", requestId);
        }

        return apiError(
          { code: "EMAIL_EXISTS", message: "Email already exists" },
          { status: 409, requestId, route }
        );
      }

      const passwordHash = await hashPassword(parsed.data.password);
      let createdUser;
      try {
        createdUser = await createAuthUser({
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash,
          role: "user"
        });
      } catch (error) {
        if (error instanceof AuthEmailExistsError) {
          if (wantsHtml) {
            return redirectWithRequestId(request, "/register?error=email_exists", requestId);
          }

          return apiError(
            { code: "EMAIL_EXISTS", message: "Email already exists" },
            { status: 409, requestId, route }
          );
        }

        throw error;
      }

      const user = {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role
      };

      const token = await createSessionToken(
        { sub: user.id, name: user.name, email: user.email, role: user.role },
        AUTH_SESSION_TTL_SECONDS
      );
      const response = wantsHtml
        ? redirectWithRequestId(request, successRedirectPath, requestId)
        : apiSuccess({ user }, { requestId });

      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: shouldUseSecureCookies(),
        sameSite: "strict",
        path: "/",
        maxAge: AUTH_SESSION_TTL_SECONDS
      });

      return response;
    },
    { requestId, route }
  );
}

export const POST = withApiHandler<NextRequest>("/api/v1/auth/register", registerHandler);
