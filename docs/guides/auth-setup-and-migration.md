# Auth Setup and Migration Guide

## Purpose

This guide explains how to choose, configure, and migrate between the two auth modes in this boilerplate:

1. `better-auth`: the built-in internal auth provider
2. `custom-auth`: an external auth/IdP adapter

Use this when adopting the template, preparing production, or replacing the default auth implementation with your own provider.

---

## Important Naming Note

In this repository, `better-auth` is the name of the built-in provider path. It uses this app's own API routes, database tables, signed session cookie, RBAC helpers, rate limiting, and audit logging.

It does not require every feature to come from a third-party package at runtime. Treat it as the internal auth mode unless your project explicitly replaces it.

---

## Auth Modes at a Glance

| Mode          | Where Auth Runs   | Use When                      | Required Base Config                                            |
| ------------- | ----------------- | ----------------------------- | --------------------------------------------------------------- |
| `better-auth` | Inside this app   | You want a self-contained app | `DATABASE_URL`, `AUTH_SESSION_SECRET` or `AUTH_SESSION_SECRETS` |
| `custom-auth` | External auth/IdP | You already have auth/SSO/IdP | `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL`, custom auth flags           |

Both modes use the same app-facing interface:

- UI: `src/modules/auth/components/AuthForm.tsx`
- Hook: `src/hooks/useAuth.ts`
- Service entry: `src/modules/auth/services/auth.service.ts`
- Provider switch: `src/lib/auth/auth.provider.ts`

That means most pages/components do not need to know which auth provider is active.

---

## Source Map

| Area                  | Files                                                            |
| --------------------- | ---------------------------------------------------------------- |
| Provider switch       | `src/lib/auth/auth.provider.ts`                                  |
| Internal provider     | `src/lib/auth/better-auth.provider.ts`                           |
| Internal API routes   | `src/app/api/v1/auth/*`                                          |
| Session cookies       | `src/lib/auth/session.ts`, `src/lib/config/constants.ts`         |
| API guards            | `src/lib/auth/session-guard.ts`, `src/lib/auth/step-up-guard.ts` |
| Database auth records | `src/lib/auth/auth-user.repository.ts`, `src/db/schema/*`        |
| Custom auth adapter   | `src/modules/optional/auth/custom-auth.adapter.ts`               |
| Custom auth types     | `src/modules/optional/auth/custom-auth.types.ts`                 |
| Runtime validation    | `src/lib/config/validate.ts`, `src/lib/config/env.ts`            |
| Frontend auth state   | `src/providers/auth.provider.ts`, `src/hooks/useAuth.ts`         |

---

## Option A: Use Built-In Better Auth

Choose this for normal self-contained products where this Next.js app owns users, passwords, sessions, roles, and auth API routes.

### 1. Configure Environment Variables

Local/staging/production:

```env
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=false
ENABLE_CUSTOM_AUTH=false

DATABASE_URL=postgresql://user:pass@host:5432/db
AUTH_SESSION_SECRET=<strong-random-secret>
```

Generate a strong secret:

```bash
openssl rand -hex 32
```

For secret rotation, prefer `AUTH_SESSION_SECRETS`:

```env
AUTH_SESSION_SECRETS=new-secret,previous-secret
```

Put the newest secret first. Existing cookies signed with older secrets can still verify while new sessions use the first secret.

### 2. Prepare the Database

Internal auth depends on the auth tables in the Drizzle schema. Before testing auth against a real database:

```bash
pnpm db:generate
pnpm db:migrate
```

For local reset/seed workflows:

```bash
pnpm db:reset
pnpm db:seed
```

Use production migrations carefully. See [Database Setup](database-setup.md) before running migrations against shared environments.

### 3. Verify Internal Auth Routes

The built-in provider calls these routes:

| Method | Route                     | Purpose                 |
| ------ | ------------------------- | ----------------------- |
| `POST` | `/api/v1/auth/register`   | Create user and session |
| `POST` | `/api/v1/auth/login`      | Validate credentials    |
| `GET`  | `/api/v1/auth/me`         | Read current user       |
| `POST` | `/api/v1/auth/logout`     | Clear session cookie    |
| `POST` | `/api/v1/auth/refresh`    | Refresh session cookie  |
| `POST` | `/api/v1/auth/mfa/verify` | Verify MFA challenge    |

Smoke test:

1. Run the app.
2. Open `/register`.
3. Create a user.
4. Confirm the browser redirects to `/docs`.
5. Log out.
6. Log in again from `/login`.
7. Refresh the page and confirm the session remains active.

### 4. Keep These Files for Better Auth

Do not remove these if you use internal auth:

- `src/app/api/v1/auth/*`
- `src/lib/auth/better-auth.provider.ts`
- `src/lib/auth/auth-user.repository.ts`
- `src/lib/auth/auth-audit.repository.ts`
- `src/lib/auth/session.ts`
- `src/lib/auth/session-guard.ts`
- auth Drizzle tables/migrations

### 5. Production Checklist

