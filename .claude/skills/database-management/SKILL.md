---
name: database-management
description: Instructions for modifying Drizzle database schemas, auto-generating and applying migrations, seeding, resetting the database, and managing Neon serverless db setups. Use this skill when proposing new tables, changing fields, seeding sample data, resetting local data, or resolving Drizzle ORM conflicts.
---

# Database & Drizzle Management

This skill governs all database operations, migrations, and schema changes in the Next.js Boilerplate. Follow this guide to ensure that Drizzle schema modifications are correctly tracked, migration files are cleanly generated, and databases (local or Neon serverless) are safely migrated and seeded.

## Database & Drizzle Architecture

- **Database Engine**: PostgreSQL (fully compatible with Neon Serverless).
- **ORM System**: Drizzle ORM.
- **Runtime Connection**: Configured in `src/db/index.ts` using `@neondatabase/serverless` neon HTTP for lightweight serverless data access.
- **Migration & Local CLI Engine**: Configured in `drizzle.config.ts` using `drizzle-kit` running on the `pg` driver (requires standard direct TCP connection string rather than pooled connections).
- **Schemas Root**: All database table structures live in `src/db/schema/index.ts`.
- **Migration Files**: Compiled SQL scripts reside in `drizzle/`.

---

## Daily Workflow & Operations

### 1. Schema Modifications

To modify the database schema:

1. Update structural declarations inside `src/db/schema/index.ts`.
2. Generate the SQL migration file by running:
   ```bash
   pnpm run db:generate
   ```
   This creates a new migration directory and `.sql` file in `drizzle/`.
3. Apply the generated migration to your local database:
   ```bash
   pnpm run db:migrate
   ```

### 2. Seeding & Resetting Data

- **Seeding**: To seed the database with admin and sample user records (defined in `scripts/seed.mjs`):
  ```bash
  pnpm run db:seed
  ```
- **Resetting**: To truncate tables, re-run all migrations, and seed fresh records:
  ```bash
  ALLOW_DB_RESET=true pnpm run db:reset
  ```
  _(Note: `db:reset` will fail if `ALLOW_DB_RESET` environment variable is not explicitly set to `true`)._

---

## 🚫 Avoid Common Pitfalls

- **Do NOT use `db:push` in production**: `pnpm run db:push` applies schemas directly to the target database without compiling migration files. It is reserved _only_ for fast local prototyping. Production releases must always rely on generated SQL migration files using `pnpm run db:generate` followed by `pnpm run db:migrate`.
- **Database URL Formats**:
  - For serverless runtime on Neon, use the pooled hostname (usually containing `-pooler`):
    `DATABASE_URL=postgresql://user:password@ep-example-pooler.region.neon.tech/db?sslmode=require`
  - For migrations (`drizzle-kit`), do not use a pooled connection if it restricts direct DDL executions. Use the direct non-pooled connection URL. If using a custom migration connection, define it in `MIGRATION_DATABASE_URL` in `.env.local` or environment variables.

---

## Production Migrations

Production database migrations are not executed on application boot or server start. They are ran:

1. Manually inside **GitHub Actions** under `Production Database Migration` workflow.
2. Require approval and the keyword input `migrate-production`.
3. Read the migration environment variable `MIGRATION_DATABASE_URL` if present, falling back to `DATABASE_URL`.
