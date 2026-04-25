# How To Use

## Required Environment

- `NEXT_PUBLIC_BACKEND_MODE`
- `NEXT_PUBLIC_AUTH_PROVIDER`
- `DATABASE_URL`
- `AUTH_SESSION_SECRET` or `AUTH_SESSION_SECRETS`

## Recommended Local Setup

```env
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nextjs_boilerplate_postgresql_drizzle
AUTH_SESSION_SECRET=replace-with-secure-secret
```

## Auth Modes

- `better-auth` (default)
- `custom` (optional)

## Database

- PostgreSQL only
- Drizzle only

## API

- REST only
- Versioned routes under `/api/v1`
