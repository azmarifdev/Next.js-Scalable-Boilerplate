# Next.js Advanced Starter Platform

A production-focused, config-driven Next.js App Router boilerplate for SaaS apps, ecommerce products, and admin dashboards.

This template is designed for real teams shipping real products: modular architecture, predictable data flow, scalable feature boundaries, and strong defaults.

## Why This Template

- Config-driven platform behavior, not hardcoded decisions.
- MongoDB-first by default, PostgreSQL-ready.
- REST-first by default, GraphQL-ready.
- External backend-first by default, internal API-ready.
- Full auth system with custom JWT flow and optional NextAuth.
- Feature-toggle support for ecommerce, billing, and admin modules.
- TanStack Query-first data fetching architecture.

## Core Configuration

Main configuration lives in `src/lib/config/app-config.ts`.

```ts
export const appConfig = {
  apiMode: "rest", // "rest" | "graphql"
  backendMode: "external", // "external" | "internal"

  dbProvider: "mongo", // "mongo" | "postgres"
  authProvider: "custom", // "custom" | "nextauth"

  features: {
    ecommerce: true,
    billing: true,
    admin: true
  }
};
```

You control behavior through env variables in `.env.local`.

## Architectural Principles

### 1) Feature Modules First

Every business feature uses this structure:

```txt
modules/{feature}/
  components/
  hooks/
  services/
  types.ts
  validation.ts
```

### 2) Strict Layer Separation

- `components/`: reusable UI only.
- `modules/`: business logic and feature orchestration.
- `services/`: transport and API communication.
- `lib/`: framework/system internals.
- `providers/`: global app providers.

### 3) Standard Data Flow

`Page -> Module -> Service -> API Layer -> Backend`

No direct API calls in UI components.

## Tech Stack

### Framework & Language

- Next.js (App Router)
- React 19
- TypeScript

### Styling & UI

- Tailwind CSS v4
- Radix UI primitives

### State & Data

- TanStack Query (server-state, caching, retries)
- Redux Toolkit (client-state where needed)
- Axios + unified API client abstraction

### Forms & Validation

- React Hook Form
- Zod

### Auth

- Custom auth (JWT/session cookie + refresh endpoint)
- Optional NextAuth (Credentials + optional Google OAuth)

### Database

- MongoDB provider (default)
- PostgreSQL provider via Drizzle (optional)
- Prisma provider scaffold (optional)

### Internationalization

- next-intl

### Testing

- Vitest (unit + integration)
- Playwright (e2e)

### Deployment

- Docker (default)
- Vercel (optional)
- AWS/Azure docs included

## Folder Structure

```txt
src/
  app/
    (auth)/
    (dashboard)/
    api/
  components/
  hooks/
  i18n/
  lib/
    api/
    auth/
    config/
    db/
      providers/
    errors/
    observability/
    security/
  modules/
    auth/
    user/
    project/
    task/
    ecommerce/
    billing/
  providers/
  services/
    apiClient.ts
    rest/
    graphql/
  store/
  styles/
  tests/
```

Detailed docs:

- `docs/architecture.md`
- `docs/folder-structure.md`
- `docs/auth-flow.md`
- `docs/how-to-use.md`

## Getting Started

### 1) Install dependencies

```bash
npm ci
```

### 2) Configure environment

```bash
cp .env.example .env.local
```

Set values in `.env.local`:

```env
NEXT_PUBLIC_API_MODE=rest
NEXT_PUBLIC_BACKEND_MODE=external
NEXT_PUBLIC_DB_PROVIDER=mongo
NEXT_PUBLIC_AUTH_PROVIDER=custom

NEXT_PUBLIC_FEATURE_ECOMMERCE=true
NEXT_PUBLIC_FEATURE_BILLING=true
NEXT_PUBLIC_FEATURE_ADMIN=true

NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

MONGODB_URI=
MONGODB_DB_NAME=nextjs_starter_template
DATABASE_URL=

AUTH_SESSION_SECRET=
AUTH_SESSION_SECRETS=
AUTH_GOOGLE_CLIENT_ID=
AUTH_GOOGLE_CLIENT_SECRET=
```

## Required Manual Configuration

These values depend on each user/team and must be set before real usage.

| Variable                                              | Required When                                | Example                     |
| ----------------------------------------------------- | -------------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_BACKEND_MODE`                            | Always                                       | `external`                  |
| `NEXT_PUBLIC_API_BASE_URL`                            | `backendMode=external`                       | `https://api.myapp.com`     |
| `NEXT_PUBLIC_API_MODE`                                | Always                                       | `rest`                      |
| `NEXT_PUBLIC_DB_PROVIDER`                             | Always                                       | `mongo`                     |
| `NEXT_PUBLIC_AUTH_PROVIDER`                           | Always                                       | `custom`                    |
| `MONGODB_URI` + `MONGODB_DB_NAME`                     | `dbProvider=mongo` and internal auth/data    | `mongodb://localhost:27017` |
| `DATABASE_URL`                                        | `dbProvider=postgres` and internal auth/data | `postgres://...`            |
| `AUTH_SESSION_SECRET` or `AUTH_SESSION_SECRETS`       | internal custom auth                         | `long-random-secret`        |
| `AUTH_GOOGLE_CLIENT_ID` + `AUTH_GOOGLE_CLIENT_SECRET` | NextAuth Google OAuth                        | values from Google Cloud    |

