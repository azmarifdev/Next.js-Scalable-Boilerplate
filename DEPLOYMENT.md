# Deployment Guide

This template supports multiple deployment targets without config conflict.

## 1) Run Requirements

- Node.js `22.x`
- npm `10+`
- `.env.local` generated from `.env.example`

Quick local run:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Validation before deployment:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run build
```

## 2) Conflict-Free Deployment Strategy

This repository keeps platform-specific config isolated:

- Vercel: `vercel.json`, `.vercelignore`
- Docker: `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- AWS docs: `deploy/aws/README.md`
- Azure docs: `deploy/azure/README.md`
- DigitalOcean docs: `deploy/digitalocean/README.md`

These files do not conflict with each other because each platform reads only its own config.

## 3) Vercel

Included and preconfigured:

- `vercel.json` with `npm ci` + `npm run build`
- `.vercelignore` for smaller deploy context

Set env vars in Vercel Project Settings before first production deploy.

## 4) Docker

Build and run:

```bash
docker build -t nextjs-starter-template .
docker run --env-file .env.local -p 3000:3000 nextjs-starter-template
```

Or compose:

```bash
docker compose up --build
```

With local Postgres profile:

```bash
docker compose --profile db up --build
```

## 5) AWS, Azure, DigitalOcean

Use the docs:

- `deploy/aws/README.md`
- `deploy/azure/README.md`
- `deploy/digitalocean/README.md`

All three should use the same runtime env keys from `.env.example`.

## 6) Environment Variables (Production)

Typical required keys:

- `AUTH_SESSION_SECRET`
- `AUTH_SESSION_SECRETS` (recommended for key rotation)
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SITE_URL` (recommended for correct sitemap/metadata URL)
- `ALLOW_DEMO_AUTH=false`
- `ALLOW_INSECURE_DEV_AUTH=false`

## 7) Health Endpoint

Use this path for health checks:

- `/api/v1/health`

## 8) Package Manager Notes

Default CI manager is `npm` for stability.

Optional install paths:

```bash
npm run install:yarn
npm run install:pnpm
npm run install:bun
```

If switching manager on same machine:

```bash
rm -rf node_modules
```

## 9) Production Hardening Checklist

- Rotate `AUTH_SESSION_SECRET`/`AUTH_SESSION_SECRETS` and keep old keys only during transition.
- Keep demo/insecure auth flags disabled:
  - `ALLOW_DEMO_AUTH=false`
  - `ALLOW_INSECURE_DEV_AUTH=false`
- Enforce TLS everywhere (edge, CDN, load balancer, origin).
- Set strict CORS allowlist and tighten CSP for scripts/images/connect-src.
- Validate same-origin policy for auth POST endpoints when behind reverse proxies.
- Validate cookie settings by environment (domain, sameSite, secure, httpOnly).
- Enable centralized structured logging and request-id tracing.
- Wire external error monitoring/tracing provider into instrumentation hooks.
- Run backups before schema migrations and document rollback steps.
- Use repeatable migration + seed workflows for staging verification before production.
