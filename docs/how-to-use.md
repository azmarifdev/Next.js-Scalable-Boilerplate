# How To Use

## 1) Install

```bash
nvm use
pnpm install --frozen-lockfile
```

## 2) Configure Environment

```bash
cp .env.example .env.local
```

Set at minimum:

- `NEXT_PUBLIC_API_MODE`
- `NEXT_PUBLIC_BACKEND_MODE`
- `NEXT_PUBLIC_DB_PROVIDER`
- `NEXT_PUBLIC_AUTH_PROVIDER`
- `NEXT_PUBLIC_API_BASE_URL` (required in external mode)

## 3) Start Dev Server

```bash
pnpm dev
```

## 4) Run Quality Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm e2e
pnpm docs:check
```

## 5) Choose Runtime Modes

### External backend (default)

- `NEXT_PUBLIC_BACKEND_MODE=external`
- `NEXT_PUBLIC_API_BASE_URL=https://api.example.com`

### Internal auth APIs (optional)

- `NEXT_PUBLIC_BACKEND_MODE=internal`
- Uses `src/app/api/v1/auth/*`

### NextAuth (optional)

- `NEXT_PUBLIC_AUTH_PROVIDER=nextauth`

### Important mode rule

- `NEXT_PUBLIC_BACKEND_MODE=internal` + `NEXT_PUBLIC_AUTH_PROVIDER=custom` requires `NEXT_PUBLIC_API_MODE=rest`.

## 6) Package Manager Policy

- This template uses `pnpm` as the canonical package manager.
- Use `pnpm` commands for local development and CI.
- If dependencies are changed, update `pnpm-lock.yaml` in the same PR.

## 7) Deploy

- Docker-first: `Dockerfile`, `docker-compose.yml`
- Vercel optional
- Cloud notes: `docs/deployment/cloud-providers.md`
