# Contributing Guide

## Development Setup

1. Install dependencies:
   - `npm install`
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

## Branch & PR Notes

- Keep PRs focused and small.
- Add/update tests for behavior changes.
- Mention any known limitations in PR description.
