# Deployment Guide

## Purpose

Step-by-step deployment procedure with validation checkpoints.

## Pre-Deploy

- Confirm selected auth mode (`better-auth` or `custom-auth`)
- Ensure all required env vars are set
- Ensure DB connectivity from runtime environment
- If step-up MFA enabled, configure verifier endpoint

## Build Validation (Local/CI)

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
```

## Database

```bash
pnpm run db:generate
pnpm run db:migrate
```

## Deploy

- Provider build command: `pnpm run build`
- Provider start command: `pnpm run start`

## Post-Deploy Checks

- `/login` and `/register` accessible
- Protected pages redirect unauthenticated users to `/login`
- Auth routes (`login`, `me`, `refresh`, `logout`) behave correctly
- If enabled, admin step-up on `/users` works
- Check logs for auth or runtime validation errors
