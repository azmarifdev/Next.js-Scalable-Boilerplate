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
- `.env`: shared non-secret defaults only. Do not put real credentials here.
- Production env: set values in your deployment provider dashboard (Vercel/Render/Railway/etc).
- CI env: set values in GitHub Actions Secrets or GitHub Environment secrets.

Rule of thumb:

| Place                      | Use For                                                          | Commit?                   |
| -------------------------- | ---------------------------------------------------------------- | ------------------------- |
| `.env.example`             | Documentation/template for all supported variables               | Yes                       |
| `.env.local`               | Local developer values and local secrets                         | No                        |
| `.env`                     | Shared non-secret defaults only                                  | Only if it has no secrets |
| Vercel/hosting env         | Production runtime variables                                     | No                        |
| GitHub repository secrets  | CI-only values such as `E2E_DATABASE_URL`                        | No                        |
| GitHub environment secrets | Protected production operations such as `MIGRATION_DATABASE_URL` | No                        |

### 3.0.1 Local URLs and Ports

Local URLs are centrally derived by `src/lib/config/url.ts`:

```env
APP_PROTOCOL=http
APP_HOST=localhost
PORT=3000
```

**How it works:**

- `getLocalAppOrigin()` → `APP_PROTOCOL://APP_HOST:PORT` (e.g. `http://localhost:3000`)
- If `NEXT_PUBLIC_SITE_URL` is blank → `getSiteOrigin()` falls back to the local origin
- On Vercel → automatically picks up `VERCEL_PROJECT_PRODUCTION_URL` or `VERCEL_URL`
- Docker: `PORT=4000 pnpm run docker:run` overrides the port everywhere

Server-side metadata, sitemap, robots, cookie security, and E2E defaults **all use this centralized origin** — change one env var, everything moves together.

To run the app on another port, change one value:

```env
PORT=4000
```

Then run:

```bash
pnpm run dev
```

Use `NEXT_PUBLIC_SITE_URL` only when you need an explicit public origin:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

For internal backend mode, keep `NEXT_PUBLIC_API_BASE_URL` blank. Set it only when `NEXT_PUBLIC_BACKEND_MODE=external`.

Most projects only need `.env.example` and `.env.local`.

Use `.env` only when you intentionally want shared non-secret defaults for everyone on the team. If `.env` duplicates empty values like `DATABASE_URL=`, command-line tools may read that value before `.env.local`. Keep secrets and developer-specific values in `.env.local`.

Solo developer example:

```txt
.env.example  -> committed template
.env.local    -> your local real values
.env          -> not needed
```

Team example:

```env
# .env
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
NEXT_PUBLIC_FEATURE_ADMIN=true
```

```env
# .env.local
DATABASE_URL=postgresql://your-local-db
AUTH_SESSION_SECRET=your-local-secret
```

Do not store real credentials in `.env` unless that file is gitignored and your team has intentionally chosen that workflow.

### 3.1 Minimum required for internal mode

```env
NEXT_PUBLIC_APP_NAME=Your App
APP_PROTOCOL=http
APP_HOST=localhost
PORT=3000
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=false
ENABLE_CUSTOM_AUTH=false
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_db
AUTH_SESSION_SECRET=<generate-with-openssl-rand-hex-32>
NEXT_PUBLIC_FEATURE_ADMIN=true
REQUIRE_ADMIN_STEP_UP_AUTH=false
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

### 3.4 Production runtime values

Set these in your hosting provider, such as Vercel Project Settings -> Environment Variables:

```env
NEXT_PUBLIC_APP_NAME=Your App
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_API_BASE_URL=

NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=false
ENABLE_CUSTOM_AUTH=false

DATABASE_URL=postgresql://...
AUTH_SESSION_SECRET=<separate-production-secret>

NEXT_PUBLIC_FEATURE_ADMIN=true
REQUIRE_ADMIN_STEP_UP_AUTH=false
```

Recommended production services:

```env
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

RESEND_API_KEY=
EMAIL_FROM=
```

Production migration values belong in GitHub, not in Vercel build commands:

```env
MIGRATION_DATABASE_URL=
```

---

## 4. Start the App

```bash
pnpm run dev
```

Open:

- `APP_PROTOCOL://APP_HOST:PORT`

With the defaults:

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

### 🚀 Professional Pre-Push Pipeline

