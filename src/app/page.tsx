"use client";

import { mockGateway, mockSessions, mockAgents, mockTasks, mockActivity } from "@/lib/mock-data";

// ── helpers ──────────────────────────────────────────────────────────────────

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffS = Math.floor(diffMs / 1000);
  if (diffS < 60) return "just now";
  const diffM = Math.floor(diffS / 60);
  if (diffM < 60) return `${diffM}m ago`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

function modelShort(model: string): string {
  if (model.includes("opus")) return "Opus";
  if (model.includes("sonnet")) return "Sonnet";
  if (model.includes("haiku")) return "Haiku";
  return model.split("-")[0];
}

// ── activity icons ───────────────────────────────────────────────────────────

const ACTIVITY_ICONS: Record<string, { icon: string; color: string }> = {
  session: { icon: "\u2B21", color: "text-blue-400" },
  task:    { icon: "\u25C8", color: "text-amber-400" },
  agent:   { icon: "\u25CE", color: "text-green-400" },
  system:  { icon: "\u2B1F", color: "text-cyan-400" },
  cron:    { icon: "\u25F7", color: "text-purple-400" },
};

const SEVERITY_DOT: Record<string, string> = {
  success: "bg-green-400",
  warning: "bg-amber-400",
  error:   "bg-red-400",
  info:    "bg-blue-400/50",
};

// ── priority dot colors ──────────────────────────────────────────────────────

const PRIORITY_DOT: Record<string, string> = {
  critical: "bg-red-500",
  high:     "bg-amber-500",
  medium:   "bg-blue-400",
  low:      "bg-gray-400",
};

// ── derived data ─────────────────────────────────────────────────────────────

const activeSessions = mockSessions.filter((s) => s.status === "active").length;
const activeAgents = mockAgents.filter((a) => a.status === "online" || a.status === "busy").length;
const gatewayUptime = formatUptime(mockGateway.uptime);

const recentTasks = [...mockTasks]
  .filter((t) => t.status !== "done")
  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  .slice(0, 6);

// ── card style constant ──────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "12px",
};

const rowStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "8px",
};

// ── page ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  return (
    <div
      className="min-h-[calc(100vh-56px)]"
      style={{ marginLeft: "-24px", marginRight: "-24px", marginTop: "-24px", marginBottom: "-24px", padding: "24px" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(99,102,241,0.15)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-indigo-400">
            <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Mission Overview
          </h1>
          <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
            {activeSessions} active sessions
            <span className="mx-1.5 opacity-40">&middot;</span>
            {activeAgents} agents online
            <span className="mx-1.5 opacity-40">&middot;</span>
            {mockGateway.memoryUsage}% memory
            <span className="mx-1.5 opacity-40">&middot;</span>
            up {gatewayUptime}
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Left column ~60% */}
        <div className="flex flex-col gap-5 lg:w-[60%]">

          {/* Active Sessions */}
          <div className="p-4" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Active Sessions
              </h2>
              <span className="text-[11px] text-[var(--text-muted)]">
                {mockSessions.length} total
              </span>
            </div>

            <div className="space-y-2">
              {mockSessions.map((session) => {
                const statusColor =
                  session.status === "active" ? "bg-green-400" :
                  session.status === "idle" ? "bg-amber-400" : "bg-gray-400";

                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 px-3 py-2.5 transition-all hover:brightness-110"
                    style={rowStyle}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor}`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                          {session.name}
                        </span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-mono flex-shrink-0"
                          style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}
                        >
                          {modelShort(session.model)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[12px] font-medium tabular-nums text-[var(--text-secondary)]">
                        {session.messageCount}
                        <span className="text-[10px] text-[var(--text-muted)] ml-0.5">msgs</span>
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {relativeTime(session.lastActivity)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="p-4" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Recent Tasks
              </h2>
              <span className="text-[11px] text-[var(--text-muted)]">
                {recentTasks.length} pending
              </span>
            </div>

            <div className="space-y-2">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-3 py-2.5 transition-all hover:brightness-110"
                  style={rowStyle}
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority] ?? "bg-gray-400"}`}
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-medium text-[var(--text-primary)] truncate block">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {task.assignee && (
                        <span className="text-[11px] text-[var(--text-muted)]">
                          {task.assignee}
                        </span>
                      )}
                      {task.assignee && task.project && (
                        <span className="text-[var(--text-muted)] opacity-40">&middot;</span>
                      )}
                      {task.project && (
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
                        >
                          {task.project}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0">
                    {relativeTime(task.updatedAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column ~40% */}
        <div className="flex flex-col gap-5 lg:w-[40%]">

          {/* Gateway Health */}
          <div className="p-4" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Gateway Health
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] text-green-400 font-medium">Online</span>
              </div>
            </div>

            {/* Status row */}
            <div
              className="flex items-center gap-3 px-3 py-2.5 mb-3"
              style={rowStyle}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[var(--text-primary)]">
                  OpenClaw Gateway
                </p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  v{mockGateway.version}
                  <span className="mx-1.5 opacity-40">&middot;</span>
                  up {gatewayUptime}
                </p>
              </div>
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: "Active", value: mockGateway.activeSessions },
                { label: "Total", value: mockGateway.totalSessions },
                { label: "Cron Jobs", value: mockGateway.cronJobs },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="px-2.5 py-2 text-center"
                  style={rowStyle}
                >
                  <p className="text-[16px] font-bold text-[var(--text-primary)]">{stat.value}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Memory bar */}
            {mockGateway.memoryUsage !== undefined && (
              <div>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-[var(--text-muted)]">Memory Usage</span>
                  <span
                    style={{
                      color: mockGateway.memoryUsage > 80
                        ? "#f87171"
                        : mockGateway.memoryUsage > 60
                        ? "#fbbf24"
                        : "#4ade80",
                    }}
                  >
                    {mockGateway.memoryUsage}%
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-1.5"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${mockGateway.memoryUsage}%`,
                      background: mockGateway.memoryUsage > 80
                        ? "#f87171"
                        : mockGateway.memoryUsage > 60
                        ? "#fbbf24"
                        : "#4ade80",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Activity Stream */}
          <div className="p-4 flex-1" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Activity Stream
              </h2>
              <span className="text-[11px] text-[var(--text-muted)]">
                {mockActivity.length} events
              </span>
            </div>

            <div className="space-y-1.5">
              {mockActivity.map((event) => {
                const ai = ACTIVITY_ICONS[event.type] ?? ACTIVITY_ICONS.system;
                const dotCls = SEVERITY_DOT[event.severity ?? "info"] ?? SEVERITY_DOT.info;

                return (
                  <div
                    key={event.id}
                    className="flex gap-2.5 px-2.5 py-2 transition-all hover:brightness-110"
                    style={rowStyle}
                  >
                    <span className={`text-[14px] leading-none mt-px flex-shrink-0 ${ai.color}`} aria-hidden="true">
                      {ai.icon}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] leading-snug text-[var(--text-secondary)]">
                        {event.message}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {relativeTime(event.timestamp)}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] opacity-60">
                          {event.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 mt-1.5">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotCls}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
