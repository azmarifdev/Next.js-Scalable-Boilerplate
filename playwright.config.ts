import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests/e2e",
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
    command: "npm run preview",
    url: "http://127.0.0.1:3000",
    env: {
      ...process.env,
      NEXT_PUBLIC_BACKEND_MODE: "internal",
      NEXT_PUBLIC_API_MODE: "rest",
      NEXT_PUBLIC_AUTH_PROVIDER: "custom",
      NEXT_PUBLIC_API_BASE_URL: "http://127.0.0.1:3000",
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
      AUTH_SESSION_SECRET: "e2e-local-secret",
      ALLOW_DEMO_AUTH: "true",
      ALLOW_INSECURE_DEV_AUTH: "true"
    },
    reuseExistingServer: !process.env.CI
  }
});
