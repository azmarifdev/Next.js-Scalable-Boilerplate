# Contributing Guide

## Purpose

This guide explains how to contribute to this boilerplate safely — without breaking conventions, tests, or documentation. Whether you're fixing a bug, adding a feature, or improving docs, follow these guidelines to keep the project consistent.

---

## Development Setup

### Prerequisites

- **Node.js** `>=20 <23` (check with `node --version`)
- **pnpm** `>=8` (check with `pnpm --version`)

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/your-org/your-repo.git
cd your-repo

# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

The app will be available at **http://localhost:3000**.

---

## Before Opening a PR

Run these checks **before** pushing your changes. They mirror what CI will run:

```bash
# Code quality
pnpm run lint

# TypeScript compilation
pnpm run typecheck

# All tests pass
pnpm run test

# Formatting is consistent
pnpm run format:check

# Production build succeeds
pnpm run build
```

If any of these fail, fix the issue before pushing. A red CI is a blocker for merging.

---

## Commit & PR Rules

### Commit Messages

Use **Conventional Commits**. This is required because Release Please uses commit messages to generate changelogs and determine version bumps.

```
type(scope): description
```

| Type       | When To Use                                | Changelog Section |
| ---------- | ------------------------------------------ | ----------------- |
| `feat`     | A new feature                              | Features          |
| `fix`      | A bug fix                                  | Bug Fixes         |
| `docs`     | Documentation changes                      | Documentation     |
| `refactor` | Code restructuring without behavior change | Refactoring       |
| `perf`     | Performance improvement                    | Performance       |
| `test`     | Adding or updating tests                   | Tests             |
| `ci`       | CI/CD workflow changes                     | CI                |
| `build`    | Build system or dependency changes         | Build System      |
| `chore`    | Maintenance tasks (hidden from changelog)  | —                 |

**Examples:**

```
feat(landing): add hero section with tech stack icons
fix(auth): resolve redirect loop on login failure
docs(readme): update deployment instructions
refactor(proxy): simplify route protection logic
test(e2e): add login flow end-to-end test
ci(release): add contributor avatars to release notes
```

### PR Titles

Since PRs are typically **squash-merged**, your PR title becomes the final commit message. Follow the same format:

✅ **Good:** `feat(landing): add hero section with icons`
❌ **Bad:** `Update landing page`

### PR Size

- ✅ Keep PRs **small and focused** — one feature or fix per PR
- ❌ Don't mix refactoring with feature work
- ❌ Don't mix docs updates with code changes (unless closely related)

---

## Testing Guidelines

| Type              | Tool       | When To Write                                            |
| ----------------- | ---------- | -------------------------------------------------------- |
| Unit tests        | Vitest     | For utility functions, hooks, pure logic                 |
| Integration tests | Vitest     | For API routes, auth flows, database operations          |
| E2E tests         | Playwright | For critical user journeys (login, register, navigation) |

- ✅ Write tests for new features and bug fixes
- ✅ Update existing tests if your change affects their behavior
- ✅ Run the full test suite before pushing

---

## Documentation Guidelines

- ✅ Update docs when you change behavior (env vars, auth flow, API, etc.)
- ✅ Keep the relevant `docs/` file in sync with your code
- ✅ Add translations to `docs/bn/` if you change English docs
- ❌ Don't leave "TODO" comments in code — either do it or file an issue

---

## Package Manager Policy

- **Primary manager:** `pnpm`
- **Lockfile:** `pnpm-lock.yaml` — must be committed and kept in sync
- **CI uses:** `pnpm install --frozen-lockfile`

If your team needs to switch to a different package manager, see the [Package Manager Migration](docs/migrations/package-manager.md) guide.

---

## Release Flow

This project uses **Release Please** for automated versioning:

1. Merge conventional commit PRs into `main`
2. Release Please opens a release PR
3. Merge the release PR → tag + changelog + GitHub release auto-generated

See [Release Automation](docs/guides/release-automation.md) for details.

---

## Related Guides

- [Deployment Guide](docs/guides/deployment.md) — How to ship to production
- [Project Maintenance](docs/guides/project-maintenance.md) — Keeping the project healthy
- [GitHub Setup Checklist](docs/guides/github-setup-checklist.md) — Repository hardening for maintainers
- [Release Automation](docs/guides/release-automation.md) — How releases work
