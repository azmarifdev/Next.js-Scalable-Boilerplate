import { execSync } from "child_process";

async function globalSetup() {
  if (process.env.E2E_SKIP_DB_SETUP === "true" || !process.env.DATABASE_URL) {
    console.log("Skipping Playwright database setup. E2E_DATABASE_URL is not configured.");
    return;
  }

  console.log("Running Playwright Global Setup: Migrating and Seeding Test Database...");
  try {
    execSync("pnpm run db:migrate", { stdio: "inherit" });
    execSync("pnpm run db:seed", { stdio: "inherit" });
    console.log("Database setup complete.");
  } catch (error) {
    console.error("Failed to setup database:", error);
    throw error;
  }
}

export default globalSetup;
