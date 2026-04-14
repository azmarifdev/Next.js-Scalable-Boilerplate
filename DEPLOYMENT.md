# Deployment Guide

## Runtime Baseline

- Node.js `22.x`
- pnpm `10.x`
- `.env.local` copied from `.env.example`

## Validate Before Deploy

```bash
pnpm run lint
pnpm run typecheck
pnpm run format:check
pnpm run test
pnpm run build
```

## Docker (Canonical)

```bash
docker build -t nextjs-starter-template .
docker run --env-file .env.local -p 3000:3000 nextjs-starter-template
```

Or with compose:

```bash
docker compose up --build
```

Optional local DB profile:

```bash
docker compose --profile db up --build
```

## Vercel (Optional)

`vercel.json` is configured with pnpm commands.

## Cloud Providers

Provider-specific guidance is documentation-only:

- `docs/deployment/cloud-providers.md`

## Production Checklist

- Set strong `AUTH_SESSION_SECRET` / `AUTH_SESSION_SECRETS`
- Keep `ALLOW_DEMO_AUTH=false`
- Keep `ALLOW_INSECURE_DEV_AUTH=false`
- Ensure TLS and secure cookie settings in production
- Set `NEXT_PUBLIC_API_BASE_URL` for external backend mode
