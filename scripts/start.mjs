import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const serverEntry = resolve(".next/standalone/server.js");

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!existsSync(serverEntry)) {
  console.log("[start] Build artifact not found, running `next build` first...");
  run("npx", ["next", "build"]);
}

run("node", [serverEntry]);
