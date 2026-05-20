# Security

## Purpose

This document describes the **defense-in-depth security architecture** of this boilerplate. Every layer — from HTTP headers to database queries to session tokens — is designed to resist common and advanced web attacks.

---

## 🔒 Why This Boilerplate Is Secure

This isn't a "add Helmet and you're done" approach. Security is built into every layer:

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: HTTP Security Headers                         │
│  └─ CSP, HSTS, X-Frame-Options, Permissions-Policy...  │
├─────────────────────────────────────────────────────────┤
│  Layer 2: Middleware Security (proxy.ts)                │
│  └─ Auth gate, CSP nonce, security headers on ALL pages │
├─────────────────────────────────────────────────────────┤
│  Layer 3: API Security Middleware (withApiHandler)       │
│  └─ Global rate limiting, CSRF, body size, headers     │
├─────────────────────────────────────────────────────────┤
│  Layer 4: Auth Route Security                           │
│  └─ Origin validation, input sanitization, audit logs  │
├─────────────────────────────────────────────────────────┤
│  Layer 5: Session & Token                               │
│  └─ Signed HMAC tokens, HttpOnly cookies, MFA step-up  │
├─────────────────────────────────────────────────────────┤
│  Layer 6: Database Layer                                │
│  └─ Drizzle ORM (parameterized queries), atomic SQL    │
├─────────────────────────────────────────────────────────┤
│  Layer 7: CI/CD Security                                │
│  └─ CodeQL, CodeHawk, dependency review, gitleaks      │
└─────────────────────────────────────────────────────────┘
```

---

## 🛡️ Attack Coverage

This table shows which common web attacks are mitigated and how:

| Attack Type                    | Mitigation                                                                                             | Location(s)                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| **XSS (Cross-Site Scripting)** | Content Security Policy with nonce-based `strict-dynamic` — inline scripts require a per-request nonce | `proxy.ts`, `security-headers.ts`           |
| **CSRF**                       | Double-submit cookie pattern — server validates token from cookie vs HTTP header                       | `csrf.ts`, `api-security.ts`                |
| **Brute Force Login**          | Account lockout after 5 failed attempts + IP-based rate limiting (15/min)                              | `auth-user.repository.ts`, `login/route.ts` |
| **Account Enumeration**        | Generic error messages + dummy password hash for non-existent users                                    | `login/route.ts`                            |
| **DDoS / API Abuse**           | IP-based rate limiting on ALL API routes (100/min global, 30/min auth)                                 | `api-security.ts`, `rate-limit.ts`          |
| **Clickjacking**               | `X-Frame-Options: DENY` + `frame-ancestors 'none'` in CSP                                              | `security-headers.ts`, `next.config.ts`     |
| **Open Redirect**              | Origin validation + safe redirect path utility                                                         | `request-origin.ts`, `redirect.ts`          |
| **Race Condition (Lockout)**   | Atomic SQL increment (`failed_login_attempts + 1`) prevents concurrent bypass                          | `auth-user.repository.ts`                   |
| **Header Injection**           | User-agent and IP are sanitized (null bytes, CRLF stripped, length-limited)                            | `input-validator.ts`                        |
| **MIME Type Confusion**        | `X-Content-Type-Options: nosniff`                                                                      | `security-headers.ts`, `next.config.ts`     |
| **Protocol Downgrade**         | HSTS with `preload` + `upgrade-insecure-requests` in CSP                                               | `proxy.ts`, `next.config.ts`                |
| **Session Hijacking**          | `HttpOnly` + `SameSite=Strict` + `Secure` cookies, HMAC-signed tokens                                  | `session.ts`, `cookie-security.ts`          |
| **Password Brute Force**       | Scrypt key derivation (CPU/memory-hard) + complexity validation (8+ chars, upper, lower, number)       | `password.ts`, `auth.schema.ts`             |
| **Resource Exhaustion**        | Request body size limit (100 KB) + Content-Length validation                                           | `api-security.ts`, `input-validator.ts`     |
| **ReDoS (Regex DoS)**          | All string inputs have explicit max-length limits before regex evaluation                              | `input-validator.ts`                        |
| **Dependency Vulnerabilities** | `pnpm audit` in CI + Dependabot auto-merge (patch-only, production deps)                               | `ci.yml`, `dependabot-auto-merge.yml`       |
| **Secret Leakage**             | Gitleaks scan in CI + `.env.local` gitignored + `.env.example` as template                             | `check-all.sh`, `.gitignore`                |
| **Supply Chain**               | Dependency review action + `frozen-lockfile` installs                                                  | `dependency-review.yml`, `ci.yml`           |

---

## 🔐 Security Architecture Details

### 1. HTTP Security Headers (Layer 1)

Every response includes security headers, applied at **three levels** (defense-in-depth):

| Level      | File              | When Applied                      |
| ---------- | ----------------- | --------------------------------- |
| CDN/Edge   | `next.config.ts`  | Before request reaches middleware |
| Middleware | `proxy.ts`        | On every page navigation          |
| API Routes | `api-security.ts` | On every API response             |

**Headers Applied:**

| Header                         | Value                                                                              | Prevents               |
| ------------------------------ | ---------------------------------------------------------------------------------- | ---------------------- |
| `Content-Security-Policy`      | `default-src 'self'; script-src 'self' 'nonce-...' 'strict-dynamic'; ...`          | XSS                    |
| `Strict-Transport-Security`    | `max-age=31536000; includeSubDomains; preload`                                     | Protocol downgrade     |
| `X-Frame-Options`              | `DENY`                                                                             | Clickjacking           |
| `X-Content-Type-Options`       | `nosniff`                                                                          | MIME confusion         |
| `X-XSS-Protection`             | `0`                                                                                | Legacy XSS filter      |
| `Referrer-Policy`              | `strict-origin-when-cross-origin`                                                  | Referrer leakage       |
| `Permissions-Policy`           | `camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()` | Feature abuse          |
| `Cross-Origin-Opener-Policy`   | `same-origin`                                                                      | Cross-origin isolation |
| `Cross-Origin-Resource-Policy` | `same-site`                                                                        | Resource sharing       |
| `Cross-Origin-Embedder-Policy` | `require-corp`                                                                     | Cross-origin embedding |

### 2. CSP with Nonce (Layer 2)

The Content Security Policy uses a **cryptographically random nonce** generated per-request:

1. `proxy.ts` generates a unique nonce (`crypto.randomUUID() → base64`)
2. Nonce is injected into the CSP header
3. Nonce is also set as `x-nonce` header for server-side rendering
4. Server-rendered React components can access `headers().get("x-nonce")` to add `nonce={nonce}` to inline `<script>` tags
5. `strict-dynamic` allows trusted scripts to load other scripts

### 3. API Security Middleware (Layer 3)

Every API route is automatically wrapped with security checks via `withApiHandler()` in `route-utils.ts`:

```typescript
// Every API response gets this automatically:
response = await handler(request); // Your route logic
enhanceApiResponse(response, rateLimit, config); // Security headers
```

**Checks applied to ALL routes:**

- ✅ **Global rate limiting** — 100 req/min per IP for general API, 30/min for auth
- ✅ **CSRF validation** — For POST/PUT/PATCH/DELETE methods (via double-submit cookie)
- ✅ **Body size validation** — Max 100 KB per request
- ✅ **Security headers** — On every response, even error responses
- ✅ **Rate limit headers** — `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`

### 4. CSRF Protection

Uses the **double-submit cookie pattern**:

1. On first request, server sets two cookies:
   - `csrf_token` — HttpOnly, read by server
   - `csrf_token_client` — non-HttpOnly, read by client JS
2. Client JS reads `csrf_token_client` and sends it as `X-CSRF-Token` header
3. Server validates header value matches `csrf_token` cookie (timing-safe comparison)

**Why this works:** An attacker's site cannot read the cookies (same-origin policy) and therefore cannot set the matching header.

**To disable CSRF for a specific route:** Pass `skipCsrf: true` to `checkApiSecurity()`.

### 5. Rate Limiting

**Three tiers of rate limiting:**

| Tier       | Limit                | Scope                     | Backend                    |
| ---------- | -------------------- | ------------------------- | -------------------------- |
| Global API | 100 req/min per IP   | All API routes            | In-memory or Upstash Redis |
| Auth API   | 30 req/min per IP    | `/api/v1/auth/*`          | In-memory or Upstash Redis |
| Login      | 15 req/min per email | `/api/v1/auth/login`      | In-memory or Upstash Redis |
| Register   | 5 req/min per IP     | `/api/v1/auth/register`   | In-memory or Upstash Redis |
| MFA Verify | 5 req/5min per user  | `/api/v1/auth/mfa/verify` | In-memory or Upstash Redis |

**Production recommendation:** Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for shared, persistent rate limiting across serverless instances. Without Upstash, rate limiting falls back to in-memory (per-instance).

### 6. Authentication Security

| Feature                 | Implementation                                                   |
| ----------------------- | ---------------------------------------------------------------- |
| **Password hashing**    | Scrypt (CPU/memory-hard) with random 16-byte salt                |
| **Password validation** | 8+ chars, 1 uppercase, 1 lowercase, 1 number                     |
| **Session tokens**      | HMAC-SHA256 signed with `AUTH_SESSION_SECRET`                    |
| **Cookie flags**        | `HttpOnly`, `SameSite=Strict`, `Secure` in production            |
| **Brute force**         | Lockout after 5 failed attempts (15 min window)                  |
| **Race condition**      | Atomic SQL increment — concurrent requests cannot bypass lockout |
| **MFA step-up**         | Optional admin MFA verification before sensitive routes          |
| **Audit logging**       | Every auth event logged with IP, UA, risk score                  |
| **Session rotation**    | Key rotation via `AUTH_SESSION_SECRETS`                          |

### 7. Input Validation & Sanitization

All user-supplied data is sanitized before storage:

| Field           | Sanitization                                                          |
| --------------- | --------------------------------------------------------------------- |
| Email           | Lowercased, length-limited (254), basic format check                  |
| Name            | Length-limited (200), control chars stripped                          |
| User-Agent      | Length-limited (500), CRLF stripped (prevents header injection)       |
| IP Address      | Length-limited (45), first IP extracted from chain                    |
| Generic strings | Control chars (\0-\x1F except \t\n\r) stripped, length-limited (2000) |
| Request body    | Size validated against Content-Length (max 100 KB)                    |

### 8. Session Token Security

```typescript
// Session structure (HMAC-SHA256 signed):
Header: { alg: "HS256", kid: "k1" }
Payload: {
  sub: "user_id",
  name: "User Name",
  email: "user@example.com",
  role: "admin" | "user",
  mfaVerified: true | false,
  iat: 1715000000,    // Issued at
  exp: 1715086400     // Expires
}
Signature: HMAC-SHA256(base64(header) + "." + base64(payload))
```

- **Key rotation**: Set `AUTH_SESSION_SECRETS` as comma-separated list. First key signs new tokens; all keys verify existing ones.
- **Timing-safe comparison**: Signature verification uses constant-time comparison to prevent timing attacks.

---

## ⚙️ Customization Guide

### Removing or Relaxing Security

Some security measures can be adjusted for development or specific use cases:

| What to Change                 | How                                                            | When                                          |
| ------------------------------ | -------------------------------------------------------------- | --------------------------------------------- |
| **Disable CSRF**               | Pass `skipCsrf: true` to `checkApiSecurity()` in route handler | Internal microservice-to-microservice calls   |
| **Change rate limits**         | Edit constants in `api-security.ts` and route files            | Your app has different traffic patterns       |
| **Remove CSP**                 | Remove headers from `security-headers.ts` or `proxy.ts`        | Internal-only tools with no user data         |
| **Reduce password complexity** | Edit `passwordSchema` in `auth.schema.ts`                      | Internal prototypes                           |
| **Disable account lockout**    | Set `MAX_FAILED_ATTEMPTS` higher or remove lockout logic       | Specific admin accounts                       |
| **Disable body size limit**    | Pass `skipBodyCheck: true` to `checkApiSecurity()`             | File upload endpoints (use dedicated handler) |
| **Disable rate limiting**      | Remove rate limit env vars or set very high limits             | Local development                             |

### Extending Security

| What to Do                   | How                                                                       |
| ---------------------------- | ------------------------------------------------------------------------- |
| **Add custom rate limit**    | Call `consumeRateLimit(key, { limit, windowMs })` in any handler          |
| **Require permission**       | Use `requirePermission()` from `session-guard.ts`                         |
| **Add audit log**            | Call `writeAuthAuditLog()` with event, status, and context                |
| **Apply to new route**       | Wrap handler with `withApiHandler()` — security comes automatically       |
| **Add CSRF to custom route** | Call `validateCsrfToken()` in handler, then `setCsrfCookie()` on response |
| **Integrate Upstash**        | Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`               |

### Important: What NOT to Remove in Production

| Component                                 | Why                                  |
| ----------------------------------------- | ------------------------------------ |
| `proxy.ts`                                | CSP, security headers, auth gate     |
| `withApiHandler()` wrapper                | Rate limiting, CSRF, body validation |
| `requireSameOrigin()`                     | Cross-origin request protection      |
| `getSafeRedirectPath()`                   | Open redirect prevention             |
| `cookie-security.ts`                      | Secure cookie flags                  |
| Input sanitization (`input-validator.ts`) | Header injection, XSS prevention     |
| Password hashing (`password.ts`)          | Credential security                  |
| Audit logging                             | Incident forensics                   |

---

## 🚀 Production Security Checklist

Before going to production:

- [ ] Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for shared rate limiting
- [ ] Generate strong session secrets: `openssl rand -hex 32`
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] Verify CSP headers are not blocking legitimate resources (use `Content-Security-Policy-Report-Only` first)
- [ ] Enable branch protection rules with all required checks
- [ ] Set `REQUIRE_ADMIN_STEP_UP_AUTH=true` if you have admin routes
- [ ] Configure Sentry for error monitoring
- [ ] Run `pnpm audit` and fix any critical vulnerabilities
- [ ] Set `SENTRY_AUTH_TOKEN` for source map uploads
- [ ] Review audit logs regularly for suspicious activity

---

## Security.txt

This boilerplate includes an RFC 9116 `security.txt` endpoint at `/api/v1/security` for security researchers. Production deployments should:

1. Configure a `/.well-known/security.txt` redirect or update the route matcher
2. Update the contact URL in `src/app/api/v1/security/route.ts` with your repository's security advisory link

---

## Report a Vulnerability

Please **do not** open a public GitHub issue for sensitive security vulnerabilities.

### Preferred Reporting Channels

| Channel                                    | Details                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| **GitHub Security Advisory** (recommended) | Use the "Report a vulnerability" button under the repository's **Security** tab |
| **Private contact**                        | Reach out to the maintainers directly if you have a direct channel              |

### What to Include

To help us respond quickly, please include:

- ✅ **Reproduction steps** — How to trigger the vulnerability
- ✅ **Affected files/routes** — Which parts of the codebase are affected
- ✅ **Impact assessment** — What an attacker could achieve
- ✅ **Suggested fix** (optional) — If you have a patch, include it

---

## Response Timeline

| Stage                       | Expected Time                                         |
| --------------------------- | ----------------------------------------------------- |
| **Initial acknowledgement** | Within 48 hours                                       |
| **Triage & assessment**     | Within 1 week                                         |
| **Fix & release**           | Depends on severity — critical issues are prioritized |

---

## Security-Sensitive Areas

These parts of the codebase require extra attention during changes:

| Area                | Location                              | Why                                                      |
| ------------------- | ------------------------------------- | -------------------------------------------------------- |
| Auth API routes     | `src/app/api/v1/auth/*`               | Handles login, registration, session management          |
| Auth infrastructure | `src/lib/auth/*`                      | Session tokens, RBAC, MFA, audit logging                 |
| Security utilities  | `src/lib/security/*`                  | Rate limiting, CSRF, CSP, origin checks, redirect safety |
| Route protection    | `src/proxy.ts`                        | Browser-level authentication gate + security headers     |
| Security headers    | `next.config.ts`                      | Edge-level CSP, HSTS, X-Frame-Options                    |
| API middleware      | `src/app/api/v1/auth/route-utils.ts`  | Automatic security wrapping for all API routes           |
| Input validation    | `src/lib/security/input-validator.ts` | Sanitization for audit logs and user input               |

---

## Related Documentation

- [Auth Flow](auth-flow.md) — Authentication lifecycle and security controls
- [Architecture](architecture.md) — System layers and security boundaries
- [Workflows](workflows.md) — CI/CD security pipelines
- [How to Use](how-to-use.md) — Setup and environment validation
- [Production Services](guides/production-services.md) — Production service configuration
- [Cloud Providers](deployment/cloud-providers.md) — Production deployment security notes
