# Auth Flow

## Default Mode

- `NEXT_PUBLIC_AUTH_PROVIDER=better-auth`
- Auth endpoints live at `src/app/api/v1/auth/*`
- Client auth provider is `src/lib/auth/better-auth.provider.ts`

## Optional Custom Mode

- `NEXT_PUBLIC_AUTH_PROVIDER=custom`
- Internal Better Auth API routes are disabled
- Custom mode is reserved for external/custom integration

## Session

- Cookie name: `auth_token`
- Session token signing uses `AUTH_SESSION_SECRET` or `AUTH_SESSION_SECRETS`
- Demo auth fallback is disabled unless `ALLOW_DEMO_AUTH=true`
