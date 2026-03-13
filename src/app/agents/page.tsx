"use client";

import { useState, useMemo } from "react";
import { mockAgents } from "@/lib/mock-data";
import type { Agent } from "@/lib/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const AVATAR_GRADIENTS = [
  "from-blue-500 to-cyan-400",
  "from-violet-500 to-purple-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-rose-500 to-pink-400",
  "from-sky-500 to-indigo-400",
];

function avatarGradient(index: number): string {
  return AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
}

function modelLabel(model: string): string {
  if (model.includes("opus")) return "Opus";
  if (model.includes("sonnet")) return "Sonnet";
  if (model.includes("haiku")) return "Haiku";
  return model.split("-")[0];
}

function modelVersion(model: string): string {
  const match = model.match(/(\d+(?:\.\d+)?)/);
  return match ? match[1] : "";
}

function healthDot(health: Agent["health"]): string {
  switch (health) {
    case "healthy":
      return "bg-green-400 shadow-[0_0_6px_#4ade80]";
    case "degraded":
      return "bg-amber-400 shadow-[0_0_6px_#fbbf24]";
    case "unhealthy":
      return "bg-red-400 shadow-[0_0_6px_#f87171]";
    default:
      return "bg-gray-400";
  }
}

function statusColor(status: Agent["status"]): string {
  switch (status) {
    case "online":
      return "bg-green-400 shadow-[0_0_6px_#4ade80]";
    case "busy":
      return "bg-amber-400 shadow-[0_0_6px_#fbbf24]";
    case "idle":
      return "bg-blue-400 shadow-[0_0_6px_#60a5fa]";
    case "offline":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
}

// ─── Agent Card ─────────────────────────────────────────────────────────────

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const grad = avatarGradient(index);
  const mLabel = modelLabel(agent.model);
  const mVersion = modelVersion(agent.model);

  return (
    <div
      className="rounded-lg p-5 flex flex-col gap-4 transition hover:brightness-110"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Top row: avatar + name/role + status */}
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-[13px] font-bold shadow-lg`}
        >
          {getInitials(agent.name)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold leading-tight truncate text-[var(--text-primary)]">
            {agent.name}
          </p>
          <p className="text-[12px] mt-0.5 truncate text-[var(--text-muted)]">
            {agent.role}
          </p>
        </div>

        {/* Inline status indicator */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor(agent.status)}`} />
          <span className="text-[11px] capitalize text-[var(--text-secondary)]">
            {agent.status}
          </span>
        </div>
      </div>

      {/* Model pill + health */}
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border"
          style={{
            background: "rgba(59,130,246,0.1)",
            borderColor: "rgba(59,130,246,0.25)",
            color: "var(--accent-blue)",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          {mLabel} {mVersion}
        </span>

        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${healthDot(agent.health)}`} />
          <span className="text-[10px] capitalize text-[var(--text-muted)]">
            {agent.health}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

      {/* Details */}
      <div className="flex flex-col gap-2 text-[12px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[var(--text-muted)]">Session</span>
          {agent.sessionId ? (
            <a
              href={`/sessions#${agent.sessionId}`}
              className="font-mono text-[11px] hover:underline truncate"
              style={{ color: "var(--accent-blue)" }}
            >
              {agent.sessionId}
            </a>
          ) : (
            <span className="italic text-[var(--text-muted)]">none</span>
          )}
        </div>

        <div className="flex items-start justify-between gap-2">
          <span className="flex-shrink-0 text-[var(--text-muted)]">Task</span>
          {agent.currentTask ? (
            <span className="text-right leading-tight truncate text-[var(--text-primary)]">
              {agent.currentTask}
            </span>
          ) : (
            <span className="italic text-[var(--text-muted)]">idle</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[var(--text-muted)]">Last seen</span>
          <span className="text-[var(--text-secondary)]">{relativeTime(agent.lastSeen)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Table View ─────────────────────────────────────────────────────────────

function AgentTable({ agents }: { agents: Agent[] }) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr
              className="text-left text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Health</th>
              <th className="px-4 py-3 font-medium">Session</th>
              <th className="px-4 py-3 font-medium">Last Seen</th>
              <th className="px-4 py-3 font-medium">Current Task</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, index) => {
              const grad = avatarGradient(index);
              return (
                <tr
                  key={agent.id}
                  className="transition hover:brightness-110"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}
                      >
                        {getInitials(agent.name)}
                      </div>
                      <span className="text-[13px] font-medium text-[var(--text-primary)]">
                        {agent.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)]">
                    {agent.role}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor(agent.status)}`} />
                      <span className="text-[12px] capitalize text-[var(--text-secondary)]">
                        {agent.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium border"
                      style={{
                        background: "rgba(59,130,246,0.1)",
                        borderColor: "rgba(59,130,246,0.25)",
                        color: "var(--accent-blue)",
                      }}
                    >
                      {modelLabel(agent.model)} {modelVersion(agent.model)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${healthDot(agent.health)}`} />
                      <span className="text-[12px] capitalize text-[var(--text-secondary)]">
                        {agent.health}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {agent.sessionId ? (
                      <a
                        href={`/sessions#${agent.sessionId}`}
                        className="font-mono text-[11px] hover:underline"
                        style={{ color: "var(--accent-blue)" }}
                      >
                        {agent.sessionId}
                      </a>
                    ) : (
                      <span className="italic text-[12px] text-[var(--text-muted)]">--</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-[12px] tabular-nums text-[var(--text-secondary)]">
                    {relativeTime(agent.lastSeen)}
                  </td>

                  <td className="px-4 py-3 text-[12px] max-w-[200px]">
                    {agent.currentTask ? (
                      <span className="truncate block text-[var(--text-primary)]">{agent.currentTask}</span>
                    ) : (
                      <span className="italic text-[var(--text-muted)]">--</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AgentsPage() {
  const [view, setView] = useState<"card" | "table">("card");

  const stats = useMemo(() => {
    const total = mockAgents.length;
    const online = mockAgents.filter((a) => a.status === "online").length;
    const busy = mockAgents.filter((a) => a.status === "busy").length;
    const idle = mockAgents.filter((a) => a.status === "idle").length;
    return { total, online, busy, idle };
  }, []);

  return (
    <div
      className="flex flex-col gap-6 min-h-screen"
      style={{
        marginLeft: "-24px",
        marginRight: "-24px",
        marginTop: "-24px",
        marginBottom: "-24px",
        padding: "24px",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {/* Agents icon */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-secondary)]">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>

          <div>
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">Agents</h1>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
              {stats.total} total &middot; {stats.online} online &middot; {stats.busy} busy &middot; {stats.idle} idle
            </p>
          </div>
        </div>

        {/* View toggle */}
        <div
          className="flex items-center rounded-lg p-0.5 gap-0.5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={() => setView("card")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition"
            style={
              view === "card"
                ? { background: "rgba(255,255,255,0.08)", color: "var(--text-primary)" }
                : { color: "var(--text-muted)" }
            }
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Cards
          </button>
          <button
            onClick={() => setView("table")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition"
            style={
              view === "table"
                ? { background: "rgba(255,255,255,0.08)", color: "var(--text-primary)" }
                : { color: "var(--text-muted)" }
            }
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            Table
          </button>
        </div>
      </div>

      {/* Content */}
      {view === "card" ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {mockAgents.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} index={index} />
          ))}
        </div>
      ) : (
        <AgentTable agents={mockAgents} />
      )}
    </div>
  );
}
