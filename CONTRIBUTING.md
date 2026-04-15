# Contributing Guide

## Development Setup

1. Use the project Node version:
   - `nvm use`
2. Install dependencies with your preferred manager:
   - npm: `npm ci`
   - pnpm: `pnpm install --frozen-lockfile`
   - yarn: `yarn install --frozen-lockfile --non-interactive`
   - bun: `bun install --frozen-lockfile`
3. Start development server:
   - `npm run dev` (or equivalent manager command)

## Package Manager Policy

- This repository supports npm, pnpm, yarn, and bun for local development.
- CI quality checks run with npm, and lockfile consistency workflow validates npm/pnpm/yarn lockfiles (bun when lockfile exists).
- If you modify dependencies, keep lockfiles consistent in the same PR.
- Do not leave dependency updates with only one lockfile updated.
- If your team wants to switch canonical manager policy, follow `docs/migrations/package-manager.md`.

## Quality Checks

Before creating a PR, run:

- install command for your chosen manager
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run format:check`
- `npm run build`

## Commit Convention (Commitlint)

This project follows Conventional Commits.

### Format

`<type>(optional-scope): <short description>`

For breaking changes, use `!` or a `BREAKING CHANGE:` footer:

- `feat(api)!: replace legacy auth endpoint`
- `feat(api): replace auth endpoint` + `BREAKING CHANGE: ...`

### Common Types

- `feat`: new feature
- `fix`: bug fix
- `refactor`: internal code change without behavior change
- `chore`: maintenance task
- `docs`: documentation change
- `test`: test-related change
- `style`: formatting/style-only change

### Valid Examples

- `feat(auth): add register form validation`
- `fix(api): handle missing auth token`
- `refactor(store): simplify auth slice`
- `docs: update setup instructions`

### Invalid Examples

- `updated stuff`
- `fixing bug`
- `new feature`

## Automated Release Flow

This repository uses `release-please` with Conventional Commits.

1. Open PR to `main` with semantic PR title and Conventional Commit messages.
2. After merge to `main`, GitHub Action automatically updates/opens a release PR.
3. Merge the release PR.
4. Version, tag, `CHANGELOG.md`, and GitHub release notes are created automatically.

Release quality notes:

- `feat`, `fix`, `perf`, `refactor`, `docs`, `ci`, `build`, `test` are surfaced in changelog sections.
- `chore` and `style` are hidden from release notes by default to reduce noise.
- Non-conventional legacy commits may appear as parse warnings; keep all new commits conventional.

For operational troubleshooting and manual fallback steps, see `docs/guides/release-automation.md`.

## GitHub Automation Checks

- Commit messages are validated on PRs.
- PR titles must follow semantic format (for example: `feat(auth): add login guard`).
- PR labels are added automatically from changed files.
- Dependency updates are scanned and safe Dependabot updates can auto-merge.

## Branch & PR Notes

- Keep PRs focused and small.
- Add/update tests for behavior changes.
- Mention any known limitations in PR description.
