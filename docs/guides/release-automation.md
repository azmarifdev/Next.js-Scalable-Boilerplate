# Release Automation Playbook

This guide explains how release automation works and how to debug failures.

## Guide Position (Tree)

```txt
docs/
└─ guides/
   ├─ deployment.md
   ├─ github-setup-checklist.md
   ├─ release-automation.md         <- you are here
   └─ project-maintenance.md
```

## Scope

This guide covers:

- Release Please flow
- Release failure diagnostics
- Manual fallback process

This guide does not duplicate:

- GitHub protection setup checklist (`docs/guides/github-setup-checklist.md`)
- Package manager migration process (`docs/migrations/package-manager.md`)

## 1) Normal Release Flow

1. Contributor opens PR to `main` with semantic title and Conventional Commit messages.
2. CI and policy checks run.
3. PR merges to `main`.
4. `release-please` workflow opens or updates a release PR.
5. Merging release PR publishes:
   - version bump in `package.json` + `.release-please-manifest.json`
   - `CHANGELOG.md` update
   - Git tag
   - GitHub release notes

## 2) Preconditions

- Conventional commits are used
- PR titles are semantic
- Workflow permissions allow bot PR creation
- Required checks are green on `main`
- Lockfile consistency checks are green for enabled package-manager jobs

## 3) Common Failures And Fixes

### A) Release Please cannot create PR

Symptom:

- Action says it cannot create/approve PR

Fix:

1. `Settings -> Actions -> General`
2. Set workflow permissions to `Read and write`
3. Enable action-created PR approval
4. Re-run workflow

### B) PR title fails semantic check

Symptom:

- `No release type found in pull request title`

Fix:

- Rename PR title to semantic format, e.g. `fix(ci): stabilize release checks`

### C) Commits cannot be parsed

Symptom:

- Release Please logs mention unparseable commits

Fix:

- Ensure new commits follow conventional format
- Treat old history parse warnings as non-blocking unless release PR is blocked

### D) No release PR after merge

Checklist:

1. Merge target was `main`
2. `release-please` workflow executed on that push
3. Action permissions are correct
4. Manifest/config files exist on `main`

## 4) Manual Fallback (If Automation Blocked)

Use only when org policy prevents automation.

1. Bump `package.json` version manually
2. Update `CHANGELOG.md`
3. Create release tag
4. Publish GitHub release notes manually

## 5) Post-Release Smoke Check

After release PR merge:

```bash
nvm use
npm ci
npm run build
```

If install/build fails in clean state, stop and open a follow-up hotfix PR.
