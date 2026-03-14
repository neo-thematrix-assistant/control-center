// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/sessions
// CLI: openclaw sessions --json
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { mockSessions } from "@/lib/mock-data";
import { openclawExec } from "@/lib/gateway";
import type { Session, ApiResponse } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<Session[]>>> {
  try {
    const data = await openclawExec<Session[]>(["sessions"]);
    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({
      data: mockSessions,
      timestamp: new Date().toISOString(),
    });
  }
}
