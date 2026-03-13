// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/docs
// Returns doc entries. When ?id= is provided the full content
// field is included; otherwise content is stripped for list views.
// Query params:
//   ?id=d-001   — return single doc with full content
//   (omit for all docs without content)
// Real CLI:
//   openclaw docs list --json
//   openclaw docs read <id> --json
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockDocs } from "@/lib/mock-data";
import type { DocEntry, ApiResponse } from "@/lib/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<DocEntry | DocEntry[]>>> {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (id) {
      // TODO: replace with real CLI call
      // const raw = await exec(`openclaw docs read ${id} --json`);
      // const doc: DocEntry = JSON.parse(raw);

      const doc = mockDocs.find((d) => d.id === id);

      if (!doc) {
        return NextResponse.json(
          {
            data: [] as DocEntry[],
            error: `Doc with id "${id}" not found`,
            timestamp: new Date().toISOString(),
          },
          { status: 404 }
        );
      }

      // Return single doc with full content included
      const docWithContent: DocEntry = {
        ...doc,
        content: doc.content ?? `[Content for ${doc.name} — wire to real CLI to populate]`,
      };

      return NextResponse.json({
        data: docWithContent,
        timestamp: new Date().toISOString(),
      });
    }

    // TODO: replace with real CLI call
    // const raw = await exec("openclaw docs list --json");
    // const docs: DocEntry[] = JSON.parse(raw);

    // Strip content from list view to keep response lean
    const data: DocEntry[] = mockDocs.map(({ content: _content, ...rest }) => rest);

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: [] as DocEntry[],
        error: error instanceof Error ? error.message : "Failed to fetch docs",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
