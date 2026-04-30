# How to Use

## Purpose

Use this file for first-time setup and daily local workflow.

## Covers

- Local install
- Environment configuration
- Running app and tests
- Auth mode switching
- Database commands

## 1. Install

```bash
pnpm install
pnpm run setup
```

## 2. Configure `.env.local`

Copy from `.env.example`.

Minimum internal mode:

- `NEXT_PUBLIC_BACKEND_MODE=internal`
- `NEXT_PUBLIC_AUTH_PROVIDER=better-auth`
- `DATABASE_URL=...`
- `AUTH_SESSION_SECRET=...`

Optional dev flags:

- `ALLOW_DEMO_AUTH=false`
- `ALLOW_INSECURE_DEV_AUTH=false`
- `REQUIRE_ADMIN_STEP_UP_AUTH=false`

## 3. Run

```bash
pnpm run dev
```

## 4. Switch Auth Modes

Internal default:

- `NEXT_PUBLIC_AUTH_PROVIDER=better-auth`

External custom auth:

- `NEXT_PUBLIC_AUTH_PROVIDER=custom-auth`
- `NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true`
- `ENABLE_CUSTOM_AUTH=true`
- `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://...`

## 5. Database Operations

```bash
pnpm run db:generate
pnpm run db:migrate
pnpm run db:studio
```

## 6. Quality Checks

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:integration
pnpm run e2e
pnpm run build
```

## 7. Useful Dev Routes

- `/login`
- `/register`
- `/dashboard`
- `/dev/flags`
- `/docs`

## Related Files

- `src/lib/config/env.ts`
- `src/lib/config/validate.ts`
- `src/lib/config/featureFlags.ts`
- `src/app/api/v1/auth/*`