- `DATABASE_URL` points to the production database.
- `AUTH_SESSION_SECRET` or `AUTH_SESSION_SECRETS` is strong and private.
- Production app runs over HTTPS.
- Session cookie is `httpOnly`, `sameSite=strict`, and `secure` in production.
- `/register`, `/login`, `/api/v1/auth/me`, `/api/v1/auth/logout` all work on the deployed domain.
- If `REQUIRE_ADMIN_STEP_UP_AUTH=true`, the MFA verifier config is present.

---

## Option B: Use Custom Auth

Choose this when another system owns identity: company SSO, an existing auth API, OAuth/OIDC gateway, custom Laravel/Rails/Nest auth service, or any external IdP.

### 1. Configure Environment Variables

Minimal custom-auth mode:

```env
NEXT_PUBLIC_AUTH_PROVIDER=custom-auth
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true
ENABLE_CUSTOM_AUTH=true
NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://auth.your-company.com
```

If the rest of your backend is also external, set:

```env
NEXT_PUBLIC_BACKEND_MODE=external
NEXT_PUBLIC_API_BASE_URL=https://api.your-company.com
```

If only auth is external but this app still serves its own APIs, keep:

```env
NEXT_PUBLIC_BACKEND_MODE=internal
```

Current runtime validation still requires `DATABASE_URL` and a session secret whenever `NEXT_PUBLIC_BACKEND_MODE=internal`, even if `NEXT_PUBLIC_AUTH_PROVIDER=custom-auth`. If your project will be fully external, use `NEXT_PUBLIC_BACKEND_MODE=external` or update `src/lib/config/validate.ts` deliberately.

### 2. Match the Adapter Contract

The default custom adapter lives at `src/modules/optional/auth/custom-auth.adapter.ts`.

It currently calls:

| Method | External Path    | Expected Meaning       |
| ------ | ---------------- | ---------------------- |
| `POST` | `/auth/login`    | Login with credentials |
| `POST` | `/auth/register` | Register user          |
| `GET`  | `/auth/me`       | Current user           |
| `POST` | `/auth/logout`   | End session            |
| `POST` | `/auth/refresh`  | Refresh session        |
| `POST` | `/oauth/token`   | Exchange auth code     |
| `POST` | `/mfa/verify`    | Verify MFA challenge   |

The app expects user data shaped like:

```ts
{
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}
```

The adapter can read the user from these response locations:

- `payload.user`
- `payload.profile`
- `payload.account`
- `payload.data`
- `payload.data.user`
- `payload.data.profile`
- `payload.data.account`

If your provider returns a different shape, update:

- `extractUserLike()`
- `normalizeAuthResponse()`
- `normalizeUserResponse()`
- `normalizeBooleanResult()`

### 3. Decide Cookie vs Token Handling

The default custom adapter sends requests with:

```ts
credentials: "include";
```

Use this when your external auth server sets secure cookies for the browser.

Your external provider must then configure CORS correctly:

- `Access-Control-Allow-Origin` must be the exact app origin, not `*`.
- `Access-Control-Allow-Credentials` must be `true`.
- Cookies must use `Secure`, appropriate `SameSite`, and a compatible domain.
- Production auth base URL must use HTTPS.

If your provider returns bearer tokens instead of cookies, update the adapter to store and attach tokens according to your security model. Do not store long-lived secrets in `localStorage` unless you have accepted that risk.

### 4. What to Remove or Disable from Better Auth

If custom auth fully replaces internal auth, you can remove or ignore the internal pieces after the adapter is working.

Safe to keep:

- `src/lib/auth/auth.provider.ts`
- `src/modules/auth/components/AuthForm.tsx`
- `src/modules/auth/services/auth.service.ts`
- `src/hooks/useAuth.ts`
- `src/providers/auth.provider.tsx`
- shared `User`, role, and permission types if your app still uses them

Usually remove or stop using:

- `src/app/api/v1/auth/*`
- `src/lib/auth/better-auth.provider.ts`
- `src/lib/auth/auth-user.repository.ts`
- `src/lib/auth/auth-audit.repository.ts`
- auth-only Drizzle tables and migrations, if no internal users remain
- password hashing utilities if the external provider owns passwords
- internal auth integration tests that hit `/api/v1/auth/*`

Usually keep, but review:

- `src/lib/auth/session-guard.ts` if your internal API routes still need app-side authorization
- `src/lib/auth/rbac.ts` if roles/permissions are still enforced in this app
- `src/proxy.ts` if signed-in users should still be redirected away from `/login` and `/register`
- `src/lib/security/request-origin.ts` and `src/lib/security/redirect.ts`

Important: do not delete internal auth files first. Switch env, adapt `custom-auth.adapter.ts`, verify the app, then remove unused internal pieces in a separate cleanup PR.

### 5. Custom Auth Migration Steps

