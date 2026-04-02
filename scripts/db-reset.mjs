import { execSync } from "node:child_process";

if (process.env.ALLOW_DB_RESET !== "true") {
  console.error("Refusing to reset DB. Set ALLOW_DB_RESET=true to continue.");
  process.exit(1);
}

execSync("npm run db:migrate", { stdio: "inherit" });
execSync("node scripts/seed.mjs", { stdio: "inherit" });

console.info("Database reset complete.");
