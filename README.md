<div align="center">
  <br />
  <h1>⚡ Next.js Boilerplate</h1>
  <h3>PostgreSQL · Drizzle ORM · TypeScript</h3>
  <p>
    <strong>A production-ready foundation for modern web applications</strong>
  </p>
  <p>
    <a href="#-quick-start">Quick Start</a> ·
    <a href="#-tech-stack">Tech Stack</a> ·
    <a href="#-key-features">Features</a> ·
    <a href="#-project-structure">Structure</a> ·
    <a href="#-documentation">Docs</a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Drizzle_C5F74F?style=flat&logo=drizzle&logoColor=black" alt="Drizzle" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  </p>
</div>

---

## 📋 Overview

A **production-ready Next.js boilerplate** that gives you a clean, scalable starting point for any ambitious web project — whether it's a SaaS product, an e-commerce platform, a content-rich application, or an internal tool.

This isn't just a "hello world" starter. It's a **battle-tested foundation** with authentication, database integration, internationalization, documentation hub, testing infrastructure, CI/CD pipelines, and a clear, modular architecture — so you can skip the setup and start building what matters.

---

## 🚀 Quick Start

```bash
# Clone & install
git clone https://github.com/azmarifdev/Next.js-Boilerplate-PostgresQL-Drizzle.git
cd Next.js-Boilerplate-PostgresQL-Drizzle
pnpm install
pnpm run setup

# Configure environment
cp .env.example .env.local
# Edit .env.local with your PostgreSQL connection string and session secret

# Start developing
pnpm run dev
```

Your app is now running at **http://localhost:3000**. 🎉

---

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
| **Testing**          | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)             | Unit, integration, and end-to-end testing                      |
| **Package Manager**  | [pnpm](https://pnpm.io/)                                                          | Fast, disk-efficient package management                        |

---

## ✨ Key Features

### 🔐 Authentication & Security

| Feature                   | Details                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **Cookie-based Sessions** | Secure `httpOnly` + `sameSite=strict` session tokens signed with `AUTH_SESSION_SECRET` |
| **Better Auth (default)** | Built-in login, register, logout, refresh — runs in your own app                       |
| **Custom Auth Provider**  | Switch to an external IdP anytime — just change environment variables                  |
| **Rate Limiting**         | Protects auth endpoints from brute force attacks                                       |
| **CSP Headers**           | Content Security Policy configured in `next.config.ts`                                 |
| **Audit Logging**         | Every login/register attempt is logged for security monitoring                         |
| **Admin MFA Step-Up**     | Optional MFA verification for admin-level routes                                       |

### 🗄️ Database

| Feature                      | Details                                                 |
| ---------------------------- | ------------------------------------------------------- |
| **PostgreSQL + Drizzle ORM** | Type-safe queries with full SQL migration support       |
| **Neon Serverless Support**  | Works with serverless PostgreSQL providers              |
| **Schema Migrations**        | Auto-generate and apply SQL migrations with Drizzle Kit |
| **Drizzle Studio**           | GUI database browser at `pnpm run db:studio`            |

### 🌐 Internationalization

| Feature               | Details                                                        |
| --------------------- | -------------------------------------------------------------- |
| **English & Bangla**  | Full translations included for both locales                    |
| **next-intl**         | Server-side internationalization with minimal overhead         |
| **Language Switcher** | Toggle between languages in the navbar                         |
| **Extensible**        | Add more locales by adding JSON files — no code changes needed |

### 📚 Documentation Hub

| Feature                 | Details                                                   |
| ----------------------- | --------------------------------------------------------- |
| **Blog-Style Docs**     | Categorized articles with read-time estimates             |
| **Markdown Rendering**  | Server-rendered with syntax highlighting and copy buttons |
| **GitHub Source Links** | Every article links to its raw markdown source            |
| **Category Navigation** | Expandable categories — find what you need quickly        |

### 🧪 Testing Infrastructure

| Layer             | Tool       | Location                 |
| ----------------- | ---------- | ------------------------ |
| Unit Tests        | Vitest     | `src/tests/unit/`        |
| Integration Tests | Vitest     | `src/tests/integration/` |
| End-to-End Tests  | Playwright | `src/tests/e2e/`         |

### ⚙️ Developer Experience

- ✅ **Strict TypeScript** — `strict: true` in tsconfig, no `any` shortcuts
- ✅ **ESLint + Prettier** — Consistent code style enforced automatically
- ✅ **Husky + commitlint** — Git hooks prevent bad commits
- ✅ **Conventional Commits** — Automatic changelog and versioning via Release Please
- ✅ **Docker Support** — `Dockerfile` and `docker-compose.yml` included
- ✅ **Storybook** — Component development environment
- ✅ **CI/CD** — 13 GitHub Actions workflows for quality, security, and release

---

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
│   │   ├── 📂 landing/            #   Navbar, Hero, Features sections
│   │   ├── 📂 docs/               #   Documentation markdown renderer
│   │   ├── 📂 common/             #   Shared UI primitives
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
│   │   ├── 📂 security/           #   Rate limiting, origin checks, redirect safety
│   │   ├── 📂 observability/      #   Structured logging
│   │   └── 📂 utils/              #   API response helpers, utilities
│   │
│   ├── 📂 providers/              # App-level providers (query, theme, toast, auth)
│   ├── 📂 hooks/                  # Shared React hooks (useAuth)
│   ├── 📂 services/               # HTTP/API client layer
│   ├── 📂 i18n/messages/          # Translation files (en.json, bn.json)
│   ├── 📂 tests/                  # Test suites
│   │   ├── 📂 unit/               #   Unit tests (Vitest)
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

## 📖 Documentation

All documentation is in the `docs/` directory and covers everything from setup to deployment.

### Getting Started

| Guide                               | Description                                         |
| ----------------------------------- | --------------------------------------------------- |
| [📘 How to Use](docs/how-to-use.md) | First-time setup, env configuration, daily workflow |
| [📘 Quick Start](#-quick-start)     | 3-command setup above                               |

### Architecture & Design

| Guide                                           | Description                                            |
| ----------------------------------------------- | ------------------------------------------------------ |
| [📗 Architecture](docs/architecture.md)         | System layers, request flow, design decisions          |
| [📗 Folder Structure](docs/folder-structure.md) | Complete directory map with ownership details          |
| [📗 Auth Flow](docs/auth-flow.md)               | Authentication lifecycle, session model, MFA, security |

### Operations

| Guide                                                              | Description                                                                |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| [📕 Contributing Guide](docs/guides/contributing.md)               | PR rules, commit conventions, dev setup, testing guidelines                |
| [📕 Deployment Guide](docs/guides/deployment.md)                   | End-to-end deployment runbook with verification steps                      |
| [📕 Cloud Providers](docs/deployment/cloud-providers.md)           | Provider-specific setup (Vercel, Netlify, Railway, Render, Fly.io, Docker) |
| [📕 GitHub Setup Checklist](docs/guides/github-setup-checklist.md) | Branch protection, secrets, labels, permissions                            |
| [📕 Release Automation](docs/guides/release-automation.md)         | How Release Please works, troubleshooting                                  |
| [📕 Project Maintenance](docs/guides/project-maintenance.md)       | Daily/weekly/monthly/quarterly maintenance routines                        |
| [📕 Security Policy](docs/security.md)                             | Supported versions and vulnerability reporting                             |

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
- [Security Policy](docs/security.md) — How to report vulnerabilities
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
