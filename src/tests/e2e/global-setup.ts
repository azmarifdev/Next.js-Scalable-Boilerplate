import { execSync } from "child_process";

async function globalSetup() {
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
