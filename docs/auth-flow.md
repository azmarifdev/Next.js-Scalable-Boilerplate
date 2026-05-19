# Auth Flow

## Purpose

This document explains how authentication works in this boilerplate — from login and session management to security controls and MFA. It covers both **internal** (Better Auth) and **external** (custom IdP) modes.

---

## Auth Modes Overview

| Mode                      | How It Works                                                                                                                      | Best For                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Better Auth (default)** | Auth routes run inside this app. Login, register, session — everything is handled by your own server.                             | Self-contained apps, smaller projects, quick MVPs |
| **Custom Auth**           | Auth is delegated to an external Identity Provider. The app calls external endpoints for login, register, and session validation. | Existing auth infrastructure, SSO, social login   |

---

## 1. Better Auth Mode (Default)

In this repository, **Better Auth** means the built-in internal auth provider path. The app owns the auth API routes, database-backed users, signed session cookie, RBAC checks, rate limiting, and audit logging.

### API Endpoints

All auth endpoints are under `/api/v1/auth/`:

| Method | Endpoint                  | Purpose                       | Auth Required |
| ------ | ------------------------- | ----------------------------- | ------------- |
| `POST` | `/api/v1/auth/login`      | Sign in with email + password | No            |
| `POST` | `/api/v1/auth/register`   | Create a new account          | No            |
| `GET`  | `/api/v1/auth/me`         | Get current session user info | Yes (cookie)  |
| `POST` | `/api/v1/auth/logout`     | Clear session, delete cookie  | Yes (cookie)  |
| `POST` | `/api/v1/auth/refresh`    | Extend session expiration     | Yes (cookie)  |
| `POST` | `/api/v1/auth/mfa/verify` | Verify MFA challenge code     | Yes (cookie)  |

### Login Flow (Step by Step)

```
User enters email + password
        │
        ▼
POST /api/v1/auth/login
        │
        ├─ Validates input (Zod schema)
        ├─ Checks credentials against database
        │   ├─ Invalid → Returns 401 "Invalid email or password"
        │   └─ Valid → Creates session token
        │
        ▼
Session token created in src/lib/auth/session.ts
  ├─ Payload: { sub, email, role, mfaVerified, iat, exp }
  ├─ Signed with AUTH_SESSION_SECRET
  └─ Stored in httpOnly cookie: auth_token=<token>
        │
        ▼
Response sent to browser
  ├─ Sets auth_token cookie (httpOnly, sameSite=strict)
  └─ Redirects to /docs
```

### Register Flow

Same as login, but:

1. Validates name + email + password
2. Creates user in database
3. Auto-logs in (creates session token)
4. Redirects to `/docs`

### Session Verification

Every protected route checks the session:

```
Browser sends request with auth_token cookie
        │
        ▼
proxy.ts (browser-level middleware)
  ├─ Reads auth_token from cookies
  ├─ Verifies signature with AUTH_SESSION_SECRET
  ├─ Checks expiration
  ├─ Valid → Request continues
  └─ Invalid/Expired → Redirect to /login
        │
        ▼
API route handlers also verify via session-guard.ts
  ├─ requireSession() → Returns 401 if no valid session
  └─ requirePermission() → Returns 403 if wrong role
```

---

## 2. Custom Auth Mode (External Provider)

When you set `NEXT_PUBLIC_AUTH_PROVIDER=custom-auth` and enable the custom auth flags, the frontend auth service delegates authentication to an external server through `src/modules/optional/auth/custom-auth.adapter.ts`.

### Required Configuration

```env
NEXT_PUBLIC_AUTH_PROVIDER=custom-auth
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true
ENABLE_CUSTOM_AUTH=true
NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://your-auth-provider.com
```

### Expected Provider Endpoints

Your external provider must expose these endpoints:

| Method | Endpoint         | Expected Response                      |
| ------ | ---------------- | -------------------------------------- |
| `POST` | `/auth/login`    | User object with id, name, email, role |
| `POST` | `/auth/register` | User object                            |
| `GET`  | `/auth/me`       | Current user data                      |
| `POST` | `/auth/logout`   | Success confirmation                   |
| `POST` | `/auth/refresh`  | Token refresh response                 |
| `POST` | `/mfa/verify`    | MFA verification result                |
| `POST` | `/oauth/token`   | OAuth/code exchange result             |

### Adapter Architecture

```
src/lib/auth/auth.provider.ts    ← Provider abstraction layer
  ├── betterAuthProvider         ← Internal Better Auth implementation
  └── customAuthProvider         ← External IdP adapter
         │
         ▼
src/modules/optional/auth/
  ├── custom-auth.adapter.ts     ← HTTP client for external endpoints
  ├── custom-auth.provider.ts    ← Wrapper adapter
  └── custom-auth.types.ts       ← Type definitions
```

The default adapter expects a user with `id`, `name`, `email`, and `role`. If your IdP returns another response shape, update the normalizers in `custom-auth.adapter.ts` instead of changing every component.

---

## 3. Session Model

### Cookie Details

| Property     | Value                                                  |
| ------------ | ------------------------------------------------------ |
| **Name**     | `auth_token`                                           |
| **Type**     | httpOnly                                               |
| **SameSite** | `strict`                                               |
| **Secure**   | Yes (in production)                                    |
| **TTL**      | 24 hours (configurable via `AUTH_SESSION_TTL_SECONDS`) |

### Token Payload

