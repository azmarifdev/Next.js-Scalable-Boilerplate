# Agent Guidance (Docs + Code Updates)

## Purpose

Instruction baseline for AI/code agents working in this repository.

## Required Behavior

- Keep behavior-doc sync: code and docs must match
- Prefer small, reviewable changes
- Avoid destructive git commands
- Run verification for touched areas

## Minimum Validation by Change Type

Code changes:

- `pnpm run typecheck`
- `pnpm run lint`

Auth/security changes:

- `pnpm run test:integration`
- Relevant e2e auth tests

Docs changes:

- `pnpm run docs:check`

## High-Risk Areas

- `src/app/api/v1/auth/*`
- `src/lib/auth/*`
- `src/proxy.ts`
- `src/lib/security/*`

## Sync Requirements

When auth/config behavior changes, update these docs in same PR:

- `README.md`
- `docs/how-to-use.md`
- `docs/auth-flow.md`
- `docs/architecture.md`
