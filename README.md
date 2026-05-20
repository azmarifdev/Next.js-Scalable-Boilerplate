<div align="center">
  <br />
  <h1>⚡ Next.js Boilerplate</h1>
  <h3>PostgreSQL · Drizzle ORM · TypeScript</h3>
  <p>
    <strong>A production-ready foundation for modern web applications</strong>
  </p>
  <p>
    <a href="#quick-start">Quick Start</a> ·
    <a href="#tech-stack">Tech Stack</a> ·
    <a href="#key-features">Features</a> ·
    <a href="#security">Security</a> ·
    <a href="#project-structure">Structure</a> ·
    <a href="#documentation">Docs</a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Drizzle-C5F74F?style=flat&logo=drizzle&logoColor=black" alt="Drizzle" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
    <img src="https://img.shields.io/badge/security-18_attack_types_mitigated-00A86B?style=flat" alt="Security" />
  </p>
</div>

---

## 📋 Overview

A **production-ready Next.js boilerplate** that gives you a clean, scalable starting point for any ambitious web project — whether it's a SaaS product, an e-commerce platform, a content-rich application, or an internal tool.

This isn't just a "hello world" starter. It's a **battle-tested foundation** with authentication, database integration, internationalization, documentation hub, testing infrastructure, CI/CD pipelines, and a clear, modular architecture — so you can skip the setup and start building what matters.

---

<a id="quick-start"></a>

## 🚀 Quick Start

```bash
# Clone & install
git clone https://github.com/azmarifdev/Next.js-Boilerplate-PostgresQL-Drizzle.git
cd Next.js-Boilerplate-PostgresQL-Drizzle
pnpm install
pnpm run setup

# Configure environment
cp .env.example .env.local
# Edit .env.local with your app name, URLs, PostgreSQL URL, and session secret

# Start developing
pnpm run dev
```

Your app is now running at the local origin from `.env.local`. With defaults: **http://localhost:3000**. 🎉

---

<a id="tech-stack"></a>

## 🛠️ Tech Stack

