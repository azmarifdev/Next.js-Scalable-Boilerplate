# Contributing Guide

## Development Setup

1. Install dependencies:
   - `npm install`
   - or `npm run install:yarn`
   - or `npm run install:pnpm`
   - or `npm run install:bun` (if Bun is installed)
   - for first-time Bun use, run `bun install` once to generate `bun.lock`/`bun.lockb`
2. Start development server:
   - `npm run dev`

## Quality Checks

Before creating a PR, run:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run format:check`

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

For operational troubleshooting and manual fallback steps, see `RELEASE_AUTOMATION.md`.

## GitHub Automation Checks

- Commit messages are validated on PRs.
- PR titles must follow semantic format (for example: `feat(auth): add login guard`).
- PR labels are added automatically from changed files.
- Dependency updates are scanned and safe Dependabot updates can auto-merge.

## Branch & PR Notes

- Keep PRs focused and small.
- Add/update tests for behavior changes.
- Mention any known limitations in PR description.
