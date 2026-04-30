# Package Manager Migration

## Purpose

Use this guide when your team wants to change package manager policy safely.

## Current Template Default

- Primary manager: `pnpm`
- Lockfile in repo: `pnpm-lock.yaml`

## Migration Steps

1. Decide new canonical manager for CI
2. Update install/build/test commands in workflows
3. Regenerate and commit correct lockfile(s)
4. Update docs (`README.md`, `CONTRIBUTING.md`, workflows docs)
5. Run full verification

## Verification Checklist

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run docs:check
```

## Risk Controls

- Avoid mixed lockfile drift in one PR
- Keep migration PR isolated from feature work
- Confirm dependency-review workflow still passes
