# Deployment Guide

## Purpose

This guide walks you through deploying this boilerplate step by step — from pre-deployment checks to post-deployment verification. Follow it in order, and you'll have a running instance with minimal surprises.

Whether you're deploying to **Vercel**, **Netlify**, **Railway**, **Render**, **Fly.io**, or a **self-managed Docker server**, the core steps are the same. Provider-specific notes are in the [Cloud Providers](../deployment/cloud-providers.md) doc.

---

## Phase 1: Pre-Deployment Checklist

Before you run any deployment command, go through this list and make sure everything is ready.

### 0. Development vs Production Configuration

Local development uses files on your machine. Production uses provider dashboards and GitHub secrets.

| Location                                | Purpose                                     | Contains Secrets? | Commit?             |
| --------------------------------------- | ------------------------------------------- | ----------------- | ------------------- |
| `.env.example`                          | Template for users adopting the boilerplate | No                | Yes                 |
| `.env.local`                            | Local development values                    | Yes, local only   | No                  |
| `.env`                                  | Shared non-secret defaults only             | No                | Only if secret-free |
| Vercel/hosting env                      | Production runtime values                   | Yes               | No                  |
| GitHub repository secrets               | CI values such as `E2E_DATABASE_URL`        | Yes               | No                  |
| GitHub `production` environment secrets | Protected production migration values       | Yes               | No                  |

For most teams, keep only:

```txt
.env.example
.env.local
```

Use `.env` only for shared non-secret defaults. Avoid duplicate empty secrets in `.env`, such as `DATABASE_URL=`, because command-line tools may read that before `.env.local`.

Recommended local pattern:

```env
# .env.local
DATABASE_URL=postgresql://your-local-or-dev-db
AUTH_SESSION_SECRET=your-local-secret
```

Recommended shared default pattern:

```env
# .env
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
NEXT_PUBLIC_FEATURE_ADMIN=true
```

Development minimum:

```env
APP_PROTOCOL=http
APP_HOST=localhost
PORT=3000
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
DATABASE_URL=postgresql://...
AUTH_SESSION_SECRET=local-secret
```

Production minimum:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
DATABASE_URL=postgresql://...
AUTH_SESSION_SECRET=strong-production-secret
```

For internal backend mode, `NEXT_PUBLIC_API_BASE_URL` can stay blank because API routes are served by the same app. Set it only when the frontend talks to an external backend.

Before pushing code, run:

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run docs:check
pnpm run build
```

### 1. Choose Your Auth Mode

This template supports two authentication modes:

| Mode                    | Description                                                                                                              | When To Use                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `better-auth` (default) | Cookie-based sessions. Auth is handled inside this app — login, register, session management all run on your own server. | You want a self-contained app. No external auth dependency.      |
| `custom-auth`           | Authentication is delegated to an external provider (your own auth server, a third-party IdP, etc.)                      | You already have an auth system, or you need SSO / social login. |

**Set it in your environment:**

```
NEXT_PUBLIC_AUTH_PROVIDER=better-auth   # or custom-auth
```

If using `custom-auth`, you also need:

```
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true
ENABLE_CUSTOM_AUTH=true
NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://your-auth-provider.example.com
```

### 2. Collect Required Environment Variables

Every deployment needs these variables. Create a list — you'll need to enter them into your provider's dashboard.

Note:

- `.env.local` is **not** used in production. Set these in your hosting provider env settings.
- CI-only values (like `MIGRATION_DATABASE_URL`) belong in GitHub Actions Secrets.

**Always required:**
| Variable | Example Value | Purpose |
|----------|--------------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://myapp.com` | Used for sitemap, SEO metadata, redirects |
| `NEXT_PUBLIC_BACKEND_MODE` | `internal` or `external` | Whether the API runs in the same process or elsewhere |
| `NEXT_PUBLIC_AUTH_PROVIDER` | `better-auth` or `custom-auth` | Which auth system to activate |

**Required for internal auth (`better-auth`):**
| Variable | Example Value | Purpose |
|----------|--------------|---------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | Database connection string |
| `AUTH_SESSION_SECRET` | (a long random string) | Used to sign session cookies — keep this secret! |

> **Tip:** Generate a strong session secret with: `openssl rand -hex 32`

**Recommended for production:**
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | External API URL when `NEXT_PUBLIC_BACKEND_MODE=external` |
| `NEXT_PUBLIC_FEATURE_ADMIN` | Enables or disables admin surfaces |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring |
| `SENTRY_AUTH_TOKEN` / `SENTRY_ORG` / `SENTRY_PROJECT` | Source map upload for Sentry |
| `RESEND_API_KEY` / `EMAIL_FROM` | Transactional email |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Shared serverless rate limiting |

**Required for custom auth (`custom-auth`):**
| Variable | Example Value | Purpose |
|----------|--------------|---------|
| `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL` | `https://auth.mycompany.com` | Your external auth provider's base URL |

**Optional but good to know:**
| Variable | Purpose |
|----------|---------|
| `REQUIRE_ADMIN_STEP_UP_AUTH=true` | Enables MFA for admin routes |
| `AUTH_MFA_VERIFY_URL` | External MFA verifier endpoint (recommended if step-up is on) |

### 2.1 Database Provider Compatibility (Important)

This boilerplate expects a **PostgreSQL-compatible** `DATABASE_URL`.

Supported options:

- PostgreSQL (self-hosted or managed)
- Neon
- Supabase Postgres

What this means in practice:

- You can switch providers without changing application code if `DATABASE_URL` is valid.
- Drizzle migrations stay the same across these providers.
- Supabase is used as database backend only by default (Supabase Auth/Storage are not auto-integrated).

### 3. Make Sure Your Database is Reachable

