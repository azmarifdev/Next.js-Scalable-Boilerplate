# Folder Structure

## Purpose

This document maps each major directory to its ownership and responsibility. Use it as a reference when adding new files or deciding where code belongs.

---

## Root Directory Overview

```
├── src/             → Application source code
├── docs/            → Project documentation
├── config/          → Shared configuration (metadata, etc.)
├── scripts/         → Setup and maintenance scripts
├── drizzle/         → Generated SQL migration files
├── .github/         → GitHub workflows and templates
├── .husky/          → Git hooks (commitlint, etc.)
├── .storybook/      → Storybook configuration
├── public/          → Static assets
```

---

## `src/` — Application Code

```
src/
├── app/             → Next.js App Router (pages, layouts, APIs)
├── components/      → Reusable UI components
├── modules/         → Domain-level logic and components
├── hooks/           → Shared React hooks
├── lib/             → Core infrastructure
├── providers/       → App-level provider composition
├── services/        → HTTP/API client helpers
├── i18n/            → Internationalization setup
├── store/           → State management (optional)
├── styles/          → Global CSS
├── tests/           → Tests (unit, integration, e2e)
├── types/           → Shared TypeScript type definitions
├── utils/           → Shared utility functions
```

---

## `src/app/` — Next.js App Router

This is where pages, layouts, and API routes live.

```
src/app/
├── (auth)/          → Auth pages (login, register)
│   ├── login/
│   │   └── page.tsx       → Login page with demo credentials auto-fill
│   └── register/
│       └── page.tsx       → Registration page
├── api/
│   └── v1/
│       └── auth/          → Auth API routes
│           ├── login/route.ts
│           ├── register/route.ts
│           ├── me/route.ts
│           ├── logout/route.ts
│           ├── refresh/route.ts
│           └── mfa/verify/route.ts
├── dev/
│   └── flags/             → Feature flag toggle UI (dev only)
├── docs/                  → Documentation hub pages
│   ├── page.tsx           → Docs hub landing page
│   └── [...slug]/
│       └── page.tsx       → Individual doc article page
├── features/
│   └── page.tsx           → Features overview page
├── page.tsx               → Landing / home page
├── layout.tsx             → Root layout (fonts, providers, theme)
├── sitemap.ts             → Dynamic sitemap generation
├── robots.ts              → Robots.txt configuration
├── global-error.tsx       → Global error boundary
├── not-found.tsx          → 404 page
├── loading.tsx            → Loading state
└── error.tsx              → Error boundary
```

### Route Group Conventions

- **(auth)** — Public auth pages; no special layout needed
- Routes without parentheses are regular pages

---

## `src/components/` — UI Components

```
src/components/
├── common/          → Shared UI (Button, Input, etc.)
├── docs/            → Documentation-specific components
│   └── DocsMarkdown.tsx   → Client-side markdown renderer
├── landing/         → Landing page components
│   ├── Navbar.tsx         → Auth-aware navigation bar
│   ├── Hero.tsx           → Hero section with tech icons
│   └── Features.tsx       → Features grid section
└── ui/              → Base UI primitives (Button, Input, etc.)
```

### Component Guidelines

| Directory  | Responsibility                                 |
| ---------- | ---------------------------------------------- |
| `common/`  | Generic reusable components (EmptyState, etc.) |
| `docs/`    | Components used only in the docs hub           |
| `landing/` | Landing page specific sections                 |
| `ui/`      | Primitive UI components (shadcn-style)         |

---

## `src/modules/` — Domain Modules

```
src/modules/
├── auth/            → Authentication module
│   ├── components/        → AuthForm, etc.
│   ├── hooks/             → useAuthForm, etc.
│   ├── services/          → Auth service (login, register, etc.)
│   ├── auth.schema.ts     → Zod validation schemas
│   └── auth.types.ts      → Auth-specific types
└── optional/
    └── auth/              → Custom auth provider adapter
        ├── custom-auth.provider.ts
        ├── custom-auth.adapter.ts
        └── custom-auth.types.ts
```

### Module Pattern

Each module follows this pattern when applicable:

```
module-name/
├── components/     → React components for the module
├── hooks/          → React hooks for the module
├── services/       → Service/API integration layer
├── module.schema.ts    → Zod schemas
└── module.types.ts     → TypeScript types
```

---

## `src/lib/` — Core Infrastructure

