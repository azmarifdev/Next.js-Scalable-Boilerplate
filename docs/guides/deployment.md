# Deployment Guide

Use this guide when preparing and deploying this template to production.

## Guide Position (Tree)

```txt
docs/
└─ guides/
   ├─ deployment.md                 <- you are here
   ├─ github-setup-checklist.md
   ├─ release-automation.md
   └─ project-maintenance.md
```

## Scope

This guide covers:

- Runtime baseline used by CI and production
- Pre-deploy verification checklist
- Docker and compose deployment flow
- Production readiness checklist

This guide does not cover:

- Cloud-provider-specific platform details (see `docs/deployment/cloud-providers.md`)
- Release versioning workflow (see `docs/guides/release-automation.md`)

## Runtime Baseline

- Node.js: `22.x` (from `.nvmrc`)
- npm: `10.x` (default CI manager)
- Engine compatibility: `package.json -> engines.node` (`>=20 <23`)

Recommendation:

- Keep runtime Node aligned with CI-tested Node for predictable behavior.

## Pre-Deploy Validation (Required)

Run from a clean branch before deployment:

```bash
nvm use
npm ci
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run build
```

If any step fails, do not deploy.

Equivalent install step also works with:

- `pnpm install --frozen-lockfile`
- `yarn install --frozen-lockfile --non-interactive`
- `bun install --frozen-lockfile`

## Deployment Paths

### Docker (Canonical)

```bash
docker build -t next-js-boilerplate-postgresql-drizzle .
docker run --env-file .env.local -p 3000:3000 next-js-boilerplate-postgresql-drizzle
```

### Docker Compose

```bash
docker compose up --build
```

Optional local DB profile:

```bash
docker compose --profile db up --build
```

### Vercel (Optional)

- `vercel.json` is configured for npm-based install/build commands.

## Environment Checklist (Production)

- Set strong `AUTH_SESSION_SECRET` or `AUTH_SESSION_SECRETS`
- Keep `ALLOW_DEMO_AUTH=false`
- Keep `ALLOW_INSECURE_DEV_AUTH=false`
- Set `NEXT_PUBLIC_API_BASE_URL` for external backend mode
- Ensure HTTPS/TLS is enabled
- Ensure secure cookies are active in production

## Troubleshooting Quick Paths

- Install/lockfile CI issues: `docs/migrations/package-manager.md`
- Branch protection/setup issues: `docs/guides/github-setup-checklist.md`
- Release pipeline issues: `docs/guides/release-automation.md`
