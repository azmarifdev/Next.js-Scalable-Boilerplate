# Code Quality Steering

## Quality Principles

- Readability over cleverness.
- Predictable behavior over hidden magic.
- Explicit types over implicit assumptions.
- Small diffs over broad rewrites.

## Mandatory Standards

- Keep TypeScript strict-safe.
- Keep lint/type/test/build green.
- Avoid introducing dead code or unused dependencies.
- Maintain accessibility for interactive UI.

## Recommended Coding Practices

- Keep functions and components focused.
- Prefer early returns to reduce nesting.
- Prefer reusable helpers when logic repeats.
- Add tests for behavioral changes.
- Add comments only when intent is non-obvious.

## Prohibited Practices

- No hardcoded secrets.
- No disabling lint/type checks to pass CI.
- No unrelated refactors in task-specific PRs.
- No direct push to protected branch unless explicitly requested.

## Verification Before Completion

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run test:vitest
npm run build
```