| Category             | Technology                                                                        | Purpose                                                        |
| -------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Framework**        | [Next.js 16](https://nextjs.org/) (App Router)                                    | React framework with server components, routing, and API layer |
| **Language**         | [TypeScript 6](https://www.typescriptlang.org/)                                   | Strict type safety across the entire codebase                  |
| **Database**         | [PostgreSQL](https://www.postgresql.org/)                                         | Relational database                                            |
| **ORM**              | [Drizzle ORM](https://orm.drizzle.team/)                                          | Type-safe SQL query builder with migrations                    |
| **Auth**             | Better Auth (built-in) or Custom IdP                                              | Cookie-based session authentication                            |
| **State Management** | [TanStack React Query](https://tanstack.com/query)                                | Server state caching and data fetching                         |
| **Styling**          | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Utility-first CSS with component primitives                    |
| **Forms**            | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)         | Performant forms with schema validation                        |
| **i18n**             | [next-intl](https://next-intl.dev/)                                               | Internationalization with English & Bangla locales             |
| **HTTP Client**      | [Axios](https://axios-http.com/)                                                  | Typed HTTP client for API communication                        |
| **Observability**    | [Sentry](https://sentry.io/)                                                      | Production error monitoring and source maps                    |
| **Email**            | [Resend](https://resend.com/)                                                     | Transactional email provider                                   |
| **Rate Limiting**    | [Upstash Redis](https://upstash.com/)                                             | Shared serverless rate limiting                                |
| **Testing**          | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)             | Unit, integration, and end-to-end testing                      |
| **Package Manager**  | [pnpm](https://pnpm.io/)                                                          | Fast, disk-efficient package management                        |

---

<a id="key-features"></a>

## ✨ Key Features

### 🔐 Authentication & Security

| Feature                      | Details                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| **Cookie-based Sessions**    | Secure `httpOnly` + `sameSite=strict` session tokens signed with `AUTH_SESSION_SECRET` |
| **Better Auth (default)**    | Built-in login, register, logout, refresh — runs in your own app                       |
| **Custom Auth Provider**     | Switch to an external IdP anytime — just change environment variables                  |
| **Rate Limiting**            | 4 tiers: global API (100/min), auth API (30/min), login (15/min), register (5/min)     |
| **CSRF Protection**          | Double-submit cookie pattern with timing-safe comparison                               |
| **CSP with Nonce**           | Content Security Policy with per-request nonce + `strict-dynamic` — blocks XSS         |
| **Security Headers**         | 10+ headers applied at 3 layers (Edge, Middleware, API)                                |
| **Input Sanitization**       | Null bytes, CRLF, and length limits on all inputs — prevents injection attacks         |
| **Brute Force Protection**   | Account lockout after 5 failed attempts with atomic SQL — race-condition proof         |
| **Password Security**        | Scrypt (CPU/memory-hard) hashing + 8-char complexity policy (upper, lower, number)     |
| **Audit Logging**            | Every auth event logged with IP, UA, risk score, and metadata for forensics            |
| **Admin MFA Step-Up**        | Optional MFA verification for admin-level routes                                       |
| **Body Size Validation**     | Max 100 KB per API request — prevents resource exhaustion attacks                      |
| **Open Redirect Prevention** | Origin validation + safe redirect path utility                                         |

### 🗄️ Database

| Feature                      | Details                                                     |
| ---------------------------- | ----------------------------------------------------------- |
| **PostgreSQL + Drizzle ORM** | Type-safe queries with full SQL migration support           |
| **Neon Serverless Support**  | Works with serverless PostgreSQL providers                  |
| **Schema Migrations**        | Auto-generate and apply SQL migrations with Drizzle Kit     |
| **Manual CI Migrations**     | Production migrations run from GitHub Actions with approval |
| **Drizzle Studio**           | GUI database browser at `pnpm run db:studio`                |

### 🌐 Internationalization

| Feature               | Details                                                           |
| --------------------- | ----------------------------------------------------------------- |
| **8 Languages**       | English, Bangla, Spanish, French, German, Hindi, Japanese, Arabic |
| **next-intl**         | Server-side internationalization with minimal overhead            |
| **Language Dropdown** | Switch between all 8 locales from the navbar                      |
| **Full Translations** | Nav, buttons, features, docs descriptions — all localized         |
| **Extensible**        | Add more locales by adding JSON files — no code changes needed    |

### 📚 Documentation Hub

| Feature                 | Details                                                   |
| ----------------------- | --------------------------------------------------------- |
| **Blog-Style Docs**     | Categorized articles with read-time estimates             |
| **Markdown Rendering**  | Server-rendered with syntax highlighting and copy buttons |
| **GitHub Source Links** | Every article links to its raw markdown source            |
| **Category Navigation** | Expandable categories — find what you need quickly        |

### 🧪 Testing Infrastructure

| Layer             | Tool          | Location                 |
| ----------------- | ------------- | ------------------------ |
| Unit Tests        | Vitest        | `src/tests/unit/`        |
| Integration Tests | Vitest        | `src/tests/integration/` |
| End-to-End Tests  | Playwright    | `src/tests/e2e/`         |
| **Total**         | **63+ tests** | **14 test files**        |

### ⚙️ Developer Experience

- ✅ **Strict TypeScript** — `strict: true` in tsconfig, no `any` shortcuts
- ✅ **ESLint + Prettier** — Consistent code style enforced automatically
- ✅ **Husky + commitlint** — Git hooks prevent bad commits
- ✅ **Conventional Commits** — Automatic changelog and versioning via Release Please
- ✅ **Docker Support** — `Dockerfile` and `docker-compose.yml` included
- ✅ **Storybook** — Component development environment
- ✅ **CI/CD** — 13 GitHub Actions workflows for quality, security, and release

---

<a id="security"></a>

## 🛡️ Enterprise-Grade Security (Built In, Not Bolted On)

Security is not an afterthought — it's woven into every layer of this boilerplate.
From the moment a request hits your app to the database query, **18 attack types** are mitigated out of the box.

### Why You Can Trust This Boilerplate

| Concern                                    | How It's Addressed                                                                                                                                                                                 |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **"Will my app get hacked through XSS?"**  | Content Security Policy with per-request nonces blocks all inline scripts except those explicitly trusted. `strict-dynamic` mode prevents injection even if an attacker finds a bypass.            |
| **"Can attackers brute-force my login?"**  | Account lockout after 5 failed attempts + IP-based rate limiting (15 req/min) + dummy password hash to prevent user enumeration. Concurrent request race conditions are prevented with atomic SQL. |
| **"What about CSRF attacks?"**             | Double-submit cookie pattern — server validates a cryptographically random token from both a cookie and an HTTP header. An attacker's site can't read either.                                      |
| **"Can someone DoS my API?"**              | Three tiers of rate limiting (global 100/min, auth 30/min, per-endpoint limits) + 100 KB request body cap. Upstash Redis support for distributed rate limiting across serverless instances.        |
| **"Are user passwords safe?"**             | Scrypt (CPU/memory-hard key derivation) with random 16-byte salt. Password validation requires 8+ characters with uppercase, lowercase, and numbers.                                               |
| **"What if I have admin routes?"**         | Optional MFA step-up authentication for admin-level routes. Session-based permission system with RBAC.                                                                                             |
| **"Can sessions be hijacked?"**            | HMAC-SHA256 signed tokens stored in `HttpOnly` + `SameSite=Strict` + `Secure` cookies. Key rotation via `AUTH_SESSION_SECRETS`. Timing-safe signature comparison.                                  |
| **"Are there security tests in CI?"**      | CodeQL static analysis, CodeHawk scan, dependency review, Gitleaks secret detection, and `pnpm audit` — all automated in GitHub Actions.                                                           |
| **"Is the database safe from injection?"** | Drizzle ORM generates parameterized queries by default. No raw SQL concatenation. Atomic operations prevent race conditions.                                                                       |

### Complete Attack Coverage

| Attack Vector           | Protection                                            | Layer |
| :---------------------- | :---------------------------------------------------- | :---: |
| **XSS**                 | CSP with nonce + `strict-dynamic`                     |  🛡️   |
| **CSRF**                | Double-submit cookie + header validation              |  🛡️   |
| **Brute Force**         | Account lockout + rate limiting + atomic SQL          |  🛡️   |
| **Account Enumeration** | Dummy password hash + generic errors                  |  🛡️   |
| **DDoS / API Abuse**    | IP-based rate limiting (all routes)                   |  🛡️   |
| **Clickjacking**        | `X-Frame-Options: DENY` + `frame-ancestors 'none'`    |  🛡️   |
| **Open Redirect**       | Origin validation + safe redirect function            |  🛡️   |
| **Race Conditions**     | Atomic SQL increment operations                       |  🛡️   |
| **Header Injection**    | Sanitized user-agent + IP (null bytes, CRLF stripped) |  🛡️   |
| **MIME Confusion**      | `X-Content-Type-Options: nosniff`                     |  🛡️   |
| **Protocol Downgrade**  | HSTS with `preload` + `upgrade-insecure-requests`     |  🛡️   |
| **Session Hijacking**   | `HttpOnly` + `SameSite=Strict` + HMAC-signed tokens   |  🛡️   |
| **Weak Passwords**      | Scrypt hashing + 8-char complexity policy             |  🛡️   |
| **Resource Exhaustion** | Request body limit (100 KB max)                       |  🛡️   |
| **ReDoS**               | Input length limits before regex evaluation           |  🛡️   |
| **Supply Chain**        | Dependency review + `frozen-lockfile` + Dependabot    |  🛡️   |
| **Secret Leakage**      | Gitleaks in CI + gitignored `.env.local`              |  🛡️   |
| **Credential Stuffing** | Rate limiting + audit logging + risk scoring          |  🛡️   |

> **Defense in Depth**: Security headers are applied at **3 levels** — CDN/Edge (`next.config.ts`), Middleware (`proxy.ts`), and API Routes (`api-security.ts`). If one layer fails, the next catches it.

### 📦 Security Modules

```
src/lib/security/
├── security-headers.ts    # CSP, HSTS, X-Frame-Options, etc. (single source)
├── api-security.ts        # Global rate limiting, CSRF, body validation
├── csrf.ts                # Double-submit cookie pattern
├── input-validator.ts     # Sanitization (XSS, header injection, ReDoS)
├── rate-limit.ts          # In-memory + Upstash Redis rate limiter
├── request-origin.ts      # Same-origin validation
└── redirect.ts            # Open redirect prevention
```

### 🔐 Auth Security

```
src/lib/auth/
├── password.ts            # Scrypt hashing with timing-safe verification
├── session.ts             # HMAC-SHA256 signed tokens with key rotation
├── session-guard.ts       # Route protection middleware
├── auth-user.repository.ts  # Atomic SQL for lockout (race-condition proof)
├── auth-audit.repository.ts # Every event logged with risk scoring
├── cookie-security.ts     # HttpOnly + SameSite + Secure flag logic
├── step-up.ts             # Admin MFA step-up configuration
├── step-up-guard.ts       # MFA enforcement for sensitive routes
└── rbac.ts                # Role-based access control
```

---

<a id="project-structure"></a>

## 📁 Project Structure

```
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── 📂 (auth)/             #   Login & register pages
│   │   ├── 📂 api/v1/auth/        #   Auth API routes (login, register, me, etc.)
│   │   ├── 📂 docs/               #   Documentation hub pages
│   │   ├── 📂 features/           #   Features overview page
│   │   ├── 📂 dev/flags/          #   Feature flag toggle UI (development only)
│   │   ├── 📄 page.tsx            #   Landing page
│   │   ├── 📄 layout.tsx          #   Root layout (fonts, theme, providers)
│   │   ├── 📄 sitemap.ts          #   Dynamic sitemap generation
│   │   └── 📄 global-error.tsx    #   Global error boundary
│   │
│   ├── 📂 components/             # Reusable UI components
│   │   ├── 📂 landing/            #   Navbar (8-locale dropdown), Hero, Features sections
│   │   ├── 📂 docs/               #   Documentation markdown renderer (marked-based, table support)
│   │   ├── 📂 common/             #   Shared UI primitives + ScrollRestoration
│   │   └── 📂 ui/                 #   shadcn/ui-style base components
│   │
│   ├── 📂 modules/                # Domain-level logic
│   │   ├── 📂 auth/               #   Auth components, hooks, services, schemas
│   │   └── 📂 optional/auth/      #   Custom auth provider adapter
│   │
│   ├── 📂 lib/                    # Core infrastructure
│   │   ├── 📂 auth/               #   Session, RBAC, MFA, audit logging
│   │   ├── 📂 config/             #   Environment vars, feature flags, constants
│   │   ├── 📂 db/                 #   Drizzle schema, providers
│   │   ├── 📂 docs/               #   Documentation content helpers
│   │   ├── 📂 errors/             #   Typed app/server error helpers
│   │   ├── 📂 security/           #   Rate limiting, origin checks, redirect safety
│   │   ├── 📂 observability/      #   Structured logging
│   │   └── 📂 utils/              #   API response helpers, utilities
│   │
│   ├── 📂 providers/              # App-level providers (query, theme, toast, auth)
│   ├── 📂 hooks/                  # Shared React hooks (useAuth)
│   ├── 📂 services/               # HTTP/API client layer
│   ├── 📂 i18n/messages/          # Translation files (en.json, bn.json)
│   ├── 📂 store/                  # Redux Toolkit slices/store setup
│   ├── 📂 tests/                  # Test suites
│   │   ├── � shared.ts           #   Shared test helpers (TEST_LOCAL_ORIGIN, testUrl)
│   │   ├── �📂 unit/               #   Unit tests (Vitest)
│   │   ├── 📂 integration/        #   Integration tests (Vitest)
│   │   └── 📂 e2e/                #   End-to-end tests (Playwright)
│   ├── 📂 styles/                 # Global CSS
│   ├── 📂 types/                  # Shared TypeScript definitions
│   └── 📂 utils/                  # Utility functions
│
├── 📂 docs/                       # Project documentation
│   ├── 📄 how-to-use.md           #   Setup & daily workflow guide
│   ├── 📄 architecture.md         #   System design & layers
│   ├── 📄 auth-flow.md            #   Authentication deep dive
│   ├── 📄 folder-structure.md     #   Directory ownership map
│   ├── 📄 workflows.md            #   GitHub Actions automation guide
│   ├── 📂 guides/                 #   Deployment, release, maintenance guides
│   ├── 📂 deployment/             #   Cloud provider-specific instructions
│   ├── 📂 migrations/             #   Package manager migration guide
│   ├── 📂 tools/                  #   Docs consistency + maintenance helpers
│   └── 📂 bn/                     #   Bangla translations of all docs
│
├── 📂 drizzle/                    # Auto-generated SQL migration files
├── 📂 scripts/                    # Setup, seed, reset automation scripts
├── 📂 .github/workflows/          # 13 CI/CD GitHub Actions workflows
├── 📄 Dockerfile                  # Production container image
├── 📄 docker-compose.yml          # Local container orchestration
├── 📄 drizzle.config.ts           # Drizzle Kit configuration
├── 📄 next.config.ts              # Next.js configuration (CSP, headers)
└── 📄 package.json                # Dependencies & scripts
```

### 🔑 Key Architecture Decisions

| Decision                             | Rationale                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------- |
| **Server Components by default**     | Better performance, smaller client bundles                                |
| **`src/lib/` for infrastructure**    | Keeps business logic separate from framework concerns                     |
| **Domain modules in `src/modules/`** | Each domain is self-contained (components, hooks, services)               |
| **Auth abstraction layer**           | Switch between Better Auth and custom providers without changing app code |
| **Drizzle over Prisma**              | More control over SQL, better performance, smaller bundle                 |
| **pnpm over npm/yarn**               | Faster installs, disk efficiency, strict dependency resolution            |

---

<a id="documentation"></a>

## 📖 Documentation

All documentation is in the `docs/` directory and covers everything from setup to deployment.

### Recommended Reading Order

1. [How to Use](docs/how-to-use.md) — first-time setup and daily workflow
2. [Architecture](docs/architecture.md) — system layers and request flow
3. [Folder Structure](docs/folder-structure.md) — where code and docs belong
4. [Auth Flow](docs/auth-flow.md) — auth lifecycle and security controls
5. [Guides Index](docs/guides/README.md) — deep-dive operations guides
6. [Deployment Guide](docs/guides/deployment.md) — production runbook
7. [Cloud Providers](docs/deployment/cloud-providers.md) — provider specifics
8. [Workflows](docs/workflows.md) — CI/CD and automation
9. [Security](docs/security.md) — defense-in-depth architecture, attack coverage, and customization guide

### Getting Started

| Guide                                                               | Description                                                           |
| ------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [📘 How to Use](docs/how-to-use.md)                                 | First-time setup, env configuration, daily workflow                   |
| [📘 Adopting This Boilerplate](docs/guides/adopting-boilerplate.md) | What to rename, configure, replace, remove, and verify for a real app |
| [📘 Database Setup](docs/guides/database-setup.md)                  | PostgreSQL, Neon, Drizzle migrations, and production migration flow   |
| [📘 Quick Start](#-quick-start)                                     | 3-command setup above                                                 |

### Architecture & Design

| Guide                                           | Description                                            |
| ----------------------------------------------- | ------------------------------------------------------ |
| [📗 Architecture](docs/architecture.md)         | System layers, request flow, design decisions          |
| [📗 Folder Structure](docs/folder-structure.md) | Complete directory map with ownership details          |
| [📗 Auth Flow](docs/auth-flow.md)               | Authentication lifecycle, session model, MFA, security |

### Operations

| Guide                                                              | Description                                                                                               |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| [📕 Contributing Guide](docs/guides/contributing.md)               | PR rules, commit conventions, dev setup, testing guidelines                                               |
| [📕 Guides Index](docs/guides/README.md)                           | Entry point for all operational guides                                                                    |
| [📕 Deployment Guide](docs/guides/deployment.md)                   | End-to-end deployment runbook with verification steps                                                     |
| [📕 Cloud Providers](docs/deployment/cloud-providers.md)           | Provider-specific setup (Vercel, Netlify, Railway, Render, Fly.io, Docker)                                |
| [📕 GitHub Setup Checklist](docs/guides/github-setup-checklist.md) | Branch protection, secrets, labels, permissions                                                           |
| [📕 Release Automation](docs/guides/release-automation.md)         | How Release Please works, troubleshooting                                                                 |
| [📕 Project Maintenance](docs/guides/project-maintenance.md)       | Daily/weekly/monthly/quarterly maintenance routines                                                       |
| [📕 Security](docs/security.md)                                    | Defense-in-depth architecture covering 18 attack types, CSP, CSRF, rate limiting, and customization guide |

### Workflows & Migration

| Guide                                                              | Description                               |
| ------------------------------------------------------------------ | ----------------------------------------- |
| [📙 Workflows](docs/workflows.md)                                  | All 13 GitHub Actions workflows explained |
| [📙 Package Manager Migration](docs/migrations/package-manager.md) | Switch from pnpm to npm/yarn/bun safely   |

---

## 📦 Available Scripts

| Category        | Script                      | Description                              |
| --------------- | --------------------------- | ---------------------------------------- |
| **Development** | `pnpm run dev`              | Start development server with hot reload |
|                 | `pnpm run build`            | Production build                         |
|                 | `pnpm run start`            | Start production server                  |
| **Quality**     | `pnpm run lint`             | ESLint check                             |
|                 | `pnpm run typecheck`        | TypeScript type checking                 |
|                 | `pnpm run format:check`     | Prettier formatting check                |
| **Database**    | `pnpm run db:generate`      | Generate migration files                 |
|                 | `pnpm run db:migrate`       | Apply migrations to database             |
|                 | `pnpm run db:studio`        | Open Drizzle Studio GUI                  |
|                 | `pnpm run db:seed`          | Seed database with sample data           |
|                 | `pnpm run db:reset`         | Reset database (⚠️ drops all data)       |
| **Testing**     | `pnpm run test`             | Run all unit & integration tests         |
|                 | `pnpm run test:integration` | Run integration tests only               |
|                 | `pnpm run e2e`              | Run Playwright end-to-end tests          |
| **Other**       | `pnpm run setup`            | First-time project setup                 |
|                 | `pnpm run docs:check`       | Verify documentation consistency         |
|                 | `pnpm run storybook`        | Launch Storybook component explorer      |

---

## 🤝 Contributing

We welcome contributions! Please see:

- [Contributing Guide](docs/guides/contributing.md) — PR rules, commit conventions, setup
- [Security](docs/security.md) — Defense-in-depth architecture, attack coverage, and vulnerability reporting
- [GitHub Setup Checklist](docs/guides/github-setup-checklist.md) — Repository hardening for maintainers
- [Project Maintenance](docs/guides/project-maintenance.md) — Maintenance routines for active projects

### Quick PR Checklist

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
```

---

## 🔄 Release Process

This project uses **Release Please** for automated versioning and changelog generation.

1. Write conventional commits (`feat:`, `fix:`, `docs:`, etc.)
2. Merge PRs to `main`
3. Release Please opens a release PR automatically
4. Merge the release PR → tag, changelog, and GitHub release are created

See [Release Automation Guide](docs/guides/release-automation.md) for details.

---

## 🏗️ Built For

| Use Case                 | Why This Boilerplate Works                                                |
| ------------------------ | ------------------------------------------------------------------------- |
| **Web Applications**     | Full auth, i18n, clean architecture — start building features immediately |
| **E-Commerce Platforms** | PostgreSQL + Drizzle for product catalogs, orders, inventory              |
| **Content-Rich Sites**   | Docs hub, blog-style pages, i18n support                                  |
| **Internal Tools**       | Auth, API layer, testing — secure from day one                            |
| **APIs & Backends**      | Versioned REST endpoints with standard response envelopes                 |
| **MVP / Prototypes**     | Everything you need to launch quickly without technical debt              |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>
    Built with ❤️ by <a href="https://azmarif.dev">A. Z. M. Arif</a>
  </p>
  <p>
    <a href="https://github.com/azmarifdev">GitHub</a> ·
    <a href="https://azmarif.dev">Website</a>
  </p>
</div>
