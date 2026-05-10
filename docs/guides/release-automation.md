# Release Automation

## Purpose

This project uses **Release Please** to automate:

- version bumping
- changelog updates
- release PR creation
- Git tag and GitHub release publishing

---

## End-to-End Flow

1. You merge conventional-commit PRs into `main`.
2. `release-please.yml` runs on push to `main`.
3. A release PR is created/updated.
4. You merge the release PR.
5. Release Please creates tag + GitHub release.

---

## Commit Types and Bumps

| Type                                                   | Release effect                           |
| ------------------------------------------------------ | ---------------------------------------- |
| `feat`                                                 | minor bump                               |
| `fix`                                                  | patch bump                               |
| `perf` / `refactor` / `docs` / `build` / `ci` / `test` | patch section entries (as configured)    |
| `chore` / `style`                                      | hidden/no bump (default config behavior) |

---

## Current Workflow Hardening

This boilerplate includes several release reliability protections:

1. **Retry on transient release-please action failure**.
2. **Auto override for non-releasable merge titles** to keep release PR generation consistent.
3. **Release PR required-check synthetic pass** so release PR does not deadlock with `Expected` checks.
4. **Release PR discovery with retries** to reduce eventual-consistency race conditions.

File reference:

- `.github/workflows/release-please.yml`

---

## Maintainer Runbook

### A) Normal release cycle

1. Merge feature/fix/docs PRs to `main`.
2. Wait for `Release Please` workflow.
3. Open release PR and review changelog/version.
4. Merge release PR.

### B) If release PR is not created

1. Go to Actions -> `Release Please`.
2. Open latest run logs and inspect Release Please step output.
3. Re-run workflow once.
4. Verify merged commit messages are conventional.

### C) If release PR exists but checks are `Expected`

1. In Actions logs, confirm message:
   `Marked ... required checks as success on ...`
2. If present and PR still expected:
   - fix ruleset mapping (remove and re-add required checks from dropdown)
3. If absent:
   - re-run `Release Please`

---

## Rules for Maintainers

Do:

- keep PR titles conventional
- keep required check names aligned with job names
- keep `main` protected with PR-only merge

Avoid:

- manual tag creation
- manual editing of generated release PR body
- forcing workflow rename without updating docs/ruleset checks

---

## Troubleshooting Matrix

| Symptom                       | Likely cause                                       | Fix                                                             |
| ----------------------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| release PR not opening        | no releasable unit, workflow failed, permissions   | re-run workflow, verify commit types, check Actions permissions |
| release PR all `Expected`     | stale required checks or check-source drift        | remove/re-add required checks from dropdown                     |
| duplicate releases/tags       | manual tags or duplicate runs                      | remove duplicate tag/release and rerun once                     |
| release notes missing entries | non-conventional merge title or hidden commit type | use conventional PR titles and releasable commit types          |

---

## Verification Checklist

After every major CI/release workflow change:

1. merge a small docs PR to `main`
2. confirm release PR creation
3. confirm release PR mergeability (no stuck required checks)
4. merge release PR and confirm tag/release generated

---

## Related Docs

- [GitHub Setup Checklist](github-setup-checklist.md)
- [Workflows](../workflows.md)
- [Contributing Guide](contributing.md)
