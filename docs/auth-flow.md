# Auth Flow

## Purpose

This file documents authentication behavior in both internal and custom provider modes.

## Modes

### Better Auth (default internal)

Endpoints:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/mfa/verify`

### Custom Auth (external)

Required environment:

- `NEXT_PUBLIC_AUTH_PROVIDER=custom-auth`
- `NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true`
- `ENABLE_CUSTOM_AUTH=true`
- `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://your-provider.example.com`

Expected provider endpoints:

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `POST /auth/logout`
- `POST /auth/refresh`

## Session Model

- Cookie name: `auth_token`
- httpOnly + `sameSite=strict`
- Signed payload includes:
  - `sub`, `email`, `role`
  - `mfaVerified` and optional `mfaVerifiedAt`
  - `iat`, `exp`

## Route Protection

- Browser-level gate via `src/proxy.ts`
- Server API permission checks via `src/lib/auth/session-guard.ts`

Protected dashboard routes:

- `/dashboard`
- `/users`
- `/projects`
- `/tasks`
- `/ecommerce`
- `/billing`

## Admin Step-up MFA

Enable with:

- `REQUIRE_ADMIN_STEP_UP_AUTH=true`

Verifier options:

- Preferred: `AUTH_MFA_VERIFY_URL`
- Local fallback: `AUTH_MFA_STATIC_CODE`

Production safety:

- Static code blocked by default unless `ALLOW_STATIC_MFA_IN_PRODUCTION=true`

## Security Controls

- Same-origin checks: `src/lib/security/request-origin.ts`
- Redirect safety: `src/lib/security/redirect.ts`
- Rate limit: `src/lib/security/rate-limit.ts`
- Audit log writes: `src/lib/auth/auth-audit.repository.ts`

## Validation Coverage

- Integration tests: `src/tests/integration/auth-api.test.ts`
- Mode guard tests: `src/tests/integration/mode-guards.test.ts`
- E2E auth path: `src/tests/e2e/home.spec.ts`
