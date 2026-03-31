# Next Starter Template

Production-ready Next.js App Router starter focused on fast delivery, safe defaults, and strong engineering workflow.

This repository is designed so a team can:

- start quickly with a modern SaaS-ready baseline
- maintain consistent code quality across contributors
- automate release and maintenance workflows on GitHub
- reduce manual mistakes in CI, PR, and release processes

## Table of Contents

- [1. What This Template Provides](#1-what-this-template-provides)
- [2. Why These Tools Were Added](#2-why-these-tools-were-added)
- [3. Tech Stack](#3-tech-stack)
- [4. Repository Structure](#4-repository-structure)
- [5. Prerequisites](#5-prerequisites)
- [6. Local Setup (Step by Step)](#6-local-setup-step-by-step)
- [7. Environment Variables](#7-environment-variables)
- [8. Daily Development Workflow](#8-daily-development-workflow)
- [9. Scripts Reference](#9-scripts-reference)
- [10. Database Workflow](#10-database-workflow)
- [11. Testing Strategy](#11-testing-strategy)
- [12. GitHub Automation Overview](#12-github-automation-overview)
- [13. Manual GitHub Setup (Required)](#13-manual-github-setup-required)
- [14. Common Problems and Manual Fixes](#14-common-problems-and-manual-fixes)
- [15. Safe Push and Release Demo](#15-safe-push-and-release-demo)
- [16. Contribution Guidelines](#16-contribution-guidelines)
- [17. Additional Documents](#17-additional-documents)

## 1. What This Template Provides

- Next.js App Router + React + TypeScript baseline.
- Modular app structure under `src/` for long-term maintainability.
- Authentication foundation with NextAuth.
- Runtime validation and schema safety with Zod.
- SQL-ready layer with Drizzle ORM.
- Stripe integration scaffold for payments.
- i18n-ready architecture.
- Full quality tooling for lint, format, type checks, and tests.
- End-to-end GitHub automation for PR checks, dependency updates, security scans, and releases.

## 2. Why These Tools Were Added

- `TypeScript (strict)`: prevents runtime bugs by catching issues at compile time.
- `ESLint + Prettier`: ensures consistent style and avoids review noise.
- `Husky + lint-staged`: blocks low-quality changes before they are committed.
- `Commitlint + semantic PR title`: enforces machine-readable commit history.
- `Jest + Vitest + Playwright`: combines fast unit feedback with browser-level confidence.
- `Release Please`: automates changelog, version bump, release PR, and tags.
- `Dependabot + dependency review`: keeps dependencies updated with security visibility.
- `CodeQL`: static security analysis in CI.

## 3. Tech Stack

### Application Layer

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Redux Toolkit
- NextAuth
- Zod
- Drizzle ORM
- Stripe SDK

### Quality and Tooling

- ESLint
- Prettier
- Husky
- lint-staged
- Commitlint
- Knip
- Storybook

### Test Stack

- Jest + React Testing Library
- Vitest
- Playwright

### CI/CD and Automation

- GitHub Actions
- Release Please
- Dependabot
- CodeQL

## 4. Repository Structure

```text
nextjs-starter-template/
  .github/
    workflows/                 # CI, release, lint, label, security workflows
  drizzle/                     # DB migration SQL snapshots
  public/                      # Static assets
  src/
    app/                       # Next.js App Router pages and routes
    components/                # Shared UI components
    lib/                       # Utilities and service helpers
    store/                     # Redux setup
    i18n/                      # Internationalization setup
    styles/                    # Global styles
  CHANGELOG.md
  CONTRIBUTING.md
  GITHUB_SETUP_CHECKLIST.md
  package.json
```

## 5. Prerequisites

- Node.js `22.x` recommended for CI parity.
- npm `10+` recommended.
- GitHub repository admin access (for one-time automation settings).

## 6. Local Setup (Step by Step)

### 6.1 Clone and install

```bash
git clone https://github.com/azmarifdev/nextjs-starter-template.git
cd nextjs-starter-template
npm install
```

### 6.2 Configure environment

```bash
cp .env.example .env.local
```

Set real values in `.env.local`.

### 6.3 Run application

```bash
npm run dev
```

### 6.4 Validate project health locally

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run test:vitest
npm run build
```

## 7. Environment Variables

- `.env.example` is the baseline template.
- `.env.local` is for local secrets and must not be committed.
- CI and production should use repository/platform secrets.

Recommended practice:

- rotate credentials periodically
- never hardcode secrets in source files
- keep naming aligned between `.env.example`, app code, and CI secrets

## 8. Daily Development Workflow

1. Sync with latest `main`.
2. Create a dedicated feature/fix branch.
3. Implement code changes.
4. Run local quality and tests.
5. Commit with Conventional Commit format.
6. Push branch.
7. Open PR to `main`.
8. Resolve review comments and failed checks.
9. Merge after all required checks pass.

## 9. Scripts Reference

### App Lifecycle

- `npm run dev`: start local development server.
- `npm run build`: create production build.
- `npm run start`: start production server.
- `npm run preview`: build + run production locally.
- `npm run analyze`: run build with bundle analysis.

### Quality

- `npm run lint`: run ESLint.
- `npm run lint:fix`: apply lint auto-fixes.
- `npm run typecheck`: run TypeScript checks.
- `npm run format:check`: validate formatting.
- `npm run format:write`: rewrite files with Prettier.

### Testing

- `npm run test`: run Jest tests.
- `npm run test:watch`: Jest watch mode.
- `npm run test:vitest`: run Vitest tests.
- `npm run test:coverage`: Vitest coverage report.
- `npm run e2e`: Playwright end-to-end tests.
- `npm run e2e:ui`: Playwright interactive mode.

### Data and Tooling

- `npm run db:generate`: generate Drizzle migrations.
- `npm run db:migrate`: run migrations.
- `npm run db:studio`: open Drizzle Studio.
- `npm run storybook`: run Storybook.
- `npm run build-storybook`: build Storybook.
- `npm run knip`: detect unused files/deps.
- `npm run codehawk`: run CodeHawk scan.

## 10. Database Workflow

Typical migration cycle:

1. Update schema files.
2. Generate migration:

```bash
npm run db:generate
```

3. Apply migration:

```bash
npm run db:migrate
```

4. Verify with studio if needed:

```bash
npm run db:studio
```

## 11. Testing Strategy

- Use Jest for component and unit behavior.
- Use Vitest for fast utility-level checks.
- Use Playwright for browser-level end-to-end flows.

Suggested CI-parity local check before PR:

```bash
npm run lint && npm run typecheck && npm run format:check && npm run test && npm run test:vitest && npm run build
```

## 12. GitHub Automation Overview

Configured workflows:

- `ci.yml`: main quality gate (`lint`, `typecheck`, `format`, `test`, `build`).
- `commitlint.yml`: validates commit messages in PR context.
- `pr-title.yml`: validates semantic PR title.
- `dependency-review.yml`: reviews dependency risk in PRs.
- `dependabot-auto-merge.yml`: auto-merges safe Dependabot patch/minor updates.
- `labeler.yml`: auto-labels PRs based on changed files.
- `stale.yml`: marks/closes stale issues and PRs.
- `release-please.yml`: automates changelog, release PR, version/tag, GitHub release notes.
- `codeql.yml`: security scan for JavaScript/TypeScript.

## 13. Manual GitHub Setup (Required)

These are one-time repository settings that must be done manually.

### 13.1 Enable action permissions for release automation

Path: `Settings -> Actions -> General`

- Set `Workflow permissions` to `Read and write permissions`.
- Enable `Allow GitHub Actions to create and approve pull requests`.

Why: required by `release-please` to open/update release PRs.

### 13.2 Enable auto-merge

Path: `Settings -> General -> Pull Requests`

- Enable `Allow auto-merge`.

Why: required for Dependabot safe auto-merge flow.

### 13.3 Configure branch protection/ruleset for `main`

Path: `Settings -> Rules -> Rulesets` or `Settings -> Branches`

Enable:

- Require pull request before merging
- Require approvals (recommended: 1+)
- Dismiss stale approvals on new commits
- Require status checks to pass
- Require branches to be up to date
- Require conversation resolution

Required checks to add:

- `CI / CI`
- `Commit Lint / commitlint`
- `PR Title Check / semantic-pr-title`
- `Dependency Review / dependency-review`
- `CodeQL / Analyze (JavaScript/TypeScript)`

Important note:

- A check name appears in ruleset selection only after it has run at least once successfully.

### 13.4 Optional but recommended repository settings

- Enable `Automatically delete head branches`.
- Keep only one merge strategy (usually squash merge).

## 14. Common Problems and Manual Fixes

### Problem A: Release Please cannot create PR

Error:

`GitHub Actions is not permitted to create or approve pull requests`

Fix:

1. Go to `Settings -> Actions -> General`.
2. Enable write workflow permissions.
3. Enable Actions create/approve PRs.
4. Re-run `Release Please` job.

### Problem B: PR title check fails

Error:

`No release type found in pull request title`

Fix:

Use semantic PR title:

- `feat(ci): improve github automation`
- `fix(ci): ensure commitlint reads repo config`
- `chore(docs): update setup guide`

### Problem C: CI check not visible in ruleset

Fix:

1. Ensure `CI` workflow ran successfully at least once on target branch context.
2. Return to ruleset and search again.

### Problem D: Push succeeded but cannot merge

Fix:

1. Push branch.
2. Open PR from feature branch to `main`.
3. Wait for checks and approvals.
4. Merge PR.

### Problem E: Commit lint fails unexpectedly

Fix checklist:

1. Verify commit format is Conventional Commit.
2. Verify PR title is semantic (separate workflow requirement).
3. Push updated commit/title and re-run failed jobs.

## 15. Safe Push and Release Demo

### 15.1 Standard safe push flow

```bash
git checkout main
git pull origin main
git checkout -b feat/your-change-name
npm run lint
npm run typecheck
npm run format:check
npm run test
git add .
git commit -m "feat(scope): short clear message"
git push -u origin feat/your-change-name
```

Then open PR to `main`.

### 15.2 After opening PR

- fix PR title if semantic check fails
- wait for all required checks to pass
- resolve reviews
- merge PR

### 15.3 Release process after merge

- `release-please` updates/creates release PR
- merge release PR
- version + tag + changelog + GitHub release notes generated automatically

## 16. Contribution Guidelines

### Commit message format

```text
<type>(optional-scope): <short description>
```

Common `type` values:

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`
- `ci`

### PR standards

- keep PR focused and reasonably small
- add/update tests for behavior changes
- use semantic PR title
- ensure all checks pass before merge

For full details, see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## 17. Additional Documents

- Contribution policy: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Manual GitHub setup checklist: [`GITHUB_SETUP_CHECKLIST.md`](./GITHUB_SETUP_CHECKLIST.md)
- Commit examples: [`.github-commit-message-examples.txt`](./.github-commit-message-examples.txt)
- Changelog: [`CHANGELOG.md`](./CHANGELOG.md)
