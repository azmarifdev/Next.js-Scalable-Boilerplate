# Adopting This Boilerplate

## Purpose

Use this checklist when you create a real project from this boilerplate. It explains what you should change, what you should keep, and what must be configured before local development, staging, and production.

---

## 1. Rename the Project

Update the boilerplate identity first so generated metadata, package names, Docker images, and release notes match your app.

| Area                 | File / Setting                               | What To Change                                     |
| -------------------- | -------------------------------------------- | -------------------------------------------------- |
| Package name         | `package.json`                               | Change `name` to your app package name             |
| App display name     | `.env.example`, `.env.local`, deployment env | Set `NEXT_PUBLIC_APP_NAME`                         |
| Site config fallback | `src/lib/config/constants.ts`                | Replace the fallback app name                      |
| Metadata defaults    | `config/root-metadata.ts`                    | Update author, creator, keywords, and descriptions |
| README title         | `README.md`                                  | Replace boilerplate copy with your project copy    |
| Docker image         | `package.json`, `docker-compose.yml`         | Rename image/container values if you use Docker    |
| Release package name | `.release-please-config.json`                | Replace `package-name` with your project name      |

After renaming, search for the old name:

```bash
rg -n "Next.js-Boilerplate-PostgresQL-Drizzle|next-js-boilerplate-postgresql-drizzle|Next.js Boilerplate" .
```

Keep only intentional references, such as historical changelog entries.

---

## 2. Configure Environment Variables

Start from `.env.example` and create `.env.local`:

```bash
cp .env.example .env.local
```

Use the env files this way:

| File / Place         | Purpose                                            | User Should Change?                              |
| -------------------- | -------------------------------------------------- | ------------------------------------------------ |
| `.env.example`       | Template and documentation for supported variables | Yes, when the boilerplate adds/removes variables |
| `.env.local`         | Local values for one developer machine             | Yes, for local development                       |
| `.env`               | Shared non-secret defaults only                    | Rarely                                           |
| Hosting provider env | Production runtime values                          | Yes, before deploy                               |
| GitHub secrets       | CI, E2E, and migration values                      | Yes, before CI/migration workflows               |

Do not put real production credentials in `.env.example` or `.env`.

You can skip `.env` entirely if it creates confusion. `.env.local` is enough for local development.

Use `.env` only for team-wide non-secret defaults:

```env
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
NEXT_PUBLIC_FEATURE_ADMIN=true
```

Keep personal values in `.env.local`:

```env
DATABASE_URL=postgresql://your-local-db
AUTH_SESSION_SECRET=your-local-secret
```

Avoid committing `.env` if it contains real credentials or machine-specific values.

For a normal self-contained app, use internal backend + built-in auth:

```env
NEXT_PUBLIC_APP_NAME=Your App Name
APP_PROTOCOL=http
APP_HOST=localhost
PORT=3000
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_API_BASE_URL=

NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/your_app_db
AUTH_SESSION_SECRET=<generate-with-openssl-rand-hex-32>
```

Generate a strong secret:

```bash
openssl rand -hex 32
```

For production, set the same variables in your hosting provider dashboard. Use your deployed HTTPS domain:

```env
NEXT_PUBLIC_SITE_URL=https://your-app.com
NEXT_PUBLIC_API_BASE_URL=
```

Do not commit real production secrets.

First-time values to change:

| Variable                   | Local Value                 | Production Value                            |
| -------------------------- | --------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_APP_NAME`     | Your app name               | Your app name                               |
| `PORT`                     | Local app port              | Usually provider-managed                    |
| `NEXT_PUBLIC_SITE_URL`     | Blank or explicit local URL | `https://your-domain.com`                   |
| `NEXT_PUBLIC_API_BASE_URL` | Blank for internal mode     | Blank for internal mode or external API URL |
| `DATABASE_URL`             | Local or dev database URL   | Production database URL                     |
| `AUTH_SESSION_SECRET`      | Local generated secret      | Separate production generated secret        |

Production services to configure when launching:

| Service       | Env Vars                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------- |
| Sentry        | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` |
| Resend        | `RESEND_API_KEY`, `EMAIL_FROM`                                                              |
| Upstash Redis | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`                                        |

---

## 3. Choose Your Auth Path

### Option A: Built-In Auth

Use this when your app should own login, registration, and sessions.

Required:

- `NEXT_PUBLIC_AUTH_PROVIDER=better-auth`
- `NEXT_PUBLIC_BACKEND_MODE=internal`
- `DATABASE_URL`
- `AUTH_SESSION_SECRET`

Then verify:

1. register a real account
2. sign out
3. sign in again
4. open `/docs` or your protected destination
5. check cookies are secure in production

### Option B: Custom Auth Provider

Use this when you already have an external auth service or IdP.

Required:

```env
NEXT_PUBLIC_AUTH_PROVIDER=custom-auth
NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://auth.your-company.com
```

Then update the adapter in `src/modules/optional/auth/custom-auth.adapter.ts` to match your provider's response format.

---

## 4. Set Up PostgreSQL and Drizzle

Create a PostgreSQL database locally or with a managed provider such as Neon or Supabase Postgres.

Recommended first-time flow:

```bash
pnpm run db:migrate
pnpm run dev
```

If you change the schema:

1. edit files under `src/db/`
2. generate a migration:

```bash
pnpm run db:generate
```

3. review the generated SQL under `drizzle/`
4. apply it locally:

```bash
pnpm run db:migrate
```

5. commit schema and migration files together

Never run `db:generate` directly in production.

---

## 5. Replace Branding and Visual Assets

Update the public-facing assets before launch.

