# How to Use

## Purpose

This guide is the complete A-to-Z onboarding flow for this boilerplate:

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

---

## 3. Configure Environment Variables

The runtime reads local configuration from `.env.local`.

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

### 3.2 Safe local fallback mode (no database yet)

If you are exploring UI/routes before connecting PostgreSQL:

```env
ALLOW_DEMO_AUTH=true
ALLOW_INSECURE_DEV_AUTH=true
DATABASE_URL=
AUTH_SESSION_SECRET=local-dev-only-secret
```

Important:

- This fallback is for local development only.
- Do not use insecure fallback flags in production.

### 3.3 Custom auth mode

```env
NEXT_PUBLIC_AUTH_PROVIDER=custom-auth
NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true
ENABLE_CUSTOM_AUTH=true
NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://your-auth-service.example.com
```

---

## 4. Start the App

```bash
pnpm run dev
```

Open:

- `http://localhost:3000`

---

## 5. Database Workflow (PostgreSQL + Drizzle)

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
- `ALLOW_DEMO_AUTH=false`
- no DB URL provided

Fix:

- add `DATABASE_URL` to `.env.local`
- or temporarily set `ALLOW_DEMO_AUTH=true` for local exploration

### Error: `AUTH_SESSION_SECRET ... is required`

Fix:

- set `AUTH_SESSION_SECRET`
- or local-only fallback `ALLOW_INSECURE_DEV_AUTH=true`

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

1. `ALLOW_INSECURE_DEV_AUTH=false`
2. `ALLOW_DEMO_AUTH=false`
3. real `DATABASE_URL` configured
4. strong `AUTH_SESSION_SECRET` configured
5. HTTPS URLs for external auth

---

## Related Guides

- [GitHub Setup Checklist](guides/github-setup-checklist.md)
- [Auth Setup and Migration](guides/auth-setup-and-migration.md)
- [Workflows](workflows.md)
- [Release Automation](guides/release-automation.md)
- [Contributing Guide](guides/contributing.md)
