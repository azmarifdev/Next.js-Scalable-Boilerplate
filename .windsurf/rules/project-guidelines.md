# Project Guidelines

- Preserve secure-by-default auth behavior
- Avoid breaking internal/external mode contracts
- Keep feature flags and docs synchronized

## Environment and Config

- `.env.local` is local-only; `.env.example` is the template.
- Production values belong in provider dashboards; CI values in GitHub Secrets.
- When env/config behavior changes, update:
  - `.env.example`
  - `docs/how-to-use.md`
  - `docs/guides/deployment.md`
  - `docs/guides/production-services.md` (if relevant)

## Runtime Modes

- `NEXT_PUBLIC_BACKEND_MODE=internal` uses app API routes.
- `NEXT_PUBLIC_BACKEND_MODE=external` requires `NEXT_PUBLIC_API_BASE_URL`.
- `NEXT_PUBLIC_AUTH_PROVIDER=better-auth` uses internal auth.
- `NEXT_PUBLIC_AUTH_PROVIDER=custom-auth` uses external adapter.

## Testing Expectations & Quality Gates

Always run the unified quality pipeline to validate edits:

```bash
# Complete validation across all 10 checks (Format, Lint, Types, Unit, Build, Playwright E2E, Docs, Knip, Audit)
pnpm run check:all

# Auto-format files first using Prettier, then run full checks
pnpm run check:fix
```

### Localized Quick Commands:

- Unit & Integration tests: `pnpm run test` (Vitest)
- End-to-End browser tests: `pnpm run e2e` (Playwright)
- Playwright behavior: Database migrations and seeding run only when `E2E_DATABASE_URL` or `TEST_DATABASE_URL` is set; otherwise skips DB steps.
- Code linting and style: `pnpm run lint` and `pnpm run format:check`
