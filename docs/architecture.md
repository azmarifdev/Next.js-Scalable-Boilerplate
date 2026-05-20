# Architecture

## Purpose

This document explains how the boilerplate is structured at a system level — the layers, data flow, and design decisions. Read this **before** making significant code changes so you understand where things belong and what shouldn't be touched.

---

## High-Level Layers

The application is organized into these layers:

```
┌─────────────────────────────────────────────┐
│          App / UI Layer                     │
│  src/app (pages, layouts, route handlers)   │
│  src/components (reusable UI components)    │
├─────────────────────────────────────────────┤
│          Domain Modules                     │
│  src/modules/auth (auth logic & components) │
├─────────────────────────────────────────────┤
│          API Layer                          │
│  src/app/api/v1/ (versioned REST endpoints) │
├─────────────────────────────────────────────┤
│          Core Infrastructure                │
│  src/lib/auth/   src/lib/config/           │
│  src/db/         src/lib/security/         │
│  src/lib/observability/                    │
├─────────────────────────────────────────────┤
│          Integration Providers              │
│  src/providers/ (theme, query, toast, auth) │
└─────────────────────────────────────────────┘
```

### Layer Rules

- **UI** can import from **Modules** and **Providers**
- **Modules** can import from **Core Infrastructure**
- **Core Infrastructure** should not import from **UI** or **Modules**
- **API Routes** use **Core Infrastructure** for auth, validation, and responses

---

## Runtime Modes

The boilerplate supports two runtime configurations that change how the app behaves.

### Backend Mode

Controls where API logic runs:

| Mode       | Description                                                                                       | When To Use                                          |
| ---------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `internal` | API routes run inside the same Next.js app. Frontend and backend are one deployment.              | Simplest setup. Great for most projects.             |
| `external` | API routes are disabled. The frontend talks to a separate backend via `NEXT_PUBLIC_API_BASE_URL`. | You have a separate backend (Node, Go, Python, etc.) |

Set with: `NEXT_PUBLIC_BACKEND_MODE=internal` or `external`.

### Auth Provider Mode

Controls where authentication logic runs:

| Mode          | Description                                                                       | When To Use                                   |
| ------------- | --------------------------------------------------------------------------------- | --------------------------------------------- |
| `better-auth` | Auth routes are built-in. Login, register, session — everything runs in this app. | You want a self-contained app.                |
| `custom-auth` | Auth is delegated to an external Identity Provider (IdP).                         | You have an existing auth system or need SSO. |

Set with: `NEXT_PUBLIC_AUTH_PROVIDER=better-auth` or `custom-auth`.

---

## Request Path (Internal Mode)

Here's the journey of a typical request:

```
Browser
  │
  ▼
1. Next.js App Router renders page
  │
  ▼
2. If page is /login or /register:
   ──► proxy.ts checks session cookie
       ├─ Signed in? → Redirect to /docs
       └─ Not signed in? → Show login/register page
  │
  ▼
3. API request (e.g., POST /api/v1/auth/login):
   ──► Route handler processes request
       ├─ Validates input with Zod
       ├─ Calls service layer (e.g., auth service)
       ├─ Interacts with database via Drizzle
       └─ Returns standardized JSON response
  │
  ▼
4. Response sent back to browser
```

### Key Files in the Request Path

| Step                 | File                              | What It Does                               |
| -------------------- | --------------------------------- | ------------------------------------------ |
| Route protection     | `src/proxy.ts`                    | Middleware that checks auth and redirects  |
| Session verification | `src/lib/auth/session.ts`         | Creates and verifies signed session tokens |
| API response format  | `src/lib/utils/api-response.ts`   | Standardizes API response envelopes        |
| Input validation     | `src/modules/auth/auth.schema.ts` | Zod schemas for auth payloads              |

---

## Configuration Architecture

### Centralized URL / Origin (`src/lib/config/url.ts`)

A single source of truth for all URLs instead of scattered `http://localhost:3000` strings.

| Function                    | Purpose                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `getLocalAppOrigin()`       | Derives local origin from `APP_PROTOCOL://APP_HOST:PORT`         |
| `getConfiguredSiteOrigin()` | Returns `NEXT_PUBLIC_SITE_URL` or Vercel fallback (`VERCEL_URL`) |
| `getSiteOrigin()`           | Configured origin → local origin fallback                        |

All consumers (`site-config.ts`, `cookie-security.ts`, `redirect.ts`, Playwright config, sitemap, robots) use these functions — never raw strings.

### Runtime Validation (`src/lib/config/validate.ts`)

Runs at app startup to catch missing env vars before they cause runtime errors. Checks `DATABASE_URL`, `AUTH_SESSION_SECRET`, and custom auth configuration.

### i18n Architecture

```
src/i18n/
├── routing.ts   → Locale list (8 locales), default locale, routing config
├── config.ts    → i18n config object
├── request.ts   → Reads NEXT_LOCALE cookie, loads messages
├── navigation.ts → next-intl navigation helpers
└── messages/    → JSON translation files
    ├── en.json  → English
    ├── bn.json  → Bangla
    ├── es.json  → Spanish
    ├── fr.json  → French
    ├── de.json  → German
    ├── hi.json  → Hindi
    ├── ja.json  → Japanese
    └── ar.json  → Arabic
```

The language switcher in the Navbar is a dropdown that cycles through all 8 locales, sets a `NEXT_LOCALE` cookie, and refreshes the page. Each locale has full translations for nav, buttons, features, and docs descriptions.

