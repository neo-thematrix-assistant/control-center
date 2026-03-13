// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/cron
// Returns all scheduled cron jobs and their current state
// Real CLI: openclaw cron list --json
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { mockCronJobs } from "@/lib/mock-data";
import type { CronJob, ApiResponse } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<CronJob[]>>> {
  try {
    // TODO: wire to execFile("openclaw", ["cron", "list", "--json"])
    const data: CronJob[] = mockCronJobs;

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        data: [],
        error: "Failed to fetch cron jobs",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
