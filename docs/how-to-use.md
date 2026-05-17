# How to Use

## Purpose

This guide is the complete A-to-Z onboarding flow for this boilerplate:

- adopting the template for a real product
- first local setup
- environment configuration
- database and auth setup
- daily developer workflow
- quality checks before pushing

If you are using this template for the first time, follow this guide in order.

---

## Quick Flow Diagram

```mermaid
graph TD
    A[Clone Repo] --> B[Install Dependencies]
    B --> C[Run Setup Script]
    C --> D[Configure .env.local]
    D --> E[Start Dev Server]
    E --> F[Run Lint / Typecheck / Tests]
    F --> G[Open PR]
```

---

## 1. Prerequisites

| Tool    | Required Version | Check            |
| ------- | ---------------- | ---------------- |
| Node.js | `>=20 <23`       | `node --version` |
| pnpm    | `>=8`            | `pnpm --version` |

---

## 2. Clone and Install

```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
pnpm install
pnpm run setup
```

What `pnpm run setup` does:

1. Creates `.env.local` from `.env.example` if missing
2. Installs dependencies

Before building product features, read [Adopting This Boilerplate](guides/adopting-boilerplate.md). It lists the project names, metadata, icons, docs, release settings, and deployment values you should replace for a real app.

---

## 3. Configure Environment Variables

The runtime reads local configuration from `.env.local`.

### 3.0 Which env file is for what?

- `.env.example`: the template. Safe defaults + comments. Commit this file.
- `.env.local`: local development only. This is **gitignored** and should never be committed.
- Production env: set values in your deployment provider dashboard (Vercel/Render/Railway/etc).
- CI env: set values in GitHub Actions Secrets (e.g., `DATABASE_URL`).

### 3.1 Minimum required for internal mode

```env
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_db
AUTH_SESSION_SECRET=<generate-with-openssl-rand-hex-32>
```

Generate session secret:

```bash
openssl rand -hex 32
```

### 3.2 Custom auth mode

```env
NEXT_PUBLIC_AUTH_PROVIDER=custom-auth
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true
ENABLE_CUSTOM_AUTH=true
NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://your-auth-service.example.com
```

### 3.3 Optional production services

These can stay blank locally:

```env
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=

RESEND_API_KEY=
EMAIL_FROM=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Configure them before public production launch. See [Production Services](guides/production-services.md).

---

## 4. Start the App

```bash
pnpm run dev
```

Open:

- `http://localhost:3000`

---

## 5. Database Workflow (PostgreSQL + Drizzle)

### 5.0 Which Databases Are Supported?

This boilerplate uses **PostgreSQL-compatible** databases through `DATABASE_URL`.

You can use:

- PostgreSQL (self-hosted or managed)
- Neon (serverless PostgreSQL)
- Supabase Postgres

Important:

- "Postgres" and "PostgreSQL" refer to the same database family.
- Supabase works here as a PostgreSQL provider (database layer). Supabase Auth/Storage are not automatically wired by default.

### 5.1 Connection String Examples

PostgreSQL (local):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_db
```

Neon:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
```

Supabase:

```env
DATABASE_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require
```

Notes:

- Prefer pooled/production connection strings when your provider offers them.
- For Neon on Vercel, pooled hostnames commonly include `-pooler`.
- For GitHub Actions migrations, use `MIGRATION_DATABASE_URL` if you need a separate direct migration URL.
- Keep SSL-related query params as recommended by your provider.
- Never commit real credentials.

### Generate migration files

```bash
pnpm run db:generate
```

### Apply migrations

```bash
pnpm run db:migrate
```

### Seed database

```bash
pnpm run db:seed
```

### Open DB studio

```bash
pnpm run db:studio
```

### Reset database (destructive)

```bash
pnpm run db:reset
```

Recommended order in a new environment:

1. set `DATABASE_URL`
2. run `pnpm run db:migrate`
3. optionally run `pnpm run db:seed`
4. start app and verify auth flow

Production migrations should be run from GitHub Actions:

```txt
Actions -> Production Database Migration -> Run workflow
```

Input:

```txt
migrate-production
```

---

## 6. Daily Development Workflow

Recommended flow before each push:

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run format:check
pnpm run build
```

For E2E:

```bash
pnpm run e2e
```

---

## 7. Common Routes

| Route        | Purpose                   |
| ------------ | ------------------------- |
| `/`          | Landing page              |
| `/login`     | Sign in                   |
| `/register`  | Registration              |
| `/docs`      | Docs hub                  |
| `/features`  | Feature overview          |
| `/dev/flags` | Development feature flags |

---

## 8. Troubleshooting

### Error: `DATABASE_URL is required`

Cause:

- `NEXT_PUBLIC_BACKEND_MODE=internal`
- no DB URL provided

Fix:

- add `DATABASE_URL` to `.env.local`

### PostgreSQL URL works locally but fails in deployment

Check:

- URL points to a publicly reachable host (or same private network as app)
- provider firewall/network access allows your app origin
- SSL requirements are satisfied (`sslmode=require` where needed)
- connection string is copied exactly (no hidden spaces/newlines)

For serverless platforms:

- prefer provider-recommended pooled connection string
- keep region close to your app deployment region

### Error: `AUTH_SESSION_SECRET ... is required`

Fix:

- set `AUTH_SESSION_SECRET`

### E2E passes locally but fails in GitHub

Cause:

- local Playwright injects fallback envs
- GitHub Actions `push` workflow expects repository secrets

Fix:

- add `DATABASE_URL` and `AUTH_SESSION_SECRET` in repo Secrets (Actions)

### Dependabot auto-merge job fails

If `Dependabot Auto Merge` fails in the guarded merge step:

- confirm `Settings > Actions > General > Workflow permissions` is `Read and write`
- confirm `Allow GitHub Actions to create and approve pull requests` is enabled
- check logs from `.github/scripts/guarded-pr-merge.sh` for policy skip/failure reason
- verify workflow file paths are intact (`.github/scripts/guarded-pr-merge.sh`)

### Docs language seems inconsistent with locale toggle

Current policy for this boilerplate:

- docs article markdown source is maintained in English
- locale toggle still changes UI labels/navigation text
- if you want localized markdown later, reintroduce per-locale source mapping in `src/lib/docs/content.ts`

### Playwright in CI is slower than expected

Likely causes:

- CI workers run serially (`workers: 1`)
- retry count is higher than local
- browser install/setup happens every CI run

What to do:

- keep selectors resilient (auth-state and locale aware)
- reduce flaky tests first
- split smoke/full e2e suites as project grows

---

## 9. Production Safety Checklist

Before production deploy:

1. real `DATABASE_URL` configured
2. strong `AUTH_SESSION_SECRET` configured
3. `NEXT_PUBLIC_SITE_URL` points to the deployed HTTPS URL
4. `NEXT_PUBLIC_API_BASE_URL` points to the deployed app or external API
5. HTTPS URLs for external auth
6. production migration workflow can run from GitHub Actions
7. Sentry env vars are set if monitoring is enabled
8. Upstash env vars are set for production rate limiting
9. Resend env vars are set before enabling email flows

---

## Related Guides

- [Adopting This Boilerplate](guides/adopting-boilerplate.md)
- [Database Setup](guides/database-setup.md)
- [GitHub Setup Checklist](guides/github-setup-checklist.md)
- [Production Services](guides/production-services.md)
- [Auth Setup and Migration](guides/auth-setup-and-migration.md)
- [Workflows](workflows.md)
- [Release Automation](guides/release-automation.md)
- [Contributing Guide](guides/contributing.md)
