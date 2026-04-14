import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
    include: [
      "src/tests/unit/**/*.{test,vitest}.{ts,tsx}",
      "src/tests/integration/**/*.{test,vitest}.{ts,tsx}"
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"]
    }
  }
});
