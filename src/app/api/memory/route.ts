// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/memory
// Returns memory entries, optionally filtered by type
// Query params:
//   ?type=journal        — only journal entries
//   ?type=long_term      — only long-term memory entries
//   (omit for all entries)
// Real CLI:
//   openclaw memory list --json
//   openclaw memory list --type=journal --json
//   openclaw memory list --type=long_term --json
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockMemory } from "@/lib/mock-data";
import type { MemoryEntry, ApiResponse } from "@/lib/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<MemoryEntry[]>>> {
  try {
    const { searchParams } = request.nextUrl;
    const typeFilter = searchParams.get("type") as MemoryEntry["type"] | null;

    // TODO: replace with real CLI call
    // const typeFlag = typeFilter ? `--type=${typeFilter}` : "";
    // const raw = await exec(`openclaw memory list ${typeFlag} --json`.trim());
    // let data: MemoryEntry[] = JSON.parse(raw);

    let data: MemoryEntry[] = mockMemory;

    if (typeFilter === "journal" || typeFilter === "long_term") {
      data = data.filter((entry) => entry.type === typeFilter);
    }

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: [],
        error: error instanceof Error ? error.message : "Failed to fetch memory entries",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
