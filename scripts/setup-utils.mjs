import { mkdir, readFile, writeFile, copyFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

export async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDirectory(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

export async function ensureEnvLocal(rootDir) {
  const envLocalPath = path.join(rootDir, ".env.local");
  if (await exists(envLocalPath)) {
    return envLocalPath;
  }

  const envExamplePath = path.join(rootDir, ".env.example");
  const source = (await exists(envExamplePath)) ? envExamplePath : null;

  if (source) {
    await copyFile(source, envLocalPath);
  } else {
    await writeFile(envLocalPath, "", "utf8");
  }

  return envLocalPath;
}

export async function setEnvValue(filePath, key, value) {
  const content = await readFile(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const nextLine = `${key}=${value}`;
  const targetIndex = lines.findIndex((line) => line.startsWith(`${key}=`));

  if (targetIndex >= 0) {
    lines[targetIndex] = nextLine;
  } else {
    if (lines.length > 0 && lines[lines.length - 1] !== "") {
      lines.push("");
    }
    lines.push(nextLine);
  }

  await writeFile(filePath, `${lines.join("\n")}\n`, "utf8");
}

export async function copyTemplate(sourcePath, destinationPath) {
  await ensureDirectory(path.dirname(destinationPath));
  await copyFile(sourcePath, destinationPath);
}

export function getProjectRoot(importMetaUrl) {
  return path.resolve(path.dirname(new URL(importMetaUrl).pathname), "..");
}
