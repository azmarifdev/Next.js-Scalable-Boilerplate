# Folder Structure

## Purpose

This file maps each major folder to ownership/responsibility.

## Root Map

- `src/app` -> pages, layouts, route handlers
- `src/components` -> reusable UI blocks
- `src/modules` -> domain-level logic and hooks
- `src/lib` -> core infrastructure (auth/db/config/security)
- `src/providers` -> app-level provider composition
- `src/services` -> HTTP/API client helpers
- `src/tests` -> unit/integration/e2e tests
- `docs` -> project documentation
- `scripts` -> setup and maintenance scripts

## App Router Areas

- `src/app/(auth)` -> login/register pages
- `src/app/(dashboard)` -> protected app pages
- `src/app/api/v1` -> versioned REST endpoints
- `src/app/dev/flags` -> local flag override UI

## Domain Modules

Core modules:

- `src/modules/auth`
- `src/modules/user`
- `src/modules/project`
- `src/modules/task`

Optional modules:

- `src/modules/optional/auth`
- `src/modules/optional/billing`
- `src/modules/optional/ecommerce`

## Infra Folders

- `src/lib/auth` -> session, adapter, guard, audit
- `src/lib/config` -> env parsing and feature flags
- `src/lib/db` -> schema and providers
- `src/lib/security` -> origin/redirect/rate-limit
- `src/lib/observability` -> logger/tracing/request-id

## Testing Layout

- `src/tests/unit`
- `src/tests/integration`
- `src/tests/e2e`

## Related Docs

- `docs/architecture.md`
- `docs/auth-flow.md`
