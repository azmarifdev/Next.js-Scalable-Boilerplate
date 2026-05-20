import { validateRuntimeConfig } from "@/lib/config/validate";
import { logger } from "@/lib/observability/logger";
import { checkApiSecurity, enhanceApiResponse } from "@/lib/security/api-security";
import { applySecurityHeaders } from "@/lib/security/security-headers";
import { apiError, resolveRequestId } from "@/lib/utils/api-response";

export function withApiHandler<TRequest extends Request>(
  route: string,
  handler: (request: TRequest) => Promise<Response>
) {
  return async (request: TRequest): Promise<Response> => {
    const requestId = resolveRequestId(request.headers);

    try {
      validateRuntimeConfig();

      // ── Global API security check ──────────────────────────────────────
      // Every single API route is protected by:
      //   • IP-based rate limiting (100 req/min for auth, 100 for others)
      //   • Body size validation (100 KB max)
      //   • CSRF protection (for state-changing methods)
      //   • Content-Type validation
      //
      // Note: CSRF is skipped for auth routes because they already have
      // requireSameOrigin() validation within each handler. Auth forms
      // submit directly and don't send CSRF headers yet.
      const isAuthRoute = route.startsWith("/api/v1/auth/");
      const securityCheck = await checkApiSecurity(request, {
        route,
        requestId,
        skipCsrf: isAuthRoute
      });

      if (!securityCheck.passed) {
        return securityCheck.response!;
      }

      const response = await handler(request);

      // ── Apply security headers to every API response ─────────────────
      enhanceApiResponse(response, securityCheck.rateLimit, {
        limit: route.startsWith("/api/v1/auth/") ? 30 : 100
      });

      return response;
    } catch (error) {
      logger.error("api:unhandled", {
        route,
        requestId,
        message: error instanceof Error ? error.message : "Unknown error"
      });

      const errorResponse = apiError(
        {
          code: "INTERNAL_ERROR",
          message: "Unexpected server error"
        },
        {
          status: 500,
          requestId,
          route
        }
      );

      // Apply security headers even on error responses
      applySecurityHeaders(errorResponse);

      return errorResponse;
    }
  };
}

export function requireInternalBackend(options: { requestId: string; route: string }) {
  if (process.env.NEXT_PUBLIC_BACKEND_MODE === "external") {
    return apiError(
      {
        code: "INTERNAL_API_DISABLED",
        message: "Internal API is disabled. Set NEXT_PUBLIC_BACKEND_MODE=internal to enable it."
      },
      {
        status: 404,
        requestId: options.requestId,
        route: options.route
      }
    );
  }

  return null;
}
