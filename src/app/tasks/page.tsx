"use client";

import { useState, useRef, useCallback } from "react";
import { mockTasks, mockActivity, mockAgents } from "@/lib/mock-data";
import type { Task } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type ColumnId = "backlog" | "in_progress" | "review" | "done";

const COLUMN_META: { id: ColumnId; label: string; dot: string }[] = [
  { id: "backlog", label: "Backlog", dot: "bg-gray-400" },
  { id: "in_progress", label: "In Progress", dot: "bg-blue-400" },
  { id: "review", label: "Review", dot: "bg-purple-400" },
  { id: "done", label: "Done", dot: "bg-green-400" },
];

// ─── Priority dot colors ──────────────────────────────────────────────────────

const PRIORITY_DOT: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-amber-500",
  medium: "bg-blue-400",
  low: "bg-gray-400",
};

// ─── Agent avatar colors (stable by name) ─────────────────────────────────────

const AVATAR_COLORS: Record<string, string> = {
  Alice: "from-green-500 to-emerald-600",
  Bob: "from-blue-500 to-indigo-600",
  Carol: "from-purple-500 to-violet-600",
  Dave: "from-cyan-500 to-teal-600",
  Eve: "from-pink-500 to-rose-600",
  Frank: "from-amber-500 to-orange-600",
};

// ─── Agent color for activity feed ────────────────────────────────────────────

const AGENT_ACTIVITY_COLORS: Record<string, string> = {
  Alice: "text-green-400",
  Bob: "text-blue-400",
  Carol: "text-purple-400",
  Dave: "text-cyan-400",
  Eve: "text-pink-400",
  Frank: "text-amber-400",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffS = Math.floor(diffMs / 1000);
  if (diffS < 60) return "just now";
  const diffM = Math.floor(diffS / 60);
  if (diffM < 60) return `${diffM}m ago`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

function getThisWeekCount(tasks: Task[]): number {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return tasks.filter((t) => new Date(t.updatedAt).getTime() >= cutoff).length;
}

// ─── Unique assignees for filter pills ────────────────────────────────────────

const allAssignees = Array.from(
  new Set(mockTasks.map((t) => t.assignee).filter(Boolean) as string[])
);

// ─── Task Card ────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDragging: boolean;
}

