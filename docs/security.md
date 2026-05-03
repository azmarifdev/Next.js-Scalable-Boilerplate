# Security Policy

## Purpose

This document defines which versions receive security updates and how to report vulnerabilities responsibly.

---

## Supported Versions

Security fixes are applied to the latest published release line.

| Version Line        | Supported           |
| ------------------- | ------------------- |
| Latest release      | ✅ Yes              |
| Older release lines | 🔶 Best effort only |

---

## Report a Vulnerability

Please **do not** open a public GitHub issue for sensitive security vulnerabilities.

### Preferred Reporting Channels

| Channel                                    | Details                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| **GitHub Security Advisory** (recommended) | Use the "Report a vulnerability" button under the repository's **Security** tab |
| **Private contact**                        | Reach out to the maintainers directly if you have a direct channel              |

### What to Include

To help us respond quickly, please include:

- ✅ **Reproduction steps** — How to trigger the vulnerability
- ✅ **Affected files/routes** — Which parts of the codebase are affected
- ✅ **Impact assessment** — What an attacker could achieve
- ✅ **Suggested fix** (optional) — If you have a patch, include it

---

## Response Timeline

| Stage                       | Expected Time                                         |
| --------------------------- | ----------------------------------------------------- |
| **Initial acknowledgement** | Within 48 hours                                       |
| **Triage & assessment**     | Within 1 week                                         |
| **Fix & release**           | Depends on severity — critical issues are prioritized |

---

## Security-Sensitive Areas

These parts of the codebase require extra attention during changes:

| Area                | Location                | Why                                               |
| ------------------- | ----------------------- | ------------------------------------------------- |
| Auth API routes     | `src/app/api/v1/auth/*` | Handles login, registration, session management   |
| Auth infrastructure | `src/lib/auth/*`        | Session tokens, RBAC, MFA, audit logging          |
| Security utilities  | `src/lib/security/*`    | Rate limiting, origin checks, redirect validation |
| Route protection    | `src/proxy.ts`          | Browser-level authentication gate                 |
| Security headers    | `next.config.ts`        | CSP, HSTS, X-Frame-Options                        |

---

## Related Documentation

- [Auth Flow](docs/auth-flow.md) — Authentication lifecycle and security controls
- [Cloud Providers](docs/deployment/cloud-providers.md) — Production deployment security notes
