# Deployment Guide

## Purpose

This guide walks you through deploying this boilerplate step by step — from pre-deployment checks to post-deployment verification. Follow it in order, and you'll have a running instance with minimal surprises.

Whether you're deploying to **Vercel**, **Netlify**, **Railway**, **Render**, **Fly.io**, or a **self-managed Docker server**, the core steps are the same. Provider-specific notes are in the [Cloud Providers](../deployment/cloud-providers.md) doc.

---

## Phase 1: Pre-Deployment Checklist

Before you run any deployment command, go through this list and make sure everything is ready.

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

**Required for custom auth (`custom-auth`):**
| Variable | Example Value | Purpose |
|----------|--------------|---------|
| `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL` | `https://auth.mycompany.com` | Your external auth provider's base URL |

**Optional but good to know:**
| Variable | Purpose |
|----------|---------|
| `REQUIRE_ADMIN_STEP_UP_AUTH=true` | Enables MFA for admin routes |
| `AUTH_MFA_VERIFY_URL` | External MFA verifier endpoint (recommended if step-up is on) |
| `ALLOW_DEMO_AUTH=true` | Enables demo login credentials in dev |

### 3. Make Sure Your Database is Reachable

Your deployment environment needs to be able to connect to your PostgreSQL database. If you're using a cloud database (Neon, Supabase, AWS RDS, etc.):

- ✅ Check that the database URL is correct
- ✅ Make sure the database IP/domain allows connections from your deployment provider
- ✅ If your provider supports it, add the database in the same region as your app for lower latency

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

### Option B: Run migrations as part of deployment

On providers like Railway or Render, you can add a **post-deploy command**:

```bash
pnpm run db:migrate
```

Some providers let you run this via a "Post-deploy hook" or a separate one-off task.

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
- The "Demo Credentials" auto-fill button should work (if you enabled it)
- Switching between login and register via the link should work

### ✅ 3. Authentication Flow

- Register a new account → you should be redirected to `/docs`
- Log out → the navbar should show "Sign In" again
- Log in with the demo credentials → you should be redirected to `/docs`
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

### "Login returns 500 error"

- Check that `AUTH_SESSION_SECRET` is set in the environment
- Verify the `DATABASE_URL` is correct
- Check runtime logs for the specific error message

### "Redirect not working correctly"

- Verify `NEXT_PUBLIC_SITE_URL` is set to your deployed domain
- Cookie-based auth depends on domain matching — the cookie domain must match the browser URL
