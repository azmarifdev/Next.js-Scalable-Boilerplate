# Next.js-Boilerplate-PostgresQL-Drizzle

Production-ready Next.js boilerplate with a single, opinionated stack:

- PostgreSQL
- Drizzle ORM
- REST API (`/api/v1`)
- Better Auth as default auth mode

## Requirements

- Node.js `>=20 <23`
- pnpm `10.x`
- PostgreSQL

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm db:migrate
pnpm dev
```

## Environment

```env
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
DATABASE_URL=
AUTH_SESSION_SECRET=
```

`NEXT_PUBLIC_AUTH_PROVIDER` supports:

- `better-auth` (default)
- `custom` (optional mode)

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run e2e`
- `npm run docs:check`

## Architecture

- `src/modules`: business logic
- `src/lib`: core systems
- `src/services`: external/API layer
- `src/providers`: app providers

## API

Internal API routes are versioned under:

- `/api/v1/auth/*`

## Docs

- `docs/architecture.md`
- `docs/folder-structure.md`
- `docs/auth-flow.md`
- `docs/how-to-use.md`
- `docs/migrations/package-manager.md`
- `docs/guides/README.md`
