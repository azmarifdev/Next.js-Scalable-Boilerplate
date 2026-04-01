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
- [10. Package Manager Support (npm, yarn, pnpm, bun)](#10-package-manager-support-npm-yarn-pnpm-bun)
- [11. Database Workflow](#11-database-workflow)
- [12. Testing Strategy](#12-testing-strategy)
- [13. GitHub Automation Overview](#13-github-automation-overview)
- [14. Manual GitHub Setup (Required)](#14-manual-github-setup-required)
- [15. AI Assistant Instructions (Optional but Recommended)](#15-ai-assistant-instructions-optional-but-recommended)
- [16. Common Problems and Manual Fixes](#16-common-problems-and-manual-fixes)
- [17. Safe Push and Release Demo](#17-safe-push-and-release-demo)
- [18. Contribution Guidelines](#18-contribution-guidelines)
- [19. Additional Documents](#19-additional-documents)
- [20. Deployment](#20-deployment)

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

## 10. Package Manager Support (npm, yarn, pnpm, bun)

This template is primarily CI-verified with `npm`, and also prepared for `yarn` and `pnpm`.

Included lock/config files:

- `package-lock.json` (npm)
- `yarn.lock` + `.yarnrc.yml` (yarn)
- `pnpm-lock.yaml` (pnpm)
- `codehawk.json` (for CodeHawk scan config)
- `bun.lock` or `bun.lockb` (generated when a user runs Bun install)

Install commands:

- npm: `npm run install:npm`
- yarn: `npm run install:yarn`
- pnpm: `npm run install:pnpm`
- bun (if installed): `npm run install:bun`

Important:

- In CI, `npm` remains the default for stability.
- If your team decides to switch primary manager, keep lockfiles synchronized intentionally.
- `bun` is optional and requires Bun runtime installed locally.
- Before switching manager on the same machine, run a clean install (`rm -rf node_modules` then fresh install) to avoid mixed dependency states.

Manual verification:

- Run GitHub Action `Package Manager Consistency` from Actions tab to validate lockfiles across package managers.
- Run GitHub Action `Bun Compatibility` from Actions tab for Bun-specific lint/typecheck/build verification.

How template users can initialize Bun lockfile:

```bash
bun install
# then commit generated bun.lock or bun.lockb
```

## 11. Database Workflow

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

## 12. Testing Strategy

- Use Jest for component and unit behavior.
- Use Vitest for fast utility-level checks.
- Use Playwright for browser-level end-to-end flows.

Suggested CI-parity local check before PR:

```bash
npm run lint && npm run typecheck && npm run format:check && npm run test && npm run test:vitest && npm run build
```

## 13. GitHub Automation Overview

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
- `codehawk.yml`: weekly/manual CodeHawk scan (report-focused, non-blocking).
- `package-manager-consistency.yml`: manual lockfile consistency verification for npm/yarn/pnpm (and bun when lockfile exists).
- `bun-compatibility.yml`: manual Bun verification flow (`bun install`, lint, typecheck, vitest, build).

Release mapping highlights:

- `feat` -> `Features`
- `fix` -> `Bug Fixes`
- `perf` -> `Performance`
- `refactor` -> `Refactoring`
- `docs` -> `Documentation`
- `ci` / `build` / `test` -> dedicated technical sections
- `chore` and `style` are hidden from changelog by default

## 14. Manual GitHub Setup (Required)

These are one-time repository settings that must be done manually.

### 14.1 Enable action permissions for release automation

Path: `Settings -> Actions -> General`

- Set `Workflow permissions` to `Read and write permissions`.
- Enable `Allow GitHub Actions to create and approve pull requests`.

Why: required by `release-please` to open/update release PRs.

### 14.2 Enable auto-merge

Path: `Settings -> General -> Pull Requests`

- Enable `Allow auto-merge`.

Why: required for Dependabot safe auto-merge flow.

### 14.3 Configure branch protection/ruleset for `main`

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

### 14.4 Optional but recommended repository settings

- Enable `Automatically delete head branches`.
- Keep only one merge strategy (usually squash merge).

## 15. AI Assistant Instructions (Optional but Recommended)

To improve output quality from coding agents, this template includes project-specific AI guidance files:

- `.claude/CLAUDE.md`: high-level engineering rules and validation flow.
- `.cursor/rules/project-agent.mdc`: Cursor rule file with repository-specific constraints.

Why this helps:

- reduces generic AI output
- keeps changes aligned with your architecture
- reminds agents to run the same quality gates as CI
- improves consistency across contributors using different AI tools

If your team does not use AI coding tools, these files are harmless and can be ignored.

## 16. Common Problems and Manual Fixes

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

Note:

- Push to branch does not auto-merge into `main`.
- If you want auto-merge behavior, add `automerge` label to the PR (this repository includes `PR Auto Merge` workflow for that).

### Problem E: Commit lint fails unexpectedly

Fix checklist:

1. Verify commit format is Conventional Commit.
2. Verify PR title is semantic (separate workflow requirement).
3. Push updated commit/title and re-run failed jobs.

### Problem F: Release Please logs parsing warnings for old commits

Example warning:

`commit could not be parsed ... unexpected token`

What it means:

- Old non-conventional commits exist in history.

What to do:

1. Keep all new commits in Conventional Commit format.
2. Continue using semantic PR titles.
3. Treat old-history parse warnings as non-blocking unless release PR generation stops.

### Problem G: Release PR not appearing after merge

Checklist:

1. Confirm merge happened into `main`.
2. Confirm `Release Please` workflow ran on that push.
3. Confirm action permissions in `Settings -> Actions -> General`.
4. Confirm `.release-please-config.json` and `.release-please-manifest.json` exist in `main`.

## 17. Safe Push and Release Demo

### 17.1 Standard safe push flow

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

### 17.2 After opening PR

- fix PR title if semantic check fails
- wait for all required checks to pass
- resolve reviews
- merge PR

### 17.3 Release process after merge

- `release-please` updates/creates release PR
- merge release PR
- version + tag + changelog + GitHub release notes generated automatically

### 17.4 Example release-friendly commit and PR title

- Commit: `feat(auth): add password reset flow`
- PR title: `feat(auth): add password reset flow`

## 18. Contribution Guidelines

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

## 19. Additional Documents

- Contribution policy: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Manual GitHub setup checklist: [`GITHUB_SETUP_CHECKLIST.md`](./GITHUB_SETUP_CHECKLIST.md)
- Commit examples: [`.github-commit-message-examples.txt`](./.github-commit-message-examples.txt)
- Changelog: [`CHANGELOG.md`](./CHANGELOG.md)
- Release automation guide: [`RELEASE_AUTOMATION.md`](./RELEASE_AUTOMATION.md)
- Cross-agent guide: [`AGENTS.md`](./AGENTS.md)
- Claude AI guide: [`.claude/CLAUDE.md`](./.claude/CLAUDE.md)
- Cursor rules: [`.cursor/rules/project-agent.mdc`](./.cursor/rules/project-agent.mdc)
- Windsurf rules: [`.windsurf/rules/project-guidelines.md`](./.windsurf/rules/project-guidelines.md)
- Copilot instructions: [`.vscode/copilot-instructions.md`](./.vscode/copilot-instructions.md)
- Kiro steering: [`.kiro/steering/product.md`](./.kiro/steering/product.md), [`.kiro/steering/tech.md`](./.kiro/steering/tech.md), [`.kiro/steering/structure.md`](./.kiro/steering/structure.md), [`.kiro/steering/code-quality.md`](./.kiro/steering/code-quality.md)

## 20. Deployment

For complete runtime requirements and multi-platform deployment steps (Vercel, Docker, AWS, Azure, DigitalOcean), use:

- [`DEPLOYMENT.md`](./DEPLOYMENT.md)
