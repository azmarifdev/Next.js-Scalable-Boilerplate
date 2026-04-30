# Contributing Guide

## Purpose

This file explains how to contribute safely without breaking template contracts.

## Development Setup

1. Use supported Node version (`>=20 <23`)
2. Install dependencies
3. Start dev server

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

## Before Opening a PR

Run:

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run format:check
pnpm run build
```

## Commit & PR Rules

- Use Conventional Commits
- Keep PRs small and focused
- Include tests for behavior changes
- Keep docs aligned with code when behavior changes

Examples:

- `feat(auth): add admin step-up verifier integration`
- `fix(proxy): prevent redirect loop on auth routes`
- `docs(auth): clarify custom provider requirements`

## Package Manager Policy

- Primary manager is `pnpm`
- Lockfile consistency matters in CI
- If switching strategy, update CI + docs in one PR

See: `docs/migrations/package-manager.md`

## Release Notes Flow

Release Please uses merged Conventional Commits to generate release PRs.

See: `docs/guides/release-automation.md`
