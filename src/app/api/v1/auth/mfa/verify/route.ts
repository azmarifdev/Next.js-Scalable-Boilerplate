import { shouldUseSecureCookies } from "@/lib/auth/cookie-security";
import { createSessionToken } from "@/lib/auth/session";
import { requireSession } from "@/lib/auth/session-guard";
import { isAdminStepUpEnabled } from "@/lib/auth/step-up";
import { AUTH_COOKIE_NAME, AUTH_SESSION_TTL_SECONDS } from "@/lib/config/constants";
import { attachRateLimitHeaders, consumeRateLimit } from "@/lib/security/rate-limit";
import { requireSameOrigin } from "@/lib/security/request-origin";
import { apiError, apiSuccess, resolveRequestId } from "@/lib/utils/api-response";

import { requireInternalBackend, withApiHandler } from "../../route-utils";

interface MfaVerifyPayload {
  code?: string;
}

const MFA_VERIFY_RATE_LIMIT = {
  limit: 5,
  windowMs: 5 * 60_000
};

async function parsePayload(request: Request): Promise<MfaVerifyPayload> {
  return request.json().catch(() => ({}));
}

function resolveExpectedCode(): string | null {
  if (process.env.AUTH_MFA_STATIC_CODE) {
    return process.env.AUTH_MFA_STATIC_CODE;
  }

  if (process.env.ALLOW_INSECURE_DEV_AUTH === "true") {
    return "000000";
  }

  return null;
}

async function verifyWithExternalMfaProvider(input: {
  code: string;
  userId: string;
  email: string;
  requestId: string;
}): Promise<boolean | null> {
  const verifyUrl = process.env.AUTH_MFA_VERIFY_URL?.trim();
  if (!verifyUrl) {
    return null;
  }

  const bearerToken = process.env.AUTH_MFA_VERIFY_BEARER_TOKEN?.trim();
  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(bearerToken ? { authorization: `Bearer ${bearerToken}` } : {})
    },
    body: JSON.stringify({
      code: input.code,
      userId: input.userId,
      email: input.email,
      requestId: input.requestId
    }),
    cache: "no-store"
  }).catch(() => null);

  if (!response) {
    return false;
  }

  if (!response.ok) {
    return false;
  }

  const payload = (await response.json().catch(() => null)) as {
    verified?: boolean;
    success?: boolean;
    data?: { verified?: boolean };
  } | null;
  if (!payload) {
    return false;
  }

  if (typeof payload.verified === "boolean") {
    return payload.verified;
  }

  if (payload.success === true && typeof payload.data?.verified === "boolean") {
    return payload.data.verified;
  }

  return false;
}

async function verifyMfaHandler(request: Request): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const route = "/api/v1/auth/mfa/verify";
  const backendError = requireInternalBackend({ requestId, route });
  if (backendError) {
    return backendError;
  }

  const originError = requireSameOrigin(request, { requestId, route });
  if (originError) {
    return originError;
  }

  const { session, response } = await requireSession({ request, requestId, route });
  if (!session) {
    return response;
  }

  if (session.role !== "admin") {
    return apiError(
      { code: "FORBIDDEN", message: "MFA step-up is only required for admin sessions" },
      { status: 403, requestId, route }
    );
  }

  if (!isAdminStepUpEnabled()) {
    return apiSuccess({ verified: true, skipped: true }, { requestId });
  }

  const rateLimitKey = `auth:mfa:verify:${session.sub}`;
  const rateLimitResult = consumeRateLimit(rateLimitKey, MFA_VERIFY_RATE_LIMIT);
  if (!rateLimitResult.allowed) {
    const rateLimitedResponse = apiError(
      { code: "RATE_LIMITED", message: "Too many MFA attempts. Please retry later." },
      { status: 429, requestId, route }
    );
    attachRateLimitHeaders(rateLimitedResponse, rateLimitResult, MFA_VERIFY_RATE_LIMIT.limit);
    return rateLimitedResponse;
  }

  const payload = await parsePayload(request);
  if (!payload.code) {
    const invalidCodeResponse = apiError(
      { code: "MFA_INVALID_CODE", message: "Invalid MFA verification code" },
      { status: 401, requestId, route }
    );
    attachRateLimitHeaders(invalidCodeResponse, rateLimitResult, MFA_VERIFY_RATE_LIMIT.limit);
    return invalidCodeResponse;
  }

  const externalVerified = await verifyWithExternalMfaProvider({
    code: payload.code,
    userId: session.sub,
    email: session.email,
    requestId
  });
  if (externalVerified === false) {
    const invalidCodeResponse = apiError(
      { code: "MFA_INVALID_CODE", message: "Invalid MFA verification code" },
      { status: 401, requestId, route }
    );
    attachRateLimitHeaders(invalidCodeResponse, rateLimitResult, MFA_VERIFY_RATE_LIMIT.limit);
    return invalidCodeResponse;
  }

  if (externalVerified === null) {
    const expectedCode = resolveExpectedCode();
    const staticAllowedInProd = process.env.ALLOW_STATIC_MFA_IN_PRODUCTION === "true";
    const isProduction = process.env.NODE_ENV === "production";
    if (!expectedCode) {
      return apiError(
        {
          code: "MFA_NOT_CONFIGURED",
          message:
            "Set AUTH_MFA_VERIFY_URL (recommended) or AUTH_MFA_STATIC_CODE for local-only fallback."
        },
        { status: 503, requestId, route }
      );
    }

    if (isProduction && !staticAllowedInProd) {
      return apiError(
        {
          code: "MFA_NOT_CONFIGURED",
          message:
            "Static MFA code is disabled in production. Configure AUTH_MFA_VERIFY_URL or set ALLOW_STATIC_MFA_IN_PRODUCTION=true (not recommended)."
        },
        { status: 503, requestId, route }
      );
    }

    if (payload.code !== expectedCode) {
      const invalidCodeResponse = apiError(
        { code: "MFA_INVALID_CODE", message: "Invalid MFA verification code" },
        { status: 401, requestId, route }
      );
      attachRateLimitHeaders(invalidCodeResponse, rateLimitResult, MFA_VERIFY_RATE_LIMIT.limit);
      return invalidCodeResponse;
    }
  }

  const token = await createSessionToken(
    {
      sub: session.sub,
      name: session.name,
      email: session.email,
      role: session.role,
      mfaVerified: true,
      mfaVerifiedAt: Math.floor(Date.now() / 1000)
    },
    AUTH_SESSION_TTL_SECONDS
  );

  const verifyResponse = apiSuccess({ verified: true }, { requestId });
  attachRateLimitHeaders(verifyResponse, rateLimitResult, MFA_VERIFY_RATE_LIMIT.limit);
  verifyResponse.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: shouldUseSecureCookies(),
    sameSite: "strict",
    path: "/",
    maxAge: AUTH_SESSION_TTL_SECONDS
  });

  return verifyResponse;
}

export const POST = withApiHandler("/api/v1/auth/mfa/verify", verifyMfaHandler);