---

## Auth & Security Design

### Session Tokens

When a user logs in, the server creates a **signed session token** stored in an httpOnly cookie:

```
Cookie: auth_token=<signed-jwt-like-token>
```

The token contains:

- `sub` — User ID
- `email` — User's email
- `role` — `admin` or `user`
- `mfaVerified` — Whether MFA was completed (for admin step-up)
- `iat` / `exp` — Issued at / Expiration timestamps

### Security Controls

| Protection             | Implementation                                                 | Location                                               |
| ---------------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| CSP with nonce         | Per-request random nonce, `strict-dynamic` mode                | `src/proxy.ts`, `src/lib/security/security-headers.ts` |
| HSTS                   | `max-age=31536000; includeSubDomains; preload`                 | `src/lib/security/security-headers.ts`                 |
| All security headers   | Centralized module applied at 3 layers (Edge, Middleware, API) | `src/lib/security/security-headers.ts`                 |
| Global rate limiting   | IP-based, 100 req/min general, 30/min auth                     | `src/lib/security/api-security.ts`                     |
| CSRF protection        | Double-submit cookie pattern with timing-safe comparison       | `src/lib/security/csrf.ts`                             |
| Input sanitization     | Null bytes, CRLF, length limits, ReDoS prevention              | `src/lib/security/input-validator.ts`                  |
| Body size validation   | Max 100 KB per request                                         | `src/lib/security/api-security.ts`                     |
| Same-origin check      | Validates request origin on sensitive endpoints                | `src/lib/security/request-origin.ts`                   |
| Redirect validation    | Prevents open redirect attacks                                 | `src/lib/security/redirect.ts`                         |
| Rate limiting          | In-memory + Upstash Redis rate limiter                         | `src/lib/security/rate-limit.ts`                       |
| Atomic account lockout | SQL `+ 1` increment prevents race condition bypass             | `src/lib/auth/auth-user.repository.ts`                 |
| Password hashing       | Scrypt (CPU/memory-hard) with random 16-byte salt              | `src/lib/auth/password.ts`                             |
| Session tokens         | HMAC-SHA256 signed, HttpOnly + SameSite=Strict                 | `src/lib/auth/session.ts`                              |
| Key rotation           | `AUTH_SESSION_SECRETS` comma-separated list, first signs       | `src/lib/auth/session.ts`                              |
| Audit logging          | Logs login/register outcomes for monitoring                    | `src/lib/auth/auth-audit.repository.ts`                |
| RBAC                   | Role-based permissions for admin/user                          | `src/lib/auth/rbac.ts`                                 |
| MFA step-up            | Optional admin MFA verification for sensitive routes           | `src/lib/auth/step-up.ts`                              |
| Route protection       | Auth gate + security headers middleware                        | `src/proxy.ts`                                         |
| AI security            | Automated via `withApiHandler()` for all API routes            | `src/app/api/v1/auth/route-utils.ts`                   |

---

## Config System

Environment variables and feature flags are validated at runtime:

```
.env.local
    │
    ▼
src/lib/config/env.ts       ← Schema definition (Zod + @t3-oss)
    │
    ▼
src/lib/config/validate.ts  ← Run on startup to check all required vars
    │
    ▼
src/lib/config/app-config.ts ← Parsed configuration object
    │
    ▼
src/lib/config/featureFlags.ts ← Feature flag definitions & helpers
```

### How to Add a New Environment Variable

1. Add the variable to `.env.example`
2. Add its schema in `src/lib/config/env.ts` (server or client section)
3. Add its runtime value in the `runtimeEnv` section of `env.ts`
4. Use it via `env.YOUR_VARIABLE` in your code

---

## Data Layer

### Database

- **PostgreSQL-compatible providers** — PostgreSQL, Neon, Supabase Postgres
- **Drizzle ORM** — Type-safe SQL query builder and migration tool
- **Runtime DB client** — centralized in `src/db/index.ts`

### Schema Location

- `src/db/schema` — Main database schema definition
- `drizzle/` — Generated migration SQL files

### Provider Pattern

Database access is centralized through:

```
src/db/index.ts
```

Provider switching (PostgreSQL vs Neon vs Supabase Postgres) is handled via `DATABASE_URL`, not separate code providers.

---

## Testing Strategy

| Layer             | Tool       | Location                 |
| ----------------- | ---------- | ------------------------ |
| Unit tests        | Vitest     | `src/tests/unit/`        |
| Integration tests | Vitest     | `src/tests/integration/` |
| End-to-end tests  | Playwright | `src/tests/e2e/`         |

### What to Test Where

- **Unit tests** — Pure functions, utilities, helpers
- **Integration tests** — API routes, auth flows, database operations
- **E2E tests** — Critical user journeys (login, register, navigation)

---

## Related Docs

| Document                                | What It Covers                                    |
| --------------------------------------- | ------------------------------------------------- |
| [How to Use](how-to-use.md)             | First-time setup and daily workflow               |
| [Auth Flow](auth-flow.md)               | Authentication lifecycle, MFA, session management |
| [Folder Structure](folder-structure.md) | Directory-level responsibilities and conventions  |
| [Workflows](workflows.md)               | GitHub Actions, CI/CD, automation                 |
| [Guides Index](guides/README.md)        | Operations playbook and deeper guides             |
