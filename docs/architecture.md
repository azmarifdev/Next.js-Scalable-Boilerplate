# Architecture

This template is a config-driven Next.js App Router platform for SaaS, ecommerce, and admin products.

## Core Principle

All platform decisions are controlled by `appConfig` in `src/lib/config/app-config.ts`.

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

## Layered Architecture

- `src/components/*`: reusable UI primitives and shared visual components.
- `src/modules/*`: business features (components, hooks, services, types, validation).
- `src/services/*`: transport and API client layer (`rest/`, `graphql/`, orchestration client).
- `src/lib/*`: system internals (config, db providers, auth internals, security, observability).
- `src/providers/*`: global React providers (theme, query, auth, state, toast).

## Data Flow

`Page -> Module -> Service -> API Layer -> Backend`

No direct `fetch`/`axios` calls are made from UI components.

## API Strategy

- REST is default.
- GraphQL is optional via the same client abstraction.
- External backend is default.
- Internal Next.js API routes are optional and guarded by backend mode.

## Database Strategy

Database provider abstraction lives in:

- `src/lib/db/index.ts`
- `src/lib/db/providers/mongo.ts`
- `src/lib/db/providers/drizzle.ts`
- `src/lib/db/providers/prisma.ts`

MongoDB is the default provider. PostgreSQL (Drizzle) is optional.

## Authentication Strategy

Two auth providers are supported through one interface:

- `custom` (default): internal JWT + refresh flow (or external backend custom auth).
- `nextauth` (optional): NextAuth credentials + optional Google OAuth.

## Feature Flags

Feature toggles are controlled by `appConfig.features` and enforced in:

- UI navigation and rendering.
- Route proxy/middleware checks.
- API handlers.

## Error Handling

- Unified API response envelope (`ApiResponse<T>`).
- Central response normalization in service clients.
- Global error boundary in `src/app/global-error.tsx`.
- Module-level empty/error/loading states.

## Testing

- Unit and integration: Vitest.
- End-to-end: Playwright.
- Jest removed.
