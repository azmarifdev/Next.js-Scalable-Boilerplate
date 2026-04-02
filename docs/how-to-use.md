# How To Use

## 1. Install

```bash
npm ci
```

## 2. Configure environment

```bash
cp .env.example .env.local
```

Update:

- platform mode (`NEXT_PUBLIC_API_MODE`, `NEXT_PUBLIC_BACKEND_MODE`)
- database provider (`NEXT_PUBLIC_DB_PROVIDER`)
- auth provider (`NEXT_PUBLIC_AUTH_PROVIDER`)
- feature flags (`NEXT_PUBLIC_FEATURE_*`)

## 3. Start development

```bash
npm run dev
```

## 4. Run quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run e2e
```

## 5. Configure providers

### MongoDB (default)

- set `MONGODB_URI`
- set `MONGODB_DB_NAME`

### PostgreSQL (optional)

- set `DATABASE_URL`
- set `NEXT_PUBLIC_DB_PROVIDER=postgres`

### External backend (default)

- keep `NEXT_PUBLIC_BACKEND_MODE=external`
- set `NEXT_PUBLIC_API_BASE_URL`

### Internal backend (optional)

- set `NEXT_PUBLIC_BACKEND_MODE=internal`
- internal API routes under `src/app/api/v1/*` become active

## 6. Deploy

- Docker: default deployment path (`Dockerfile`, `docker-compose.yml`)
- Vercel: optional (`vercel.json`)
- AWS/Azure: use docs in `deploy/*`
