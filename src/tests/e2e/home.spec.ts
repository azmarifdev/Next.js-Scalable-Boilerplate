import { expect, test } from "@playwright/test";

const authEmail = process.env.E2E_AUTH_EMAIL;
const authPassword = process.env.E2E_AUTH_PASSWORD;

if (!authEmail || !authPassword) {
  throw new Error("Missing E2E_AUTH_EMAIL or E2E_AUTH_PASSWORD for Playwright tests.");
}

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /next\.js.*(boilerplate|বয়লারপ্লেট)/i })
  ).toBeVisible();
  await expect(
    page
      .getByRole("button", { name: /sign out|সাইন আউট/i })
      .or(page.getByRole("link", { name: /sign in|সাইন ইন/i }))
  ).toBeVisible();
});

const authTest = process.env.E2E_SKIP_DB_SETUP === "true" ? test.skip : test;

authTest("authenticated user can access docs after login", async ({ page }) => {
  await page.goto("/login");
  await page.locator("input[type='email']").fill(authEmail);
  await page.locator("input[type='password']").fill(authPassword);
  await page.getByRole("button", { name: /sign in|login|লগইন/i }).click();

  await expect(page).toHaveURL(/\/docs$/);
  await expect(page.getByText(/docs journal|ডকস জার্নাল/i)).toBeVisible();
});

authTest("signed-in users get redirected from login to docs", async ({ page }) => {
  // First login
  await page.goto("/login");
  await page.locator("input[type='email']").fill(authEmail);
  await page.locator("input[type='password']").fill(authPassword);
  await page.getByRole("button", { name: /sign in|login|লগইন/i }).click();
  await expect(page).toHaveURL(/\/docs$/);

  // Try going back to login - should redirect to docs
  await page.goto("/login");
  await expect(page).toHaveURL(/\/docs$/);
});
