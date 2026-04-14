import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /starter template/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
});

test("protected routes require auth", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
});

test("authenticated user can access dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.locator("input[type='email']").fill("admin@example.com");
  await page.locator("input[type='password']").fill("secret123");
  await page.locator("form").evaluate((form) => (form as HTMLFormElement).submit());

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /dashboard overview/i })).toBeVisible();
});

test("feature routes require auth", async ({ page }) => {
  await page.goto("/ecommerce");
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/billing");
  await expect(page).toHaveURL(/\/login$/);
});
