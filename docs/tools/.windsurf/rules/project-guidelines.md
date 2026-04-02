# Windsurf Project Rules

## Context

This repository is a Next.js App Router starter focused on production readiness, strict typing, and automated GitHub workflows.

## Primary Objectives

- Keep changes minimal and safe.
- Preserve CI pass rate.
- Respect TypeScript strict mode and existing architecture.
- Keep automation and docs in sync.

## Must-Follow Rules

1. Do not bypass lint/type/test failures with quick hacks.
2. Avoid unrelated refactors in feature/fix tasks.
3. Never expose secrets or env values in logs or code.
4. Keep PR-ready code with clear commit intent.

## Implementation Checklist

Before editing:

- Read nearby modules and match existing patterns.
- Identify edge cases and failure paths.

After editing:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run test:vitest
npm run build
```

Run this when user flows changed:

```bash
npm run e2e
```

## Framework-Specific Guidance

- Prefer Server Components by default.
- Add `"use client"` only where browser interactivity is required.
- Maintain accessibility and semantic HTML in UI changes.
- Validate API inputs with Zod.

## GitHub Workflow Safety

- Keep check names stable where branch protection depends on them.
- Keep release automation files valid (`release-please` configs/workflows).
- Use Conventional Commits and semantic PR titles.