function TaskCard({ task, onDragStart, onDragEnd, isDragging }: TaskCardProps) {
  const avatarGradient = task.assignee
    ? AVATAR_COLORS[task.assignee] ?? "from-gray-500 to-gray-600"
    : "";

  return (
    <div
      className="rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg active:cursor-grabbing select-none"
      style={{
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
      }}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
    >
        {/* Priority dot + title */}
        <div className="flex items-start gap-2 mb-1.5">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${PRIORITY_DOT[task.priority] ?? "bg-gray-400"}`}
          />
          <h3 className="text-[13px] font-medium text-[var(--text-primary)] leading-snug line-clamp-2">
            {task.title}
          </h3>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-[11px] leading-relaxed text-[var(--text-muted)] mb-3 ml-4 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Bottom row: avatar + project tag + timestamp */}
        <div className="flex items-center justify-between mt-auto ml-4">
          <div className="flex items-center gap-2">
            {task.assignee && (
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}
              >
                {task.assignee.charAt(0)}
              </div>
            )}
            {task.project && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "var(--text-secondary)",
                }}
              >
                {task.project}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">
            {relativeTime(task.updatedAt)}
          </span>
        </div>
      </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);
  const dragLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const thisWeek = getThisWeekCount(tasks);
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const totalCount = tasks.length;
  const completionPct = tasks.length
    ? Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100)
    : 0;

  // ── Filtered tasks ───────────────────────────────────────────────────────
  const filteredTasks = filterAssignee
    ? tasks.filter((t) => t.assignee === filterAssignee)
    : tasks;

  const tasksByColumn: Record<ColumnId, Task[]> = {
    backlog: filteredTasks.filter((t) => t.status === "backlog"),
    in_progress: filteredTasks.filter((t) => t.status === "in_progress"),
    review: filteredTasks.filter((t) => t.status === "review"),
    done: filteredTasks.filter((t) => t.status === "done"),
  };

  // ── DnD ──────────────────────────────────────────────────────────────────
  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(taskId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: ColumnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragLeaveTimer.current) {
      clearTimeout(dragLeaveTimer.current);
      dragLeaveTimer.current = null;
    }
    setDragOverColumn(columnId);
  }, []);

  const handleDragLeave = useCallback(() => {
    dragLeaveTimer.current = setTimeout(() => setDragOverColumn(null), 50);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColumn: ColumnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: targetColumn, updatedAt: new Date().toISOString() } : t
      )
    );
    setDraggingId(null);
    setDragOverColumn(null);
  }, []);

  // ── Activity feed (last 8 events) ────────────────────────────────────────
  const recentActivity = mockActivity.slice(0, 8);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex gap-0 min-h-[calc(100vh-56px)]" style={{ marginLeft: "-24px", marginRight: "-24px", marginTop: "-24px", marginBottom: "-24px" }}>
      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* KPI Strip — inline numbers like reference */}
        <div className="flex items-baseline gap-6 mb-5 flex-wrap">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{thisWeek}</span>
            <span className="text-[13px] text-[var(--text-muted)]">This week</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{inProgressCount}</span>
            <span className="text-[13px] text-[var(--text-muted)]">In progress</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{totalCount}</span>
            <span className="text-[13px] text-[var(--text-muted)]">Total</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{completionPct}%</span>
            <span className="text-[13px] text-[var(--text-muted)]">Completion</span>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-medium text-white transition-colors"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            <span className="text-base leading-none">+</span>
            New task
          </button>

          {/* Agent filter pills */}
          {allAssignees.map((name) => (
            <button
              key={name}
              onClick={() => setFilterAssignee(filterAssignee === name ? null : name)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                filterAssignee === name
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-[var(--text-secondary)] hover:bg-white/5 border border-transparent"
              }`}
            >
              {name}
            </button>
          ))}

          {/* Project dropdown placeholder */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-[var(--text-secondary)] border border-[var(--border-color)] ml-auto cursor-default"
          >
            All projects
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50">
              <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Kanban columns */}
        <div className="grid grid-cols-4 gap-4">
          {COLUMN_META.map((col) => {
            const colTasks = tasksByColumn[col.id];
            const isOver = dragOverColumn === col.id;

            return (
              <div
                key={col.id}
                className="flex flex-col min-h-[400px]"
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                      {col.label}
                    </span>
                    <span className="text-[12px] text-[var(--text-muted)]">{colTasks.length}</span>
                  </div>
                  <button className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Cards container */}
                <div
                  className={`flex flex-col gap-3 flex-1 rounded-xl p-1 transition-all ${
                    isOver ? "ring-1 ring-blue-500/30 bg-blue-500/5" : ""
                  }`}
                >
                  {colTasks.length === 0 ? (
                    <div className="flex items-center justify-center flex-1 text-[12px] text-[var(--text-muted)] opacity-60">
                      No tasks
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        isDragging={draggingId === task.id}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Activity sidebar */}
      <div
        className="w-[280px] flex-shrink-0 border-l overflow-y-auto p-4"
        style={{ borderColor: "var(--border-color)", background: "rgba(0,0,0,0.15)" }}
      >
        <h2 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4">
          Live Activity
        </h2>

        <div className="space-y-4">
          {recentActivity.map((event) => {
            // Try to extract agent name from the message
            const agentMatch = mockAgents.find((a) =>
              event.message.includes(a.name)
            );
            const agentName = agentMatch?.name ?? "System";
            const nameColor = AGENT_ACTIVITY_COLORS[agentName] ?? "text-[var(--text-secondary)]";

            return (
              <div key={event.id} className="flex gap-2.5">
                <div className="flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[var(--text-muted)]">
                    <path d="M2 7h3l2-4 2 8 2-4h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[12px] font-semibold ${nameColor}`}>
                    {agentName}
                  </span>
                  {event.timestamp && (
                    <span className="text-[10px] text-[var(--text-muted)] ml-2">
                      {relativeTime(event.timestamp)}
                    </span>
                  )}
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-0.5 line-clamp-2">
                    {event.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
