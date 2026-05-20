---
name: boilerplate-testing
description: Instructions for running, writing, and debugging unit/integration tests with Vitest, and end-to-end tests with Playwright. Use this skill when running tests, debugging failures, setting up test environments, or verifying local features using Playwright.
---

# Testing Suite (Vitest & Playwright)

This skill governs testing workflows inside the Next.js Boilerplate. Follow these guidelines to run tests, write new test files, handle global setups/teardowns, and debug testing environment issues.

## Testing Infrastructure

The project utilizes two testing layers:

1. **Unit & Integration Testing (Vitest)**: Located under `src/tests/unit/` and `src/tests/integration/`. Uses jsdom environment for component/DOM tests.
2. **End-to-End Testing (Playwright)**: Located under `src/tests/e2e/`. Tests the full compiled page interactions and features.

---

## 🏃 Run Commands

### 1. Vitest (Unit & Integration)

- **Run all unit & integration tests**:
  ```bash
  pnpm run test
  ```
- **Run integration tests only**:
  ```bash
  pnpm run test:integration
  ```
- **Start Vitest in watch/interactive mode**:
  ```bash
  pnpm run test:watch
  ```
- **Generate coverage report**:
  ```bash
  pnpm run test:coverage
  ```

### 2. Playwright (E2E)

- **Install browsers (Mandatory before first run)**:
  ```bash
  pnpm run e2e:install
  ```
- **Run E2E tests**:
  ```bash
  pnpm run e2e
  ```
- **Run E2E tests with Playwright UI mode**:
  ```bash
  pnpm run e2e:ui
  ```

---

## ⚙️ Test Environments & Setup

### Database Integration in Tests

- **Vitest**: Unit and integration tests must remain mock-driven or stateless. Use test adapters or Mock classes to avoid writing to a live database.
- **Playwright (E2E)**: Playwright runs a global setup (`src/tests/e2e/global-setup.ts`) which automatically migrates and seeds a test database:
  - Reads `E2E_DATABASE_URL` or `TEST_DATABASE_URL`.
  - Runs `pnpm run db:migrate` and `pnpm run db:seed` on that URL.
  - To skip this database migration and seeding (e.g. when database is not configured locally), set:
    ```env
    E2E_SKIP_DB_SETUP=true
    ```

### Playwright WebServer Configuration

Playwright is configured inside `playwright.config.ts` to launch the application using `pnpm run preview` on localhost.

- Origin configuration is determined dynamically, resolving to `127.0.0.1:3000` by default.
- If you need to test a custom running host, configure `E2E_BASE_URL` in environment variables.

---

## 🛠️ Best Practices & Helpers

1. **Origin Consistency (`src/tests/shared.ts`)**:
   - When creating mock `Request` or `NextRequest` objects in integration tests, import `TEST_LOCAL_ORIGIN` and `testUrl` helpers from `src/tests/shared.ts` to ensure consistency:
     ```typescript
     import { testUrl } from "@/tests/shared";
     const mockUrl = testUrl("/api/v1/auth/me");
     ```
2. **Wait for Network Idle in E2E**:
   - Because Next.js uses client-side hydration, always wait for the network to become idle or wait for a specific selector before asserting or taking action in Playwright:
     ```typescript
     await page.goto("/");
     await page.waitForLoadState("networkidle");
     ```
3. **Avoid Hardcoded Secrets**:
   - E2E tests read default credentials like `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` (defaulting to `admin@example.com` and `password123` respectively). Never hardcode these inside `.spec.ts` files; instead, fetch from `process.env`.