Run this single command before every push:

```bash
pnpm run check:all
```

If you want the pipeline to format files first and then validate everything:

```bash
pnpm run check:fix
```

Or run all stages individually:

```bash
pnpm run format:check &&
pnpm run lint &&
pnpm run typecheck &&
pnpm run test &&
pnpm run build &&
pnpm run e2e &&
pnpm run docs:check &&
pnpm run knip &&
pnpm audit
```

> **Note:** `gitleaks detect` (secret scanning) is also included in `check:all` but requires the `gitleaks` CLI to be installed separately.

**Pipeline breakdown (10 stages):**

| Step | Command        | Time  | What it guards against                                              |
| ---- | -------------- | ----- | ------------------------------------------------------------------- |
| 1    | `format:check` | ~1s   | Inconsistent code style, trailing whitespace, bad quotes            |
| 2    | `lint`         | ~3s   | Unused imports, type misuse, logical errors                         |
| 3    | `typecheck`    | ~3s   | Type mismatches, missing exports, broken generics                   |
| 4    | `test`         | ~1s   | Regressions — 63 tests across 14 files                              |
| 5    | `build`        | ~10s  | Bundling errors, broken routes, standalone failure                  |
| 6    | `e2e`          | ~40s  | Playwright end-to-end tests — login, docs, navigation, multi-locale |
| 7    | `docs:check`   | ~0.5s | Broken doc references, missing files                                |
| 8    | `knip`         | ~2s   | Dead file & unused dependency analysis                              |
| 9    | `audit`        | ~5s   | Known vulnerabilities in dependencies                               |
| 10   | `gitleaks`     | ~3s   | Secret leak detection (requires `gitleaks` CLI)                     |

**Fast-fail principle:** Steps 1–3 fail in seconds. You never wait minutes for a build only to discover a missing semicolon.

`check:all` is read-only by default. Use `check:fix` when you want Prettier to rewrite files before the rest of the validation pipeline runs.

### E2E Behavior

- Without `E2E_DATABASE_URL`, Playwright runs smoke tests and skips auth DB flows.
- With `E2E_DATABASE_URL`, Playwright migrates/seeds that database and runs auth flows.
- Use a disposable test database. Do not point E2E at production.
- The `e2e` command starts the production build via the Playwright webServer, so `pnpm run build` must run first.

### Individual Commands (for quick checks)

If you only need a subset:

```bash
pnpm run lint           # Quick lint scan
pnpm run typecheck      # TypeScript errors only
pnpm run test           # Run all unit + integration tests
pnpm run format:check   # Check formatting (read-only)
pnpm run build          # Full production build
pnpm run e2e            # Playwright end-to-end tests
pnpm run docs:check     # Documentation consistency
```

If you changed the database schema:

```bash
pnpm run db:generate
pnpm run db:migrate
```

Commit the schema code and generated files under `drizzle/` together.

For E2E:

```bash
pnpm run e2e
```

E2E behavior:

- Without `E2E_DATABASE_URL`, Playwright runs smoke tests and skips auth DB flows.
- With `E2E_DATABASE_URL`, Playwright migrates/seeds that database and runs auth flows.
- Use a disposable test database. Do not point E2E at production.

**Test suite overview (63+ tests across 6 E2E specs & 11 unit/integration files):**

| Layer             | Tool       | Location                 | Test count |
| ----------------- | ---------- | ------------------------ | ---------- |
| Unit tests        | Vitest     | `src/tests/unit/`        | 40+        |
| Integration tests | Vitest     | `src/tests/integration/` | 9          |
| E2E (Playwright)  | Playwright | `src/tests/e2e/`         | 6 specs    |

**Shared test helper:** `src/tests/shared.ts` provides `TEST_LOCAL_ORIGIN` and `testUrl()` so integration tests stay consistent with the centralized URL config.

GitHub path:

```txt
Repository -> Settings -> Secrets and variables -> Actions -> New repository secret
```

Secret values are private and are not committed to the repository.

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

- auth E2E requires `E2E_DATABASE_URL`
- PR workflows intentionally run without database secrets

Fix:

- add `E2E_DATABASE_URL` or `TEST_DATABASE_URL` in repo Secrets for push auth E2E
- keep PR E2E secret-free unless you intentionally use a safe test database

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
