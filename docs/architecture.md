# Architecture

## Purpose

This file explains system design so new contributors can reason about boundaries before editing code.

## High-Level Layers

- App/UI layer: `src/app`, `src/components`
- Domain modules: `src/modules/*`
- API layer: `src/app/api/v1/*`
- Core infrastructure: `src/lib/*`
- Integration providers: `src/providers/*`

## Runtime Modes

- Backend mode
  - `internal`: UI + API in same app
  - `external`: UI talks to external backend via base URL
- Auth provider mode
  - `better-auth`: internal auth routes
  - `custom-auth`: external IdP adapter

## Request Path (Internal Mode)

1. Browser loads App Router page
2. Protected route hits `src/proxy.ts`
3. Session cookie verified in `src/lib/auth/session.ts`
4. UI or API route continues
5. API handlers return standard envelope

## Auth & Security Design

- Signed cookie session token (`auth_token`)
- Same-origin check on sensitive auth endpoints
- In-memory auth/MFA rate limiting
- Optional admin step-up MFA for `/users`
- Audit log writes for login/register outcomes

## Config Design

- Environment schema: `src/lib/config/env.ts`
- Runtime validation: `src/lib/config/validate.ts`
- Runtime flags: `src/lib/config/featureFlags.ts`

## Data Design

- PostgreSQL + Drizzle only
- Schema in `src/lib/db/schema.ts`
- Providers in `src/lib/db/providers/*`

## Testing Strategy

- Unit: `src/tests/unit`
- Integration: `src/tests/integration`
- E2E: `src/tests/e2e`

## Related Docs

- `docs/auth-flow.md`
- `docs/folder-structure.md`
- `docs/workflows.md`
