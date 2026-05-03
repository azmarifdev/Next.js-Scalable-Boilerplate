# Guides Index

## Purpose

This is the starting point for maintainers, contributors, and team members who work with this boilerplate. Each guide covers a specific operational area — from shipping your first deployment to keeping the project healthy over the long term.

Think of this as your **operations playbook**. You don't need to read everything at once — pick the guide that matches what you're trying to do right now.

---

## Guide Map

| Guide                                               | What It Covers                                                                                                        | Who It's For                                           |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [Contributing Guide](contributing.md)               | PR rules, commit conventions, dev setup, testing guidelines                                                           | Contributors and new team members                      |
| [Deployment Guide](deployment.md)                   | End-to-end deployment: pre-checks, build validation, database migration, provider setup, and post-deploy verification | Anyone deploying to production or staging              |
| [GitHub Setup Checklist](github-setup-checklist.md) | Branch protection, required CI checks, secrets management, labels, and release permissions                            | Repository admins and team leads setting up a new repo |
| [Project Maintenance](project-maintenance.md)       | Daily, weekly, monthly, and quarterly routines to keep the project stable and secure                                  | Active maintainers and regular contributors            |
| [Release Automation](release-automation.md)         | How Release Please works, conventional commit rules, version bumps, and troubleshooting                               | Anyone involved in the release process                 |

---

## Recommended Reading Order

If you're new to this boilerplate, follow this order:

1. **Learn how to contribute** → [Contributing Guide](contributing.md)
2. **Set up your repo** → [GitHub Setup Checklist](github-setup-checklist.md)
3. **Ship to production** → [Deployment Guide](deployment.md)
4. **Understand releases** → [Release Automation](release-automation.md)
5. **Keep things healthy** → [Project Maintenance](project-maintenance.md)

---

## Related Docs

- [Security Policy](../security.md) — Supported versions and vulnerability reporting
- [Architecture](../architecture.md) — System layers and design decisions
- [Auth Flow](../auth-flow.md) — Authentication lifecycle and security controls
