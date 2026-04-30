# Workflows

## Purpose

This file explains what each GitHub workflow does and when it runs.

## CI & Quality

- `ci.yml`: install, lint, typecheck, test, build
- `package-manager-consistency.yml`: lockfile/install consistency checks
- `bun-compatibility.yml`: bun install compatibility checks

## PR Governance

- `commitlint.yml`: Conventional Commit validation
- `pr-title.yml`: semantic PR title validation
- `labeler.yml`: auto labels from changed paths
- `pr-auto-merge.yml`: optional auto-merge policy

## Security & Dependency

- `codeql.yml`: static security analysis
- `codehawk.yml`: additional security scan
- `dependency-review.yml`: dependency risk checks on PR
- `dependabot-auto-merge.yml`: controlled safe dependency auto-merge

## Release & Maintenance

- `release-please.yml`: automated version/changelog/tag/release
- `stale.yml`: stale issue/PR cleanup

## Suggested Local Preflight

Before pushing major changes:

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
```

## Related Docs

- `docs/guides/release-automation.md`
- `docs/guides/github-setup-checklist.md`
