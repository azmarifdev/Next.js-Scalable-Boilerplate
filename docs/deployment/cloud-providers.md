# Cloud Providers

## Purpose

This file lists deployment targets and environment requirements.

## Supported Targets

- Vercel
- Netlify
- Railway
- Render
- Fly.io
- Self-managed Docker

## Required Environment Variables

Always set:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BACKEND_MODE`
- `NEXT_PUBLIC_AUTH_PROVIDER`

Internal auth mode:

- `DATABASE_URL`
- `AUTH_SESSION_SECRET` or `AUTH_SESSION_SECRETS`

Custom auth mode:

- `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL`
- `NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true`
- `ENABLE_CUSTOM_AUTH=true`

If admin step-up is enabled:

- `REQUIRE_ADMIN_STEP_UP_AUTH=true`
- `AUTH_MFA_VERIFY_URL` (recommended)

## Deployment Checklist

1. Configure environment variables in provider dashboard
2. Run migrations (`pnpm run db:migrate`)
3. Build and start (`pnpm run build`, `pnpm run start`)
4. Verify `/login`, `/register`, and protected route redirect behavior
5. Verify auth APIs (`login`, `me`, `refresh`, `logout`)
6. Verify MFA flow if step-up is enabled

## Docker Notes

Use included `Dockerfile` and `docker-compose.yml` for containerized deployment/testing.
