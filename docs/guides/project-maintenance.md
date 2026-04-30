# Project Maintenance

## Purpose

Routine maintenance checklist for stability, security, and upgrade health.

## Daily

- Sync feature branches with `main`
- Run lint/typecheck/tests before pushing
- Keep docs aligned with behavior changes

## Weekly

- Review dependency PRs and scan results
- Review CI flakes and failing tests
- Check auth/security related open issues

## Monthly

- Audit env vars and secret hygiene
- Review optional module flag usage
- Verify release automation health
- Verify docs still match runtime behavior

## Quarterly

- Validate deployment guides against current providers
- Re-run full e2e + integration suite
- Review deprecated dependencies and major upgrades
