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

Minimum for stable CI:

| Secret                | Required | Example                               |
| --------------------- | -------- | ------------------------------------- |
| `DATABASE_URL`        | Yes      | `postgresql://user:pass@host:5432/db` |
| `AUTH_SESSION_SECRET` | Yes      | `openssl rand -hex 32` output         |

Optional:

| Secret                             | When needed                              |
| ---------------------------------- | ---------------------------------------- |
| `AUTH_MFA_VERIFY_URL`              | external MFA verifier                    |
| `AUTH_MFA_VERIFY_BEARER_TOKEN`     | MFA verifier auth                        |
| `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL` | custom auth provider mode                |
| `RELEASE_PLEASE_TOKEN`             | optional PAT-based release PR triggering |

Notes:

- Do not commit real secrets.
- Store secrets only in GitHub or your deployment provider.

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

### Problem: Release PR does not open after merge to `main`

Causes:

- no releasable commit detected
- workflow permissions misconfigured
- action failed before PR creation

Fix:

1. Verify merge commit message is Conventional Commit.
2. Re-run `Release Please` from Actions.
3. Verify Actions permission is read/write.

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
