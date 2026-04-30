# GitHub Setup Checklist

## Purpose

Repository hardening checklist for teams adopting this template.

## Branch Protection

- Protect `main`
- Require pull request review(s)
- Require status checks before merge
- Restrict direct pushes to `main`
- Prefer squash merge strategy

## Required Checks (Recommended)

- `ci`
- `commitlint`
- `pr-title`
- `dependency-review`
- `codeql` (if enforced by your org policy)

## Secrets

Internal mode minimum:

- `DATABASE_URL`
- `AUTH_SESSION_SECRET`

Optional MFA verifier:

- `AUTH_MFA_VERIFY_URL`
- `AUTH_MFA_VERIFY_BEARER_TOKEN`

Custom auth mode:

- `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL`

## Labels

Recommended baseline labels:

- `bug`
- `enhancement`
- `documentation`
- `dependencies`
- `security`

## Release Permissions

- Allow workflows to create pull requests
- Allow workflows to write release/tags metadata
