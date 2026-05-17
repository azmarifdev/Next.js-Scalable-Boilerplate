# Production Services

## Purpose

This guide covers the optional production services wired into the boilerplate:

- Sentry for error monitoring
- Resend for transactional email
- Upstash Redis for shared rate limiting

These services can stay blank during local development. Configure them before a public production launch.

---

## Which env file is for what?

- `.env.example`: template only. Commit this file.
- `.env.local`: local development only. Gitignored.
- Production env: set in your hosting provider (Vercel/Render/Railway/etc).
- CI env: set in GitHub Actions Secrets.

---

## First-Time Setup Order

1. Configure the required app env values.
2. Apply database migrations.
3. Add Sentry.
4. Add Upstash Redis.
5. Add Resend when the product sends email.
6. Run a deployed smoke test.

Required app values:

```env
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_BACKEND_MODE=internal
NEXT_PUBLIC_AUTH_PROVIDER=better-auth
DATABASE_URL=
AUTH_SESSION_SECRET=
```

---

## Sentry

Use Sentry to capture production runtime errors and client navigation traces.

Set these in Vercel Production:

```env
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_TRACES_SAMPLE_RATE=0.05
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.05
```

Notes:

- `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` usually use the same DSN.
- `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` enable source map upload during builds.
- Leave `SENTRY_AUTH_TOKEN` blank only if you intentionally do not upload source maps.

Files:

- `next.config.ts`
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `src/instrumentation.ts`
- `src/instrumentation-client.ts`

---

## Resend

Use Resend for transactional email such as verification, password reset, and security alerts.

Set these in Vercel Production:

```env
RESEND_API_KEY=
EMAIL_FROM=
```

Example `EMAIL_FROM`:

```env
EMAIL_FROM=Your App <auth@your-domain.com>
```

The shared email client lives in:

```txt
src/lib/email/resend.ts
```

Do not add email-dependent auth flows until the sending domain is verified in Resend.

---

## Upstash Redis

Use Upstash Redis for rate limiting that works across serverless instances.

Set these in Vercel Production:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

The app falls back to in-memory rate limiting when these values are blank. That is acceptable for local development, but production should use Upstash.

Files:

- `src/lib/security/rate-limit.ts`
- `src/app/api/v1/auth/login/route.ts`
- `src/app/api/v1/auth/mfa/verify/route.ts`

---

## GitHub Secrets

Set these under `Settings -> Secrets and variables -> Actions`:

```env
DATABASE_URL=
```

Optional separate migration URL:

```env
MIGRATION_DATABASE_URL=
```

Use `MIGRATION_DATABASE_URL` if the runtime URL is pooled but migrations should use a direct PostgreSQL connection.

---

## GitHub Environment

Create a GitHub environment:

```txt
production
```

Enable required reviewers. The production migration workflow uses this environment and requires typing:

```txt
migrate-production
```

Run it from:

```txt
Actions -> Production Database Migration -> Run workflow
```
