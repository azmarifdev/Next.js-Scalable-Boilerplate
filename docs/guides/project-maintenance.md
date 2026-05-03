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

## Summary: Maintenance at a Glance

| Frequency     | What To Do                                                             | Time Required |
| ------------- | ---------------------------------------------------------------------- | ------------- |
| **Daily**     | Sync branch, run pre-push checks, keep docs aligned                    | 5–10 min      |
| **Weekly**    | Review dependency PRs, check CI health, scan new issues                | 15–30 min     |
| **Monthly**   | Env/secret audit, release automation health, docs accuracy             | 1–2 hours     |
| **Quarterly** | Validate deploy guides, full test run, major upgrades, security review | Half a day    |
