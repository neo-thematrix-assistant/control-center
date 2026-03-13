// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/memory
// Returns memory entries, optionally filtered by type
// Query params:
//   ?type=journal        — only journal entries
//   ?type=long_term      — only long-term memory entries
//   (omit for all entries)
// Real CLI (use execFile to prevent shell injection):
//   execFile("openclaw", ["memory", "list", "--json"])
//   execFile("openclaw", ["memory", "list", "--type=journal", "--json"])
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockMemory } from "@/lib/mock-data";
import type { MemoryEntry, ApiResponse } from "@/lib/types";

const VALID_TYPES: MemoryEntry["type"][] = ["journal", "long_term"];

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<MemoryEntry[]>>> {
  try {
    const { searchParams } = request.nextUrl;
    const typeFilter = searchParams.get("type");

    // TODO: wire to execFile("openclaw", ["memory", "list", ...(typeFilter ? [`--type=${typeFilter}`] : []), "--json"])

    let data: MemoryEntry[] = mockMemory;

    // Only filter if typeFilter is a known valid type
    if (typeFilter && VALID_TYPES.includes(typeFilter as MemoryEntry["type"])) {
      data = data.filter((entry) => entry.type === typeFilter);
    }

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        data: [],
        error: "Failed to fetch memory entries",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
