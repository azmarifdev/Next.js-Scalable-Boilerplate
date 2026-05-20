# GitHub Copilot Custom Instructions

These guidelines steer GitHub Copilot when generating code, answering chat prompts, or refactoring elements within the Next.js Boilerplate repository. Follow these constraints to maintain architectural purity and security consistency.

---

## 🏗️ Project Architecture & Key Directories

- **Framework**: Next.js App Router (React 19) + TypeScript
- **Styling**: Tailwind CSS v4 + Vanilla CSS + shadcn/ui
- **Auth Systems**:
  - `better-auth`: Primary internal cookie-based auth (`NEXT_PUBLIC_AUTH_PROVIDER=better-auth`).
  - `custom-auth`: Optional external IdP auth adapter (`NEXT_PUBLIC_AUTH_PROVIDER=custom-auth`).
- **Database Layer**: PostgreSQL database mapped via Drizzle ORM.
- **Key Modules**: Domain isolated logic resides under `src/modules/` (e.g., `src/modules/auth/`, `src/modules/optional/`).
- **Config & Env Schema**: Configured strictly in `src/lib/config/env.ts`.

---

## 💡 Code & Framework Design Rules

1. **Server Components by Default**:
   - Create React components as Server Components by default to optimize rendering times and keep the client bundle size small.
   - Use the `"use client";` directive at the very top _only_ when utilizing client-side state hooks (`useState`, `useEffect`) or binding interactive event listeners.

2. **Strict Type Safety**:
   - Enforce explicit TypeScript types and interfaces.
   - Never use the `any` keyword. Use generics or strict interfaces instead.
   - Keep lint and typechecks pristine; do not disable lint rules to bypass code errors.

3. **Internationalization (i18n)**:
   - The project supports 8 locales: English (`en`), Bangla (`bn`), Spanish (`es`), French (`fr`), German (`de`), Hindi (`hi`), Japanese (`ja`), and Arabic (`ar`).
   - All user-facing strings must be localized. Never hardcode inline texts. Add translation keys inside `src/i18n/messages/` in **all 8 JSON files**.

---

## 🔑 Environment Variables & Security Rules

- **Local Development**: Read and write configurations strictly inside `.env.local` (gitignored). The template file is `.env.example`.
- **Production Environment**: Environment variables live directly inside your hosting provider dashboard (Vercel, Railway, etc.), _never_ committed to Git.
- **Secrets Management**: Never expose or hardcode credentials, private tokens, database strings, or Sentry keys inside the codebase, comments, or documentation.

---

## 🏃 Validation Commands & Verification

Always run the following unified verification script to ensure code formatting, linting, type safety, and tests pass successfully:

```bash
# Run the entire validation pipeline (Format, Lint, Types, Unit tests, Build, Docs, Knip, pnpm Audit)
pnpm run check:all

# Automatically fix code style and linting issues
pnpm run check:fix

# Run unit & integration tests only
pnpm run test

# Run Playwright end-to-end tests
pnpm run e2e
```

---

## 📋 Git Commit Guidelines

- **Commit Format**: Follow the Conventional Commits specification.
  - `feat(scope): ...` for new features (Minor version bump).
  - `fix(scope): ...` for bug fixes (Patch version bump).
  - `docs(scope): ...` for documentation changes.
  - `refactor(scope): ...` for structural code shifts.