1. Add custom auth env vars in local/staging.
2. Update `src/modules/optional/auth/custom-auth.adapter.ts` to match the external provider.
3. Run the app with `NEXT_PUBLIC_AUTH_PROVIDER=custom-auth`.
4. Test login, register, `/auth/me`, logout, refresh, and expired-session behavior.
5. Confirm CORS and cookies work in a real browser, not only in API clients.
6. Update tests to mock or hit the custom provider.
7. Deploy to staging and repeat the same browser checks.
8. Switch production env only after staging passes.
9. Remove unused internal auth code only after the custom provider is stable.

### 6. Custom Auth Smoke Test Matrix

| Scenario                  | Expected Result                                   |
| ------------------------- | ------------------------------------------------- |
| Valid login               | user returned, navbar updates, protected UI works |
| Invalid login             | form shows error, no stale user remains           |
| `GET /auth/me` signed in  | returns user with `id`, `name`, `email`, `role`   |
| `GET /auth/me` signed out | adapter reports unauthenticated state cleanly     |
| Logout                    | external session/cookie cleared                   |
| Refresh                   | session remains valid or fails gracefully         |
| CORS failure              | visible error, no silent success                  |

---

## Switching Back from Custom Auth to Better Auth

1. Set:

```env
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=false
ENABLE_CUSTOM_AUTH=false
NEXT_PUBLIC_BACKEND_MODE=internal
DATABASE_URL=postgresql://...
AUTH_SESSION_SECRET=<strong-random-secret>
```

2. Restore internal auth files if they were removed.
3. Run migrations for auth tables.
4. Test `/register`, `/login`, `/api/v1/auth/me`, `/api/v1/auth/logout`.
5. Remove custom provider secrets from production only after the internal path is verified.

---

## Common Questions

### Do I need to change the login/register pages for custom auth?

Usually no. The UI calls `authService`, and `authService` resolves to the active provider. Change the adapter first. Change UI only if your provider needs different fields, such as organization ID, OTP, passkey, or OAuth-only login.

### Do I need `DATABASE_URL` in custom auth mode?

If `NEXT_PUBLIC_BACKEND_MODE=external`, not for this app's internal auth APIs.

If `NEXT_PUBLIC_BACKEND_MODE=internal`, yes, the current runtime validator expects a database because this app still owns internal backend behavior.

### Can I keep internal auth APIs while using custom auth?

Yes during migration, but avoid having two active sources of truth for users. Decide which system owns identity, passwords, sessions, and roles.

### What if my custom provider has roles other than `admin` and `user`?

Update the shared role types and RBAC mapping:

- `src/types/auth.ts`
- `src/types/user.ts`
- `src/lib/auth/rbac.ts`
- `src/modules/optional/auth/custom-auth.adapter.ts`

### What if my provider uses OAuth redirects instead of email/password?

Keep `custom-auth` as the app-facing mode, then change the UI and adapter:

- add a "Continue with SSO" action in `AuthForm`
- redirect to your provider's authorization URL
- handle callback/code exchange using the adapter or a route handler
- return the same app-facing `User` shape

---

## Troubleshooting

### `AUTH_SESSION_SECRET or AUTH_SESSION_SECRETS is required`

You are running with `NEXT_PUBLIC_BACKEND_MODE=internal`.

Fix:

- set `AUTH_SESSION_SECRET`, or
- set `AUTH_SESSION_SECRETS`, or
- switch to `NEXT_PUBLIC_BACKEND_MODE=external` if this app should not run internal backend/auth behavior.

### `DATABASE_URL is required when NEXT_PUBLIC_BACKEND_MODE=internal`

Internal backend mode requires the database.

Fix:

- set `DATABASE_URL`, or
- switch to external backend mode, or
- deliberately update runtime validation if your architecture no longer needs a database.

### `NEXT_PUBLIC_AUTH_PROVIDER=custom-auth` falls back to better-auth

Custom auth is gated by feature flags.

Set both:

```env
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true
ENABLE_CUSTOM_AUTH=true
```

### Custom auth login works in Postman but fails in browser

Check browser-specific requirements:

- CORS origin is exact.
- Credentials are allowed.
- Cookies are `Secure` on HTTPS.
- Cookie domain matches the app/auth domains.
- SameSite policy allows your flow.

### Signed-in users can still open `/login`

`src/proxy.ts` redirects from `/login` and `/register` only when it can verify this app's `auth_token` cookie. If custom auth uses only an external cookie that this app cannot verify, update proxy logic or accept that the client-side auth state controls the UI.

---

## Final Checklist

1. Pick exactly one auth source of truth.
2. Set env vars for that mode in local, staging, production, and CI.
3. Verify login, register, me, logout, refresh.
4. Verify cookie/session behavior in a browser.
5. Update tests for the selected mode.
6. Remove unused internal/custom pieces only after the selected mode is stable.

---

## Related Docs

- [Auth Flow](../auth-flow.md)
- [How to Use](../how-to-use.md)
- [Architecture](../architecture.md)
- [Deployment Guide](deployment.md)
- [Database Setup](database-setup.md)
- [Production Services](production-services.md)
