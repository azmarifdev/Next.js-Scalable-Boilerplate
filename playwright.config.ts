import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { defineConfig, devices } from "@playwright/test";
import { parse } from "dotenv";

import { getLocalAppOrigin } from "./src/lib/config/url";

function loadPlaywrightEnv(): void {
  const mode = process.env.NODE_ENV === "development" ? "development" : "production";
  const envFiles = [`.env.${mode}.local`, ".env.local", `.env.${mode}`, ".env"];

  for (const envFile of envFiles) {
    const envPath = resolve(process.cwd(), envFile);
    if (!existsSync(envPath)) {
      continue;
    }

    const parsed = parse(readFileSync(envPath, "utf8"));
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] !== undefined) {
        continue;
      }

      process.env[key] = value;
    }
  }
}

loadPlaywrightEnv();

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

const authProvider = readEnv("NEXT_PUBLIC_AUTH_PROVIDER") ?? "better-auth";
const backendMode = readEnv("NEXT_PUBLIC_BACKEND_MODE") ?? "internal";
const customAuthBaseUrl = readEnv("NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL");
const isCustomAuth = authProvider === "custom-auth";
const seedAdminEmail = readEnv("SEED_ADMIN_EMAIL") ?? "admin@example.com";
const seedAdminPassword = readEnv("SEED_ADMIN_PASSWORD") ?? "password123";
const e2eAuthEmail = readEnv("E2E_AUTH_EMAIL") ?? (isCustomAuth ? undefined : seedAdminEmail);
const e2eAuthPassword =
  readEnv("E2E_AUTH_PASSWORD") ?? (isCustomAuth ? undefined : seedAdminPassword);
const e2eDatabaseUrl = readEnv("E2E_DATABASE_URL") ?? readEnv("TEST_DATABASE_URL");
const shouldSkipDbSetup = !e2eDatabaseUrl || backendMode === "external" || isCustomAuth;
const shouldSkipAuthTests =
  process.env.E2E_SKIP_AUTH_TESTS === "true" ||
  (isCustomAuth ? !customAuthBaseUrl || !e2eAuthEmail || !e2eAuthPassword : shouldSkipDbSetup);

process.env.SEED_ADMIN_EMAIL = seedAdminEmail;
process.env.SEED_ADMIN_PASSWORD = seedAdminPassword;
process.env.NEXT_PUBLIC_BACKEND_MODE = backendMode;
process.env.NEXT_PUBLIC_AUTH_PROVIDER = authProvider;
if (e2eAuthEmail) {
  process.env.E2E_AUTH_EMAIL = e2eAuthEmail;
}
if (e2eAuthPassword) {
  process.env.E2E_AUTH_PASSWORD = e2eAuthPassword;
}
if (e2eDatabaseUrl) {
  process.env.DATABASE_URL = e2eDatabaseUrl;
  process.env.E2E_DATABASE_URL = e2eDatabaseUrl;
}
if (shouldSkipDbSetup) {
  process.env.E2E_SKIP_DB_SETUP = "true";
}
if (shouldSkipAuthTests) {
  process.env.E2E_SKIP_AUTH_TESTS = "true";
}

const e2eBaseUrl = readEnv("E2E_BASE_URL") ?? getLocalAppOrigin({ host: "127.0.0.1" });
const e2eApiBaseUrl =
  readEnv("NEXT_PUBLIC_API_BASE_URL") ?? (backendMode === "internal" ? e2eBaseUrl : undefined);

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
      ...(e2eAuthEmail ? { E2E_AUTH_EMAIL: e2eAuthEmail } : {}),
      ...(e2eAuthPassword ? { E2E_AUTH_PASSWORD: e2eAuthPassword } : {}),
      NEXT_PUBLIC_BACKEND_MODE: backendMode,
      NEXT_PUBLIC_AUTH_PROVIDER: authProvider,
      ...(e2eApiBaseUrl ? { NEXT_PUBLIC_API_BASE_URL: e2eApiBaseUrl } : {}),
      NEXT_PUBLIC_SITE_URL: e2eBaseUrl,
      AUTH_SESSION_SECRET: readEnv("AUTH_SESSION_SECRET") ?? "e2e-local-secret",
      ...(shouldSkipDbSetup ? { E2E_SKIP_DB_SETUP: "true" } : {}),
      ...(shouldSkipAuthTests ? { E2E_SKIP_AUTH_TESTS: "true" } : {}),
      ...(shouldSkipDbSetup ? { SKIP_RUNTIME_VALIDATION: "true" } : {}),
      ...(e2eDatabaseUrl ? { DATABASE_URL: e2eDatabaseUrl } : {})
    },
    reuseExistingServer: !process.env.CI
  }
});
