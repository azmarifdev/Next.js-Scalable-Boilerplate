import { expect, test } from "@playwright/test";

test.describe("Sanity", () => {
  test("homepage renders", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /next\.js-boilerplate-postgresql-drizzle/i })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });

  test("robots and sitemap are reachable", async ({ page }) => {
    const robots = await page.request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    await expect
      .soft(robots.text())
      .resolves.toContain("Sitemap: http://127.0.0.1:3000/sitemap.xml");

    const sitemap = await page.request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    await expect.soft(sitemap.text()).resolves.toContain("/dashboard");
  });
});
