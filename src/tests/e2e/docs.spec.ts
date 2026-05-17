import { expect, test } from "@playwright/test";

test.describe("Docs", () => {
  test("docs hub page loads with categories", async ({ page }) => {
    await page.goto("/docs");
    await expect(page.getByText(/docs journal|ডকস জার্নাল/i)).toBeVisible();
    // At least one category should be visible
    await expect(page.locator(".docs-hub-category").first()).toBeVisible();
  });

  test("can open and view an article", async ({ page }) => {
    await page.goto("/docs");
    // First open a category (details element closed by default)
    const firstCategory = page.locator(".docs-hub-category").first();
    await firstCategory.locator("summary").click();
    await page.waitForTimeout(300);

    // Click first "Open Article" link inside the expanded category
    const openBtn = page.getByRole("link", { name: /open article|আর্টিকেল খুলুন/i }).first();
    await openBtn.click();

    // Should be on an article page
    await expect(page).toHaveURL(/\/docs\//);
    // Article content should be visible
    await expect(page.locator(".docs-markdown")).toBeVisible();
  });

  test("architecture article has tables", async ({ page }) => {
    await page.goto("/docs/architecture");
    await expect(page.locator(".docs-th").first()).toBeVisible();
    await expect(page.locator(".docs-table")).not.toHaveCount(0);
  });

  test("code blocks have copy buttons", async ({ page }) => {
    await page.goto("/docs/how-to-use");
    const copyButtons = page.locator(".docs-copy-btn");
    const count = await copyButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("article has GitHub source link", async ({ page }) => {
    await page.goto("/docs/folder-structure");
    await expect(page.getByText(/view on github|github-এ দেখুন/i)).toBeVisible();
  });

  test("back button returns to docs hub", async ({ page }) => {
    await page.goto("/docs/architecture");
    await page.getByRole("link", { name: /back to docs|ডকসে ফিরে যান/i }).click();
    await expect(page).toHaveURL("/docs");
  });
});
