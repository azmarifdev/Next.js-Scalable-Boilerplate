import path from "node:path";

import { copyTemplate, ensureEnvLocal, getProjectRoot, setEnvValue } from "./setup-utils.mjs";

const rootDir = getProjectRoot(import.meta.url);
const envLocalPath = await ensureEnvLocal(rootDir);

await setEnvValue(envLocalPath, "NEXT_PUBLIC_DB_PROVIDER", "postgres");
await setEnvValue(envLocalPath, "DATABASE_URL", "postgres://postgres:postgres@localhost:5432/nextjs_starter_template");
await setEnvValue(envLocalPath, "ALLOW_DEMO_AUTH", "false");

await copyTemplate(
  path.join(rootDir, "docs", "optional", "templates", "postgres.env.example"),
  path.join(rootDir, ".env.optional.postgres.example")
);

console.log("PostgreSQL optional profile enabled.");
console.log("- Updated .env.local with NEXT_PUBLIC_DB_PROVIDER=postgres and DATABASE_URL placeholder.");
console.log("- Copied template: .env.optional.postgres.example");
console.log("- Next: run `pnpm db:migrate` and verify your database connection.");
