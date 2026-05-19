# GitHub Setup Checklist

## Purpose

This is the complete repository hardening checklist for this boilerplate.
Use it immediately after creating a repo from the template.

---

## Quick Setup Order

1. Configure a `main` branch ruleset.
2. Add required checks using exact check-run names.
3. Configure Actions permissions.
4. Add required repository secrets.
5. Configure merge strategy.
6. Run a test PR and validate all required checks.

---

## 1. Branch Ruleset (`main`)

Go to:
`Settings` -> `Rules` -> `Rulesets` -> `New branch ruleset`

Recommended:

- Ruleset name: `Protect main`
- Enforcement: `Active`
- Target branch: `main`
- Bypass list: empty (recommended)

Enable:

- `Require a pull request before merging`
- `Require approvals` (minimum `1`)
- `Dismiss stale approvals when new commits are pushed`
- `Require status checks to pass`
- `Block force pushes`
- `Restrict deletions`

---

## 2. Required Checks (Exact Names)

Add these required checks from the **Add checks** dropdown (do not type manually):

- `Build`
- `Quality (lint)`
- `Quality (test)`
- `Quality (typecheck)`
- `commitlint`
- `dependency-review`
- `semantic-pr-title`
- `scan`
- `Analyze (JavaScript/TypeScript)`

Important:

- Use job check names, not workflow names.
- Example mismatch: requiring `CI` will fail because actual checks are `Build` and `Quality (*)`.

Keep these non-required:

- `PR Labeler`
- `PR Auto Merge`
- `Dependabot Auto Merge`
- `Release Please`
- `Stale Issues and PRs`
- `Pnpm Compatibility`

Reason:

- These are automation/maintenance checks and may be skipped by trigger conditions.
- Keeping them required can deadlock merges.

Dependency automation policy note:

- `Dependabot Auto Merge` is intentionally non-required and policy-guarded.
- It should skip unsafe updates rather than block every PR.

---

## 3. Actions Permissions

Go to:
`Settings` -> `Actions` -> `General`

Set:

- `Workflow permissions` -> `Read and write permissions`
- `Allow GitHub Actions to create and approve pull requests` -> enabled

Required for:

- `release-please.yml`
- auto-merge workflows

---

## 4. Repository Secrets

Go to:
`Settings` -> `Secrets and variables` -> `Actions`

Click `New repository secret`, enter the exact secret name, paste the value, then save.

Repository secrets are not committed to code and are not shown in pull request diffs. GitHub masks them in logs and only exposes them to workflows that are allowed to receive secrets. Public repositories can safely use GitHub Secrets, but secrets are not passed to untrusted fork pull requests by default.

Use repository secrets for non-production CI values such as test databases and CI-only auth secrets.

Minimum for stable CI:

| Secret                | Required | Example                       |
| --------------------- | -------- | ----------------------------- |
| `AUTH_SESSION_SECRET` | Yes      | `openssl rand -hex 32` output |

Optional for auth E2E on push workflows:

| Secret              | Required | Notes                                          |
| ------------------- | -------- | ---------------------------------------------- |
| `E2E_DATABASE_URL`  | Optional | Disposable test database for Playwright        |
| `TEST_DATABASE_URL` | Optional | Fallback name if `E2E_DATABASE_URL` is not set |

Pull request E2E runs without database secrets and skips auth DB flows by default.

Where to get `E2E_DATABASE_URL`:

1. Open Neon, Supabase, or your PostgreSQL provider.
2. Create a disposable test database or branch.
3. Copy its PostgreSQL connection string.
4. Add it as `E2E_DATABASE_URL`.

Never use production `DATABASE_URL` for E2E. Playwright can migrate, seed, and reset this database.

Required for production migrations:

| Secret                   | Required | Notes                                                         |
| ------------------------ | -------- | ------------------------------------------------------------- |
| `DATABASE_URL`           | Yes      | Fallback migration URL                                        |
| `MIGRATION_DATABASE_URL` | Optional | Preferred when migrations should use a separate direct DB URL |

Production migration secrets should preferably be environment secrets, not repository-wide secrets.

Go to:
`Settings` -> `Environments` -> `New environment`

Create:

```txt
production
```

Then add environment secrets:

| Secret                   | Required  | Where To Get It                                                  |
| ------------------------ | --------- | ---------------------------------------------------------------- |
| `MIGRATION_DATABASE_URL` | Preferred | Direct PostgreSQL connection string from Neon/Supabase/Postgres  |
| `DATABASE_URL`           | Fallback  | PostgreSQL connection string if no separate migration URL exists |

