import { rmSync } from "node:fs";

const paths = [".next", "coverage", "dist", "storybook-static", "tsconfig.tsbuildinfo"];

for (const target of paths) {
  try {
    rmSync(target, { recursive: true, force: true });
    console.log(`cleaned: ${target}`);
  } catch (error) {
    console.error(`failed to clean ${target}:`, error);
  }
}
