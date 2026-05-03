# Package Manager Migration

## Purpose

This boilerplate uses **pnpm** as its default package manager. If your team prefers a different package manager (npm, yarn, bun), this guide walks you through a safe migration — without breaking CI, lockfiles, or developer workflows.

---

## Current Defaults

| Setting                | Value                            |
| ---------------------- | -------------------------------- |
| **Package manager**    | `pnpm`                           |
| **Lockfile**           | `pnpm-lock.yaml`                 |
| **CI install command** | `pnpm install --frozen-lockfile` |
| **Workspace config**   | `pnpm-workspace.yaml`            |

---

## Migration Steps

Follow these steps **in order**. Don't skip ahead.

### Step 1: Choose Your New Package Manager

Decide which manager to switch to:

| Manager  | Lockfile            | Install Command                  | Notes                                 |
| -------- | ------------------- | -------------------------------- | ------------------------------------- |
| **npm**  | `package-lock.json` | `npm ci`                         | Node built-in, familiar to most       |
| **yarn** | `yarn.lock`         | `yarn install --frozen-lockfile` | Faster than npm in some cases         |
| **bun**  | `bun.lock`          | `bun install --frozen-lockfile`  | Fastest installs, but newer ecosystem |

### Step 2: Delete Old Lockfile & Node Modules

Clean up the old manager's artifacts to prevent conflicts:

```bash
# For pnpm → npm migration:
rm -rf node_modules pnpm-lock.yaml pnpm-workspace.yaml

# For pnpm → yarn migration:
rm -rf node_modules pnpm-lock.yaml yarn.lock  # (yarn.lock will be regenerated)

# For pnpm → bun migration:
rm -rf node_modules pnpm-lock.yaml
```

### Step 3: Generate New Lockfile

```bash
# For npm
npm install
# This creates package-lock.json

# For yarn
yarn install
# This creates yarn.lock

# For bun
bun install
# This creates bun.lock
```

### Step 4: Update CI Workflows

Go to `.github/workflows/` and update **every workflow file** that runs package manager commands.

Find these files:

- `ci.yml`
- `package-manager-consistency.yml`
- `bun-compatibility.yml`
- `dependabot-auto-merge.yml`
- `dependency-review.yml`

**For npm migration:** Update all `pnpm install` commands to `npm ci`, and `pnpm run` to `npm run`.

**Example — CI workflow before (pnpm):**

```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile

- name: Run lint
  run: pnpm run lint
```

**Example — CI workflow after (npm):**

```yaml
- name: Install dependencies
  run: npm ci

- name: Run lint
  run: npm run lint
```

### Step 5: Update Package.json Scripts

Check if any scripts in `package.json` use pnpm-specific features:

- `pnpm run` → stays the same (works for all managers)
- `pnpm exec` → replace with `npx` (npm), `yarn exec` (yarn), or `bunx` (bun)
- Filtering (`pnpm --filter`) → needs to be adapted per manager

### Step 6: Update Documentation

Update these files to reference the new package manager:

| File                                 | What to Update                            |
| ------------------------------------ | ----------------------------------------- |
| `README.md`                          | Installation commands, build instructions |
| `CONTRIBUTING.md`                    | Setup steps, PR requirements              |
| `docs/how-to-use.md`                 | All CLI examples                          |
| `docs/guides/deployment.md`          | Build and start commands                  |
| `docs/deployment/cloud-providers.md` | Provider build settings                   |
| `.github/pull-request-template.md`   | (If it references commands)               |

### Step 7: Remove Manager-Specific Config Files

Delete files that are specific to the old manager:

```bash
# For pnpm → npm, remove:
rm -f .npmrc  # If you had one, create a new one if needed

# For pnpm → bun, remove:
# (pnpm files already deleted in Step 2)
```

### Step 8: Commit and Verify

```bash
# Add all changes
git add .

# Commit with a descriptive message
git commit -m "build(deps): migrate from pnpm to npm"

# Push and let CI run
git push
```

---

## Verification Checklist

After migration, run these commands locally and make sure they all pass:

```bash
# Install should succeed with the new lockfile
npm ci

# Core quality checks
npm run lint
npm run typecheck
npm run test
npm run build
npm run docs:check
```

Then check CI:

1. ✅ All workflow runs pass
2. ✅ Lockfile is consistent (no unexpected changes)
3. ✅ Build produces the same output as before

---

## Risk Controls

### ⚠️ Avoid Mixed Lockfiles

Never commit two lockfiles (`pnpm-lock.yaml` + `package-lock.json`) in the same branch. This confuses CI and can cause subtle dependency resolution bugs.

### ⚠️ Keep Migration PR Focused

Do **not** mix a package manager migration with feature work or bug fixes. Create a single-purpose PR:

```
Title: build(deps): migrate from pnpm to npm
Changes: lockfile, CI workflows, docs
```

### ⚠️ Verify Dependency-Review Still Works

The `dependency-review.yml` workflow checks for vulnerabilities. After migration, confirm it still passes — some workflows depend on the lockfile format.

---

## Rollback Plan

If something goes wrong after migration:

1. Revert the migration commit: `git revert <commit-hash>`
2. Restore the old lockfile from git: `git checkout HEAD~1 -- pnpm-lock.yaml`
3. Delete the new lockfile: `rm package-lock.json`
4. Reinstall: `pnpm install`
5. Investigate what went wrong, fix it, and try again

---

## Related Docs

- `docs/guides/deployment.md`
- `docs/guides/github-setup-checklist.md`
- `docs/workflows.md`
