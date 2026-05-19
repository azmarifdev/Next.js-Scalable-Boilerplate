import { execSync } from "child_process";

async function globalSetup() {
  const e2eDatabaseUrl = process.env.E2E_DATABASE_URL || process.env.TEST_DATABASE_URL;
  if (process.env.E2E_SKIP_DB_SETUP === "true" || !e2eDatabaseUrl) {
    console.log(
      "Skipping Playwright database setup. E2E_DATABASE_URL or TEST_DATABASE_URL is not configured."
    );
    return;
  }

  console.log("Running Playwright Global Setup: Migrating and Seeding Test Database...");
  try {
    execSync("pnpm run db:migrate", {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: e2eDatabaseUrl,
        MIGRATION_DATABASE_URL: e2eDatabaseUrl
      }
    });
    execSync("pnpm run db:seed", {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: e2eDatabaseUrl
      }
    });
    console.log("Database setup complete.");
  } catch (error) {
    console.error("Failed to setup database:", error);
    throw error;
  }
}

export default globalSetup;
