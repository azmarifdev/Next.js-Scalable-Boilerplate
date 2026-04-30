# Security Policy

## Purpose

This file defines supported versions and how to report vulnerabilities responsibly.

## Supported Versions

Security fixes are applied to the latest published line.

| Version line        | Supported        |
| ------------------- | ---------------- |
| Latest release      | Yes              |
| Older release lines | Best effort only |

## Report a Vulnerability

Please do not open public GitHub issues for sensitive vulnerabilities.

Use one of these channels:

- Security advisory workflow in GitHub (preferred)
- Private contact with maintainers (if available)

Include:

- Reproduction steps
- Affected files/routes
- Impact assessment
- Suggested fix (optional)

## Expected Response

- Initial acknowledgement: as soon as maintainers are available
- Triage: severity and exploitability review
- Remediation: patch + release guidance

## Scope Highlights

Sensitive areas in this template:

- `src/app/api/v1/auth/*`
- `src/lib/auth/*`
- `src/lib/security/*`
- `src/proxy.ts`

For secure runtime setup, also read: `docs/auth-flow.md` and `docs/deployment/cloud-providers.md`.
