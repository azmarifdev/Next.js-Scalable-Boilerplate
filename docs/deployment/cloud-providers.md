# Cloud Providers

## Purpose

This document covers each supported deployment target in detail. If you haven't read the [Deployment Guide](../guides/deployment.md) yet, start there — it covers the general flow that applies to all providers. This doc adds provider-specific setup steps, gotchas, and recommendations.

---

## Common Ground

All providers share these requirements:

- **Environment variables** must be configured in the provider's dashboard or CLI
- **Build command:** `pnpm run build`
- **Start command:** `pnpm run start`
- **Node version:** `>=20` (set via `.nvmrc` or provider config)
- **Package manager:** `pnpm` (lockfile: `pnpm-lock.yaml`)

The environment variables you need depend on your auth mode. See the [Deployment Guide](../guides/deployment.md#2-collect-required-environment-variables) for a full list.

---

## 1. Vercel

Vercel is the **recommended** deployment target. It has first-class Next.js support and the simplest setup.

### How to Deploy

**Option A — Git Import (recommended for new projects):**

1. Push your repo to GitHub/GitLab/Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel auto-detects Next.js — no framework override needed

**Option B — Vercel CLI (recommended for existing projects):**

```bash
# Install the Vercel CLI
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy (follow the prompts)
vercel

# For production
vercel --prod
```

### Required Settings

| Setting              | Value                                    |
| -------------------- | ---------------------------------------- |
| **Framework Preset** | Next.js (auto-detected)                  |
| **Build Command**    | `pnpm run build` (auto-detected)         |
| **Output Directory** | `.next` (auto-detected)                  |
| **Install Command**  | `pnpm install` (auto-detected)           |
| **Node.js Version**  | 20.x (set in project settings > General) |

### Environment Variables

Add these in your Vercel project dashboard under **Settings > Environment Variables**:

| Variable                    | Scope      | Notes                                       |
| --------------------------- | ---------- | ------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`      | Production | Must be your Vercel domain or custom domain |
| `NEXT_PUBLIC_BACKEND_MODE`  | All        | `internal`                                  |
| `NEXT_PUBLIC_AUTH_PROVIDER` | All        | `better-auth` or `custom-auth`              |
| `DATABASE_URL`              | All        | Your PostgreSQL connection string           |
| `AUTH_SESSION_SECRET`       | All        | Generate with `openssl rand -hex 32`        |

### Post-Deployment

- Vercel assigns a `.vercel.app` domain automatically
- Set `NEXT_PUBLIC_SITE_URL` to this domain (or your custom domain)
- Run database migrations from your local machine (Vercel doesn't run build-time DB commands)

### Vercel-Specific Notes

- ✅ **Serverless functions** — API routes become serverless functions automatically
- ✅ **Edge caching** — Static pages are cached at the edge
- ⚠️ **WebSockets** — Not supported on the Hobby plan. Use external service if needed
- ⚠️ **Build time limit** — 45 minutes on Pro plan, 60 on Enterprise

---

## 2. Netlify

Netlify supports Next.js with the `@netlify/plugin-nextjs` plugin.

### How to Deploy

1. Push your repo to GitHub/GitLab/Bitbucket
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click **Add new site > Import an existing project**
4. Select your repository
5. Configure build settings (see below)
6. Deploy

### Required Settings

| Setting               | Value                                    |
| --------------------- | ---------------------------------------- |
| **Build command**     | `pnpm run build`                         |
| **Publish directory** | `.next`                                  |
| **Node version**      | Set via `.nvmrc` file (already included) |

### Netlify-Specific Notes

- ⚠️ **Plugin required:** Netlify needs the Next.js plugin for full functionality. Add `netlify.toml` or enable the plugin in the dashboard
- ✅ **Forms handling** — Not applicable here (no Netlify Forms)
- ✅ **Deploy previews** — Work automatically for PR branches

---

## 3. Railway

Railway is great if you want **zero-config database hosting** alongside your app.

### How to Deploy

1. Push your repo to GitHub
2. Go to [railway.app](https://railway.app)
3. Click **New Project > Deploy from GitHub repo**
4. Select your repository
5. Railway auto-detects Next.js

### Railway-Specific Advantages

- ✅ **Built-in PostgreSQL** — You can add a PostgreSQL database with one click
- ✅ **Automatic migrations** — Add a post-deploy command in your `railway.json`

### Setting Up PostgreSQL on Railway

1. In your Railway project, click **New > Database > Add PostgreSQL**
2. Once created, Railway sets `DATABASE_URL` automatically as an environment variable for your app
3. For migrations, go to the **Deployments** tab and run:

```bash
pnpm run db:migrate
```

### Environment Variables

Railway injects `DATABASE_URL` automatically if you add a PostgreSQL plugin. You still need to set:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BACKEND_MODE`
- `NEXT_PUBLIC_AUTH_PROVIDER`
- `AUTH_SESSION_SECRET`

---

## 4. Render

Render offers both **Web Services** (for the app) and **PostgreSQL** (for the database).

### How to Deploy

1. Push your repo to GitHub/GitLab
2. Go to [dashboard.render.com](https://dashboard.render.com)
3. Click **New + > Web Service**
4. Connect your repository
5. Configure:

| Setting           | Value                        |
| ----------------- | ---------------------------- |
| **Name**          | Your app name                |
| **Environment**   | Node                         |
| **Region**        | Choose closest to your users |
| **Branch**        | `main`                       |
| **Build Command** | `pnpm run build`             |
| **Start Command** | `pnpm run start`             |
| **Plan**          | Free or paid                 |

### Adding PostgreSQL

1. In Render dashboard, click **New + > PostgreSQL**
2. Once created, copy the **Internal Database URL**
3. Add it as `DATABASE_URL` in your Web Service's environment variables

### Render-Specific Notes

- ✅ **Auto-deploy** — Deploys automatically when you push to the connected branch
- ✅ **SSL** — Handled automatically
- ⚠️ **Cold starts** — Free tier spins down after 15 minutes of inactivity; first request may take ~30 seconds
- ⚠️ **Disk** — Ephemeral filesystem; don't store uploaded files locally

---

## 5. Fly.io

Fly.io runs your app close to your users with regions worldwide.

### Prerequisites

```bash
# Install flyctl
curl -fsSL https://fly.io/install.sh | sh

# Login
flyctl auth login
```

### How to Deploy

```bash
# Launch (first time)
flyctl launch

# This will:
# 1. Detect your app type (Next.js)
# 2. Ask you to name your app
# 3. Ask which region to deploy to
# 4. Create a fly.toml config
# 5. Set up secrets from .env or prompt

# Deploy updates
flyctl deploy

# Set environment variables
flyctl secrets set DATABASE_URL=postgresql://...
flyctl secrets set AUTH_SESSION_SECRET=your-secret
```

### Fly.io-Specific Notes

- ✅ **Global regions** — Deploy to multiple regions for low latency
- ✅ **IPv6 by default** — All apps get an IPv6 address
- ⚠️ **Dockerfile required** — Fly.io builds and runs your `Dockerfile`. The included `Dockerfile` is already configured
- ⚠️ **PostgreSQL** — Use Fly.io's managed PostgreSQL or an external provider like Neon

---

## 6. Self-Managed Docker

If you run your own server (VPS, dedicated server, etc.), use the included Docker setup.

### Prerequisites

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose (included with Docker Desktop / modern Docker)
# Verify:
docker --version
docker compose version
```

### Quick Start

```bash
# Clone the repo on your server
git clone https://github.com/your-org/your-repo.git
cd your-repo

# Create .env file with all required variables
cp .env.example .env.local

# Build and start
docker compose up --build -d
```

### Docker Compose Configuration

The included `docker-compose.yml` sets up:

- **App container** — Runs the Next.js app on port 3000
- **PostgreSQL container** (optional, if you don't have an external DB)

To use the built-in database, uncomment the PostgreSQL service in `docker-compose.yml`.

### Docker-Specific Notes

- ✅ **Full control** — You own the infrastructure
- ✅ **No cold starts** — Always-on
- ⚠️ **You manage SSL** — Use a reverse proxy (nginx, Caddy, Traefik) with Let's Encrypt
- ⚠️ **You manage updates** — Pull new images and restart manually or with watchtower

---

## Quick Reference: Environment Variables by Provider

| Variable                    | Vercel    | Netlify   | Railway                     | Render    | Fly.io    | Docker    |
| --------------------------- | --------- | --------- | --------------------------- | --------- | --------- | --------- |
| `NEXT_PUBLIC_SITE_URL`      | ✅ Manual | ✅ Manual | ✅ Manual                   | ✅ Manual | ✅ Manual | ✅ Manual |
| `NEXT_PUBLIC_BACKEND_MODE`  | ✅ Manual | ✅ Manual | ✅ Manual                   | ✅ Manual | ✅ Manual | ✅ Manual |
| `NEXT_PUBLIC_AUTH_PROVIDER` | ✅ Manual | ✅ Manual | ✅ Manual                   | ✅ Manual | ✅ Manual | ✅ Manual |
| `DATABASE_URL`              | ✅ Manual | ✅ Manual | 🔄 Auto (PostgreSQL plugin) | ✅ Manual | ✅ Manual | ✅ Manual |
| `AUTH_SESSION_SECRET`       | ✅ Manual | ✅ Manual | ✅ Manual                   | ✅ Manual | ✅ Manual | ✅ Manual |

---

## Docker Notes

Use the included `Dockerfile` and `docker-compose.yml` for containerized deployment and local testing. The `Dockerfile` uses Next.js's **standalone output mode** for minimal image size.

```bash
# Build the Docker image
docker build -t my-app .

# Run with environment variables
docker run --env-file .env.local -p 3000:3000 my-app

# Or use docker compose (recommended)
docker compose up --build
```
