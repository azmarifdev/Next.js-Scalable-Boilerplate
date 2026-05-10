# GitHub Setup Checklist

## Purpose

This is the complete A-to-Z GitHub repository setup for this boilerplate.

Use this guide right after creating your repo from the template.

---

## Setup Flow Diagram

```mermaid
graph TD
    A[Create Repo from Template] --> B[Configure Branch Ruleset]
    B --> C[Configure Required Checks]
    C --> D[Add Repository Secrets]
    D --> E[Configure Actions Permissions]
    E --> F[Create Labels]
    F --> G[Set Merge Strategy]
    G --> H[Open Test PR]
```

---

## 1. Branch Ruleset (for `main`)

Go to:

- `Settings` -> `Rules` -> `Rulesets` -> `New ruleset` -> `New branch ruleset`

Configure:

1. **Ruleset name**: `Protect main`
2. **Enforcement status**: `Active`
3. **Target branches**: include `main` (or default branch)
4. **Bypass list**: keep empty (recommended)

Enable these rules:

- `Require a pull request before merging`
- `Require status checks to pass`
- `Block force pushes`
- `Restrict deletions`

Under PR rule:

- required approvals: `1`
- dismiss stale approvals: `on`

---

## 2. Required Status Checks

Inside `Require status checks to pass`, add:

- `Build`
- `Quality (lint)`
- `Quality (test)`
- `Quality (typecheck)`
- `commitlint`
- `dependency-review`
- `semantic-pr-title`
- `scan`
- `Analyze (JavaScript/TypeScript)`

Why these checks:

- `Build` + `Quality (*)`: lint, typecheck, tests, build gates from CI
- `Commit Lint`: conventional commits
- `PR Title Check`: clean squash commit title
- `Dependency Review`: dependency risk review on PRs
- `CodeQL`: static security analysis
- `CodeHawk Scan`: additional security/code scan

Important:

- Add required checks from the **Add checks** dropdown (GitHub Actions source).
- Do not type workflow names manually.
- Required checks must match the actual check-run names shown in PRs.

Do not mark these as required checks:

- `PR Labeler`
- `PR Auto Merge`
- `Dependabot Auto Merge`
- `Release Please`
- `Stale Issues and PRs`
- `Pnpm Compatibility`

Reason:

- They are automation/maintenance workflows, not core merge-quality gates.
- Keeping them non-required prevents PR deadlocks when a workflow is skipped by trigger conditions.

---

## 3. Secrets for Actions

Go to:

- `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

Add these minimum secrets for stable CI on pushes:

| Secret                | Required                            | Example                               |
| --------------------- | ----------------------------------- | ------------------------------------- |
| `DATABASE_URL`        | Yes (for internal mode + e2e paths) | `postgresql://user:pass@host:5432/db` |
| `AUTH_SESSION_SECRET` | Yes                                 | output of `openssl rand -hex 32`      |

Optional:

| Secret                             | When needed                                                    |
| ---------------------------------- | -------------------------------------------------------------- |
| `AUTH_MFA_VERIFY_URL`              | MFA external verifier                                          |
| `AUTH_MFA_VERIFY_BEARER_TOKEN`     | verifier auth token                                            |
| `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL` | custom auth mode                                               |
| `RELEASE_PLEASE_TOKEN`             | optional: use only if you want PAT-based release PR triggering |

Important:

- Never commit real secrets in repo files.
- Store real values only in GitHub Secrets or deployment platform env settings.

---

## 4. GitHub Actions Permissions

Go to:

- `Settings` -> `Actions` -> `General`

Set:

- `Workflow permissions`: `Read and write permissions`
- check `Allow GitHub Actions to create and approve pull requests`

This is required for:

- release automation (`release-please.yml`)
- guarded auto-merge flows

---

## 5. Labels Setup

Go to:

- `Issues` -> `Labels`

Create these labels (recommended baseline):

- `bug`
- `enhancement`
- `dependencies`
- `ci`
- `docs`
- `tests`
- `frontend`
- `backend`
- `automerge`
- `automerge-candidate`
- `needs triage`
- `stale`
- `security`
- `work-in-progress`
- `pinned`

These labels are used by:

- issue templates
- PR labeler automation
- stale workflow
- auto-merge strategy

---

## 6. Merge Strategy

Go to:

- `Settings` -> `General` -> `Pull Requests`

Recommended:

- `Allow squash merging`: on
- `Allow merge commits`: off
- `Allow rebase merging`: optional (off recommended)

Why:

- cleaner history
- PR title becomes final conventional commit
- consistent release note generation

---

## 7. Validate the Setup (Test PR)

1. create branch: `chore/test-github-setup`
2. small docs change
3. open PR with title: `chore(docs): validate github setup`
4. verify checks run:
   - Build
   - Quality (lint)
   - Quality (test)
   - Quality (typecheck)
   - commitlint
   - dependency-review
   - semantic-pr-title
   - scan
   - Analyze (JavaScript/TypeScript)
5. merge with squash

If all pass, your GitHub setup is complete.

---

## 8. What Runs Automatically (Even If Not Required)

These workflows still run by their triggers and continue doing their jobs:

- `PR Labeler`: applies labels to PRs
- `PR Auto Merge`: merges labeled PRs when conditions are met
- `Dependabot Auto Merge`: merges safe Dependabot updates
- `Release Please`: opens release PRs and creates tags/releases
- `Stale Issues and PRs`: cleans inactive issues/PRs on schedule
- `Pnpm Compatibility`: compatibility pipeline for PR/manual runs

---

## 9. Common Failure Modes and Fixes

### Problem: `Expected — Waiting for status to be reported`

Cause:

- Required check names in ruleset do not match actual check-run names.
- Example: required set to `CI`, but PR reports `Build` and `Quality (lint/test/typecheck)`.

Fix:

1. Open ruleset required checks.
2. Remove mismatched entries.
3. Re-add checks from **Add checks** dropdown only.
4. Re-run checks by pushing a tiny commit or re-running jobs from Actions.

### Problem: Release PR shows all required checks as `Expected`

Cause:

- Release PR was created by bot token and downstream checks were not triggered on that branch yet.

Fix:

1. Push an empty commit to the release branch:
   - `git commit --allow-empty -m "chore(ci): trigger required checks"`
   - `git push origin HEAD`
2. If needed, re-run workflows from Actions tab.

Prevention:

- This repo's release workflow marks required checks on release PRs automatically, so PAT is not required for release PR mergeability.

### Problem: Same check appears twice (or confusing duplicates)

Cause:

- Generic job names reused across multiple workflows (for example, two jobs named `automerge`).

Fix:

- Use unique job names per workflow.
- Keep non-gating automation checks out of required list.

---

## 10. Security Notes

1. do not add admins to bypass list unless truly necessary
2. do not enable force-push to protected branches
3. rotate secrets if accidentally exposed
4. keep dependency updates enabled (Dependabot)

---

## Related Docs

- [How to Use](../how-to-use.md)
- [Workflows](../workflows.md)
- [Release Automation](release-automation.md)
