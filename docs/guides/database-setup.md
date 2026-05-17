# Database Setup

## Architecture

- Migration layer: `drizzle-kit` with the `pg` PostgreSQL driver.
- Runtime layer: `drizzle-orm` with `@neondatabase/serverless`.
- Schema source: `src/db/schema`.
- Generated migrations: `drizzle/`.

## Neon Setup

1. Create a Neon project and database.
2. Copy the PostgreSQL connection string from Neon.
3. Use a pooled connection string for app runtime when appropriate.
4. Use a direct PostgreSQL connection string for migrations.

## Environment

Set `DATABASE_URL` in `.env.local` for local development and in your deployment platform for production:

```env
DATABASE_URL=
```

Do not commit real credentials.

For serverless runtime on Neon, the pooled hostname usually contains `-pooler`:

```env
DATABASE_URL=postgresql://user:password@ep-example-pooler.region.aws.neon.tech/db?sslmode=require&channel_binding=require
```

For CI migrations, use `MIGRATION_DATABASE_URL` in GitHub Secrets if you want migrations to use a separate direct connection.

## Commands

```bash
pnpm run db:generate
pnpm run db:migrate
pnpm run db:push
pnpm run db:studio
```

## Generate vs Migrate vs Push

- `db:generate` creates SQL migration files from schema changes.
- `db:migrate` applies committed migration files to the database.
- `db:push` applies schema changes directly without creating migration files.
- Use `db:migrate` for production releases.
- Use `db:push` only for local prototyping.

## Runtime

Runtime database access lives in `src/db/index.ts` and uses:

```ts
import { drizzle } from "drizzle-orm/neon-http";
```

This keeps Neon serverless access inside the application runtime layer.

## Migrations

`drizzle.config.ts` uses plain PostgreSQL credentials:

```ts
dbCredentials: {
  url: process.env.DATABASE_URL!,
}
```

`pg` is used for local and CI migration execution because migrations need a standard PostgreSQL connection. Neon HTTP/serverless drivers are runtime drivers and are not used by `drizzle-kit migrate`.

## Production CI Migration

Production migrations are run manually from GitHub Actions:

```txt
Actions -> Production Database Migration -> Run workflow
```

Required GitHub secret:

```env
DATABASE_URL=
```

Optional separate migration secret:

```env
MIGRATION_DATABASE_URL=
```

Recommended:

- Vercel `DATABASE_URL`: pooled runtime URL
- GitHub `MIGRATION_DATABASE_URL`: direct migration URL
- GitHub `DATABASE_URL`: fallback when no separate migration URL is needed

The workflow only runs on `main`, requires the `production` GitHub environment, and requires typing:

```txt
migrate-production
```
