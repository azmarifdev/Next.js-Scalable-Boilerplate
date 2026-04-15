# Project Maintenance Playbook

Use this playbook for ongoing repository health and long-term stability.

## Guide Position (Tree)

```txt
docs/
└─ guides/
   ├─ deployment.md
   ├─ github-setup-checklist.md
   ├─ release-automation.md
   └─ project-maintenance.md        <- you are here
```

## Scope

This guide covers:

- Weekly and monthly maintenance cadence
- Node LTS upgrade process
- Dependency and lockfile discipline
- CI stability habits

This guide links out for specialized tasks:

- Deployment details: `docs/guides/deployment.md`
- GitHub settings: `docs/guides/github-setup-checklist.md`
- Release troubleshooting: `docs/guides/release-automation.md`
- Package manager migration: `docs/migrations/package-manager.md`

## 1) Weekly Maintenance Routine

- Review Dependabot PRs; merge safe patch/minor updates after CI passes.
- Run clean-state health check:

```bash
nvm use
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

- Check open CI failures and remove flaky behavior quickly.

## 2) Monthly Maintenance Routine

- Review major release notes for core tools (`next`, `react`, `typescript`, `eslint`, `vitest`).
- Run `npm audit` and evaluate non-breaking fixes.
- Verify docs still match workflow names and current policy.
- Confirm branch protection required checks are still valid.

## 3) Node LTS Upgrade Routine

When moving to newer Node LTS:

1. Update `.nvmrc`
2. Update CI Node version(s)
3. Keep `package.json -> engines.node` aligned
4. Regenerate dependencies and lockfile
5. Run full checks
6. Update docs mentioning runtime baseline

Keep all steps in one PR to avoid drift.

## 4) Dependency And Lockfile Discipline

- Repository supports npm, pnpm, yarn, and bun.
- If dependencies change, keep lockfiles consistent in the same PR.
- Use package-manager consistency workflow output as the source of truth for lock drift.
- If team migrates canonical manager policy, do dedicated migration PR using `docs/migrations/package-manager.md`.

## 5) CI Reliability Rules

- Treat `npm ci` as first health indicator.
- Keep toolchain upgrades isolated from feature changes when possible.
- Avoid changing CI job names casually (branch protection dependencies).
- After dependency updates, run checks in this order:
  1. install with your chosen manager
  2. `npm run lint`
  3. `npm run typecheck`
  4. `npm run test`
  5. `npm run build`

## 6) Release Hygiene Rules

- Use Conventional Commits for meaningful changelogs.
- Ensure semantic PR titles are used.
- After release PR merge, run clean clone smoke checks (`npm ci`, `npm run build`).
