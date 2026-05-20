# OpenAI Codex Guidelines

These notes and guidelines tune OpenAI Codex-based developer agents for this Next.js boilerplate repository. Follow them to ensure all code generations remain secure, modular, and type-safe.

---

## 🏗️ Tech Stack & Key Directories

- **Core**: Next.js App Router (React 19) + TypeScript
- **Styling**: Tailwind CSS v4 + Vanilla CSS + shadcn/ui
- **Auth Model**: `better-auth` (internal session routes) or `custom-auth` (external adapter)
- **Database**: PostgreSQL database client utilizing Drizzle ORM
- **Directory Structure**:
  - `src/app/` - Application routing, pages, and layouts
  - `src/db/` - Database schemas, seeding scripts, and migrations
  - `src/modules/` - Modular, domain-isolated features and page logic
  - `src/lib/` - Shared services (observability, security, API routing)

---

## 💡 Key Coding Rules

1. **Server Components by Default**:
   - Keep all React components as Server Components by default to optimize bundle size and speed.
   - Use the `"use client";` directive at the top _only_ when client hooks or browser events are mandatory.

2. **Strict Type Safety**:
   - Enforce robust TypeScript types and avoid using `any`.
   - Ensure all configurations map to type-safe environment schemas in `src/lib/config/env.ts`.

3. **Multi-locale Translation (i18n)**:
   - This boilerplate supports 8 languages: English (`en`), Bangla (`bn`), Spanish (`es`), French (`fr`), German (`de`), Hindi (`hi`), Japanese (`ja`), and Arabic (`ar`).
   - All user-facing strings must be localized inside `src/i18n/messages/` in **all 8 JSON translation files**.

---

## 🔒 Security & Environment Rules

- **Env Management**: Local configurations belong to `.env.local` (gitignored). `.env.example` is the template.
- **Secrets Protection**: Never commit or hardcode sensitive tokens, database URLs, Sentry credentials, or private keys inside the codebase.

---

## 🏃 Quality & Validation Commands

Execute the following commands before completing any code changes:

```bash
# Run the complete validation pipeline (Format, Lint, Types, Unit tests, Build, Docs, Knip)
pnpm run check:all

# Run Vitest test suites
pnpm run test

# Run Playwright E2E suites
pnpm run e2e
```
