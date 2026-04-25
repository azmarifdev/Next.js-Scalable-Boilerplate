import { expect, test } from "@playwright/test";

test.describe("I18n", () => {
  test("locale cookie switches homepage translations", async ({ page, context }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();

    await context.addCookies([
      {
        name: "NEXT_LOCALE",
        value: "bn",
        domain: "127.0.0.1",
        path: "/"
      }
    ]);

    await page.goto("/");
    await expect(page.getByRole("link", { name: /সাইন ইন/i })).toBeVisible();
  });
});
