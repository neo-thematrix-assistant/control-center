// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/agents
// CLI: openclaw agents list --json
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { mockAgents } from "@/lib/mock-data";
import { openclawExec } from "@/lib/gateway";
import type { Agent, ApiResponse } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<Agent[]>>> {
  try {
    const data = await openclawExec<Agent[]>(["agents", "list"]);
    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({
      data: mockAgents,
      timestamp: new Date().toISOString(),
    });
  }
}
