---
applyTo: "**/*.{ts,tsx,js,jsx,json,md,yml,yaml}"
---

# Copilot Instructions for nextjs-starter-template

## Goal

Generate code that is production-safe, minimal in scope, and consistent with repository patterns.

## Do First

1. Inspect nearby files and reuse existing patterns.
2. Confirm whether change affects API, UI, DB, or workflow.
3. Plan smallest safe implementation.

## Coding Expectations

- Respect TypeScript strict mode.
- Prefer explicit types and deterministic logic.
- Keep UI changes accessible and semantic.
- Use Next.js App Router conventions.
- Avoid unnecessary client components.

## Security and Data Safety

- Never hardcode secrets.
- Never print env secrets in logs.
- Validate external input, especially in route handlers.

## GitHub/CI Awareness

- Use Conventional Commit style.
- PR title should be semantic: `type(scope): summary`.
- Keep CI check names and release automation behavior stable.

## Verification Commands

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run test:vitest
npm run build
```

For user-flow changes:

```bash
npm run e2e
```
