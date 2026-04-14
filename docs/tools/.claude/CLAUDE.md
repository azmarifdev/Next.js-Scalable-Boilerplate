# AI Collaboration Guide

Repository: `nextjs-starter-template`
Audience: Claude-style coding assistants and contributors using AI support.

## 1) Operating Contract

- Prioritize correctness over speed.
- Make the smallest safe change that solves the user request.
- Preserve existing architecture and conventions unless the task requires change.
- Keep diffs focused; avoid opportunistic refactors.
- When uncertain, prefer explicit assumptions in comments/PR notes.

## 2) Source of Truth

When rules conflict, follow this order:

1. `tsconfig.json`
2. `eslint.config.mjs`
3. Existing code patterns in `src/`
4. CI workflows under `.github/workflows/`
5. This guide

## 3) Stack Awareness

- Next.js App Router + React + TypeScript (strict)
- Tailwind CSS
- NextAuth
- Drizzle ORM
- Zod and env validation
- Jest + Vitest + Playwright
- GitHub Actions + Release Please

## 4) Implementation Expectations

Before coding:

1. Read related route/component/module files.
2. Confirm naming and placement patterns.
3. Identify edge cases and failure paths.
4. Make a bounded plan.

While coding:

- Prefer clear, explicit code over clever abstractions.
- Keep component and function responsibilities narrow.
- Add comments only when logic is non-obvious.
- Avoid duplicate logic; extract utilities when repeated.

After coding:

- Update tests/docs if behavior changes.
- Run validation commands.
- Check that GitHub automation assumptions still hold.

## 5) Validation Gate (Required)

Run what is relevant; for most code changes run all:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run test:vitest
npm run build
```

Run E2E when user-facing flow changes:

```bash
npm run e2e
```

## 6) TypeScript Rules

- Keep `strict` compatibility.
- Avoid `any`; if unavoidable, isolate and explain.
- Use `import type` and `export type` where appropriate.
- Prefer narrow, explicit domain types.
- Do not silence type errors with broad casts unless unavoidable and documented.

## 7) Next.js and React Rules

- Default to Server Components; add `"use client"` only when required.
- Keep data-fetching and rendering boundaries clear.
- Avoid unnecessary client-side state for server-renderable content.
- Ensure accessible semantics and keyboard usability.
- Do not introduce unstable patterns that fight App Router conventions.

## 8) API, Validation, and Security Rules

- Validate request payloads and critical inputs with Zod.
- Return predictable error shape and HTTP status.
- Keep auth checks close to protected logic.
- Never commit or print secrets.
- Avoid storing sensitive data in logs.

## 9) Data Layer Rules (Drizzle)

- Keep schema and migration updates in sync.
- Prefer additive migration changes.
- Avoid destructive operations without explicit user request.
- Recheck calling code and types after schema updates.

## 10) Testing Rules

- Add or update tests for behavior changes.
- Keep tests deterministic and readable.
- For bug fixes, include a regression test when practical.
- Avoid brittle assertions tied to unstable implementation details.

## 11) Git and PR Rules

- Use Conventional Commits.
- PR title must be semantic: `type(scope): summary`.
- Keep PR scope single-purpose.
- Never force-push to protected branch.
- Do not push directly to `main` unless explicitly asked.

## 12) CI and Release Safety Rules

When editing workflow/release files:

- Keep check names stable if branch protection depends on them.
- Ensure `release-please` config and manifest remain valid.
- Keep docs aligned with workflow behavior.
- Avoid permission broadening unless needed and justified.

## 13) Explicit Anti-Patterns

- No blanket disabling of lint/type rules.
- No hidden dependency or config changes without explanation.
- No unrelated formatting-only churn in feature PRs.
- No workaround that weakens security controls.

## 14) Definition of Done

A task is done when:

- requested behavior is implemented
- tests/checks relevant to the change pass
- docs/config are updated if needed
- no obvious regressions introduced
