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

When you set `NEXT_PUBLIC_AUTH_PROVIDER=custom-auth`, the app delegates authentication to an external server.

### Required Configuration

```env
NEXT_PUBLIC_AUTH_PROVIDER=custom-auth
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true
ENABLE_CUSTOM_AUTH=true
NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://your-auth-provider.com
```

### Expected Provider Endpoints

Your external provider must expose these endpoints:

| Method | Endpoint           | Expected Response                      |
| ------ | ------------------ | -------------------------------------- |
| `POST` | `/auth/login`      | User object with id, name, email, role |
| `POST` | `/auth/register`   | User object                            |
| `GET`  | `/auth/me`         | Current user data                      |
| `POST` | `/auth/logout`     | Success confirmation                   |
| `POST` | `/auth/refresh`    | Token refresh response                 |
| `POST` | `/auth/mfa/verify` | MFA verification result                |

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

### Browser-Level Protection (`src/proxy.ts`)

The proxy runs on every request to `/login` and `/register`:

| Scenario                                 | Action              |
| ---------------------------------------- | ------------------- |
| User visits `/login` while signed in     | Redirect to `/docs` |
| User visits `/register` while signed in  | Redirect to `/docs` |
| User visits `/login` while signed out    | Show login page     |
| User visits `/register` while signed out | Show register page  |

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

1. Admin logs in normally
2. Admin navigates to `/users`
3. App checks if MFA is needed (admin role + step-up enabled)
4. If MFA not yet verified → Redirect to MFA challenge
5. Admin completes MFA → Session updated with `mfaVerified: true`
6. Admin can now access the route

### Verifier Options

| Option                 | How To Configure              | Use Case                                       |
| ---------------------- | ----------------------------- | ---------------------------------------------- |
| External MFA service   | `AUTH_MFA_VERIFY_URL`         | Production — integrates with your MFA provider |
| Static code (dev only) | `AUTH_MFA_STATIC_CODE=123456` | Local development — quick testing              |

### Production Safety

```env
# Static MFA is blocked in production by default
# To allow it (not recommended):
ALLOW_STATIC_MFA_IN_PRODUCTION=false
```

---

## 7. Navbar Auth States

The navbar dynamically changes based on auth state:

| State             | Shows                                                                   |
| ----------------- | ----------------------------------------------------------------------- |
| **Not logged in** | Features · Docs · 🌐 Toggle · ☀️ Toggle · **Sign In** · **Get Started** |
| **Logged in**     | Features · Docs · 🌐 Toggle · ☀️ Toggle · **Sign Out**                  |

The auth state is checked via the `useAuth()` hook which calls `GET /api/v1/auth/me` to verify the session.

---

## Related Documentation

| File                                 | What It Covers                                |
| ------------------------------------ | --------------------------------------------- |
| [Architecture](docs/architecture.md) | System layers, request path, design decisions |
| [How to Use](docs/how-to-use.md)     | Setup, env config, switching auth modes       |

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