```
src/lib/
├── auth/            → Authentication infrastructure
│   ├── session.ts         → Session token creation & verification
│   ├── session-guard.ts   → Permission checking middleware
│   ├── rbac.ts            → Role-based access control
│   ├── step-up.ts         → MFA step-up configuration
│   ├── step-up-guard.ts   → MFA step-up guard
│   ├── auth.provider.ts   → Auth provider abstraction
│   ├── better-auth.provider.ts  → Better Auth implementation
│   └── auth-audit.repository.ts → Audit log writes
├── config/          → Configuration system
│   ├── env.ts             → Environment variable schema
│   ├── validate.ts        → Runtime validation
│   ├── constants.ts       → App constants
│   ├── app-config.ts      → Parsed config object
│   ├── featureFlags.ts    → Feature flag definitions
│   ├── feature-registry.ts → Feature definitions (routes, permissions)
│   └── site-config.ts     → Site-wide configuration
├── db/              → Database layer
│   ├── schema.ts          → Drizzle schema definitions
│   ├── index.ts           → DB client initialization
│   └── providers/         → Database connection providers
├── docs/            → Documentation content helpers
│   └── content.ts         → Doc entries, slug resolution, GitHub links
├── observability/   → Logging and tracing
│   └── logger.ts          → Structured logging
├── security/        → Security utilities
│   ├── request-origin.ts  → Same-origin validation
│   ├── redirect.ts        → Safe redirects
│   └── rate-limit.ts      → Rate limiting
└── utils/           → General utilities
    ├── api-response.ts    → Standard API response helpers
    └── ...                → Other utilities
```

---

## `src/providers/` — App Providers

```
src/providers/
├── index.ts         → Provider composition (AppProviders)
├── auth.provider.ts       → Auth data prefetching
├── query.provider.ts      → TanStack React Query provider
├── theme.provider.ts      → Dark/light theme provider
└── toast.provider.ts      → Toast notification provider
```

Providers wrap the app in the root layout and are ordered by dependency:

```
QueryProvider → ThemeProvider → ToastProvider → AuthProvider → App
```

---

## `src/hooks/` — Shared Hooks

```
src/hooks/
└── useAuth.ts      → Auth hook (user, isAuthenticated, logout)
```

---

## `src/i18n/` — Internationalization

```
src/i18n/
├── config.ts        → i18n configuration
├── routing.ts       → Locale routing
├── navigation.ts    → Navigation helpers
├── request.ts       → Request-time locale detection
└── messages/
    ├── en.json      → English translations
    └── bn.json      → Bangla translations
```

---

## `src/tests/` — Tests

```
src/tests/
├── unit/            → Unit tests (Vitest)
├── integration/     → Integration tests (Vitest)
│   ├── auth-api.test.ts    → Auth API integration tests
│   └── mode-guards.test.ts → Mode guard integration tests
└── e2e/             → End-to-end tests (Playwright)
    ├── home.spec.ts        → Auth flow e2e tests
    └── sanity.check.spec.ts → Basic sanity checks
```

---

## `docs/` — Documentation

```
docs/
├── architecture.md              → System architecture
├── auth-flow.md                 → Authentication flow
├── folder-structure.md          → This file
├── how-to-use.md                → Setup and daily workflow
├── workflows.md                 → GitHub Actions workflows
├── migrations/
│   └── package-manager.md       → Package manager migration guide
├── deployment/
│   └── cloud-providers.md       → Provider-specific deploy guides
├── guides/
│   ├── README.md                → Guides index
│   ├── deployment.md            → Deployment runbook
│   ├── github-setup-checklist.md → Repo hardening checklist
│   ├── project-maintenance.md   → Maintenance routines
│   └── release-automation.md    → Release Please guide
├── bn/                          → Bangla translations of docs
└── tools/                       → AI/agent config files
```

---

## `scripts/` — Automation Scripts

```
scripts/
├── setup.mjs        → First-time project setup
├── start.mjs        → Production server starter
├── seed.mjs         → Database seeding
├── db-reset.mjs     → Database reset
├── clean.mjs        → Project cleanup
└── check-docs.mjs   → Documentation consistency check
```

---

## Related Docs

- [Architecture](docs/architecture.md) — System layers and design decisions
- [How to Use](docs/how-to-use.md) — Setup and daily workflow
