// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/sessions
// Returns all active and recent sessions
// Real CLI: openclaw sessions list --json
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { mockSessions } from "@/lib/mock-data";
import type { Session, ApiResponse } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<Session[]>>> {
  try {
    // TODO: replace with real CLI call
    // const raw = await exec("openclaw sessions list --json");
    // const data: Session[] = JSON.parse(raw);
    const data: Session[] = mockSessions;

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: [],
        error: error instanceof Error ? error.message : "Failed to fetch sessions",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
