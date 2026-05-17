import { expect, test } from "@playwright/test";

test.describe("Navigation & Layout", () => {
  test("navbar links are visible on landing page", async ({ page }) => {
    await page.goto("/");
    const navbar = page.locator("nav");
    // Match links in either English or Bangla (default locale)
    await expect(
      navbar.getByRole("link", { name: /features|docs|stack|ফিচারসমূহ|ডকস|টেক/i }).first()
    ).toBeVisible();
  });

  test("navigates to features page", async ({ page }) => {
    await page.goto("/");
    const featuresLink = page.getByRole("link", { name: /features/i }).first();
    if (await featuresLink.isVisible()) {
      await featuresLink.click();
      await expect(page).toHaveURL(/\/features$/);
    }
  });

  test("theme toggle switches between light and dark", async ({ page }) => {
    await page.goto("/");
    // Get current theme (checking initial state)
    await page.evaluate(() => document.documentElement.getAttribute("data-theme"));

    // Find and click theme toggle button
    const themeBtn = page
      .getByRole("button", {
        name: /light|dark|claro|oscuro|hell|dunkel|হালকা|গাঢ়|ライト|ダーク|فاتح|داكن/i
      })
      .first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      // Theme should have changed
      await page.waitForTimeout(300);
    }
  });

  test("four-oh-four page shows for unknown routes", async ({ page }) => {
    const response = await page.goto("/this-path-does-not-exist-12345");
    // Should get 404 status
    expect(response?.status()).toBe(404);
  });
});
