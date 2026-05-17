import { execSync } from "child_process";

async function globalTeardown() {
  if (process.env.E2E_SKIP_DB_SETUP === "true" || !process.env.DATABASE_URL) {
    console.log("Skipping Playwright database teardown. E2E_DATABASE_URL is not configured.");
    return;
  }

  console.log("Running Playwright Global Teardown: Resetting Test Database...");
  try {
    execSync("pnpm run db:reset", {
      stdio: "inherit",
      env: {
        ...process.env,
        ALLOW_DB_RESET: "true"
      }
    });
    console.log("Database reset complete.");
  } catch (error) {
    console.error("Failed to reset database:", error);
  }
}

export default globalTeardown;
