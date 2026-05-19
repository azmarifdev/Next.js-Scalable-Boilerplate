# Workflows

## Purpose

This boilerplate includes **13 GitHub Actions workflows** for CI quality gates, PR governance, security scanning, and release automation.

---

## CI & Quality

### `ci.yml` — Main CI Pipeline

Triggers:

- `pull_request` (all PRs)
- `push` to `main`/`master`/`develop` (path-filtered)

Checks produced:

- `Quality (lint)`
- `Quality (typecheck)`
- `Quality (test)`
- `Build`
- `Playwright E2E Push` (push only; runs internal auth DB flows only when `E2E_DATABASE_URL` or `TEST_DATABASE_URL` is configured)
- `Playwright E2E PR` (PR only; secret-free smoke coverage, skips internal auth DB flows)

Notes:

- PR path filter is intentionally removed so required checks always run and do not remain `Expected`.
- Playwright loads `.env*` before applying E2E defaults. Workflow defaults should not force `NEXT_PUBLIC_AUTH_PROVIDER`; set auth mode in env files or deployment/CI env instead.

### `package-manager-consistency.yml`

- Trigger: PR and push for package-manager files.
- Purpose: lockfile / package-manager consistency validation.

### `bun-compatibility.yml`

- Trigger: PR and manual run.
- Purpose: verify install/build compatibility with Bun.
- Merge gate: non-required by default.

---

## PR Governance

### `commitlint.yml`

- Trigger: PR opened/synchronize/reopened/edited
- Check name: `commitlint`
- Purpose: enforce Conventional Commits in PR commit history.

### `pr-title.yml`

- Trigger: `pull_request_target` opened/edited/synchronize/reopened
- Check name: `semantic-pr-title`
- Purpose: ensure PR title format is valid for squash-merge commit quality.

### `labeler.yml`

- Trigger: `pull_request_target`
- Purpose: apply labels based on changed paths.

### `pr-auto-merge.yml`

- Trigger: `pull_request_target`
- Purpose: optional guarded auto-merge for labeled PRs.

---

## Security & Dependency

### `codeql.yml`

- Trigger: push to main/master, PR, weekly schedule
- Check name: `Analyze (JavaScript/TypeScript)`
- Purpose: static security analysis.

### `codehawk.yml`

- Trigger: PR, manual, weekly schedule
- Check name: `scan`
- Purpose: additional security/code scan.

### `dependency-review.yml`

- Trigger: PR
- Check name: `dependency-review`
- Purpose: dependency risk analysis for manifest/lockfile changes.

### `dependabot-auto-merge.yml`

- Trigger: `pull_request_target` for Dependabot actor
- Purpose: merge safe dependency updates under policy.
- Current safety gates:
  - semver patch updates only
  - npm ecosystem only
  - production dependencies only
  - denylist protection for core/high-risk packages
  - guarded merge script fallback when native auto-merge is unavailable

---

## Release & Maintenance

### `release-please.yml`

- Trigger: push to `main`, manual run
- Purpose:
  1. create/update release PR from Conventional Commits
  2. create tag/release after release PR merge
  3. append enriched release notes metadata

Hardening included:

- auto commit override for non-releasable squash titles
- release PR discovery via outputs + API fallback + retry
- required-check synthetic pass publish on release PR head to prevent `Expected` deadlock
- contributor cards are generated in a wrapping layout to avoid broken table alignment on odd contributor counts

### `stale.yml`

- Trigger: daily schedule
- Purpose: mark and close stale issues/PRs.

---

## Required Checks (Recommended)

Use these exact check-run names in ruleset:

- `Build`
- `Quality (lint)`
- `Quality (test)`
- `Quality (typecheck)`
- `commitlint`
- `dependency-review`
- `semantic-pr-title`
- `scan`
- `Analyze (JavaScript/TypeScript)`

Keep non-required:

- `Release Please`
- `PR Labeler`
- `PR Auto Merge`
- `Dependabot Auto Merge`
- `Stale Issues and PRs`
- `Pnpm Compatibility`

---

## Troubleshooting

### `Expected — Waiting for status to be reported`

Most likely causes:

- ruleset requires wrong check names
- stale old checks remain in ruleset
- check source mapping drift after workflow refactor

Fix:

1. remove all required checks from ruleset
2. re-add from a fresh successful PR using **Add checks** dropdown
3. re-run workflow or push tiny commit

### Release PR checks still `Expected`

1. open latest `Release Please` run logs
2. confirm `Marked ... required checks as success ...` message exists
3. if yes but still expected: ruleset mapping is stale, remove and re-add checks
4. if no: re-run `Release Please`

---

## Local Preflight

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run format:check
pnpm run build
```

---

## Related Docs

- [GitHub Setup Checklist](guides/github-setup-checklist.md)
- [Release Automation](guides/release-automation.md)
- [Contributing Guide](guides/contributing.md)
- [How to Use](how-to-use.md)
- [Deployment Guide](guides/deployment.md)
- [Security Policy](security.md)
