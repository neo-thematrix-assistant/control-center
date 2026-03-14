// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/docs
// CLI: openclaw docs list --json | openclaw docs read <id> --json
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockDocs } from "@/lib/mock-data";
import { openclawExec } from "@/lib/gateway";
import type { DocEntry, ApiResponse } from "@/lib/types";

const ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<DocEntry | DocEntry[]>>> {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (id) {
      if (!ID_PATTERN.test(id) || id.length > 50) {
        return NextResponse.json(
          { data: [] as DocEntry[], error: "Invalid document ID format", timestamp: new Date().toISOString() },
          { status: 400 }
        );
      }

      try {
        const data = await openclawExec<DocEntry>(["docs", "read", id]);
        return NextResponse.json({ data, timestamp: new Date().toISOString() });
      } catch {
        const doc = mockDocs.find((d) => d.id === id);
        if (!doc) {
          return NextResponse.json(
            { data: [] as DocEntry[], error: "Document not found", timestamp: new Date().toISOString() },
            { status: 404 }
          );
        }
        return NextResponse.json({
          data: { ...doc, content: doc.content ?? `[Content for ${doc.name}]` },
          timestamp: new Date().toISOString(),
        });
      }
    }

    try {
      const data = await openclawExec<DocEntry[]>(["docs", "list"]);
      return NextResponse.json({ data, timestamp: new Date().toISOString() });
    } catch {
      const data: DocEntry[] = mockDocs.map(({ content: _content, ...rest }) => rest);
      return NextResponse.json({ data, timestamp: new Date().toISOString() });
    }
  } catch {
    return NextResponse.json(
      { data: [] as DocEntry[], error: "Failed to fetch docs", timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
