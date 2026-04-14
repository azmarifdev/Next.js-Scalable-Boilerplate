# Azmarif Dev Next.js Starter

Production-ready Next.js App Router boilerplate by **Azmarif Dev** for SaaS dashboards and product frontends.

## Highlights

- Built and maintained by **Azmarif Dev**
- External backend-first architecture
- REST + GraphQL transport layer support
- Config-driven runtime modes
- MongoDB default, PostgreSQL optional
- Custom auth and NextAuth support
- Clean module boundaries with scalable feature structure
- Docker-first deployment
- npm-first workflow (pnpm lockfile also included)

## Core Rules

- `modules/` contains business features only
- `components/` contains reusable UI only
- `services/` contains API communication only
- `lib/` contains system internals only
- `providers/` contains global providers composed in one place

Data flow:

`Page -> Module -> Service -> API -> Backend`

## Quick Start

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm run dev
```

## Required Config

Main config is in `src/lib/config/app-config.ts`.

```ts
export const appConfig = {
  apiMode: "rest", // rest | graphql
  backendMode: "external", // external | internal
  dbProvider: "mongo", // mongo | postgres
  authProvider: "custom", // custom | nextauth
  features: {
    ecommerce: true,
    billing: true,
    admin: true
  }
};
```

## API Strategy

- External backend is default.
- Frontend does not define business APIs.
- Internal route handlers are retained only for auth support:
  - `src/app/api/auth/[...nextauth]/route.ts`
  - `src/app/api/v1/auth/*`

## Documentation

- `docs/architecture.md`
- `docs/folder-structure.md`
- `docs/auth-flow.md`
- `docs/how-to-use.md`
- `docs/deployment/cloud-providers.md`

## Branding

- Author: **A. Z. M. Arif (Azmarif Dev)**
- Website: `https://azmarif.dev`
- GitHub: `https://github.com/azmarifdev`

## Commands

```bash
pnpm run dev
pnpm run build
pnpm run start
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run e2e
pnpm run docs:check
pnpm run docker:up
```
