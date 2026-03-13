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
    // TODO: replace with real CLI call
    // const raw = await exec("openclaw agents list --json");
    // const data: Agent[] = JSON.parse(raw);
    const data: Agent[] = mockAgents;

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: [],
        error: error instanceof Error ? error.message : "Failed to fetch agents",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
