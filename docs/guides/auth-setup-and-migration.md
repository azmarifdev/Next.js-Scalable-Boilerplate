# Auth Setup and Migration Guide

## Purpose

This guide helps you:

1. configure production-safe internal auth (`better-auth`)
2. optionally switch to external `custom-auth`
3. verify auth behavior before deployment

Use this before staging/production deploys.

---

## Auth Modes at a Glance

| Mode          | Best For               | Core Requirement                                           |
| ------------- | ---------------------- | ---------------------------------------------------------- |
| `better-auth` | self-contained apps    | `DATABASE_URL` + `AUTH_SESSION_SECRET`                     |
| `custom-auth` | existing IdP/SSO setup | external auth service + `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL` |

---

## Part A: Configure Better Auth

### 1) Set production-safe env values

```env
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth

DATABASE_URL=postgresql://user:pass@host:5432/db
AUTH_SESSION_SECRET=<strong-random-secret>
```

Generate a strong secret:

```bash
openssl rand -hex 32
```

### 2) Test auth behavior locally

1. Start app
2. open `/login`
3. register a real account
4. sign out and sign in with real credentials

### 3) Verify session cookie security

In production, cookie should be:

- `httpOnly`
- `sameSite=strict`
- `secure=true`

---

## Part B: Keep Better Auth (Internal) in Production

Use this if you do not need external IdP.

### Required env

```env
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
NEXT_PUBLIC_BACKEND_MODE=internal
DATABASE_URL=postgresql://...
AUTH_SESSION_SECRET=...
```

### Optional hardening

```env
REQUIRE_ADMIN_STEP_UP_AUTH=true
AUTH_MFA_VERIFY_URL=https://your-mfa-service.example.com/verify
AUTH_MFA_VERIFY_BEARER_TOKEN=<token>
```

### Smoke tests

- `/register` creates user
- `/login` returns session
- `/docs` accessible after login
- `/login` redirects to `/docs` when already signed in

---

## Part C: Switch to Custom Auth

Use this if your organization already has an auth service.

### 1) Set env flags

```env
NEXT_PUBLIC_AUTH_PROVIDER=custom-auth
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true
ENABLE_CUSTOM_AUTH=true
NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://your-auth-provider.example.com
```

### 2) External provider contract

Your provider should support:

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/mfa/verify`

### 3) Integration checks

- CORS allows app origin
- credentials/cookies flow works (if cookie-based)
- TLS/HTTPS enabled
- response shape matches adapter expectations

### 4) Rollout strategy

1. deploy custom-auth in staging
2. test login/register/logout/me/refresh
3. verify route guards and redirects
4. switch production env only after staging pass

---

## Recommended Environments

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
AUTH_SESSION_SECRET=<strong-random-secret>
```

Use the same real-auth shape locally, in staging, and in production. Change only URLs, database credentials, and secrets per environment.

---

## CI/CD and Deployment Notes

- Add secrets in GitHub Actions and deployment provider:
  - `DATABASE_URL`
  - `AUTH_SESSION_SECRET`
- For custom auth, also set:
  - `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL`
- Keep `NEXT_PUBLIC_AUTH_PROVIDER` aligned across environments.

---

## Troubleshooting

### `DATABASE_URL is required`

You are running internal mode without DB config.

Fix:

- set valid `DATABASE_URL`
- or for local-only exploration temporarily enable demo flags

### `AUTH_SESSION_SECRET ... is required`

Fix:

- set `AUTH_SESSION_SECRET`
- do not rely on insecure fallback in production

### Login works locally but fails in deployment

Check:

- provider env vars in deployment dashboard
- database network access
- custom-auth CORS and HTTPS

---

## Final Production Checklist

1. correct auth provider selected (`better-auth` or `custom-auth`)
2. all required secrets configured
3. login/register/logout/me flows verified in production URL

---

## Related Docs

- [How to Use](../how-to-use.md)
- [Auth Flow](../auth-flow.md)
- [Deployment Guide](deployment.md)
- [Cloud Providers](../deployment/cloud-providers.md)
