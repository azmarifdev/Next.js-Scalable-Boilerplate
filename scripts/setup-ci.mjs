import { readdir, copyFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

import { ensureDirectory, getProjectRoot } from "./setup-utils.mjs";

const rootDir = getProjectRoot(import.meta.url);
const workflowsDir = path.join(rootDir, ".github", "workflows");
const baseDir = path.join(rootDir, "docs", "optional", "workflows", "base");
const advancedDir = path.join(rootDir, "docs", "optional", "workflows", "advanced");
const includeAdvanced = process.argv.includes("--advanced");
const baseFilesArg = process.argv.find((arg) => arg.startsWith("--base-files="));
const advancedFilesArg = process.argv.find((arg) => arg.startsWith("--advanced-files="));
const packageJsonPath = path.join(rootDir, "package.json");
const pnpmLockPath = path.join(rootDir, "pnpm-lock.yaml");

async function assertReadable(dirPath, label) {
  try {
    await access(dirPath, constants.R_OK);
  } catch {
    throw new Error(`${label} not found: ${dirPath}`);
  }
}

function parseCsvArg(rawArg) {
  if (!rawArg) {
    return null;
  }

  const [, csv] = rawArg.split("=");
  if (!csv) {
    return [];
  }

  return csv
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function filterBySelection(allFiles, selectedFiles, label) {
  if (!selectedFiles) {
    return allFiles;
  }

  const selectedSet = new Set(selectedFiles);
  const missing = selectedFiles.filter((file) => !allFiles.includes(file));
  if (missing.length > 0) {
    throw new Error(`${label} selection contains unknown files: ${missing.join(", ")}`);
  }

  return allFiles.filter((file) => selectedSet.has(file));
}

async function copySelectedWorkflows(groupDir, selectedFiles, label) {
  const allFiles = (await readdir(groupDir)).filter(
    (file) => file.endsWith(".yml") || file.endsWith(".yaml")
  );
  const filesToCopy = filterBySelection(allFiles, selectedFiles, label);

  for (const file of filesToCopy) {
    await copyFile(path.join(groupDir, file), path.join(workflowsDir, file));
  }

  return filesToCopy;
}

async function main() {
  await assertReadable(packageJsonPath, "package.json");
  await assertReadable(pnpmLockPath, "pnpm-lock.yaml");
  await assertReadable(baseDir, "Base workflow template directory");
  if (includeAdvanced) {
    await assertReadable(advancedDir, "Advanced workflow template directory");
  }

  await ensureDirectory(workflowsDir);

  const selectedBaseFiles = parseCsvArg(baseFilesArg);
  const selectedAdvancedFiles = parseCsvArg(advancedFilesArg);

  const copiedBase = await copySelectedWorkflows(baseDir, selectedBaseFiles, "Base workflow");
  const copiedAdvanced = includeAdvanced
    ? await copySelectedWorkflows(advancedDir, selectedAdvancedFiles, "Advanced workflow")
    : [];

  console.log("CI setup complete.");
  console.log(`- Base workflows copied: ${copiedBase.join(", ")}`);
  if (includeAdvanced) {
    console.log(`- Advanced workflows copied: ${copiedAdvanced.join(", ")}`);
  } else {
    console.log("- Advanced workflows skipped. Run `pnpm setup:ci -- --advanced` to include them.");
  }
  console.log(
    "- Tip: use `--base-files=a.yml,b.yml` or `--advanced-files=c.yml,d.yml` to copy selected templates."
  );
}

main().catch((error) => {
  console.error(`setup:ci failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  process.exit(1);
});
