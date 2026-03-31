# GitHub Setup Checklist

Use this as a one-time manual setup guide after workflows are added.

## 1) Repository Settings (General)

- [ ] Go to `Settings -> General -> Pull Requests`.
- [ ] Enable `Allow auto-merge`.
- [ ] (Recommended) Enable `Automatically delete head branches`.

## 2) Default Branch

- [ ] Confirm default branch is `main` (or `master`, but keep one primary release branch).

## 3) Branch Protection Rule (for `main`)

Go to `Settings -> Branches -> Add branch protection rule`.

- [ ] Branch name pattern: `main`
- [ ] Enable `Require a pull request before merging`.
- [ ] Enable `Require approvals` and set required approvals to `1` (or team preference).
- [ ] Enable `Dismiss stale pull request approvals when new commits are pushed`.
- [ ] Enable `Require status checks to pass before merging`.
- [ ] Enable `Require branches to be up to date before merging`.
- [ ] Add required status checks:
  - [ ] `CI / CI`
  - [ ] `Commit Lint / commitlint`
  - [ ] `Dependency Review / dependency-review`
  - [ ] `PR Title Check / semantic-pr-title`
- [ ] (Recommended) Add CodeQL check when available:
  - [ ] `CodeQL / Analyze (JavaScript/TypeScript)`
- [ ] Enable `Require conversation resolution before merging`.
- [ ] Enable `Do not allow bypassing the above settings` (recommended for strict teams).
- [ ] Save changes.

## 4) Branch Protection Rule (optional `develop`)

- [ ] Repeat the same rule for `develop` if your team uses it as an integration branch.

## 5) Actions Permissions

Go to `Settings -> Actions -> General`.

- [ ] `Actions permissions`: Allow all actions and reusable workflows.
- [ ] `Workflow permissions`: select `Read and write permissions`.
- [ ] Enable `Allow GitHub Actions to create and approve pull requests`.

## 6) Pull Request Merge Strategy

Go to `Settings -> General -> Pull Requests`.

- [ ] Keep only one merge strategy if you want consistent history.
- [ ] (Recommended for this repo) Enable `Allow squash merging`.
- [ ] (Optional) Disable `Allow merge commits`.
- [ ] (Optional) Disable `Allow rebase merging`.

## 7) Labels (for automation quality)

Create these labels in `Issues -> Labels` if missing:

- [ ] `dependencies`
- [ ] `automerge-candidate`
- [ ] `ci`
- [ ] `docs`
- [ ] `tests`
- [ ] `frontend`
- [ ] `backend`
- [ ] `stale`

## 8) Release Please Manual Prereq

- [ ] Verify `.release-please-config.json` and `.release-please-manifest.json` are merged in default branch.
- [ ] Ensure release commits follow Conventional Commits (`feat`, `fix`, etc.).

## 9) Dependabot Auto-merge Safety

- [ ] Confirm branch protection required checks are enabled (so auto-merge waits for CI).
- [ ] Confirm only safe updates auto-merge (already configured for `patch` and `minor`).
- [ ] (Recommended) Keep major updates manual review only.

## 10) First-Time Validation Run

- [ ] Create a test PR with title like `chore(ci): verify github automation`.
- [ ] Confirm these checks run successfully:
  - [ ] CI
  - [ ] Commit Lint
  - [ ] PR Title Check
  - [ ] Dependency Review
- [ ] Merge a Conventional Commit into `main` and confirm `Release Please` opens/updates a release PR.

## Copy-Paste PR Title Examples

- `feat(auth): add remember me flow`
- `fix(ci): skip flaky e2e on develop`
- `chore(deps): update next and eslint`
- `docs(readme): add github setup checklist`
