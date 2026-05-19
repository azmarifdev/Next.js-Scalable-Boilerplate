# Project Maintenance

## Purpose

A project is like a garden — it needs regular care to stay healthy. This guide gives you a **maintenance routine** organized by how often you should do each task. Follow it, and your repository will stay stable, secure, and up to date.

If you're a solo developer, you can combine daily and weekly tasks into one session. For teams, assign different tasks to different members.

---

## Daily Routine (Every Push)

These are things you should do every time you work on the project.

### 1. Sync Your Branch

Before starting any new work, make sure your feature branch is up to date with `main`:

```bash
git checkout main
git pull origin main
git checkout your-feature-branch
git merge main
```

### 2. Run the Standard Pre-Push Checks

These are the same checks that run in CI. Running them locally saves time and prevents broken commits:

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run format:check
pnpm run build
```

If any of these fail, fix the issue **before** pushing.

### 3. Keep Docs Aligned

If your change affects how something works (auth flow, environment variables, API endpoints), update the relevant docs in `docs/` before committing. This prevents documentation from going stale.

---

## Weekly Routine (Every Week)

Set aside 15–30 minutes each week for these tasks.

### 1. Review Dependency PRs

Dependabot (or Renovate) will open PRs when dependencies have updates. Each week:

- ✅ Review open dependency PRs
- ✅ Check the release notes for breaking changes
- ✅ Merge patch updates (`x.y.z` → `x.y.z+1`) — these are safe bug fixes
- ⚠️ Review minor/major updates more carefully — they may require code changes

### 2. Check CI Health

Go to the **Actions** tab and look at recent workflow runs:

- Are any workflows failing?
- Are any tests flaky (pass sometimes, fail others)?
- Is the build time increasing unexpectedly?

Address failures promptly — a red CI badge is a sign that something is broken.

Also check for `Expected — Waiting for status to be reported` on recent PRs.
If seen repeatedly, audit branch ruleset required checks and re-add them from live check sources.

### 3. Review Open Issues

Quick scan through new issues:

- ✅ Are there any auth/security related issues?
- ✅ Are there reproducible bugs?
- ✅ Can any issues be closed (answered, duplicate, stale)?

---

## Monthly Routine (Every Month)

Set aside 1–2 hours each month for deeper maintenance.

### 1. Audit Environment Variables & Secrets

Environment variables tend to accumulate over time. Check:

- ✅ Are all variables in `.env.example` still in use?
- ✅ Are there any variables that are no longer referenced in code?
- ✅ Are secrets rotated? (Best practice: rotate `AUTH_SESSION_SECRET` every few months)
- ✅ Are there any hardcoded values that should be environment variables?

### 2. Verify Release Automation Health

- ✅ Check that the last release was generated correctly
- ✅ Is the CHANGELOG being updated properly?
- ✅ Are Conventional Commits being followed?
- ✅ Check `.release-please-config.json` and manifest are in sync
- ✅ Confirm release PRs are mergeable (no stuck required checks)

### 3. Verify Documentation Accuracy

Docs drift from reality over time. Pick a few docs and verify:

- ✅ Do the instructions still produce the expected result?
- ✅ Are the code examples up to date?
- ✅ Are the CLI commands still correct (package manager, flags, etc.)?

---

## Quarterly Routine (Every 3 Months)

Set aside half a day each quarter for a deeper review.

### 1. Validate Deployment Guides

Deployment providers change their UIs, pricing, and requirements regularly:

- ✅ Try following the deployment guide from scratch on a fresh environment
- ✅ Update any UI screenshots or step descriptions
- ✅ Check if there are new provider features worth adopting
- ✅ Verify Dockerfile and docker-compose.yml still work with the latest Node.js version

### 2. Full Test Suite Run

Run the **entire** test suite, including e2e tests (if configured):

```bash
pnpm run test
pnpm run test:integration
```

Failing tests after a long time? It could be:

- A dependency update that changed behavior
- A change in the testing environment (Node version, OS)
- Drift between test data and actual data

### 3. Review Dependencies for Major Upgrades

Check which major version upgrades are available:

```bash
pnpm outdated
```

For each major upgrade:

1. Read the library's changelog / migration guide
2. Check if it affects your code (breaking changes)
3. Plan the upgrade in a dedicated PR (don't mix with feature work)
4. Run the full test suite after upgrading

### 4. Security Review

- ✅ Check if any new CVEs affect your dependencies (`pnpm audit`)
- ✅ Verify CSP headers in `next.config.ts` are still appropriate
- ✅ Review access to the repository (who has admin/ write access?)
- ✅ Check if GitHub has flagged any security advisories for the repo

---

## Maintainer Troubleshooting Playbook

Use this section when recurring operational issues appear in CI/release workflows.

### 1. Dependabot auto-merge fails in guarded merge script

Symptoms:

- Dependabot auto-merge workflow fails early
- logs show GitHub CLI output or schema-related errors

Typical causes:

- script depends on unstable `gh` JSON fields
- script path/permission issues in workflow
- missing token permissions

What to check:

1. `.github/scripts/guarded-pr-merge.sh` exists and is executable
2. workflow step runs `chmod +x .github/scripts/guarded-pr-merge.sh`
3. workflow uses `GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`
4. `Settings > Actions > General > Workflow permissions` is set to `Read and write`

Safer script behavior:

- prefer command-attempt + fallback over hardcoded schema fields
- keep `set -euo pipefail` and enough contextual logs
- fail only on truly unsafe states; skip gracefully when merge policy blocks

### 2. Token policy for boilerplate repositories

Rules:

- never hardcode Personal Access Tokens (PATs) in repo files
- use `${{ secrets.GITHUB_TOKEN }}` in workflows by default
- if custom PAT is needed, each user sets it in their own repo secrets

Why:

- this template will be reused by many teams
- committed tokens are immediate security incidents
- `GITHUB_TOKEN` is scoped and managed by GitHub Actions

### 3. Supply-chain protection for dependency auto-merge

Blind auto-merge is risky. Use a guarded policy:

- auto-merge only `semver-patch`
- production dependencies only
- ecosystem scoped (for this repo: npm)
- denylist critical/core packages for manual review
- required CI checks must pass

Manual-review examples:

- `next`, `react`, `react-dom`
- auth/data foundations (`better-auth`, `drizzle-orm`, `pg`)
- test/runtime tooling with broad impact (`typescript`, `@types/node`)

### 4. Playwright runtime suddenly increases (for example ~15 minutes)

Common reasons:

- CI runs with `workers: 1` (serial execution)
- retries are high and flaky tests retry frequently
- browser/dependency install overhead in each run
- test suite grew without smoke/full split

Practical tuning:

1. raise CI workers moderately (for example `2`)
2. reduce retries after stabilizing flaky selectors
3. split e2e into fast smoke checks vs deeper full suite
4. keep selectors resilient to auth-state and locale variants
5. monitor runtime trends in Actions weekly

### 5. Locale/content mismatch in docs pages

Symptoms:

- switching EN/BN changes UI language, but article content stays in one language

Checks:

1. verify locale resolution logic in `src/lib/docs/content.ts`
2. verify source path mapping per locale
3. if docs policy is English-only, point all locale source paths to English markdown
4. remove stale locale doc folders to avoid accidental routing regressions

### 6. Branch/ruleset check drift

Symptoms:

- release or PR checks show `Expected — Waiting for status to be reported`

Fix:

1. open branch protection ruleset
2. remove stale required check names
3. re-add required checks from live check-run names
4. re-run affected workflow

---

## Summary: Maintenance at a Glance

| Frequency     | What To Do                                                             | Time Required |
| ------------- | ---------------------------------------------------------------------- | ------------- |
| **Daily**     | Sync branch, run pre-push checks, keep docs aligned                    | 5–10 min      |
| **Weekly**    | Review dependency PRs, check CI health, scan new issues                | 15–30 min     |
| **Monthly**   | Env/secret audit, release automation health, docs accuracy             | 1–2 hours     |
| **Quarterly** | Validate deploy guides, full test run, major upgrades, security review | Half a day    |

---

## Related Docs

- [Workflows](../workflows.md)
- [Release Automation](release-automation.md)
- [Contributing Guide](contributing.md)
- [Security Policy](../security.md)
- [Deployment Guide](deployment.md)
