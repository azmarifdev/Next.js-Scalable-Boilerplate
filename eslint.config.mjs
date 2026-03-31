import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    rules: {
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn"
    }
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"])
]);
