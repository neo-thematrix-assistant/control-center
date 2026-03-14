// ═══════════════════════════════════════════════════════════════
// API Route — GET /api/tasks | POST /api/tasks
// GET maps cron jobs into task-like cards; POST uses local in-memory store
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockTasks } from "@/lib/mock-data";
import { openclawExec } from "@/lib/gateway";
import type { Task, ApiResponse } from "@/lib/types";

// In-memory fallback store (resets on server restart)
const taskStore: Task[] = [...mockTasks];

// ── Validation ───────────────────────────────────────────────

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
    const now = new Date().toISOString();
    const cron = await openclawExec<{ jobs?: Array<{ id?: string; name?: string; enabled?: boolean; updatedAtMs?: number; schedule?: { kind?: string; expr?: string } }> }>(["cron", "list"]);
    const jobs = Array.isArray(cron) ? cron : (cron.jobs || []);

    const data: Task[] = jobs.map((job, idx) => ({
      id: job.id || `cron-${idx}`,
      title: job.name || `Cron job ${idx + 1}`,
      description: job.schedule?.expr ? `Cron: ${job.schedule.expr}` : "OpenClaw cron job",
      status: job.enabled ? "in_progress" : "backlog",
      priority: "medium",
      assignee: "System",
      project: "Automation",
      tags: ["cron", job.schedule?.kind || "schedule"],
      createdAt: job.updatedAtMs ? new Date(job.updatedAtMs).toISOString() : now,
      updatedAt: job.updatedAtMs ? new Date(job.updatedAtMs).toISOString() : now,
    }));

    return NextResponse.json({ data, timestamp: now });
  } catch {
    return NextResponse.json({
      data: taskStore,
      timestamp: new Date().toISOString(),
    });
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
        { data: {} as Task, error: "Invalid JSON body", timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const { id, ...fields } = body;

    const title = sanitizeString(fields.title, MAX_TITLE_LENGTH);
    if (!title) {
      return NextResponse.json(
        { data: {} as Task, error: "Missing or invalid field: title", timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const description = sanitizeString(fields.description, MAX_DESCRIPTION_LENGTH);
    const status = VALID_STATUSES.includes(fields.status) ? fields.status : "backlog";
    const priority = VALID_PRIORITIES.includes(fields.priority) ? fields.priority : "medium";
    const assignee = sanitizeString(fields.assignee, 50);
    const project = sanitizeString(fields.project, 100);
    const now = new Date().toISOString();

    if (id) {
      if (typeof id !== "string" || !ID_PATTERN.test(id) || id.length > 50) {
        return NextResponse.json(
          { data: {} as Task, error: "Invalid task ID format", timestamp: now },
          { status: 400 }
        );
      }

      // Try gateway first
      try {
        const updated = await openclawExec<Task>(["tasks", "update", id, "--data", JSON.stringify({ title, description, status, priority, assignee, project })]);
        return NextResponse.json({ data: updated, timestamp: now }, { status: 200 });
      } catch {
        // Fallback to local store
        const index = taskStore.findIndex((t) => t.id === id);
        if (index === -1) {
          return NextResponse.json(
            { data: {} as Task, error: "Task not found", timestamp: now },
            { status: 404 }
          );
        }
        const updated: Task = { ...taskStore[index], title, description, status, priority, assignee, project, id, updatedAt: now };
        taskStore[index] = updated;
        return NextResponse.json({ data: updated, timestamp: now }, { status: 200 });
      }
    } else {
      // Try gateway first
      try {
        const created = await openclawExec<Task>(["tasks", "create", "--data", JSON.stringify({ title, description, status, priority, assignee, project })]);
        return NextResponse.json({ data: created, timestamp: now }, { status: 201 });
      } catch {
        // Fallback to local store
        const newTask: Task = {
          id: `t-${Date.now()}`,
          title, description, status, priority, assignee, project,
          tags: Array.isArray(fields.tags) ? fields.tags.filter((t): t is string => typeof t === "string").slice(0, 20) : [],
          createdAt: now, updatedAt: now,
        };
        taskStore.push(newTask);
        return NextResponse.json({ data: newTask, timestamp: now }, { status: 201 });
      }
    }
  } catch {
    return NextResponse.json(
      { data: {} as Task, error: "Failed to process task", timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
