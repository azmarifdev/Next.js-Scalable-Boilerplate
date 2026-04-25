# Architecture

## Core Layers

- `src/modules`: business logic
- `src/lib`: core systems and platform concerns
- `src/services`: API/external access layer
- `src/providers`: app providers

## API

- REST only
- Internal routes under `src/app/api/v1/*`

## Database

- PostgreSQL only
- Drizzle client in `src/lib/db/providers/drizzle.ts`
- Schema in `src/lib/db/schema.ts`

## Auth

- Default provider: Better Auth (`better-auth` mode)
- Optional provider mode: `custom`
- Internal auth API handlers:
  - `src/app/api/v1/auth/login/route.ts`
  - `src/app/api/v1/auth/register/route.ts`
  - `src/app/api/v1/auth/me/route.ts`
  - `src/app/api/v1/auth/logout/route.ts`
  - `src/app/api/v1/auth/refresh/route.ts`
