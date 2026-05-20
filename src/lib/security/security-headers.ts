/**
 * src/lib/security/security-headers.ts
 *
 * Comprehensive HTTP security headers for the application.
 * These headers protect against XSS, clickjacking, MIME sniffing,
 * protocol downgrade, and other common web attacks.
 */

export interface SecurityHeadersOptions {
  /** Whether to include HSTS header (production-only) */
  includeHsts?: boolean;
  /** CSP nonce value for inline scripts/styles */
  nonce?: string;
  /** Whether to relax CSP for development (allows eval, inline styles) */
  isDev?: boolean;
}

/**
 * Builds a Content Security Policy string with a nonce for inline scripts.
 * CSP is the primary defense against XSS attacks.
 *
 * In development mode, `'unsafe-eval'` is added because Next.js Turbopack's
 * HMR client and React DevTools rely on `eval()` for hot reloading.
 * In production, eval is strictly blocked for security.
 */
export function buildCsp(nonce: string, isDev = false): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    ...(isDev ? ["'unsafe-eval'"] : [])
  ].join(" ");

  // In development, allow inline styles since Turbopack injects them without nonces
  const styleSrc = isDev ? `'self' 'unsafe-inline'` : `'self' 'nonce-${nonce}'`;

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src ${scriptSrc}`,
    "script-src-attr 'none'",
    `style-src ${styleSrc}`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "object-src 'none'",
    "worker-src 'self' blob:",
    ...(isDev ? [] : ["upgrade-insecure-requests"])
  ].join("; ");
}

/**
 * Returns an array of security header key-value pairs.
 * These headers are applied to every response in production.
 */
export function getSecurityHeaders(options: SecurityHeadersOptions = {}): Record<string, string> {
  const { nonce, includeHsts = true, isDev = false } = options;

  const headers: Record<string, string> = {
    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",
    // Prevent clickjacking
    "X-Frame-Options": "DENY",
    // Enable XSS filter in older browsers (legacy)
    "X-XSS-Protection": "0",
    // Referrer policy
    "Referrer-Policy": "strict-origin-when-cross-origin",
    // Cross-Origin isolation
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-site",
    "Cross-Origin-Embedder-Policy": "require-corp",
    // DNS prefetch control
    "X-DNS-Prefetch-Control": "off",
    // Permissions policy - restrict access to sensitive device features
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()"
  };

  if (nonce) {
    headers["Content-Security-Policy"] = buildCsp(nonce, isDev);
  }

  if (includeHsts) {
    headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload";
  }

  return headers;
}

/**
 * Applies security headers to a Response/NextResponse object.
 * Also adds the nonce to request headers for server-side rendering.
 */
export function applySecurityHeaders(
  response: Response,
  options: SecurityHeadersOptions = {}
): void {
  const headers = getSecurityHeaders(options);

  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
}
