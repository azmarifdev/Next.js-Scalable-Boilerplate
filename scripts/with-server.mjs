#!/usr/bin/env node

/**
 * scripts/with-server.mjs
 * 
 * Production-grade server lifecycle manager.
 * Launches a development or production server, waits for the target port to become responsive,
 * executes a specified command (e.g., Playwright automation, testing scripts),
 * and cleanly tears down the running server.
 * 
 * Usage:
 *   node scripts/with-server.mjs --server "pnpm run dev" --port 3000 -- pnpm run e2e
 *   node scripts/with-server.mjs --server "pnpm run start" --port 3000 -- node test-script.js
 */

import { spawn } from "node:child_process";
import net from "node:net";

// Helper: Check if a port is responsive
function checkPort(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    socket.setTimeout(800);
    
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

// Helper: Poll port until ready
async function waitForServer(port, host = "127.0.0.1", timeoutMs = 30000) {
  const start = Date.now();
  console.log(`[with-server] Waiting for server on ${host}:${port}...`);
  
  while (Date.now() - start < timeoutMs) {
    const isReady = await checkPort(port, host);
    if (isReady) {
      console.log(`[with-server] Server detected on port ${port}!`);
      return true;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  
  throw new Error(`[with-server] Server failed to respond on port ${port} within ${timeoutMs / 1000}s`);
}

async function main() {
  const args = process.argv.slice(2);
  
  let serverCmd = "pnpm run dev";
  let port = 3000;
  let host = "127.0.0.1";
  let timeout = 30000;
  
  // Simple argument parser
  const serverIndex = args.indexOf("--server");
  if (serverIndex !== -1 && args[serverIndex + 1]) {
    serverCmd = args[serverIndex + 1];
  }
  
  const portIndex = args.indexOf("--port");
  if (portIndex !== -1 && args[portIndex + 1]) {
    port = parseInt(args[portIndex + 1], 10);
  }
  
  const hostIndex = args.indexOf("--host");
  if (hostIndex !== -1 && args[hostIndex + 1]) {
    host = args[hostIndex + 1];
  }
  
  const timeoutIndex = args.indexOf("--timeout");
  if (timeoutIndex !== -1 && args[timeoutIndex + 1]) {
    timeout = parseInt(args[timeoutIndex + 1], 10);
  }
  
  // Extract target command (everything after '--')
  const separatorIndex = args.indexOf("--");
  if (separatorIndex === -1 || separatorIndex === args.length - 1) {
    console.error("Error: Please specify the command to run after '--' separator.");
    console.error("Example: node scripts/with-server.mjs --server \"pnpm run dev\" --port 3000 -- pnpm run e2e");
    process.exit(1);
  }
  
  const targetCommand = args.slice(separatorIndex + 1);
  
  console.log(`[with-server] Starting server: "${serverCmd}"`);
  
  // Launch server child process
  const serverProcess = spawn(serverCmd, {
    shell: true,
    stdio: "inherit",
    env: { ...process.env }
  });
  
  let targetProcess = null;
  
  const cleanup = (code = 0) => {
    console.log("\n[with-server] Shutting down and cleaning up processes...");
    
    if (targetProcess) {
      try {
        targetProcess.kill("SIGTERM");
      } catch (e) {}
    }
    
    if (serverProcess) {
      try {
        serverProcess.kill("SIGTERM");
      } catch (e) {}
    }
    
    console.log("[with-server] Cleanup complete.");
    process.exit(code);
  };
  
  // Intercept exit signals
  process.on("SIGINT", () => cleanup(130));
  process.on("SIGTERM", () => cleanup(143));
  
  serverProcess.on("error", (err) => {
    console.error("[with-server] Failed to start server process:", err);
    cleanup(1);
  });
  
  try {
    // Wait for the server port to open
    await waitForServer(port, host, timeout);
    
    // Execute target command
    console.log(`[with-server] Running target command: "${targetCommand.join(" ")}"\n`);
    
    targetProcess = spawn(targetCommand[0], targetCommand.slice(1), {
      shell: true,
      stdio: "inherit"
    });
    
    targetProcess.on("close", (code) => {
      console.log(`[with-server] Target command exited with code ${code}`);
      cleanup(code);
    });
    
    targetProcess.on("error", (err) => {
      console.error("[with-server] Target command error:", err);
      cleanup(1);
    });
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    cleanup(1);
  }
}

main();
