import { defineConfig, devices } from "@playwright/test";

const seedAdminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD ?? "password123";
const e2eAuthEmail = process.env.E2E_AUTH_EMAIL ?? seedAdminEmail;
const e2eAuthPassword = process.env.E2E_AUTH_PASSWORD ?? seedAdminPassword;

process.env.SEED_ADMIN_EMAIL = seedAdminEmail;
process.env.SEED_ADMIN_PASSWORD = seedAdminPassword;
process.env.E2E_AUTH_EMAIL = e2eAuthEmail;
process.env.E2E_AUTH_PASSWORD = e2eAuthPassword;

export default defineConfig({
  testDir: "./src/tests/e2e",
  globalSetup: require.resolve("./src/tests/e2e/global-setup.ts"),
  globalTeardown: require.resolve("./src/tests/e2e/global-teardown.ts"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: {
    command: "pnpm run preview",
    url: "http://127.0.0.1:3000",
    env: {
      ...process.env,
      SEED_ADMIN_EMAIL: seedAdminEmail,
      SEED_ADMIN_PASSWORD: seedAdminPassword,
      E2E_AUTH_EMAIL: e2eAuthEmail,
      E2E_AUTH_PASSWORD: e2eAuthPassword,
      NEXT_PUBLIC_BACKEND_MODE: "internal",
      NEXT_PUBLIC_AUTH_PROVIDER: "better-auth",
      NEXT_PUBLIC_API_BASE_URL: "http://127.0.0.1:3000",
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
      AUTH_SESSION_SECRET: "e2e-local-secret",
      DATABASE_URL:
        process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres"
    },
    reuseExistingServer: !process.env.CI
  }
});
