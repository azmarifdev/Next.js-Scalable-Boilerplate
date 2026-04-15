# Project Guides

This folder contains operational guides for maintainers and contributors.

## Documentation Tree

```txt
.
├─ README.md
├─ CHANGELOG.md
├─ CONTRIBUTING.md
└─ docs/
   ├─ architecture.md
   ├─ folder-structure.md
   ├─ auth-flow.md
   ├─ how-to-use.md
   ├─ deployment/
   │  └─ cloud-providers.md
   ├─ migrations/
   │  └─ package-manager.md
   └─ guides/
      ├─ README.md
      ├─ deployment.md
      ├─ github-setup-checklist.md
      ├─ release-automation.md
      └─ project-maintenance.md
```

## Duplicate Content Review (Completed)

We reviewed all repository markdown files and reduced repeated content by assigning a single owner per topic.

Topic ownership:

- Deployment runtime + preflight: `docs/guides/deployment.md`
- GitHub repository/branch protection setup: `docs/guides/github-setup-checklist.md`
- Release Please and release troubleshooting: `docs/guides/release-automation.md`
- Ongoing maintenance cadence (weekly/monthly/LTS upgrades): `docs/guides/project-maintenance.md`
- Package manager migration playbook: `docs/migrations/package-manager.md`

## How To Use These Guides

1. New project setup: start with `docs/how-to-use.md`
2. Team/repo setup: follow `github-setup-checklist.md`
3. Deployment readiness: follow `deployment.md`
4. Ongoing ownership: follow `project-maintenance.md`
5. Release issues: use `release-automation.md`

## Scope Rules For Guides

To avoid future duplication:

- Keep process checklists in `docs/guides/*`.
- Keep system design and architecture in `docs/*.md` root.
- Keep migration procedures in `docs/migrations/*`.
- If a guide needs another topic, link to the owner doc instead of re-explaining everything.
