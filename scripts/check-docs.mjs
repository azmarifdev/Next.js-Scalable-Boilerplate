import { existsSync, readFileSync } from "node:fs";

const requiredDocs = [
  "docs/architecture.md",
  "docs/folder-structure.md",
  "docs/auth-flow.md",
  "docs/how-to-use.md",
  "docs/migrations/package-manager.md",
  "docs/guides/README.md"
];

const missingDocs = requiredDocs.filter((file) => !existsSync(file));
if (missingDocs.length > 0) {
  console.error("Missing required docs files:");
  for (const file of missingDocs) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

const readme = readFileSync("README.md", "utf8");
const requiredMentions = [
  "docs/architecture.md",
  "docs/folder-structure.md",
  "docs/auth-flow.md",
  "docs/how-to-use.md",
  "docs/migrations/package-manager.md",
  "docs/guides/README.md"
];

const missingMentions = requiredMentions.filter((item) => !readme.includes(item));
if (missingMentions.length > 0) {
  console.error("README.md is missing required doc references:");
  for (const item of missingMentions) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log("Documentation checks passed.");
