# Package Manager Policy and Migration Guide

Use this guide for two cases:

1. Working in this repository with npm/pnpm/yarn/bun support
2. Migrating your fork to a single canonical package manager policy

## Current Baseline in This Template

- `packageManager`: npm
- CI quality jobs run via npm
- Lockfile consistency workflow validates npm/pnpm/yarn (and bun if bun lockfile exists)

## Local Usage (Any Supported Manager)

Use one manager per local workflow session:

- npm: `npm ci`
- pnpm: `pnpm install --frozen-lockfile`
- yarn: `yarn install --frozen-lockfile --non-interactive`
- bun: `bun install --frozen-lockfile`

If dependencies change, keep lockfiles consistent before opening PR.

## Migrating Your Fork to One Canonical Manager

Migrate only if your team wants a single enforced manager policy.

### Target: pnpm

1. Set `package.json -> packageManager` to pnpm version
2. Remove non-target lockfiles your team will no longer maintain
3. Regenerate target lockfile
4. Update CI install commands and caches for pnpm
5. Update docs and contributing instructions
6. Run full validation

### Target: yarn

1. Set `package.json -> packageManager` to yarn version
2. Remove non-target lockfiles your team will no longer maintain
3. Regenerate target lockfile
4. Update CI install commands and caches for yarn
5. Update docs and contributing instructions
6. Run full validation

### Target: bun

1. Set `package.json -> packageManager` to bun version (if team policy requires)
2. Generate and commit bun lockfile (`bun.lock` or `bun.lockb`)
3. Update CI jobs to use bun as primary quality pipeline
4. Update docs and contributing instructions
5. Run full validation

## Recommended Safety Checks (Any Migration)

- Keep migration in a dedicated PR.
- Include lockfile + workflow + docs updates in the same PR.
- Ensure branch protection requires install/build checks.
- Verify `nvm use` + CI Node version remain aligned.

## Long-Term Node Policy

For reproducibility over years:

- Keep `.nvmrc` pinned to current tested LTS baseline.
- Keep `engines.node` as supported compatibility range.
- Test at least one current LTS in CI.
- On LTS upgrades, update `.nvmrc`, CI Node version, and docs together.