| Asset            | Location                                                 |
| ---------------- | -------------------------------------------------------- |
| Favicon          | `src/app/icon.svg` and `public/icon.svg`                 |
| Apple icon       | `src/app/apple-icon.svg` and `public/apple-icon.svg`     |
| Web manifest     | `src/app/manifest.ts`                                    |
| Open Graph image | `src/app/opengraph-image.tsx`                            |
| Twitter image    | `src/app/twitter-image.tsx`                              |
| Landing copy     | `src/i18n/messages/en.json`, `src/i18n/messages/bn.json` |
| Site metadata    | `config/root-metadata.ts`                                |

After editing, verify:

```bash
pnpm run build
```

Then open:

- `/icon.svg`
- `/apple-icon.svg`
- `/manifest.webmanifest`
- `/opengraph-image`
- `/twitter-image`

---

## 6. Decide What to Keep or Remove

This boilerplate includes useful starter surfaces. Keep only what your product needs.

| Area             | Keep If                                        | Remove / Change If                                                     |
| ---------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| Landing page     | You want a public marketing-style first screen | Your app should open directly to a dashboard                           |
| Docs hub         | Your product needs built-in docs               | You prefer external docs or no docs                                    |
| `/features` page | You want a feature overview                    | Replace with product-specific pages                                    |
| `/dev/flags`     | You need development-only feature visibility   | Remove before a locked-down production app                             |
| Admin flag       | You need admin-only routes                     | Set `NEXT_PUBLIC_FEATURE_ADMIN=false` or remove admin feature registry |
| Bangla locale    | You need Bangla support                        | Remove `bn` from i18n routing and messages                             |
| Storybook        | You build components in isolation              | Remove scripts/dependency if unused                                    |
| Docker           | You deploy containers                          | Remove Docker files if your team never uses them                       |

If you remove a route, also update:

- `src/app/sitemap.ts`
- `src/lib/docs/content.ts` if it was a docs article
- README and docs links
- Playwright tests that visit that route

---

## 7. Customize App Routes and Domain Logic

Use the existing structure instead of putting everything in one folder.

Recommended ownership:

| Need                              | Put It In                            |
| --------------------------------- | ------------------------------------ |
| Route pages/layouts               | `src/app/`                           |
| Domain-specific UI/hooks/services | `src/modules/<domain>/`              |
| Shared UI                         | `src/components/`                    |
| Database schema/repositories      | `src/db/` and domain repositories    |
| Auth/session/security helpers     | `src/lib/auth/`, `src/lib/security/` |
| API client code                   | `src/services/`                      |
| Translations                      | `src/i18n/messages/`                 |

When adding a new feature:

1. define the route
2. define data model and migration if needed
3. add API route or server action
4. add UI module
5. add tests for risky behavior
6. update docs if behavior is user-facing

---

## 8. Update Documentation

At minimum, update:

- `README.md`
- `docs/how-to-use.md`
- `docs/guides/deployment.md`
- `docs/auth-flow.md` if auth behavior changes
- `docs/architecture.md` if module boundaries change
- `docs/folder-structure.md` if folders change

If you add or remove docs articles, update:

- `src/lib/docs/content.ts`
- `src/app/sitemap.ts`

Run:

```bash
pnpm run docs:check
```

---

## 9. Configure GitHub and Releases

Before working with a team:

1. enable branch protection on `main`
2. require CI checks
3. configure repository secrets:
   - `DATABASE_URL`
   - `MIGRATION_DATABASE_URL` if migrations use a separate direct DB URL
   - `AUTH_SESSION_SECRET`
   - deployment provider secrets if needed
4. create the `production` GitHub environment with required reviewers
5. verify `.github/workflows/migrate-production.yml`
6. decide whether to use Release Please
7. update `.release-please-config.json` package name
8. review `.github/workflows/`

If you do not want automated releases, remove or disable `.github/workflows/release-please.yml` and update README/docs so contributors do not expect release PRs.

---

## 10. Production Readiness Checklist

Before public launch:

- app name, metadata, icons, OG/Twitter images are project-specific
- `NEXT_PUBLIC_SITE_URL` is the real HTTPS domain
- `NEXT_PUBLIC_API_BASE_URL` is correct
- `DATABASE_URL` points to production database
- `AUTH_SESSION_SECRET` is strong and private
- migrations have been applied
- production migration workflow has been tested from GitHub Actions
- Sentry receives a test error or smoke-test issue
- Upstash Redis is configured for production auth rate limiting
- Resend sender domain is verified before email-dependent flows are enabled
- login/register/logout/me flows work on deployed URL
- `/docs` article links work
- `/manifest.webmanifest`, `/icon.svg`, and `/apple-icon.svg` return 200
- `pnpm run lint` passes
- `pnpm run typecheck` passes
- `pnpm run test` passes
- `pnpm run build` passes
- provider runtime logs are clean after a smoke test

---

## 11. Useful Search Commands

Find remaining boilerplate naming:

```bash
rg -n "boilerplate|starter|template|Next.js Boilerplate|azmarif" .
```

Find environment usage:

```bash
rg -n "process\\.env|NEXT_PUBLIC_|DATABASE_URL|AUTH_SESSION_SECRET" src docs .env.example
```

Find routes to update after removing pages:

```bash
rg -n "\"/docs|\"/features|\"/login|\"/register|sitemap" src
```

---

## Related Docs

- [How to Use](../how-to-use.md)
- [Architecture](../architecture.md)
- [Folder Structure](../folder-structure.md)
- [Auth Setup and Migration](auth-setup-and-migration.md)
- [Database Setup](database-setup.md)
- [Deployment Guide](deployment.md)
