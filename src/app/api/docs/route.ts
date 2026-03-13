// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/docs
// Returns doc entries. When ?id= is provided the full content
// field is included; otherwise content is stripped for list views.
// Query params:
//   ?id=d-001   — return single doc with full content
//   (omit for all docs without content)
// Real CLI (use execFile to prevent shell injection):
//   execFile("openclaw", ["docs", "list", "--json"])
//   execFile("openclaw", ["docs", "read", id, "--json"])
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockDocs } from "@/lib/mock-data";
import type { DocEntry, ApiResponse } from "@/lib/types";

const ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<DocEntry | DocEntry[]>>> {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (id) {
      // Validate ID format to prevent injection when wired to real CLI
      if (!ID_PATTERN.test(id) || id.length > 50) {
        return NextResponse.json(
          {
            data: [] as DocEntry[],
            error: "Invalid document ID format",
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      // TODO: wire to execFile("openclaw", ["docs", "read", id, "--json"])
      const doc = mockDocs.find((d) => d.id === id);

      if (!doc) {
        return NextResponse.json(
          {
            data: [] as DocEntry[],
            error: "Document not found",
            timestamp: new Date().toISOString(),
          },
          { status: 404 }
        );
      }

      const docWithContent: DocEntry = {
        ...doc,
        content: doc.content ?? `[Content for ${doc.name} — wire to real CLI to populate]`,
      };

      return NextResponse.json({
        data: docWithContent,
        timestamp: new Date().toISOString(),
      });
    }

    // TODO: wire to execFile("openclaw", ["docs", "list", "--json"])

    // Strip content from list view to keep response lean
    const data: DocEntry[] = mockDocs.map(({ content: _content, ...rest }) => rest);

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        data: [] as DocEntry[],
        error: "Failed to fetch docs",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
