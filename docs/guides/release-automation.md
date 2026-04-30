# Release Automation

## Purpose

How versioning and changelog automation works with Release Please.

## Workflow

1. Merge Conventional Commit PRs into `main`
2. `release-please.yml` opens/updates release PR
3. Merge `chore(main): release ...` PR
4. Tag + GitHub release + `CHANGELOG.md` update happen automatically

## Rules

- Do not create release tags manually
- Do not hand-edit generated release PR body
- Keep commit messages conventional (`feat`, `fix`, `docs`, `refactor`, etc.)

## Troubleshooting

### Missing expected changelog items

- Check commit message format
- Check target branch and merged commit scope

### Duplicate tag or release entry

- Remove duplicate release entry
- Re-run workflow from Actions tab

### Release PR not opening

- Verify workflow permissions
- Check `.release-please-config.json` and `release-please-manifest.json`
