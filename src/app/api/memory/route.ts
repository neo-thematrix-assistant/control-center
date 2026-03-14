// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/memory
// Reads real memory files from workspace (MEMORY.md + memory/*.md)
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";
import { getConfig } from "@/lib/config";
import type { MemoryEntry, ApiResponse } from "@/lib/types";

const VALID_TYPES: MemoryEntry["type"][] = ["journal", "long_term"];

function countWords(text: string): number {
  return (text.trim().match(/\S+/g) || []).length;
}

function previewOf(text: string, max = 180): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.slice(0, max);
}

async function loadLongTermMemory(workspacePath: string): Promise<MemoryEntry[]> {
  const file = join(workspacePath, "MEMORY.md");

  try {
    const [content, st] = await Promise.all([readFile(file, "utf-8"), stat(file)]);
    return [
      {
        id: "long-term-memory",
        type: "long_term",
        title: "Long-Term Memory",
        date: st.mtime.toISOString().slice(0, 10),
        preview: previewOf(content),
        content,
        wordCount: countWords(content),
        file,
      },
    ];
  } catch {
    return [];
  }
}

async function loadJournalMemory(workspacePath: string): Promise<MemoryEntry[]> {
  const dir = join(workspacePath, "memory");

  let files: string[] = [];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }

  const mdFiles = files
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort()
    .reverse();

  const entries = await Promise.all(
    mdFiles.map(async (name): Promise<MemoryEntry | null> => {
      const file = join(dir, name);
      try {
        const content = await readFile(file, "utf-8");
        const date = name.replace(/\.md$/, "");
        return {
          id: `journal-${date}`,
          type: "journal",
          title: "Daily Journal",
          date,
          preview: previewOf(content),
          content,
          wordCount: countWords(content),
          file,
        };
      } catch {
        return null;
      }
    })
  );

  return entries.filter((e): e is MemoryEntry => !!e);
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<MemoryEntry[]>>> {
  try {
    const { workspacePath } = getConfig();
    const base = workspacePath || process.cwd();

    const { searchParams } = request.nextUrl;
    const typeFilter = searchParams.get("type");
    const q = (searchParams.get("q") || "").trim().toLowerCase();

    let data: MemoryEntry[] = [
      ...(await loadLongTermMemory(base)),
      ...(await loadJournalMemory(base)),
    ];

    if (typeFilter && VALID_TYPES.includes(typeFilter as MemoryEntry["type"])) {
      data = data.filter((entry) => entry.type === typeFilter);
    }

    if (q) {
      data = data.filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) ||
          entry.preview.toLowerCase().includes(q) ||
          entry.content.toLowerCase().includes(q) ||
          entry.date.includes(q)
      );
    }

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        data: [],
        error: "Failed to load memory files",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
