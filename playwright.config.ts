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
      NEXT_PUBLIC_BACKEND_MODE: process.env.NEXT_PUBLIC_BACKEND_MODE?.trim() || "internal",
      AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET?.trim() || "e2e-local-secret",
      ALLOW_DEMO_AUTH: process.env.ALLOW_DEMO_AUTH?.trim() || "true",
      ALLOW_INSECURE_DEV_AUTH: process.env.ALLOW_INSECURE_DEV_AUTH?.trim() || "true"
    },
    reuseExistingServer: !process.env.CI
  }
});
