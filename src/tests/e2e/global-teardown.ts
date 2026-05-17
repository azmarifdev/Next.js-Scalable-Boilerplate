import { execSync } from "child_process";

async function globalTeardown() {
  console.log("Running Playwright Global Teardown: Resetting Test Database...");
  try {
    execSync("pnpm run db:reset", { stdio: "inherit" });
    console.log("Database reset complete.");
  } catch (error) {
    console.error("Failed to reset database:", error);
  }
}

export default globalTeardown;
