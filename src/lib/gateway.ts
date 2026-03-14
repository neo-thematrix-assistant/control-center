// ═══════════════════════════════════════════════════════════════
// Gateway — safe CLI execution wrapper for OpenClaw commands
// Uses execFile (not exec) to prevent shell injection.
// ═══════════════════════════════════════════════════════════════

import { execFile as execFileCb } from "child_process";
import { promisify } from "util";
import { getConfig } from "./config";

const execFile = promisify(execFileCb);

export async function openclawExec<T>(args: string[]): Promise<T> {
  const { openclawBin, gatewayToken } = getConfig();

  const env = { ...process.env };
  if (gatewayToken) {
    env.OPENCLAW_GATEWAY_TOKEN = gatewayToken;
  }

  const { stdout } = await execFile(openclawBin, [...args, "--json"], {
    env: env as NodeJS.ProcessEnv,
    timeout: 10000,
    maxBuffer: 5 * 1024 * 1024,
  });

  return JSON.parse(stdout) as T;
}

export async function openclawExecRaw(args: string[]): Promise<string> {
  const { openclawBin, gatewayToken } = getConfig();

  const env = { ...process.env };
  if (gatewayToken) {
    env.OPENCLAW_GATEWAY_TOKEN = gatewayToken;
  }

  const { stdout } = await execFile(openclawBin, args, {
    env: env as NodeJS.ProcessEnv,
    timeout: 10000,
    maxBuffer: 5 * 1024 * 1024,
  });

  return stdout;
}
