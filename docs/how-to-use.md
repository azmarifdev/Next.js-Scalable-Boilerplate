# How To Use

## 1) Install

```bash
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
pnpm run dev
```

## 4) Run Quality Checks

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run e2e
pnpm run docs:check
```

## 5) Choose Runtime Modes

### External backend (default)

- `NEXT_PUBLIC_BACKEND_MODE=external`
- `NEXT_PUBLIC_API_BASE_URL=https://api.example.com`

### Internal auth APIs (optional)

- `NEXT_PUBLIC_BACKEND_MODE=internal`
- uses `src/app/api/v1/auth/*`

### NextAuth (optional)

- `NEXT_PUBLIC_AUTH_PROVIDER=nextauth`

## 6) Deploy

- Docker-first: `Dockerfile`, `docker-compose.yml`
- Vercel optional
- Cloud notes: `docs/deployment/cloud-providers.md`
