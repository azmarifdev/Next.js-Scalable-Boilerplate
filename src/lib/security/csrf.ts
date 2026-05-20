/**
 * src/lib/security/csrf.ts
 *
 * Double-submit cookie pattern CSRF protection.
 *
 * How it works:
 * 1. A cryptographically random CSRF token is generated and set as an
 *    HttpOnly cookie (readable by the server) AND as a non-HttpOnly cookie
 *    (readable by client JavaScript).
 * 2. Client-side JavaScript reads the non-HttpOnly cookie and sends its
 *    value as a custom header (X-CSRF-Token).
 * 3. The server validates that the header value matches the cookie value.
 *
 * This prevents CSRF attacks because an attacker's site cannot read the
 * cookie (same-origin policy) and therefore cannot set the matching header.
 */

import { cookies } from "next/headers";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_TOKEN_BYTES = 32;

/**
 * Generates a cryptographically random CSRF token.
 */
function generateToken(): string {
  const bytes = new Uint8Array(CSRF_TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Sets the CSRF token cookies on a response.
 * - `csrf_token` (HttpOnly): Read by server for validation.
 * - `csrf_token_client` (non-HttpOnly): Read by client JS to set header.
 */
export function setCsrfCookie(response: Response): string {
  const token = generateToken();

  // Server-side cookie (HttpOnly) — for validation
  response.headers.append(
    "Set-Cookie",
    `${CSRF_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Secure`
  );

  // Client-side cookie (non-HttpOnly) — for reading in JS
  response.headers.append(
    "Set-Cookie",
    `${CSRF_COOKIE_NAME}_client=${token}; Path=/; SameSite=Strict; Secure`
  );

  return token;
}

/**
 * Extracts the CSRF token from the cookies (server-side HttpOnly cookie).
 */
async function getServerCsrfToken(): Promise<string | null> {
  try {
    return (await cookies()).get(CSRF_COOKIE_NAME)?.value ?? null;
  } catch {
    return null;
  }
}

/**
 * Extracts the CSRF token from the request header (set by client JS).
 */
function getHeaderCsrfToken(request: Request): string | null {
  return request.headers.get(CSRF_HEADER_NAME);
}

/**
 * Validates a CSRF token from a request.
 * Compares the value in the X-CSRF-Token header with the server-side cookie.
 *
 * Returns null if valid, or an error response if invalid.
 */
export async function validateCsrfToken(
  request: Request
): Promise<{ valid: true } | { valid: false; reason: string }> {
  const serverToken = await getServerCsrfToken();
  const headerToken = getHeaderCsrfToken(request);

  if (!serverToken || !headerToken) {
    return {
      valid: false,
      reason: !serverToken ? "Missing CSRF cookie" : "Missing X-CSRF-Token header"
    };
  }

  if (serverToken.length !== headerToken.length) {
    return { valid: false, reason: "CSRF token length mismatch" };
  }

  // Timing-safe comparison
  let diff = 0;
  for (let i = 0; i < serverToken.length; i++) {
    diff |= serverToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }

  if (diff !== 0) {
    return { valid: false, reason: "CSRF token mismatch" };
  }

  return { valid: true };
}
