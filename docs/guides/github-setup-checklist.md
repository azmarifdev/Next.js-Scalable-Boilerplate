# GitHub Setup Checklist

## Purpose

When you fork or clone this boilerplate, there are a few GitHub settings you should configure to keep your repository secure, consistent, and easy to maintain. This guide walks you through each one step by step.

If you're setting up a new repository, go through this checklist **before** your team starts contributing.

---

## 1. Branch Protection Rules

Protecting your `main` branch prevents accidental pushes and enforces code review. Without this, anyone with push access could bypass reviews and deploy broken code to production.

### How to Set Up

1. Go to your repository on GitHub
2. Click **Settings** → **Branches** → **Add branch protection rule**
3. In the **Branch name pattern** field, type `main`
4. Enable these settings:

| Setting                                                                 | Why It Matters                        |
| ----------------------------------------------------------------------- | ------------------------------------- |
| ✅ **Require a pull request before merging**                            | Every change must be reviewed         |
| ✅ **Require approvals** (set to at least 1)                            | At least one person must approve      |
| ✅ **Dismiss stale pull request approvals when new commits are pushed** | Ensures reviewers see latest changes  |
| ✅ **Require status checks to pass before merging**                     | Broken code can't be merged           |
| ✅ **Require branches to be up to date**                                | PR must be based on the latest `main` |
| ✅ **Restrict who can push to matching branches**                       | Only admins can push directly         |
| ✅ **Do not allow bypassing the above settings**                        | Even admins must follow the rules     |

5. Click **Create**

### Suggested Status Checks to Require

These are the GitHub Actions workflow names from this template. Require them so that failing CI blocks merging:

- `ci` — Runs lint, typecheck, tests, build
- `commitlint` — Ensures commit messages follow conventions
- `dependency-review` — Scans for vulnerable dependencies
- `pr-title` — Validates PR title follows conventional format

---

## 2. Secrets & Environment Variables

GitHub Secrets keep sensitive values (database URLs, API keys) out of your codebase. These are needed for CI workflows and deployments.

### How to Add Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret below

### Required Secrets (Internal Auth)

| Secret                | Example Value                           | Used By              |
| --------------------- | --------------------------------------- | -------------------- |
| `DATABASE_URL`        | `postgresql://user:pass@host/db`        | CI tests, migrations |
| `AUTH_SESSION_SECRET` | (generated with `openssl rand -hex 32`) | Session signing      |

### Optional Secrets (MFA / Security)

| Secret                         | When Needed                                                      |
| ------------------------------ | ---------------------------------------------------------------- |
| `AUTH_MFA_VERIFY_URL`          | If `REQUIRE_ADMIN_STEP_UP_AUTH=true` and using external verifier |
| `AUTH_MFA_VERIFY_BEARER_TOKEN` | If your MFA verifier requires authentication                     |

### Secrets for Custom Auth Mode

| Secret                             | When Needed                                |
| ---------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL` | If `NEXT_PUBLIC_AUTH_PROVIDER=custom-auth` |

> ⚠️ **Never commit secrets.** The `.env` file is in `.gitignore` for a reason. Always use GitHub Secrets or your provider's env variable dashboard for production values.

---

## 3. Required Status Checks

Go to **Settings** → **Branches** → edit your `main` branch rule. Under "Require status checks to pass before merging", select:

| Check               | What It Does                                            |
| ------------------- | ------------------------------------------------------- |
| `ci`                | Runs lint → typecheck → test → build                    |
| `commitlint`        | Validates each commit message is conventional           |
| `pr-title`          | Ensures the PR title matches conventional commit format |
| `dependency-review` | Flags PRs that introduce vulnerable dependencies        |
| `codeql`            | (Optional) GitHub's built-in security analysis          |

> **Tip:** If you're not using CodeQL, you can skip it. The other four are the minimum recommended set.

---

## 4. Repository Labels

Labels make it easy to categorize issues and pull requests. Here are the recommended baseline labels:

| Label           | Color                  | Purpose                     |
| --------------- | ---------------------- | --------------------------- |
| `bug`           | `#d73a4a` (red)        | Something isn't working     |
| `enhancement`   | `#a2eeef` (light blue) | New feature or improvement  |
| `documentation` | `#0075ca` (blue)       | Docs-related changes        |
| `dependencies`  | `#0366d6` (dark blue)  | Dependency updates          |
| `security`      | `#e99695` (light red)  | Security-related issues/PRs |

### How to Add Labels

1. Go to **Issues** → **Labels** → **New label**
2. Enter the name, description, and color
3. Click **Create label**

Or use this GitHub CLI command to add them all at once:

```bash
gh label create bug --color d73a4a --description "Something isn't working"
gh label create enhancement --color a2eeef --description "New feature or improvement"
gh label create documentation --color 0075ca --description "Docs-related changes"
gh label create dependencies --color 0366d6 --description "Dependency updates"
gh label create security --color e99695 --description "Security-related issues/PRs"
```

---

## 5. Release Permissions

The release workflow needs permission to create pull requests and write tags/releases. By default, the `GITHUB_TOKEN` in GitHub Actions has limited permissions — you need to expand them.

### How to Configure

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

This allows the `release-please.yml` workflow to:

- Create release PRs automatically
- Create GitHub releases with changelog entries
- Push version tags (`v0.1.x`)

---

## 6. Merge Strategy (Recommended)

Go to **Settings** → **Merge button** and enable only:

| Option                   | Recommended?         | Why                                                       |
| ------------------------ | -------------------- | --------------------------------------------------------- |
| **Allow squash merging** | ✅ **Yes (default)** | Keeps history clean — one commit per PR                   |
| **Allow merge commits**  | ❌ No                | Creates messy history with merge bubbles                  |
| **Allow rebase merging** | ⚠️ Optional          | Useful for some workflows, but can be confusing for teams |

Set **Squash merge** as the default. This means when you merge a PR, all its commits are combined into one conventional commit message.

---

## Quick Reference Summary

```mermaid
graph TD
    A[New Repository] --> B[Branch Protection]
    A --> C[Secrets]
    A --> D[Labels]
    A --> E[Permissions]
    B --> F[Require PR reviews]
    B --> G[Require status checks]
    C --> H[Add DATABASE_URL, AUTH_SESSION_SECRET]
    D --> I[Create baseline labels]
    E --> J[Enable write permissions for Actions]
```
