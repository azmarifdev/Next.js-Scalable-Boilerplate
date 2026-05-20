/**
 * src/lib/security/input-validator.ts
 *
 * Input validation and sanitization utilities to prevent:
 * - XSS via header injection
 * - ReDoS via regex abuse
 * - Buffer overflow via oversized inputs
 * - NoSQL/SQL injection via special characters (defense-in-depth)
 */

// ── Constants ─────────────────────────────────────────────────────────────

/** Maximum length for user-supplied string fields */
const MAX_STRING_LENGTH = 2000;

/** Maximum length for email addresses (RFC 5321) */
const MAX_EMAIL_LENGTH = 254;

/** Maximum length for name fields */
const MAX_NAME_LENGTH = 200;

/** Maximum length for user-agent strings */
const MAX_USER_AGENT_LENGTH = 500;

/** Maximum length for IP address strings */
const MAX_IP_LENGTH = 45; // IPv6 max length

// ── Sanitization ──────────────────────────────────────────────────────────

/**
 * Sanitizes a string input by:
 * 1. Trimming whitespace
 * 2. Stripping null bytes and control characters (except tabs/newlines)
 * 3. Truncating to maxLength
 */
export function sanitizeString(
  input: string | null | undefined,
  maxLength = MAX_STRING_LENGTH
): string | null {
  if (!input || typeof input !== "string") {
    return null;
  }

  // Remove null bytes and control characters (allow \t, \n, \r)
  let sanitized = input.replace(/[\0-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Trim whitespace
  sanitized = sanitized.trim();

  // Truncate to max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized.length > 0 ? sanitized : null;
}

/**
 * Sanitizes an email address: lowercases, trims, validates basic format.
 */
export function sanitizeEmail(email: string | null | undefined): string | null {
  const sanitized = sanitizeString(email, MAX_EMAIL_LENGTH);
  if (!sanitized) {
    return null;
  }

  const lowercased = sanitized.toLowerCase();

  // Basic email format check (defense-in-depth beyond zod)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lowercased)) {
    return null;
  }

  return lowercased;
}

/**
 * Sanitizes a user name.
 */
export function sanitizeName(name: string | null | undefined): string | null {
  return sanitizeString(name, MAX_NAME_LENGTH);
}

/**
 * Sanitizes a user-agent string.
 */
export function sanitizeUserAgent(ua: string | null | undefined): string | null {
  const sanitized = sanitizeString(ua, MAX_USER_AGENT_LENGTH);
  if (!sanitized) {
    return null;
  }

  // Strip potential header injection characters
  return sanitized.replace(/[\r\n]/g, "");
}

/**
 * Validates and normalizes an IP address string.
 * Prevents spoofed/arbitrarily long IP values from being stored in audit logs.
 */
export function sanitizeIpAddress(ip: string | null | undefined): string | null {
  const sanitized = sanitizeString(ip, MAX_IP_LENGTH);
  if (!sanitized) {
    return null;
  }

  // Take the first IP if multiple (X-Forwarded-For can have a chain)
  const firstIp = sanitized.includes(",") ? sanitized.split(",")[0].trim() : sanitized;

  return firstIp;
}

/**
 * Validates JSON body size to prevent resource exhaustion attacks.
 * Returns null if valid, or an error message if oversized.
 */
export function validateBodySize(
  contentLengthHeader: string | null,
  maxBytes: number
): string | null {
  if (!contentLengthHeader) {
    // Chunked encoding — check on parse
    return null;
  }

  const length = parseInt(contentLengthHeader, 10);
  if (isNaN(length)) {
    return "Invalid Content-Length header";
  }

  if (length > maxBytes) {
    return `Request body exceeds maximum allowed size of ${maxBytes} bytes`;
  }

  return null;
}

/**
 * Validates Content-Type header for POST/PUT/PATCH requests.
 * Prevents content-type confusion attacks.
 */
export function validateContentType(
  contentType: string | null,
  allowedTypes: string[]
): string | null {
  if (!contentType) {
    return "Content-Type header is required";
  }

  const normalized = contentType.toLowerCase().split(";")[0].trim();
  if (!allowedTypes.includes(normalized)) {
    return `Content-Type "${normalized}" is not allowed. Must be one of: ${allowedTypes.join(", ")}`;
  }

  return null;
}
