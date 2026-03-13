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

// ── GET ──────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse<ApiResponse<Task[]>>> {
  try {
    // TODO: replace with real CLI call
    // const raw = await exec("openclaw tasks list --json");
    // const data: Task[] = JSON.parse(raw);
    const data: Task[] = taskStore;

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: [],
        error: error instanceof Error ? error.message : "Failed to fetch tasks",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// ── POST ─────────────────────────────────────────────────────────

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

    if (!fields.title || typeof fields.title !== "string") {
      return NextResponse.json(
        {
          data: {} as Task,
          error: "Missing required field: title",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    if (id) {
      // ── Update existing task ────────────────────────────────
      // TODO: const raw = await exec(`openclaw tasks update ${id} --json '${JSON.stringify(fields)}'`);
      // const updated: Task = JSON.parse(raw);

      const index = taskStore.findIndex((t) => t.id === id);
      if (index === -1) {
        return NextResponse.json(
          {
            data: {} as Task,
            error: `Task with id "${id}" not found`,
            timestamp: now,
          },
          { status: 404 }
        );
      }

      const updated: Task = {
        ...taskStore[index],
        ...fields,
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
      // TODO: const raw = await exec(`openclaw tasks create --json '${JSON.stringify(fields)}'`);
      // const created: Task = JSON.parse(raw);

      const newTask: Task = {
        id: `t-${Date.now()}`,
        title: fields.title,
        description: fields.description,
        status: fields.status ?? "backlog",
        priority: fields.priority ?? "medium",
        assignee: fields.assignee,
        project: fields.project,
        tags: fields.tags ?? [],
        createdAt: now,
        updatedAt: now,
      };

      taskStore.push(newTask);

      return NextResponse.json(
        { data: newTask, timestamp: now },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        data: {} as Task,
        error: error instanceof Error ? error.message : "Failed to process task",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
