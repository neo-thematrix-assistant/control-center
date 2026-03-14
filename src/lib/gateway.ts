// ═══════════════════════════════════════════════════════════════
// Gateway — safe CLI execution wrapper for OpenClaw commands
// Uses execFile (not exec) to prevent shell injection.
// The CLI binary connects to the local gateway RPC automatically.
// ═══════════════════════════════════════════════════════════════

import { execFile as execFileCb } from "child_process";
import { promisify } from "util";
import { getConfig } from "./config";

const execFile = promisify(execFileCb);

export async function openclawExec<T>(args: string[]): Promise<T> {
  const { openclawBin, gatewayUrl } = getConfig();

  const env = { ...process.env };
  if (gatewayUrl) {
    env.OPENCLAW_GATEWAY_URL = gatewayUrl;
  }

  const { stdout } = await execFile(openclawBin, [...args, "--json"], {
    env: env as NodeJS.ProcessEnv,
    timeout: 10000,
    maxBuffer: 5 * 1024 * 1024,
  });

  return JSON.parse(stdout) as T;
}

export async function openclawExecRaw(args: string[]): Promise<string> {
  const { openclawBin, gatewayUrl } = getConfig();

  const env = { ...process.env };
  if (gatewayUrl) {
    env.OPENCLAW_GATEWAY_URL = gatewayUrl;
  }

  const { stdout } = await execFile(openclawBin, args, {
    env: env as NodeJS.ProcessEnv,
    timeout: 10000,
    maxBuffer: 5 * 1024 * 1024,
  });

  return stdout;
}
