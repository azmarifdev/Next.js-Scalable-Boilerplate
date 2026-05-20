---
name: webapp-automation
description: Toolkit for local server orchestration and web application testing using Playwright browser scripts and Node.js with-server script. Use this skill when executing automated UI tasks, debugging browser layouts, capturing screenshots of live pages, or performing regression testing.
---

# Local Server WebApp Playwright Automation

This skill governs testing and UI automation of the Next.js Boilerplate using the built-in Node.js server lifecycle utility and Playwright script execution. Follow these instructions to launch servers automatically, connect chromium clients, inspect the active DOM, and automate web actions.

---

## ⚙️ Server Lifecycle Orchestration (`with-server.mjs`)

Instead of manually starting `pnpm run dev` in one terminal and executing scripts in another, utilize the boilerplate's custom Node.js helper. This launches the Next.js environment, monitors the port until it is open, runs your target script, and tears down the server cleanly to free up system resources.

- **Check help instructions**:
  ```bash
  node scripts/with-server.mjs --help
  ```
- **Execute a Playwright automation script against a dynamic development server**:
  ```bash
  node scripts/with-server.mjs --server "pnpm run dev" --port 3000 -- node scripts/your-playwright-automation.js
  ```
- **Execute against a compiled production server**:
  ```bash
  node scripts/with-server.mjs --server "pnpm run preview" --port 3000 -- node scripts/your-playwright-automation.js
  ```

---

## 🔍 The Reconnaissance-Then-Action Pattern

When executing browser automation tasks (e.g. searching, visual validation, clicking elements):

1. **Navigate and Wait**: Always load the page and wait for JS/React hydration to settle.
   ```javascript
   await page.goto("http://127.0.0.1:3000");
   await page.waitForLoadState("networkidle"); // CRITICAL: Wait for network idle
   ```
2. **Inspect & Extract Selectors**: If selectors are unknown, capture a screenshot or read the HTML tree:
   ```javascript
   await page.screenshot({ path: "tmp/debug-inspect.png", fullPage: true });
   const bodyHtml = await page.content();
   ```
3. **Target Element Selectors**: Utilize resilient selectors matching the boilerplate structure:
   - For auth screens, search for standard elements inside `.auth-card`:
     - Inputs: `input[type="email"]`, `input[type="password"]`
     - Action button: `.btn-primary` or `button[type="submit"]`
   - For language switching: `.topbar` or `.topbar-actions` dropdown links.

---

## 📝 Example Playwright Script

Save your automation scripts under a temporary file or inside a test file (e.g., `scripts/automate.js`):

```javascript
import { chromium } from "playwright";

async function run() {
  // Always launch in headless mode within containerized or terminal environments
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("http://127.0.0.1:3000");
    await page.waitForLoadState("networkidle");

    // Capture landing page state
    console.log("Page Title:", await page.title());
    await page.screenshot({ path: "tmp/landing-view.png" });

    // Perform standard actions here...
  } catch (error) {
    console.error("Automation error:", error);
  } finally {
    await browser.close();
  }
}

run();
```