## Setup Path By Use Case

### Path A: External Backend (Default, Recommended)

Use this when your API/auth/database are in a separate backend service.

```env
NEXT_PUBLIC_BACKEND_MODE=external
NEXT_PUBLIC_API_MODE=rest
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_AUTH_PROVIDER=custom
```

Notes:

- Internal `src/app/api/v1/*` routes are disabled in this mode.
- Your external backend must expose equivalent endpoints/contracts.

### Path B: Internal API (Optional)

Use this when you want Next.js route handlers to serve API/auth.

```env
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_API_MODE=rest
NEXT_PUBLIC_DB_PROVIDER=mongo
NEXT_PUBLIC_AUTH_PROVIDER=custom
MONGODB_URI=...
MONGODB_DB_NAME=...
AUTH_SESSION_SECRET=...
```

### Path C: NextAuth (Optional)

```env
NEXT_PUBLIC_AUTH_PROVIDER=nextauth
```

Optional Google OAuth:

```env
AUTH_GOOGLE_CLIENT_ID=...
AUTH_GOOGLE_CLIENT_SECRET=...
```

### Path D: GraphQL (Optional)

```env
NEXT_PUBLIC_API_MODE=graphql
```

Then implement/point to a GraphQL endpoint compatible with your selected backend mode.

### 3) Run development server

```bash
npm run dev
```

## Configuration Modes

### API Mode

- `rest` (default): calls REST endpoints.
- `graphql` (optional): uses GraphQL transport client.

### Backend Mode

- `external` (default): frontend targets external backend via `NEXT_PUBLIC_API_BASE_URL`.
- `internal` (optional): enables internal API routes under `src/app/api/v1/*`.

### DB Provider

- `mongo` (default): MongoDB provider.
- `postgres` (optional): Drizzle/Postgres provider.

### Auth Provider

- `custom` (default): custom session/JWT flow.
- `nextauth` (optional): NextAuth integration.

## Auth System Overview

### Custom Auth (Default)

- Login, register, logout, me endpoint.
- Refresh endpoint: `POST /api/v1/auth/refresh`.
- Role-based guards via proxy and server permissions.

### NextAuth (Optional)

- Route: `src/app/api/auth/[...nextauth]/route.ts`.
- Credentials provider included.
- Google provider auto-enabled when Google env vars exist.

## Role & Permission Model

Roles:

- `admin`
- `user`

Permissions include:

- `dashboard:read`
- `users:read`
- `projects:read`
- `tasks:read`
- `auth:manage`

Enforcement points:

- `src/proxy.ts` route protection.
- `src/lib/auth/session-guard.ts` API permission checks.
- Feature/UI rendering guards.

## Feature Toggles

Control optional modules through config flags:

```ts
features: {
  ecommerce: true,
  billing: false,
  admin: true
}
```

Current usage:

- Admin flag controls user/admin surfaces and route behavior.
- Ecommerce and billing module scaffolds are included and config-gated.

## Data Fetching Rules

- TanStack Query is mandatory for async server data.
- Module hooks own query keys and query/mutation logic.
- Components consume hooks and render loading/error/empty states.

## API Response Standard

```ts
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};
```

The client layer normalizes error handling before data reaches modules.

## Error, Loading, and Notifications

- Global error boundary: `src/app/global-error.tsx`
- API error normalization in service client layer
- Module-level empty/loading/error UI states
- Global toast notifications for success/error/info

## Scripts

Core scripts:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:integration`
- `npm run e2e`

Database and Docker scripts are available in `package.json`.

## Testing

- Unit/integration with Vitest under `src/tests`.
- E2E with Playwright.
- Jest is not used.

### E2E Important Note

Playwright config uses `NEXT_PUBLIC_BACKEND_MODE=internal` for the test web server so built-in auth E2E flows can run against internal routes.

This is test-only behavior in [playwright.config.ts](/data/Code/Template/Frontend/nextjs-starter-template/playwright.config.ts) and does not change your app's default runtime mode (`external`).

## Common Misconfigurations

1. `backendMode=external` but missing `NEXT_PUBLIC_API_BASE_URL`.
2. `backendMode=internal` but missing DB connection values.
3. `authProvider=nextauth` without provider credentials/config.
4. Enabling GraphQL mode without a working GraphQL backend endpoint.

## Deployment

### Docker (Default)

```bash
npm run docker:build
npm run docker:run
```

Or compose:

```bash
npm run docker:up
```

### Vercel (Optional)

- `vercel.json` is included.
- Set env vars in Vercel project settings.

### AWS/Azure

- Use deployment guides under `deploy/`.

## Cleanup and Tooling Notes

Editor/AI assistant configs are stored under `docs/tools/` to keep project root production-focused.

## Contributing

1. Create a feature branch.
2. Keep changes module-scoped and config-driven.
3. Run lint, typecheck, and tests before opening PR.
4. Update docs when architecture behavior changes.

## License

See project license file and repository policy.
