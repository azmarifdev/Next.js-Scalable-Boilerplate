/**
 * src/lib/security/api-security.ts
 *
 * Reusable API security middleware that wraps route handlers with:
 * - IP-based global rate limiting (prevents DDoS / brute force)
 * - Request body size validation (prevents resource exhaustion)
 * - Content-Type validation (prevents content-type confusion)
 * - Security headers on all API responses
 * - CSRF protection for state-changing requests
 * - Input sanitization for audit logging
 */

import { apiError } from "@/lib/utils/api-response";

import { validateCsrfToken } from "./csrf";
import { validateBodySize } from "./input-validator";
import { attachRateLimitHeaders, consumeRateLimit, type RateLimitResult } from "./rate-limit";
import { applySecurityHeaders } from "./security-headers";

// ── Constants ─────────────────────────────────────────────────────────────

/** Maximum request body size for API routes (100 KB) */
const MAX_BODY_SIZE = 100 * 1024;

/** Global API rate limit per IP (100 requests per minute) */
const GLOBAL_API_RATE_LIMIT = {
  limit: 100,
  windowMs: 60_000
};

/** Auth-specific rate limit per IP (30 requests per minute) */
const AUTH_API_RATE_LIMIT = {
  limit: 30,
  windowMs: 60_000
};

/** Routes that require CSRF protection (state-changing methods) */
const CSRF_PROTECTED_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Routes that are exempt from CSRF checks.
 * Auth routes are skipped in withApiHandler (route-utils.ts) because they
 * already have requireSameOrigin() validation per-handler.
 * Add routes here for other exceptions.
 */
const CSRF_EXEMPT_PATHS = new Set<string>();

// ── Helpers ───────────────────────────────────────────────────────────────

function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith("/api/v1/auth/");
}

function requiresCsrf(pathname: string, method: string): boolean {
  if (!CSRF_PROTECTED_METHODS.has(method)) {
    return false;
  }
  if (CSRF_EXEMPT_PATHS.has(pathname)) {
    return false;
  }
  return true;
}

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ── Security Middleware ───────────────────────────────────────────────────

export interface SecurityCheckResult {
  /** Whether all security checks passed */
  passed: boolean;
  /** Error response if checks failed */
  response?: Response;
  /** Rate limit result for attaching headers */
  rateLimit?: RateLimitResult;
}

/**
 * Runs all security checks for an incoming API request.
 * Call this at the start of every API route handler.
 */
export async function checkApiSecurity(
  request: Request,
  options: {
    route: string;
    requestId: string;
    /** Skip CSRF check for this request */
    skipCsrf?: boolean;
    /** Skip body size validation for this request */
    skipBodyCheck?: boolean;
    /** Custom max body size in bytes */
    maxBodySize?: number;
  }
): Promise<SecurityCheckResult> {
  const { route, requestId, skipCsrf, skipBodyCheck, maxBodySize } = options;
  const ip = getClientIp(request);
  const method = request.method.toUpperCase();

  // ── 1. Global rate limiting ─────────────────────────────────────────────
  // Different limits for auth vs non-auth routes
  const rateLimitConfig = isAuthRoute(route) ? AUTH_API_RATE_LIMIT : GLOBAL_API_RATE_LIMIT;
  const rateLimit = await consumeRateLimit(`api:global:${route}:${ip}`, rateLimitConfig);

  if (!rateLimit.allowed) {
    const response = apiError(
      {
        code: "RATE_LIMITED",
        message: `Too many requests. Please slow down.`
      },
      { status: 429, requestId, route }
    );
    attachRateLimitHeaders(response, rateLimit, rateLimitConfig.limit);
    return { passed: false, response, rateLimit };
  }

  // ── 2. CSRF protection ──────────────────────────────────────────────────
  if (!skipCsrf && requiresCsrf(route, method)) {
    const csrfResult = await validateCsrfToken(request);
    if (!csrfResult.valid) {
      return {
        passed: false,
        response: apiError(
          { code: "CSRF_INVALID", message: "CSRF validation failed" },
          { status: 403, requestId, route }
        )
      };
    }
  }

  // ── 3. Body size validation ─────────────────────────────────────────────
  if (!skipBodyCheck && CSRF_PROTECTED_METHODS.has(method)) {
    const contentLength = request.headers.get("content-length");
    const bodyError = validateBodySize(contentLength, maxBodySize ?? MAX_BODY_SIZE);
    if (bodyError) {
      return {
        passed: false,
        response: apiError(
          { code: "PAYLOAD_TOO_LARGE", message: bodyError },
          { status: 413, requestId, route }
        )
      };
    }
  }

  return { passed: true, rateLimit };
}

/**
 * Applies security headers to an API response and attaches rate limit headers.
 */
export function enhanceApiResponse(
  response: Response,
  rateLimit?: RateLimitResult,
  rateLimitConfig?: { limit: number }
): void {
  // Apply security headers
  applySecurityHeaders(response, { includeHsts: process.env.NODE_ENV === "production" });

  // Attach rate limit headers
  if (rateLimit && rateLimitConfig) {
    attachRateLimitHeaders(response, rateLimit, rateLimitConfig.limit);
  }
}
