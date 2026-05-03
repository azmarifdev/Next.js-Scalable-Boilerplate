# Next.js Boilerplate (PostgreSQL + Drizzle)

Production-ready Next.js template for modern web applications, e-commerce platforms, and modular web apps.

## Purpose

This README gives you the shortest safe path to run, configure, and ship the template.

## What You Get

- Next.js App Router + TypeScript
- REST API under `/api/v1/*`
- PostgreSQL + Drizzle ORM
- Cookie-based session auth (internal mode)
- Optional external auth provider mode
- Optional module flags (`billing`, `ecommerce`, `admin`)
- React Query data layer
- Vitest + Playwright + CI workflows

## Quick Start

```bash
pnpm install
pnpm run setup
pnpm run dev
```

App runs at `http://localhost:3000`.

## Required Environment

Copy `.env.example` to `.env.local`.

Minimum internal mode:

- `NEXT_PUBLIC_BACKEND_MODE=internal`
- `NEXT_PUBLIC_AUTH_PROVIDER=better-auth`
- `DATABASE_URL=<postgres-connection-string>`
- `AUTH_SESSION_SECRET=<strong-random-secret>`

Common optional flags:

- `ALLOW_DEMO_AUTH=false`
- `ALLOW_INSECURE_DEV_AUTH=false`
- `REQUIRE_ADMIN_STEP_UP_AUTH=false`

## Auth Modes

Default internal auth:

- `NEXT_PUBLIC_AUTH_PROVIDER=better-auth`

External custom auth:

- `NEXT_PUBLIC_AUTH_PROVIDER=custom-auth`
- `NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true`
- `ENABLE_CUSTOM_AUTH=true`
- `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://your-auth-provider.example.com`

## Admin Step-up MFA

Enable:

- `REQUIRE_ADMIN_STEP_UP_AUTH=true`

Recommended verifier settings:

- `AUTH_MFA_VERIFY_URL=https://your-mfa-verifier.example.com/verify`
- `AUTH_MFA_VERIFY_BEARER_TOKEN=<optional-service-token>`

Local-only fallback:

- `AUTH_MFA_STATIC_CODE=123456`
- `ALLOW_STATIC_MFA_IN_PRODUCTION=false`

## Core Scripts

- `pnpm run dev`
- `pnpm run build`
- `pnpm run start`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run test:integration`
- `pnpm run e2e`
- `pnpm run db:generate`
- `pnpm run db:migrate`
- `pnpm run docs:check`

## Documentation Map (File-by-File)

- [How to Use](docs/how-to-use.md): local setup and day-to-day usage
- [Architecture](docs/architecture.md): system layers and design decisions
- [Auth Flow](docs/auth-flow.md): login/register/session/MFA behavior
- [Folder Structure](docs/folder-structure.md): directory-level ownership
- [Workflows](docs/workflows.md): CI/CD/security automation map
- [Migration Package Manager Guide](docs/migrations/package-manager.md): manager policy migration
- [Cloud Providers](docs/deployment/cloud-providers.md): deployment target notes
- [Guides](docs/guides/README.md): operational playbooks

## Release Model

Release Please is configured for automated versioning and changelog/tag flow.

- Do not create release tags manually
- Merge generated `chore(main): release ...` PRs

## License

MIT
