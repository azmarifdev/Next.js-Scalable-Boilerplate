# Next.js Starter Boilerplate

Production-ready Next.js App Router boilerplate by **[A. Z. M. Arif](https://azmarif.dev)** for SaaS dashboards and product frontends.

## Highlights

- Built and maintained by **[Azmarif Dev](https://azmarif.dev)**
- External backend-first architecture
- REST + GraphQL transport layer support
- Config-driven runtime modes
- MongoDB default, PostgreSQL optional
- Custom auth and NextAuth support
- Clean module boundaries with scalable feature structure
- Docker-first deployment
- Supports npm, pnpm, yarn, and bun workflows

## Runtime Baseline

- Node.js: `22.x` (see `.nvmrc`)
- npm: `10.x` (default CI manager)
- Engines: `>=20 <23` (for compatibility window)

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
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Alternative install commands:

```bash
pnpm install --frozen-lockfile
yarn install --frozen-lockfile --non-interactive
bun install --frozen-lockfile
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

Important guardrail:

- `backendMode=internal` + `authProvider=custom` supports only `apiMode=rest` in this template.

## Package Manager Policy

- Contributors may use npm, pnpm, yarn, or bun locally.
- CI quality pipeline runs with npm, and lockfile consistency is validated across npm/pnpm/yarn (bun when lockfile exists).
- When dependencies change, keep lockfiles consistent and do not submit partial lockfile updates.
- Manager migration strategy and guardrails are documented in `docs/migrations/package-manager.md`.

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
- `docs/migrations/package-manager.md`
- `docs/guides/README.md`

## Branding

- Author: **[A. Z. M. Arif (Azmarif Dev)](https://azmarif.dev)**
- Website: `https://azmarif.dev`
- GitHub: `https://github.com/azmarifdev`

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run e2e
npm run docs:check
npm run docker:up
```
