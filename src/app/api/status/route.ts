// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/status
// CLI: openclaw status --json
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { mockGateway } from "@/lib/mock-data";
import { openclawExec } from "@/lib/gateway";
import type { GatewayStatus, ApiResponse } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<GatewayStatus>>> {
  try {
    const data = await openclawExec<GatewayStatus>(["status"]);
    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({
      data: mockGateway,
      timestamp: new Date().toISOString(),
    });
  }
}
