# Architecture

This template is a production-ready Next.js App Router frontend designed to consume an external backend by default.

## Goals

- clean and predictable boundaries
- minimal abstractions with clear ownership
- config-driven behavior without hidden coupling
- scalable for SaaS-style modules

## Architecture Rules

- `src/modules/*`: business features only (feature UI, hooks, validation, feature services)
- `src/components/*`: reusable UI only
- `src/services/*`: API communication only (`apiClient`, `rest`, `graphql`)
- `src/lib/*`: system-level concerns only (config, auth core, db adapters, security, observability, utils)
- `src/providers/*`: global app providers only, composed once in `src/providers/index.tsx`

## Data Flow

`Page -> Module -> Service -> API -> Backend`

UI does not call transport clients directly.

## API Strategy

- External backend is the default mode (`NEXT_PUBLIC_BACKEND_MODE=external`).
- Frontend does not define business APIs.
- Next.js route handlers are kept only for auth provider support:
  - `src/app/api/auth/[...nextauth]/route.ts`
  - `src/app/api/v1/auth/*`
- Business endpoints such as projects/tasks/users/billing/ecommerce are consumed from the external backend through `src/services/*`.

## Config System

Runtime platform configuration is centralized in:

- `src/lib/config/app-config.ts`
- `src/lib/config/runtime.ts`
- `src/lib/config/validate.ts`

Important switches:

- `apiMode`: `rest | graphql`
- `backendMode`: `external | internal` (external default)
- `dbProvider`: `mongo | postgres` (mongo default)
- `authProvider`: `custom | nextauth`

## Auth Architecture

- `src/modules/auth/*`: auth UI and feature orchestration.
- `src/lib/auth/*`: core provider implementations and internals.
- Active provider is selected by config through `src/lib/auth/auth.provider.ts`.

## Database Architecture

- Active provider is selected once at runtime via `NEXT_PUBLIC_DB_PROVIDER`.
- MongoDB is default.
- PostgreSQL is optional.
- DB adapters are isolated to `src/lib/db/providers/*`.

## Provider Composition

`src/providers/index.tsx` is the single composition entry for all global providers and is used once in the root layout.

## Deployment Model

Docker-first deployment is canonical:

- `Dockerfile`
- `docker-compose.yml`

Cloud-provider notes are documentation-only (`docs/deployment/cloud-providers.md`).
