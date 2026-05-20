# Claude Notes

These notes tune Claude for this boilerplate. Follow them when writing code, docs, or test fixes.

## Project Overview

- Framework: Next.js App Router + TypeScript
- Auth default: `better-auth` (internal API)
- Optional auth: `custom-auth` (external provider)
- Database: PostgreSQL + Drizzle ORM

## Key Directories

- `src/app/` routes, layouts, API handlers
- `src/lib/` core infrastructure (auth, config, security)
- `src/modules/` domain features (auth, optional providers)
- `src/db/` schema + runtime DB client
- `src/tests/` unit, integration, e2e
- `docs/` documentation hub

## Environment & Config Rules

- Local development uses `.env.local` (gitignored). Template is `.env.example`.
- Production values are set in the hosting provider, not in `.env.local`.
- CI secrets live in GitHub Actions Secrets or environment secrets.
- If you change env variables or config behavior, update:
  - `.env.example`
  - `docs/how-to-use.md`
  - `docs/guides/deployment.md`
  - `docs/guides/production-services.md` (if relevant)

## Runtime Modes

- `NEXT_PUBLIC_BACKEND_MODE=internal` uses Next.js API routes.
- `NEXT_PUBLIC_BACKEND_MODE=external` disables internal APIs and requires `NEXT_PUBLIC_API_BASE_URL`.
- `NEXT_PUBLIC_AUTH_PROVIDER=better-auth` uses internal auth routes.
- `NEXT_PUBLIC_AUTH_PROVIDER=custom-auth` uses external auth adapter.

## Testing & E2E Behavior

- Unit/Integration: `pnpm run test` (Vitest)
- E2E: `pnpm run e2e` (Playwright)
- Playwright behavior:
  - Without `E2E_DATABASE_URL` or `TEST_DATABASE_URL`, auth DB setup is skipped.
  - With `E2E_DATABASE_URL`, migrations + seed run for auth flows.
  - With `custom-auth`, set `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL` and E2E creds.

## Common Commands

- `pnpm run dev`
- `pnpm run build`
- `pnpm run start`
- `pnpm run db:generate`, `db:migrate`, `db:seed`, `db:reset`
- `pnpm run check:all` (full quality pipeline - read-only)
- `pnpm run check:fix` (auto-format using Prettier first, then execute quality pipeline)

## Documentation Standards

- Keep docs in English only (UI copy can be localized).
- When adding/removing docs, update:
  - `src/lib/docs/content.ts`
  - `src/app/sitemap.ts`
- Prefer cross-links between related docs to show reading order.

## Change Safety

- Avoid destructive DB commands in production.
- Never include real secrets in docs or examples.
- Keep behavior consistent between docs and code.

## Claude Code Custom Skills

In addition to these notes, the project contains dedicated **Claude Code Custom Skills** located at the repository root in `.claude/skills/`. When running the `claude` CLI agent, it will automatically detect and load these specialized skills progressively based on your tasks:

- **`boilerplate-development`**: Guides domain modularity, next-intl translations, and routing.
- **`database-management`**: Governs schema edits in `src/db/schema/` and migrations.
- **`boilerplate-testing`**: Coordinates Vitest unit tests and Playwright setups.
- **`release-workflow`**: Details Husky, commitlint, and release-please operations.
- **`code-quality`**: Enforces ESLint, Knip, Gitleaks, and pre-PR validations.
- **`ui-brand-guidelines`**: Teaches Claude the exact theme colors and classes from globals.css.
- **`changelog-summarizer`**: Translates technical commits into consumer-friendly updates.
- **`webapp-automation`**: Leverages Playwright and `with-server.mjs` for server automation.
