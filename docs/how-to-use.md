# How To Use

## 1) Install

```bash
nvm use
npm ci
```

Any one of these alternatives also works:

```bash
pnpm install --frozen-lockfile
yarn install --frozen-lockfile --non-interactive
bun install --frozen-lockfile
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
npm run dev
```

## 4) Run Quality Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run e2e
npm run docs:check
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

## 6) Package Manager Alternatives

- You can use npm, pnpm, yarn, or bun locally.
- CI still validates npm quality flow and lockfile consistency across managers.
- If dependencies are changed, update lockfiles consistently in the same PR.
- If you want a different canonical policy for your fork/team, follow `docs/migrations/package-manager.md`.

## 7) Deploy

- Docker-first: `Dockerfile`, `docker-compose.yml`
- Vercel optional
- Cloud notes: `docs/deployment/cloud-providers.md`
