---
name: boilerplate-development
description: Guide for creating features, modules, pages, routing, auth adapters, i18n support, and managing structured configurations in the Next.js boilerplate. Use this skill when implementing new business logic, extending components, setting up multi-language interfaces, or adjusting Next.js App Router endpoints.
---

# Boilerplate Development & Architecture

This skill governs the core development workflow and architecture of the Next.js Boilerplate project. Use this skill to align with the modular structure, code separation guidelines, internationalization, and authentication mechanisms built into the codebase.

## Architectural Principles

1. **Domain Modularity (`src/modules/`)**:
   - Keep business domains isolated. All domain-specific UI components, hooks, services, and schemas must reside in their respective folder inside `src/modules/` (e.g., `src/modules/auth/`).
   - Reusable, cross-domain primitives (like general inputs, button extensions, modal containers) belong in `src/components/ui/` or `src/components/common/`.
   - Core system infrastructure belongs in `src/lib/` (e.g., `src/lib/db/`, `src/lib/auth/`, `src/lib/errors/`, `src/lib/observability/`).

2. **Server Components by Default**:
   - Keep page components as Server Components by default to minimize the client bundle size and optimize database/API fetching times.
   - Use `"use client";` at the top of files only for interactive elements containing hooks like `useState`, `useEffect`, or component context.

3. **Strict Type Safety**:
   - Strict TypeScript (`strict: true`) is enforced.
   - Avoid using the `any` keyword. Define explicit interfaces, type declarations, or leverage generic typed handlers.

---

## Key Core Modules

### 🔐 Authentication & Session Security

- The system supports an Auth Abstraction Layer allowing easy toggling between **Better Auth** (cookie-based sessions running internally) and **Custom Identity Providers**.
- Custom adapters live in `src/modules/optional/auth/`.
- Ensure session security parameters like `httpOnly`, `sameSite=strict` are enforced for all cookie transactions.
- Audit Logging: Maintain audit logs for login attempts using `authAuditLogs` schema tracking Suspicious activities and IP addresses.

### 🌐 Internationalization (i18n)

- The boilerplate supports 8 languages: English (`en`), Bangla (`bn`), Spanish (`es`), French (`fr`), German (`de`), Hindi (`hi`), Japanese (`ja`), and Arabic (`ar`).
- **Translation keys**: All user-facing strings must be localized. Edit/add translation tokens in JSON files under `src/i18n/messages/` (e.g., `src/i18n/messages/en.json` and `src/i18n/messages/bn.json`).
- Ensure every new key has translations added to **all 8 locale files** to prevent localized text fallbacks.
- Dynamic localized titles, pages, and components utilize the `next-intl` server-side translator pattern.

### ⚙️ Feature Flags & Configuration

- Feature flags are configured in `src/lib/config/` and can be customized/toggled in the developer UI at `src/app/dev/flags/` (enabled only in development mode).
- Use `src/lib/config/env` to handle system settings, environment variables, and client-safe vs. server-only configuration flags.

---

## Detailed Implementation Workflows

### Creating a New Feature Domain

To implement a new feature (e.g., a "Product Catalog"), follow these structural steps:

1. **Define the Schema**: Create or extend Drizzle database schemas in `src/db/schema/index.ts`.
2. **Setup the Module Directory**: Create the folder structure:
   ```
   src/modules/products/
   ├── components/       # Product list, item cards, filters
   ├── hooks/            # useProducts, useProductActions
   ├── services/         # API calls via Axios client
   └── schemas/          # Zod validator schemas for product mutations
   ```
3. **Establish API Endpoints**: Create API routes under `src/app/api/v1/products/route.ts` using structured server errors (`src/lib/errors/`) and typed response envelopes (`src/lib/utils/`).
4. **Create Pages & Layouts**: Link the feature module components into pages inside `src/app/[locale]/products/page.tsx` utilizing standard App Router dynamic routing and internationalization wrappers.

### Styling & Component Standards

- **Tailwind CSS v4**: Build interfaces using Tailwind's utility classes.
- **shadcn/ui**: Component primitives live in `src/components/ui/`. If introducing a new shadcn component, use:
  ```bash
  pnpm dlx shadcn@latest add <component-name>
  ```
- **Harmony**: Avoid ad-hoc coloring. Rely strictly on CSS custom properties (variables) defined in the theme variables in `src/styles/` to maintain dark mode capability.
- **Animations**: Implement smooth hover states, dynamic list changes, and glassmorphism elements matching the premium UI look and feel.
