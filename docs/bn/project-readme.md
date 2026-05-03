# Next.js Boilerplate (PostgreSQL + Drizzle)

আধুনিক ওয়েব অ্যাপ্লিকেশন, ই-কমার্স প্ল্যাটফর্ম এবং মডুলার ওয়েব অ্যাপ-এর জন্য production-ready Next.js টেমপ্লেট।

## উদ্দেশ্য

এই README আপনাকে টেমপ্লেট run, configure, এবং ship করার সবচেয়ে ছোট এবং নিরাপদ পথ দেখায়।

## আপনি কী পাচ্ছেন

- Next.js App Router + TypeScript
- `/api/v1/*` এর নিচে REST API
- PostgreSQL + Drizzle ORM
- Cookie-based session auth (internal mode)
- Optional external auth provider mode
- Optional module flags (`billing`, `ecommerce`, `admin`)
- React Query data layer
- Vitest + Playwright + CI workflow

## Quick Start

```bash
pnpm install
pnpm run setup
pnpm run dev
```

App চলবে `http://localhost:3000` এ।

## প্রয়োজনীয় Environment

`.env.example` থেকে `.env.local` কপি করুন।

Minimum internal mode:

- `NEXT_PUBLIC_BACKEND_MODE=internal`
- `NEXT_PUBLIC_AUTH_PROVIDER=better-auth`
- `DATABASE_URL=<postgres-connection-string>`
- `AUTH_SESSION_SECRET=<strong-random-secret>`

Common optional flags:

- `ALLOW_DEMO_AUTH=false`
- `ALLOW_INSECURE_DEV_AUTH=false`
- `REQUIRE_ADMIN_STEP_UP_AUTH=false`

## Auth Mode

ডিফল্ট internal auth:

- `NEXT_PUBLIC_AUTH_PROVIDER=better-auth`

External custom auth:

- `NEXT_PUBLIC_AUTH_PROVIDER=custom-auth`
- `NEXT_PUBLIC_ENABLE_CUSTOM_AUTH=true`
- `ENABLE_CUSTOM_AUTH=true`
- `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL=https://your-auth-provider.example.com`

## Admin Step-up MFA

Enable করুন:

- `REQUIRE_ADMIN_STEP_UP_AUTH=true`

Recommended verifier settings:

- `AUTH_MFA_VERIFY_URL=https://your-mfa-verifier.example.com/verify`
- `AUTH_MFA_VERIFY_BEARER_TOKEN=<optional-service-token>`

Local-only fallback:

- `AUTH_MFA_STATIC_CODE=123456`
- `ALLOW_STATIC_MFA_IN_PRODUCTION=false`

## Core Scripts

- `pnpm run dev`
- `pnpm run build`
- `pnpm run start`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run test:integration`
- `pnpm run e2e`
- `pnpm run db:generate`
- `pnpm run db:migrate`
- `pnpm run docs:check`

## Documentation Map (File-by-File)

- [How to Use](./how-to-use.md): local setup এবং day-to-day usage
- [Architecture](./architecture.md): system layer এবং design decision
- [Auth Flow](./auth-flow.md): login/register/session/MFA behavior
- [Folder Structure](./folder-structure.md): directory-level ownership
- [Workflows](./workflows.md): CI/CD/security automation map
- [Migration Package Manager Guide](./migrations/package-manager.md): manager policy migration
- [Cloud Providers](./deployment/cloud-providers.md): deployment target notes
- [Guides](./guides/README.md): operational playbook

## Release Model

Release Please automated versioning, changelog, tag, release flow-এর জন্য configured।

- Manually release tag তৈরি করবেন না
- Generated `chore(main): release ...` PR merge করুন

## লাইসেন্স

MIT
