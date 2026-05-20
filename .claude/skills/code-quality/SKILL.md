---
name: code-quality
description: Checklist and instructions for code formatting, strict TypeScript enforcement, ESLint validation, Sentry observability setup, and verify-before-PR tasks. Use this skill when verifying code formatting, fixing ESLint/TypeScript errors, resolving build failures, or preparing changes for code review.
---

# Code Quality & PR Hardening Checklist

This skill governs code style, validation pipeline procedures, and pre-PR hardening checks in the Next.js Boilerplate. Adhering to these rules ensures that code remains clean, bugs are caught early, and no broken builds or style mismatches reach production.

## 🧹 Code Quality Tooling

The boilerplate enforces consistent standards using several automated tools:

1. **ESLint**: Standard JS/TS rules matching Next.js specifications (`eslint.config.mjs`).
2. **Prettier**: Code formatting tool (`prettier.config.js`).
3. **TypeScript**: Strict typechecking configurations (`tsconfig.json`).
4. **Knip**: Unused code, files, exports, and dead dependency analyzer.
5. **Gitleaks**: Checks for accidental commits of API keys, secrets, or certificates.

---

## 🔍 The Unified Validation Pipeline

To ensure maximum correctness, a single unified local bash script checks all layers of the project, mirroring the actions executed in the CI server.

- **Check all project layers (Format, Lint, Types, Unit tests, Build, Playwright, Docs, Knip, Audit)**:
  ```bash
  pnpm run check:all
  ```
- **Automatically fix format and lint issues inside the pipeline**:
  ```bash
  pnpm run check:fix
  ```
- **Skip Playwright (E2E) checks in the pipeline (useful if no DB is running locally)**:
  ```bash
  CHECK_ALL_SKIP_E2E=true pnpm run check:all
  ```

---

## 📋 The Pre-PR Hardening Checklist

Before merging a branch or opening a Pull Request, verify that all elements in this list are satisfied:

### 1. Style & Types

- [ ] No `any` keywords are introduced. All functions and hooks have strict TypeScript typings.
- [ ] Code has been reformatted and linted cleanly:
  ```bash
  pnpm run format:write
  pnpm run lint:fix
  ```
- [ ] TypeScript checks compile with zero warnings or errors:
  ```bash
  pnpm run typecheck
  ```

### 2. Observability & Sentry

- [ ] Structured logging is leveraged instead of `console.log` for app actions. Import and use the structured logging module from `src/lib/observability/`.
- [ ] All major server/API actions wrap critical code blocks in try-catch structures, raising typed errors (`src/lib/errors/`) and sending error traces to Sentry.

### 3. Localization

- [ ] Added or modified user-facing strings are correctly populated across all **8 language files** inside `src/i18n/messages/` (English, Bangla, Spanish, French, German, Hindi, Japanese, Arabic).
- [ ] Run the dynamic documentation validation script to ensure markdown files match the internationalization configurations:
  ```bash
  pnpm run docs:check
  ```

### 4. Tests & Build Verification

- [ ] Run all Vitest unit and integration tests to ensure no core regressions are introduced:
  ```bash
  pnpm run test
  ```
- [ ] Build the Next.js production bundle locally to ensure zero static export or compilation issues:
  ```bash
  pnpm run build
  ```
- [ ] Run E2E specs if database configurations allow:
  ```bash
  pnpm run e2e
  ```
