// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/agents
// Returns all registered agents and their current status
// Real CLI: openclaw agents list --json
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { mockAgents } from "@/lib/mock-data";
import type { Agent, ApiResponse } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<Agent[]>>> {
  try {
    // TODO: wire to execFile("openclaw", ["agents", "list", "--json"])
    const data: Agent[] = mockAgents;

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        data: [],
        error: "Failed to fetch agents",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
