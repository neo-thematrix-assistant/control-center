// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/docs
// Lists/reads real files from workspace directories
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import { join, extname } from "path";
import { getConfig } from "@/lib/config";
import type { DocEntry, ApiResponse } from "@/lib/types";

const SCAN_DIRS = ["docs", "memory", "content", "notes", "agents", "config", "journal"];
const TEXT_EXT = new Set([".md", ".txt", ".json", ".yaml", ".yml", ".html", ".js", ".ts", ".tsx", ".jsx", ".css"]);

function toDocType(fileName: string): string {
  const ext = extname(fileName).replace(/^\./, "").toLowerCase();
  return ext || "unknown";
}

function categoryForPath(relPath: string): string {
  if (relPath.startsWith("docs/")) return "Docs";
  if (relPath.startsWith("memory/") || relPath.startsWith("journal/")) return "Journal";
  if (relPath.startsWith("content/newsletters/")) return "Newsletters";
  if (relPath.startsWith("content/youtube/")) return "YouTube Scripts";
  if (relPath.startsWith("content/")) return "Content";
  if (relPath.startsWith("notes/")) return "Notes";
  if (relPath.includes("nova")) return "Nova";
  return "Other";
}

function previewOf(text: string, max = 220): string {
  return text.replace(/\s+/g, " ").trim().slice(0, max);
}

function wordCount(text: string): number {
  return (text.trim().match(/\S+/g) || []).length;
}

async function scanFiles(base: string): Promise<string[]> {
  const out: string[] = [];

  for (const dir of SCAN_DIRS) {
    const full = join(base, dir);
    let names: string[] = [];
    try {
      names = await readdir(full);
    } catch {
      continue;
    }

    for (const name of names) {
      const rel = `${dir}/${name}`;
      const abs = join(base, rel);
      try {
        const st = await stat(abs);
        if (st.isFile()) out.push(rel);
      } catch {
        continue;
      }
    }
  }

  return out;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<DocEntry | DocEntry[]>>> {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    const q = (searchParams.get("q") || "").trim().toLowerCase();

    const { workspacePath } = getConfig();
    const base = workspacePath || process.cwd();

    if (id) {
      const filePath = join(base, id);
      const st = await stat(filePath);
      if (!st.isFile()) {
        return NextResponse.json(
          { data: [] as DocEntry[], error: "Document not found", timestamp: new Date().toISOString() },
          { status: 404 }
        );
      }

      const name = id.split("/").pop() || id;
      const type = toDocType(name);
      let content = "";
      let preview = "Binary file";
      let wc = 0;

      if (TEXT_EXT.has(`.${type}`)) {
        content = await readFile(filePath, "utf-8");
        preview = previewOf(content);
        wc = wordCount(content);
      }

      const doc: DocEntry = {
        id,
        name,
        path: id,
        type,
        size: st.size,
        modifiedAt: st.mtime.toISOString(),
        preview,
        content: content || undefined,
        category: categoryForPath(id),
        wordCount: wc,
      };

      return NextResponse.json({ data: doc, timestamp: new Date().toISOString() });
    }

    const relFiles = await scanFiles(base);
    const docs: DocEntry[] = [];

    for (const rel of relFiles) {
      const abs = join(base, rel);
      try {
        const st = await stat(abs);
        if (!st.isFile()) continue;

        const name = rel.split("/").pop() || rel;
        const type = toDocType(name);
        let preview = "Binary file";
        let wc = 0;

        if (TEXT_EXT.has(`.${type}`) && st.size <= 512_000) {
          const content = await readFile(abs, "utf-8");
          preview = previewOf(content);
          wc = wordCount(content);
        }

        docs.push({
          id: rel,
          name,
          path: rel,
          type,
          size: st.size,
          modifiedAt: st.mtime.toISOString(),
          preview,
          category: categoryForPath(rel),
          wordCount: wc,
        });
      } catch {
        continue;
      }
    }

    const filtered = q
      ? docs.filter((d) =>
          d.name.toLowerCase().includes(q) ||
          d.path.toLowerCase().includes(q) ||
          d.preview.toLowerCase().includes(q) ||
          (d.category || "").toLowerCase().includes(q)
        )
      : docs;

    filtered.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));

    return NextResponse.json({ data: filtered, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json(
      { data: [] as DocEntry[], error: "Failed to fetch docs", timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
