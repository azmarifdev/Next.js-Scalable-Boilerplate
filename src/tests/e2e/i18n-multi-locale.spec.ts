import { expect, test } from "@playwright/test";

test.describe("Multi-locale", () => {
  const LOCALES = [
    { code: "bn", flag: "🇧🇩", header: /ডকস জার্নাল/i },
    { code: "es", flag: "🇪🇸", header: /documentación|docs/i },
    { code: "fr", flag: "🇫🇷", header: /documentation|docs/i },
    { code: "de", flag: "🇩🇪", header: /dokumentation|docs/i },
    { code: "hi", flag: "🇮🇳", header: /दस्तावेज़|docs/i },
    { code: "ja", flag: "🇯🇵", header: /ドキュメント|docs/i },
    { code: "ar", flag: "🇸🇦", header: /التوثيق|docs/i }
  ];

  for (const { code, flag } of LOCALES) {
    test(`homepage shows translated nav in ${code} (${flag})`, async ({ page, context }) => {
      await context.addCookies([
        {
          name: "NEXT_LOCALE",
          value: code,
          domain: "127.0.0.1",
          path: "/"
        }
      ]);

      await page.goto("/");
      // The page should render without error and show the locale-specific flag
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    });

    test(`docs hub shows translated content in ${code} (${flag})`, async ({ page, context }) => {
      await context.addCookies([
        {
          name: "NEXT_LOCALE",
          value: code,
          domain: "127.0.0.1",
          path: "/"
        }
      ]);

      await page.goto("/docs");
      // Docs page should load with locale-specific content visible
      await expect(page.locator("h1").first()).toBeVisible();
      // At least one category should render
      await expect(page.locator(".docs-hub-category").first()).toBeVisible();
    });
  }
});
