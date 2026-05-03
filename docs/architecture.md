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
│  src/lib/db/     src/lib/security/         │
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

| Protection          | Implementation                                  | Location                                |
| ------------------- | ----------------------------------------------- | --------------------------------------- |
| Same-origin check   | Validates request origin on sensitive endpoints | `src/lib/security/request-origin.ts`    |
| Redirect validation | Prevents open redirect attacks                  | `src/lib/security/redirect.ts`          |
| Rate limiting       | In-memory rate limiter for auth endpoints       | `src/lib/security/rate-limit.ts`        |
| Audit logging       | Logs login/register outcomes for monitoring     | `src/lib/auth/auth-audit.repository.ts` |
| CSP headers         | Content Security Policy in next.config.ts       | `next.config.ts`                        |

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

- **PostgreSQL** — The only supported database
- **Drizzle ORM** — Type-safe SQL query builder and migration tool
- **Neon Serverless** — Optional adapter for serverless PostgreSQL

### Schema Location

- `src/lib/db/schema.ts` — Main database schema definition
- `drizzle/` — Generated migration SQL files

### Provider Pattern

Database connections are managed through providers:

```
src/lib/db/providers/
  ├── neon.provider.ts   (serverless/Neon)
  └── node.provider.ts   (standard Node.js PostgreSQL)
```

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

| Document                                     | What It Covers                                    |
| -------------------------------------------- | ------------------------------------------------- |
| [Auth Flow](docs/auth-flow.md)               | Authentication lifecycle, MFA, session management |
| [Folder Structure](docs/folder-structure.md) | Directory-level responsibilities and conventions  |
| [Workflows](docs/workflows.md)               | GitHub Actions, CI/CD, automation                 |