Enable required reviewers for the `production` environment. The `Production Database Migration` workflow uses this environment and requires typing `migrate-production`.

Optional:

| Secret                             | When needed                              |
| ---------------------------------- | ---------------------------------------- |
| `AUTH_MFA_VERIFY_URL`              | external MFA verifier                    |
| `AUTH_MFA_VERIFY_BEARER_TOKEN`     | MFA verifier auth                        |
| `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL` | custom auth provider mode                |
| `SENTRY_AUTH_TOKEN`                | Sentry source map uploads from CI/builds |
| `RELEASE_PLEASE_TOKEN`             | optional PAT-based release PR triggering |

Notes:

- Do not commit real secrets.
- Store secrets only in GitHub or your deployment provider.
- For most repositories, `${{ secrets.GITHUB_TOKEN }}` is sufficient for workflow automation.
- Do not add personal access tokens unless a specific workflow limitation requires it.

---

## 5. Merge Strategy

Go to:
`Settings` -> `General` -> `Pull Requests`

Recommended:

- `Allow squash merging` -> on
- `Allow merge commits` -> off
- `Allow rebase merging` -> optional (off preferred)

Why:

- Clean history
- PR title becomes final commit message
- Better release note quality with Conventional Commits
- Prevents duplicate Release Please changelog entries from GitHub merge commits plus original PR commits

---

## 6. Test PR Validation

Create branch:

```bash
git checkout -b chore/test-github-setup
```

Make a tiny docs change, open PR with title:

```text
chore(docs): validate github setup
```

Verify required checks appear and run:

- Build
- Quality (lint/test/typecheck)
- commitlint
- dependency-review
- semantic-pr-title
- scan
- Analyze (JavaScript/TypeScript)

If all pass, setup is healthy.

---

## 7. Release PR Reliability (Important)

This boilerplate includes release PR hardening in `release-please.yml`:

- detects release PR from action outputs and API fallback
- retries release PR discovery to avoid timing race
- marks required checks on release PR head commit when downstream PR workflows are not triggered

Why this exists:

- release PRs created by bot tokens can sometimes show all required checks as `Expected`.

---

## 8. Common Problems and Fixes

### Problem: `Expected — Waiting for status to be reported`

Causes:

- required check names do not match real check-run names
- stale/migrated checks remain in ruleset
- workflow skipped due to trigger conditions

Fix:

1. Remove all required checks from ruleset.
2. Re-add from **Add checks** dropdown using a recent successful PR.
3. Push a tiny commit to retrigger checks if needed.

### Problem: Release PR opens but all checks stay `Expected`

Fix order:

1. Check latest `Release Please` run logs for the line:
   `Marked ... required checks as success on ...`
2. If line missing: re-run `Release Please` workflow.
3. If line exists but PR still expected: ruleset has stale/wrong check source mapping. Remove and re-add checks from dropdown.

### Problem: Dependabot auto-merge always skipped

Check:

1. update type is patch (`semver-patch`)
2. dependency is production dependency
3. package is not in denylist/core-risk set
4. ecosystem is npm

If any check fails, skip is expected by policy.

### Problem: Release PR does not open after merge to `main`

Causes:

- no releasable commit detected
- workflow permissions misconfigured
- action failed before PR creation

Fix:

1. Verify merge commit message is Conventional Commit.
2. Re-run `Release Please` from Actions.
3. Verify Actions permission is read/write.

### Problem: Release notes show the same change twice

Cause:

- PRs were merged with **Create a merge commit** instead of **Squash and merge**.
- GitHub's merge commit body contains the PR title, while the original PR commit is still in history.
- Release Please can interpret both as changelog-worthy Conventional Commits.

Fix:

1. Go to `Settings` -> `General` -> `Pull Requests`.
2. Keep `Allow squash merging` enabled.
3. Disable `Allow merge commits`.
4. Prefer the guarded auto-merge workflows, which already use `--squash`.

The release workflow also deduplicates repeated release-note bullets as a safety net, but squash-only merging is the clean source-of-truth fix.

---

## 9. Security Baseline

- keep admin bypass minimal
- never allow force-push on `main`
- rotate leaked secrets immediately
- keep dependency/security workflows enabled

---

## Related Docs

- [Workflows](../workflows.md)
- [Release Automation](release-automation.md)
- [Contributing Guide](contributing.md)
- [Project Maintenance](project-maintenance.md)
- [Deployment Guide](deployment.md)