```typescript
{
  sub: string,            // User ID
  name: string,           // User's display name
  email: string,          // User's email
  role: "admin" | "user", // User role
  mfaVerified: boolean,   // Whether MFA was completed
  mfaVerifiedAt?: number, // When MFA was verified (timestamp)
  iat: number,            // Issued at timestamp
  exp: number             // Expiration timestamp
}
```

### Token Lifecycle

```
Created at login/register
        │
        ▼
Valid for 24 hours
        │
        ├─ Sent with every request via cookie
        ├─ Refreshable via POST /api/v1/auth/refresh
        │
        ▼
Expired → User redirected to /login
        │
        ▼
Logout → Cookie cleared, token invalidated
```

---

## 4. Route Protection

### Browser-Level Auth Redirects (`src/proxy.ts`)

The proxy currently redirects signed-in users away from public auth routes:

| Scenario                                                        | Action              |
| --------------------------------------------------------------- | ------------------- |
| User visits `/login` while signed in with a valid app cookie    | Redirect to `/docs` |
| User visits `/register` while signed in with a valid app cookie | Redirect to `/docs` |
| User visits `/login` while signed out                           | Show login page     |
| User visits `/register` while signed out                        | Show register page  |

Protected API access is enforced in route handlers with `session-guard.ts`. If custom auth uses only external cookies that this app cannot verify, update `src/proxy.ts` or rely on client-side auth state for public auth page UI.

### API-Level Protection (`src/lib/auth/session-guard.ts`)

API routes use `requireSession()` to enforce authentication:

- ✅ **Authenticated** → Route handler runs normally
- ❌ **No session cookie** → Returns `401 UNAUTHORIZED`
- ❌ **Invalid/expired session** → Returns `401 INVALID_SESSION`
- ❌ **Insufficient permissions** → Returns `403 FORBIDDEN`

---

## 5. Security Controls

### Same-Origin Check

Prevents CSRF attacks by validating the `Origin` header on sensitive endpoints. If the origin doesn't match the expected domain, the request is rejected.

**Implementation:** `src/lib/security/request-origin.ts`

### Redirect Validation

Prevents open redirect attacks. Any redirect URL from query parameters is validated against a whitelist of allowed origins.

**Implementation:** `src/lib/security/redirect.ts`

### Rate Limiting

In-memory rate limiter protects auth endpoints from brute force attacks:

| Endpoint                  | Limit      | Window                 |
| ------------------------- | ---------- | ---------------------- |
| `/api/v1/auth/login`      | 5 attempts | 15 minutes (per email) |
| `/api/v1/auth/mfa/verify` | 3 attempts | 15 minutes (per user)  |

After exceeding the limit, the endpoint returns `429 Too Many Requests`.

**Implementation:** `src/lib/security/rate-limit.ts`

### Audit Logging

Every login and registration attempt is logged:

| Event            | Logged Fields                       |
| ---------------- | ----------------------------------- |
| Login success    | User ID, email, role, timestamp     |
| Login failure    | Email, reason, timestamp            |
| Registration     | New user ID, email, timestamp       |
| MFA verification | User ID, success/failure, timestamp |

**Implementation:** `src/lib/auth/auth-audit.repository.ts`

---

## 6. Admin Step-Up MFA

### What It Is

An optional security layer that requires admins to verify their identity with MFA before accessing `/users` or other admin routes.

### How to Enable

```env
REQUIRE_ADMIN_STEP_UP_AUTH=true
```

### How It Works

1. Admin logs in normally.
2. Admin calls an API route that requires an admin-only permission.
3. `session-guard.ts` checks the role and step-up setting.
4. If MFA is not verified, the API returns a step-up required error.
5. The app should show or route to an MFA challenge UI for that workflow.
6. After MFA verifies, the session can be updated with `mfaVerified: true`.

### Verifier Options

| Option               | How To Configure      | Use Case                                       |
| -------------------- | --------------------- | ---------------------------------------------- |
| External MFA service | `AUTH_MFA_VERIFY_URL` | Production — integrates with your MFA provider |

---

## 7. Navbar Auth States

The navbar dynamically changes based on auth state:

| State             | Shows                                                   |
| ----------------- | ------------------------------------------------------- |
| **Not logged in** | Features, Docs, locale switcher, theme toggle, Sign In  |
| **Logged in**     | Features, Docs, locale switcher, theme toggle, Sign Out |

The auth state is checked via the `useAuth()` hook which calls `GET /api/v1/auth/me` to verify the session.

---

## Related Documentation

| File                                                           | What It Covers                                     |
| -------------------------------------------------------------- | -------------------------------------------------- |
| [Architecture](architecture.md)                                | System layers, request path, design decisions      |
| [How to Use](how-to-use.md)                                    | Setup, env config, switching auth modes            |
| [Auth Setup and Migration](guides/auth-setup-and-migration.md) | Demo auth removal + production/custom auth runbook |

### Key Source Files

| File                                       | Purpose                                 |
| ------------------------------------------ | --------------------------------------- |
| `src/proxy.ts`                             | Browser-level route protection          |
| `src/lib/auth/session.ts`                  | Session token creation and verification |
| `src/lib/auth/session-guard.ts`            | API-level permission checking           |
| `src/lib/auth/rbac.ts`                     | Role-based access control definitions   |
| `src/lib/auth/auth.provider.ts`            | Auth provider abstraction layer         |
| `src/hooks/useAuth.ts`                     | React hook for auth state               |
| `src/modules/auth/components/AuthForm.tsx` | Login/register form component           |
| `src/lib/security/rate-limit.ts`           | Rate limiting for auth endpoints        |
