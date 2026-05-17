import { defineConfig, devices } from "@playwright/test";

import { getLocalAppOrigin } from "./src/lib/config/url";

const seedAdminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD ?? "password123";
const e2eAuthEmail = process.env.E2E_AUTH_EMAIL ?? seedAdminEmail;
const e2eAuthPassword = process.env.E2E_AUTH_PASSWORD ?? seedAdminPassword;
const e2eDatabaseUrl =
  process.env.E2E_DATABASE_URL ??
  process.env.TEST_DATABASE_URL ??
  (process.env.CI ? undefined : process.env.DATABASE_URL);

process.env.SEED_ADMIN_EMAIL = seedAdminEmail;
process.env.SEED_ADMIN_PASSWORD = seedAdminPassword;
process.env.E2E_AUTH_EMAIL = e2eAuthEmail;
process.env.E2E_AUTH_PASSWORD = e2eAuthPassword;
if (e2eDatabaseUrl) {
  process.env.DATABASE_URL = e2eDatabaseUrl;
  process.env.E2E_DATABASE_URL = e2eDatabaseUrl;
} else {
  process.env.E2E_SKIP_DB_SETUP = "true";
}

const e2eBaseUrl = process.env.E2E_BASE_URL ?? getLocalAppOrigin({ host: "127.0.0.1" });

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
    baseURL: e2eBaseUrl,
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
    url: e2eBaseUrl,
    env: {
      ...process.env,
      SEED_ADMIN_EMAIL: seedAdminEmail,
      SEED_ADMIN_PASSWORD: seedAdminPassword,
      E2E_AUTH_EMAIL: e2eAuthEmail,
      E2E_AUTH_PASSWORD: e2eAuthPassword,
      NEXT_PUBLIC_BACKEND_MODE: "internal",
      NEXT_PUBLIC_AUTH_PROVIDER: "better-auth",
      NEXT_PUBLIC_API_BASE_URL: e2eBaseUrl,
      NEXT_PUBLIC_SITE_URL: e2eBaseUrl,
      AUTH_SESSION_SECRET: "e2e-local-secret",
      ...(e2eDatabaseUrl ? {} : { SKIP_RUNTIME_VALIDATION: "true" }),
      ...(e2eDatabaseUrl ? { DATABASE_URL: e2eDatabaseUrl } : {})
    },
    reuseExistingServer: !process.env.CI
  }
});