Your deployment environment needs to be able to connect to your PostgreSQL database. If you're using a cloud database (Neon, Supabase, AWS RDS, etc.):

- ✅ Check that the database URL is correct
- ✅ Make sure the database IP/domain allows connections from your deployment provider
- ✅ If your provider supports it, add the database in the same region as your app for lower latency

For Neon/Supabase specifically:

- prefer their pooled/production connection string for serverless hosting
- use a direct PostgreSQL connection string for migrations if pooled URLs fail migration locks or TCP access
- keep SSL-required params as recommended by provider docs

### 4. Run Tests Locally (Recommended)

Before you push, confirm everything compiles and tests pass:

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
```

If `pnpm run build` succeeds, the app is ready to deploy.

---

## Phase 2: Database Migration

Your database schema needs to match what the app expects. Run this **after** the database is reachable from your deployment environment.

### Option A: Run migrations from your local machine

If your database accepts remote connections:

```bash
# Generate migration files (if you changed the schema)
pnpm run db:generate

# Apply migrations to the database
pnpm run db:migrate
```

### Option B: Run migrations from GitHub Actions

Use the manual production workflow:

```txt
Actions -> Production Database Migration -> Run workflow
```

Set `DATABASE_URL` or `MIGRATION_DATABASE_URL` in GitHub Secrets. Configure the `production` GitHub environment with required reviewers before using it for production.

Recommended secret placement:

| Secret                   | Where                           | Notes                                            |
| ------------------------ | ------------------------------- | ------------------------------------------------ |
| `E2E_DATABASE_URL`       | Repository Actions secret       | Disposable test database for Playwright auth E2E |
| `MIGRATION_DATABASE_URL` | `production` environment secret | Direct production DB URL for migrations          |
| `DATABASE_URL`           | Vercel env var                  | Runtime app database URL                         |

Run the workflow from the `main` branch and type:

```txt
migrate-production
```

Use `MIGRATION_DATABASE_URL` when runtime uses a pooled URL but migrations should use a direct connection.

> ⚠️ **Important:** Never run `db:generate` in production — it can create unintended schema changes. Run it locally and commit the generated files.

---

## Phase 3: Deploy to Your Provider

Each provider works slightly differently, but the core is the same:

| Setting              | Value                                     |
| -------------------- | ----------------------------------------- |
| **Build command**    | `pnpm run build`                          |
| **Start command**    | `pnpm run start`                          |
| **Output directory** | `.next` (auto-detected by most providers) |
| **Package manager**  | `pnpm`                                    |

Detailed provider-specific instructions are in the [Cloud Providers](../deployment/cloud-providers.md) document.

---

## Phase 4: Post-Deployment Verification

After the deploy completes, go through these checks to make sure everything is working.

### ✅ 1. Landing Page Loads

Open your app's URL. You should see:

- The hero section with the project title and tech stack icons
- The navigation bar (Features, Docs links)
- The "Get Started" and "View on GitHub" buttons
- The features section below the hero

### ✅ 2. Login & Register Pages Are Accessible

Navigate to `/login` and `/register`. Both pages should render without errors:

- The auth form should appear
- Switching between login and register via the link should work

### ✅ 3. Authentication Flow

- Register a new account → you should be redirected to `/docs`
- Log out → the navbar should show "Sign In" again
- Log in with the real account → you should be redirected to `/docs`
- After login, the navbar should show a "Sign Out" button

### ✅ 4. Docs Page

Navigate to `/docs`. You should see:

- The docs hub with categorized article sections
- Clicking a category should expand it to show articles
- Each article should have an "Open Article" link and a "GitHub" link

### ✅ 5. Auth Redirect Behavior

- Visit `/login` while already signed in → you should be redirected to `/docs`
- Visit `/register` while already signed in → you should be redirected to `/docs`

### ✅ 6. Check Logs

If anything doesn't work, check your provider's logs:

- Build logs — did the build complete without errors?
- Runtime logs — any API errors? Database connection issues?
- Migration logs — did the database migration run successfully?
- Sentry issues — did the smoke test create new errors?
- Upstash metrics — are auth rate-limit requests reaching Redis?

---

## Troubleshooting Common Issues

### "Build fails with out of memory"

Some providers have limited build memory. Try:

- Set `NODE_OPTIONS="--max-old-space-size=2048"`
- On Vercel, upgrade to a Pro plan or optimize your dependencies

### "Database connection refused"

- Double-check the `DATABASE_URL` in your provider's environment settings
- Make sure the database allows connections from your provider's IP range
- For Neon/Serverless, use the pooled connection string (with `-pooler` in the hostname)

### "Works with local Postgres, fails with Neon/Supabase"

Most common causes:

- missing SSL query parameters in URL
- using direct/non-pooled URL on serverless platform
- provider-side network restrictions

Fix:

1. copy the provider's recommended production URL again
2. verify region/network access settings
3. re-run migrations against the same URL used by runtime

### "Login returns 500 error"

- Check that `AUTH_SESSION_SECRET` is set in the environment
- Verify the `DATABASE_URL` is correct
- Check runtime logs for the specific error message

### "Rate limiting works locally but not consistently in production"

- Set `UPSTASH_REDIS_REST_URL`
- Set `UPSTASH_REDIS_REST_TOKEN`
- Verify auth requests show activity in Upstash

### "Sentry does not receive errors"

- Set `SENTRY_DSN`
- Set `NEXT_PUBLIC_SENTRY_DSN`
- Redeploy after setting env vars
- Add `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` for source maps

### "Emails do not send"

- Set `RESEND_API_KEY`
- Set `EMAIL_FROM`
- Verify the sending domain in Resend

### "Redirect not working correctly"

- Verify `NEXT_PUBLIC_SITE_URL` is set to your deployed domain
- Cookie-based auth depends on domain matching — the cookie domain must match the browser URL
