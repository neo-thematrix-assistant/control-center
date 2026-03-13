// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/status
// Returns current GatewayStatus
// Real CLI: openclaw status --json
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { mockGateway } from "@/lib/mock-data";
import type { GatewayStatus, ApiResponse } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<GatewayStatus>>> {
  try {
    // TODO: replace with real CLI call
    // const raw = await exec("openclaw status --json");
    // const data: GatewayStatus = JSON.parse(raw);
    const data: GatewayStatus = mockGateway;

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: mockGateway,
        error: error instanceof Error ? error.message : "Failed to fetch gateway status",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
