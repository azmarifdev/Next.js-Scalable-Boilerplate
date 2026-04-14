# Release Automation Playbook

This repository uses `release-please` to automate versioning, changelog, tags, and GitHub Releases.

## 1. How the Pipeline Works

1. Contributor opens PR to `main` with semantic title and Conventional Commit messages.
2. CI, commitlint, PR title, dependency review, and security checks run.
3. PR is merged to `main`.
4. `Release Please` workflow runs on `main` and opens/updates a release PR.
5. When release PR is merged, it creates:
   - version bump in `package.json` and `.release-please-manifest.json`
   - generated `CHANGELOG.md` entry
   - git tag
   - GitHub Release notes

## 2. Required Discipline for Accurate Changelog

- Commit messages must follow Conventional Commits.
- PR title must be semantic (`feat(scope): message`, `fix(scope): message`, etc.).
- Prefer squash merge with a clean semantic merge title.

## 3. Known Real-World Issues and Fixes

### Issue A: Release Please cannot create PR

Error example:
`GitHub Actions is not permitted to create or approve pull requests`

Fix:

1. Go to `Settings -> Actions -> General`.
2. Set `Workflow permissions` to `Read and write permissions`.
3. Enable `Allow GitHub Actions to create and approve pull requests`.
4. Re-run `Release Please` workflow.

### Issue B: Semantic PR title check fails

Error example:
`No release type found in pull request title`

Fix:

- Rename PR title to semantic format:
  - `feat(ci): improve release pipeline reliability`
  - `fix(release): handle edge case in workflow permissions`

### Issue C: Release Please logs show "commit could not be parsed"

Cause:

- Old non-conventional commits exist in history.

Impact:

- Usually non-blocking; release PR can still be created.

Fix:

- Keep all new commits conventional.
- If noise persists from old history, create a clean baseline release and continue from there.

### Issue D: Release PR not created after merge to main

Checklist:

1. Confirm merge target was `main`.
2. Confirm `Release Please` workflow ran on that `main` push.
3. Confirm action permissions from Issue A.
4. Confirm `.release-please-config.json` and `.release-please-manifest.json` exist in `main`.

## 4. Release Roles and Manual Fallback

- Automated path:
  - merge code PR -> release PR opens/updates -> merge release PR -> release published
- Manual fallback (if automation is blocked by org policy):
  - maintainer updates version
  - maintainer updates changelog
  - maintainer tags release
  - maintainer publishes GitHub release

Use fallback only when automation cannot be enabled by repository policy.

## 5. Quick Verification After Setup

1. Create branch and add a small change.
2. Commit with `fix(docs): verify release pipeline`.
3. Open PR with semantic title.
4. Merge to `main`.
5. Confirm release PR appears from `release-please[bot]`.
