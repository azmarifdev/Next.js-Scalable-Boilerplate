import { copyFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const rootDir = process.cwd();
const envExamplePath = path.join(rootDir, ".env.example");
const envLocalPath = path.join(rootDir, ".env.local");

function log(step, message) {
  console.log(`[setup] ${step} ${message}`);
}



async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function ensureEnvLocalFile() {
  const hasEnvLocal = await fileExists(envLocalPath);
  if (hasEnvLocal) {
    log("env", ".env.local already exists");
    return;
  }

  const hasExample = await fileExists(envExamplePath);
  if (!hasExample) {
    log("env", "skipped (.env.example not found)");
    return;
  }

  await copyFile(envExamplePath, envLocalPath);
  log("env", "created .env.local from .env.example");
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", shell: true });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`));
    });
  });
}

async function installDependencies() {
  const userAgent = process.env.npm_config_user_agent ?? "";
  const usePnpm = userAgent.includes("pnpm") || (await fileExists(path.join(rootDir, "pnpm-lock.yaml")));

  if (usePnpm) {
    log("deps", "installing with pnpm");
    await runCommand("pnpm", ["install"]);
    return;
  }

  log("deps", "installing with npm");
  await runCommand("npm", ["install"]);
}

async function main() {
  log("start", "project setup started");
  await ensureEnvLocalFile();
  await installDependencies();
  log("done", "project setup completed");
}

main().catch((error) => {
  console.error(`[setup] error ${error.message}`);
  process.exit(1);
});
