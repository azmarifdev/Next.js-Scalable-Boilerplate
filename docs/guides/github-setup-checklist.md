# GitHub Setup Checklist

Use this checklist after adding workflows or creating a new repository from this template.

## Guide Position (Tree)

```txt
docs/
└─ guides/
   ├─ deployment.md
   ├─ github-setup-checklist.md     <- you are here
   ├─ release-automation.md
   └─ project-maintenance.md
```

## Scope

This guide covers repository settings, branch protection, required checks, and action permissions.

This guide does not cover release troubleshooting details (see `docs/guides/release-automation.md`).

## 1) Repository Settings (General)

- [ ] Go to `Settings -> General -> Pull Requests`
- [ ] Enable `Allow auto-merge`
- [ ] (Recommended) Enable `Automatically delete head branches`

## 2) Default Branch

- [ ] Confirm primary branch is `main`

## 3) Branch Protection Rule (`main`)

Go to `Settings -> Branches -> Add branch protection rule`.

- [ ] Pattern: `main`
- [ ] Require PR before merging
- [ ] Require at least 1 approval
- [ ] Dismiss stale approvals on new commits
- [ ] Require status checks to pass
- [ ] Require branches to be up to date
- [ ] Require conversation resolution before merging
- [ ] (Recommended) Do not allow bypassing these rules

Required checks to add:

- [ ] `CI / Quality (lint)`
- [ ] `CI / Quality (typecheck)`
- [ ] `CI / Quality (test)`
- [ ] `CI / Build`
- [ ] `Commit Lint / commitlint`
- [ ] `Dependency Review / dependency-review`
- [ ] `PR Title Check / semantic-pr-title`
- [ ] `Package Manager Consistency / npm lockfile check` (recommended)
- [ ] `Package Manager Consistency / yarn lockfile check` (recommended)
- [ ] `Package Manager Consistency / pnpm lockfile check` (recommended)
- [ ] `Package Manager Consistency / bun lockfile check` (recommended when bun lockfile exists)
- [ ] `CodeQL / Analyze (JavaScript/TypeScript)` (recommended)

## 4) Actions Permissions

Go to `Settings -> Actions -> General`.

- [ ] Actions permission: allow workflows required by repository policy
- [ ] Workflow permissions: `Read and write`
- [ ] Enable `Allow GitHub Actions to create and approve pull requests`

## 5) Merge Strategy

Go to `Settings -> General -> Pull Requests`.

- [ ] Enable `Allow squash merging`
- [ ] (Optional) Disable merge commit
- [ ] (Optional) Disable rebase merge

## 6) Labels For Automation

Ensure these labels exist:

- [ ] `dependencies`
- [ ] `automerge-candidate`
- [ ] `automerge`
- [ ] `ci`
- [ ] `docs`
- [ ] `tests`
- [ ] `frontend`
- [ ] `backend`
- [ ] `stale`

## 7) Baseline Alignment Policy

- [ ] `.nvmrc` version matches CI Node baseline
- [ ] `package.json -> engines.node` matches supported window
- [ ] If Node baseline changes, update workflows + docs in the same PR

## 8) First Validation PR

- [ ] Open test PR: `chore(ci): verify github automation`
- [ ] Confirm required checks run and pass
- [ ] Merge one conventional commit into `main`
- [ ] Confirm release PR is opened/updated by Release Please

## 9) Optional Auto-Merge Flow

- [ ] Add label `automerge` to the PR
- [ ] Ensure all required checks pass
- [ ] Auto-merge should execute under branch protection rules

## Quick PR Title Examples

- `feat(auth): add remember me flow`
- `fix(ci): stabilize lockfile checks`
- `chore(deps): update eslint and vitest`
- `docs(guides): improve onboarding checklist`
