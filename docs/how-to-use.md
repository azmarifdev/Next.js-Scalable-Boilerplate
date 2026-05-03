# How to Use

## Purpose

This guide covers **first-time setup** and **day-to-day development workflow**. Whether you're a new developer joining a team or setting up this project locally for the first time, follow these steps in order.

---

## What This Guide Covers

- Installing the project for the first time
- Configuring environment variables
- Running the development server
- Switching between auth modes
- Working with the database
- Running quality checks (lint, test, build)
- Useful development routes

---

## 1. First-Time Setup

### Prerequisites

Make sure you have these installed on your machine:

| Tool        | Minimum Version | Check Command    |
| ----------- | --------------- | ---------------- |
| **Node.js** | `>=20 <23`      | `node --version` |
| **pnpm**    | `>=8`           | `pnpm --version` |

> 💡 **Using a different package manager?** See the [Package Manager Migration](docs/migrations/package-manager.md) guide.

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/your-repo.git
cd your-repo

# Install all dependencies
pnpm install

# Run the automated setup script (creates .env.local, etc.)
pnpm run setup
```

The `setup` script will:

1. Copy `.env.example` to `.env.local` (if not already present)
2. Generate any necessary keys
3. Verify your Node.js version matches requirements

---

## 2. Configure Environment Variables

The project uses `.env.local` for local development. Copy the example file if it wasn't created by the setup script:

```bash
cp .env.example .env.local
```

### Minimum Configuration (Internal Auth Mode)

For the most common setup — internal auth with Better Auth — set these variables:

```env
# Backend runs inside the same app
NEXT_PUBLIC_BACKEND_MODE=internal

# Use Better Auth (default, no external provider needed)
NEXT_PUBLIC_AUTH_PROVIDER=better-auth

# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/your-db

# Session encryption secret (generate with: openssl rand -hex 32)
AUTH_SESSION_SECRET=your-32-byte-hex-string-here
```

### Optional Dev Flags

These are **optional** — only set them if you know what you're doing:

```env
# Enable demo account for testing
ALLOW_DEMO_AUTH=false

# Allow insecure development auth (not recommended)
ALLOW_INSECURE_DEV_AUTH=false

# Enable MFA step-up for admin routes
REQUIRE_ADMIN_STEP_UP_AUTH=false
```

---

## 3. Start the Development Server

```bash
pnpm run dev
```

The app starts at **http://localhost:3000**.

### What You Should See

When you open the browser:

1. ✅ **Landing page** — Hero section with project title, tech stack icons, and navigation
2. ✅ **Working navigation** — Links to Features, Docs, Sign In
3. ✅ **Language toggle** — Switch between English (🇬🇧) and Bangla (🇧🇩)
4. ✅ **Theme toggle** — Switch between dark and light mode

---

## 4. Switch Auth Modes

### Default: Internal Auth (Better Auth)

This is the simplest setup — everything runs in your app:

```env
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
```

Auth endpoints are at `/api/v1/auth/*`:

- Login: `POST /api/v1/auth/login`
- Register: `POST /api/v1/auth/register`
- Session: `GET /api/v1/auth/me`
- Logout: `POST /api/v1/auth/logout`

### External: Custom Auth Provider

If you have an existing auth system:

```env
NEXT_PUBLIC_AUTH_PROVIDER=custom-auth
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true
ENABLE_CUSTOM_AUTH=true
NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://your-auth-server.com
```

The app will delegate login, register, and session management to your external provider.

---

## 5. Database Operations

### Generate Migrations

When you change the database schema in `src/lib/db/schema.ts`, generate migration files:

```bash
pnpm run db:generate
```

This creates SQL migration files in the `drizzle/` directory.

### Apply Migrations

Apply pending migrations to your database:

```bash
pnpm run db:migrate
```

### Open Drizzle Studio (GUI)

Visually browse and edit your database:

```bash
pnpm run db:studio
```

This opens a web interface at **http://localhost:4983**.

### Reset Database

⚠️ **This drops all data** — use with caution:

```bash
pnpm run db:reset
```

### Seed Database

Add sample data for development:

```bash
pnpm run db:seed
```

---

## 6. Running Quality Checks

Run these before pushing any changes:

```bash
# Lint your code
pnpm run lint

# TypeScript type checking
pnpm run typecheck

# Run all unit & integration tests
pnpm run test

# Run integration tests only (faster)
pnpm run test:integration

# Run end-to-end tests (requires dev server running)
pnpm run e2e

# Check formatting
pnpm run format:check

# Build the production bundle
pnpm run build
```

### Recommended Pre-Push Workflow

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
```

---

## 7. Useful Development Routes

| Route          | What It Shows                                  |
| -------------- | ---------------------------------------------- |
| `/`            | Landing page with hero and features            |
| `/login`       | Sign in page (with demo credentials auto-fill) |
| `/register`    | Create account page                            |
| `/docs`        | Documentation hub with categorized articles    |
| `/docs/[slug]` | Individual documentation article               |
| `/features`    | Full features overview page                    |
| `/dev/flags`   | Feature flag toggle UI (for development)       |

---

## 8. Common Development Tasks

### Adding a New Page

1. Create a file in `src/app/` following Next.js App Router conventions
2. Add the route to `src/app/sitemap.ts` if it should appear in the sitemap
3. Add translations to `src/i18n/messages/en.json` and `bn.json`
4. Add any navigation links to the relevant component

### Adding a New API Route

1. Create a route file in `src/app/api/v1/`
2. Use the standard API response helpers from `src/lib/utils/api-response.ts`
3. Add auth protection using `session-guard.ts` if needed

### Adding i18n Translations

1. Open `src/i18n/messages/en.json` (English)
2. Open `src/i18n/messages/bn.json` (Bangla)
3. Add the same key to both files with translated values
4. Use `useTranslations("namespace")` in components

---

## Related Files

| File                             | Purpose                                |
| -------------------------------- | -------------------------------------- |
| `src/lib/config/env.ts`          | Environment variable schema definition |
| `src/lib/config/validate.ts`     | Runtime configuration validation       |
| `src/lib/config/featureFlags.ts` | Feature flag definitions and helpers   |
| `src/app/api/v1/auth/*`          | Internal auth API route handlers       |
