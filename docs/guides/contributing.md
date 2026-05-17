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

The app will be available at the origin derived from `APP_PROTOCOL`, `APP_HOST`, and `PORT`. With defaults, that is **http://localhost:3000**.

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

More examples (copied from repository defaults):

```
feat(auth): add forgot-password form shell
fix(middleware): redirect unauthorized users to login
refactor(services): centralize error handling in api client
docs(readme): add testing section
test(auth): add login validation tests
chore(ci): cache npm dependencies
```

### Git Workflow (Recommended)

Use this workflow for clean history and easier maintenance:

```bash
# 1) Sync main
git checkout main
git pull origin main

# 2) Create a focused branch
git checkout -b fix/docs-locale-fallback

# 3) Work + stage only related files
git add <files>
git commit -m "fix(docs): load english markdown for docs routes"

# 4) Rebase on latest main before PR
git fetch origin
git rebase origin/main

# 5) Push and open PR
git push -u origin fix/docs-locale-fallback
```

Tips:

- Keep one PR = one concern (example: `docs locale fix`, not `docs + auth + ui` together)
- Prefer multiple small commits over one huge commit while developing
- Before merge, squash via PR title using conventional commit format
- If conflicts happen during rebase, resolve carefully and run tests again

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

**Shared test helper:** Use `TEST_LOCAL_ORIGIN` and `testUrl()` from `src/tests/shared.ts` when creating mock `NextRequest` objects in integration tests — keeps them in sync with the centralized URL config (`APP_PROTOCOL`/`APP_HOST`/`PORT`).

**Current test coverage (63+ tests across 14 files):**

| Layer       | Files                                                                                                                                                                                                                                                                         | What's covered                                                                                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit        | `url.vitest.ts`, `rate-limit.vitest.ts`, `logger.vitest.ts`, `feature-flags.vitest.ts`, `api-response.vitest.ts`, `redirect.vitest.ts`, `request-origin.vitest.ts`, `runtime.vitest.ts`, `session.vitest.ts`, `auth.validation.test.ts`, `utils.vitest.ts`, `button.test.tsx` | URL derivation, rate-limit in-memory fallback, logger JSON output, feature flag resolution, redirect safety, origin validation, runtime config, auth validation |
| Integration | `auth-api.test.ts`, `mode-guards.test.ts`                                                                                                                                                                                                                                     | Auth API routes (register/login/logout/me/MFA), mode guards (external mode blocking)                                                                            |
| E2E         | `home.spec.ts`, `i18n.spec.ts`, `sanity.check.spec.ts`, `docs.spec.ts`, `navigation.spec.ts`, `i18n-multi-locale.spec.ts`                                                                                                                                                     | Login flow, locale switch, robots/sitemap, docs articles & tables, theme toggle, 404, multi-locale rendering                                                    |

- ✅ Write tests for new features and bug fixes
- ✅ Update existing tests if your change affects their behavior
- ✅ Run the full test suite before pushing

### E2E Stability Tips (Playwright)

If tests fail in CI but pass locally, check these first:

- Avoid brittle selectors that depend on one exact text only
- Prefer role-based selectors with locale-aware fallback patterns
- If UI may show different auth state (`Sign in` vs `Sign out`), assert both possible states safely
- Keep `PORT`/`E2E_BASE_URL` consistent with `playwright.config.ts` if you change the local test origin
- Review retries/workers settings in `playwright.config.ts` if runtime suddenly increases

---

## Documentation Guidelines

- ✅ Update docs when you change behavior (env vars, auth flow, API, etc.)
- ✅ Keep the relevant `docs/` file in sync with your code
- ✅ Keep documentation in English only (UI localization can still use `next-intl` messages)
- ❌ Don't leave "TODO" comments in code — either do it or file an issue

---

## Package Manager Policy

- **Primary manager:** `pnpm`
- **Lockfile:** `pnpm-lock.yaml` — must be committed and kept in sync
- **CI uses:** `pnpm install --frozen-lockfile`

If your team needs to switch to a different package manager, see the [Package Manager Migration](../migrations/package-manager.md) guide.

---

## Release Flow

This project uses **Release Please** for automated versioning:

1. Merge conventional commit PRs into `main`
2. Release Please opens a release PR
3. Merge the release PR → tag + changelog + GitHub release auto-generated

If a release PR ever shows required checks as `Expected`, do not guess check names manually.
Use the ruleset **Add checks** dropdown and re-add exact live check-run names.

See [Release Automation](release-automation.md) for details.

---

## Maintenance Troubleshooting

For CI, auto-merge policy, dependency safety, and long-term maintenance incidents, see:

- [Project Maintenance](project-maintenance.md)

---

## Related Guides

- [Deployment Guide](deployment.md) — How to ship to production
- [Project Maintenance](project-maintenance.md) — Keeping the project healthy
- [GitHub Setup Checklist](github-setup-checklist.md) — Repository hardening for maintainers
- [Release Automation](release-automation.md) — How releases work
