// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/tasks | POST /api/tasks
//
// GET  — Returns all tasks
//        Real CLI: openclaw tasks list --json
//
// POST — Create a new task or update an existing one.
//        Provide `id` in the body to update; omit to create.
//        Real CLI:
//          create: openclaw tasks create --json '{ ...fields }'
//          update: openclaw tasks update <id> --json '{ ...fields }'
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockTasks } from "@/lib/mock-data";
import type { Task, ApiResponse } from "@/lib/types";

// In-memory store for mock creates/updates (resets on server restart)
// TODO: remove once wired to real CLI / database
const taskStore: Task[] = [...mockTasks];

// ── Validation helpers ───────────────────────────────────────

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;
const VALID_STATUSES: Task["status"][] = ["backlog", "in_progress", "review", "done"];
const VALID_PRIORITIES: Task["priority"][] = ["low", "medium", "high", "critical"];
const ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

function sanitizeString(s: unknown, maxLen: number): string | undefined {
  if (typeof s !== "string") return undefined;
  return s.trim().slice(0, maxLen);
}

// ── GET ──────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse<ApiResponse<Task[]>>> {
  try {
    // TODO: wire to real CLI — use execFile("openclaw", ["tasks", "list", "--json"])
    // execFile avoids shell interpretation, preventing command injection.
    const data: Task[] = taskStore;

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        data: [],
        error: "Failed to fetch tasks",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// ── POST ─────────────────────────────────────────────────────

type CreateTaskBody = Omit<Task, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    let body: CreateTaskBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          data: {} as Task,
          error: "Invalid JSON body",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const { id, ...fields } = body;

    // Validate title
    const title = sanitizeString(fields.title, MAX_TITLE_LENGTH);
    if (!title) {
      return NextResponse.json(
        {
          data: {} as Task,
          error: "Missing or invalid field: title (string, max 200 chars)",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate optional fields
    const description = sanitizeString(fields.description, MAX_DESCRIPTION_LENGTH);
    const status = VALID_STATUSES.includes(fields.status) ? fields.status : "backlog";
    const priority = VALID_PRIORITIES.includes(fields.priority) ? fields.priority : "medium";
    const assignee = sanitizeString(fields.assignee, 50);
    const project = sanitizeString(fields.project, 100);

    const now = new Date().toISOString();

    if (id) {
      // ── Update existing task ────────────────────────────────
      // Validate ID format
      if (typeof id !== "string" || !ID_PATTERN.test(id) || id.length > 50) {
        return NextResponse.json(
          { data: {} as Task, error: "Invalid task ID format", timestamp: now },
          { status: 400 }
        );
      }

      // TODO: wire to real CLI — use execFile("openclaw", ["tasks", "update", id, "--json", JSON.stringify(fields)])
      // execFile passes args as array, preventing shell injection.

      const index = taskStore.findIndex((t) => t.id === id);
      if (index === -1) {
        return NextResponse.json(
          { data: {} as Task, error: "Task not found", timestamp: now },
          { status: 404 }
        );
      }

      const updated: Task = {
        ...taskStore[index],
        title,
        description,
        status,
        priority,
        assignee,
        project,
        id,
        updatedAt: now,
      };

      taskStore[index] = updated;

      return NextResponse.json(
        { data: updated, timestamp: now },
        { status: 200 }
      );
    } else {
      // ── Create new task ─────────────────────────────────────
      // TODO: wire to real CLI — use execFile("openclaw", ["tasks", "create", "--json", JSON.stringify(fields)])

      const newTask: Task = {
        id: `t-${Date.now()}`,
        title,
        description,
        status,
        priority,
        assignee,
        project,
        tags: Array.isArray(fields.tags) ? fields.tags.filter((t): t is string => typeof t === "string").slice(0, 20) : [],
        createdAt: now,
        updatedAt: now,
      };

      taskStore.push(newTask);

      return NextResponse.json(
        { data: newTask, timestamp: now },
        { status: 201 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        data: {} as Task,
        error: "Failed to process task",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
