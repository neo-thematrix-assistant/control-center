"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import AgentPanel from "@/components/AgentPanel";
import type { Agent } from "@/lib/types";

// ─── Agent visual data (mirrors office pixel sprites) ────────────────────────

const AGENT_VISUALS: Record<
  string,
  { emoji: string; color: string; skinColor: string; hairColor: string; shirtColor: string }
> = {
  henry: { emoji: "\uD83D\uDC51", color: "#8b5cf6", skinColor: "#f0c8a0", hairColor: "#4a3728", shirtColor: "#8b5cf6" },
  alex: { emoji: "\uD83D\uDC7E", color: "#6366f1", skinColor: "#d4a574", hairColor: "#1a1a2e", shirtColor: "#6366f1" },
  scout: { emoji: "\uD83D\uDD2D", color: "#94a3b8", skinColor: "#f0c8a0", hairColor: "#8b6c47", shirtColor: "#64748b" },
  quill: { emoji: "\u270D\uFE0F", color: "#eab308", skinColor: "#c68642", hairColor: "#2d1b00", shirtColor: "#ca8a04" },
  echo: { emoji: "\uD83D\uDCE3", color: "#64748b", skinColor: "#f0c8a0", hairColor: "#3d2b1f", shirtColor: "#475569" },
  violet: { emoji: "\uD83D\uDC9C", color: "#a855f7", skinColor: "#e8b88a", hairColor: "#6b21a8", shirtColor: "#9333ea" },
  codex: { emoji: "\uD83D\uDCBB", color: "#f97316", skinColor: "#f0c8a0", hairColor: "#1c1c1c", shirtColor: "#ea580c" },
  charlie: { emoji: "\u2699\uFE0F", color: "#22c55e", skinColor: "#d4a574", hairColor: "#2d1b00", shirtColor: "#16a34a" },
  ralph: { emoji: "\uD83D\uDD28", color: "#64748b", skinColor: "#f0c8a0", hairColor: "#5c4033", shirtColor: "#57534e" },
  pixel: { emoji: "\uD83C\uDFA8", color: "#ec4899", skinColor: "#e8b88a", hairColor: "#ec4899", shirtColor: "#db2777" },
};

function getVisuals(name: string) {
  const key = name.toLowerCase();
  return AGENT_VISUALS[key] ?? { emoji: "\uD83E\uDD16", color: "#6366f1", skinColor: "#f0c8a0", hairColor: "#1a1a2e", shirtColor: "#6366f1" };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function statusDotStyle(status: Agent["status"]): React.CSSProperties {
  const colors: Record<string, string> = {
    online: "#22c55e",
    busy: "#f59e0b",
    idle: "#3b82f6",
    offline: "#6b7280",
  };
  const c = colors[status] ?? "#6b7280";
  return {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: c,
    boxShadow: status === "online" ? `0 0 6px ${c}` : status === "busy" ? `0 0 6px ${c}` : "none",
    flexShrink: 0,
  };
}

function healthDotStyle(health: Agent["health"]): React.CSSProperties {
  const colors: Record<string, string> = {
    healthy: "#22c55e",
    degraded: "#f59e0b",
    unhealthy: "#ef4444",
  };
  const c = colors[health] ?? "#6b7280";
  return {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: c,
    boxShadow: `0 0 4px ${c}80`,
    flexShrink: 0,
  };
}

// ─── Pixel Sprite Avatar ─────────────────────────────────────────────────────

function PixelAvatar({ name, size = 48 }: { name: string; size?: number }) {
  const v = getVisuals(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Hair */}
      <rect x="5" y="1" width="6" height="3" fill={v.hairColor} />
      <rect x="4" y="2" width="1" height="2" fill={v.hairColor} />
      <rect x="11" y="2" width="1" height="2" fill={v.hairColor} />
      {/* Face */}
      <rect x="5" y="3" width="6" height="4" fill={v.skinColor} />
      <rect x="4" y="4" width="1" height="2" fill={v.skinColor} />
      <rect x="11" y="4" width="1" height="2" fill={v.skinColor} />
      {/* Eyes */}
      <rect x="6" y="4" width="1" height="1" fill="#1a1a2e" />
      <rect x="9" y="4" width="1" height="1" fill="#1a1a2e" />
      {/* Body */}
      <rect x="4" y="7" width="8" height="5" fill={v.shirtColor} rx="1" />
      <rect x="3" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
      <rect x="11" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
      {/* Hands */}
      <rect x="3" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
      <rect x="11" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
      {/* Legs */}
      <rect x="5" y="12" width="2" height="3" fill="#374151" />
      <rect x="9" y="12" width="2" height="3" fill="#374151" />
      {/* Shoes */}
      <rect x="4" y="14" width="3" height="1" fill="#1e293b" rx="0.5" />
      <rect x="9" y="14" width="3" height="1" fill="#1e293b" rx="0.5" />
    </svg>
  );
}

// ─── Agent Card ─────────────────────────────────────────────────────────────

function AgentCard({ agent, onClick }: { agent: Agent; onClick: () => void }) {
  const v = getVisuals(agent.name);
  const mLabel = modelLabel(agent.model);
  const mVersion = modelVersion(agent.model);

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 transition-all cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${v.color}15`,
        boxShadow: agent.status === "online" || agent.status === "busy" ? `0 0 20px ${v.color}08` : "none",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${v.color}30`;
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${v.color}15`;
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
    >
      {/* Top row: pixel avatar + name/role + status */}
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 rounded-lg flex items-center justify-center"
          style={{
            width: 52,
            height: 52,
            background: `linear-gradient(135deg, ${v.color}15, ${v.color}08)`,
            border: `1px solid ${v.color}20`,
          }}
        >
          <PixelAvatar name={agent.name} size={40} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-semibold leading-tight truncate text-[var(--text-primary)]">
              {agent.name}
            </p>
            <span style={{ fontSize: 14 }}>{v.emoji}</span>
          </div>
          <p className="text-[12px] mt-0.5 truncate text-[var(--text-muted)]">
            {agent.role}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div style={statusDotStyle(agent.status)} />
          <span className="text-[11px] capitalize text-[var(--text-secondary)]">
            {agent.status}
          </span>
        </div>
      </div>

      {/* Model + health row */}
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium"
          style={{
            background: `${v.color}12`,
            border: `1px solid ${v.color}25`,
            color: v.color,
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
          <div style={healthDotStyle(agent.health)} />
          <span className="text-[10px] capitalize text-[var(--text-muted)]">
            {agent.health}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: `${v.color}10` }} />

      {/* Details */}
      <div className="flex flex-col gap-2.5 text-[12px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[var(--text-muted)]">Session</span>
          {agent.sessionId ? (
            <span
              className="font-mono text-[11px] truncate"
              style={{ color: v.color }}
            >
              {agent.sessionId}
            </span>
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
      className="rounded-xl overflow-hidden"
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
              <th className="px-4 py-3 font-medium">Agent</th>
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
            {agents.map((agent) => {
              const v = getVisuals(agent.name);
              return (
                <tr
                  key={agent.id}
                  className="transition hover:brightness-110"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-shrink-0 rounded-md flex items-center justify-center"
                        style={{
                          width: 32,
                          height: 32,
                          background: `${v.color}15`,
                          border: `1px solid ${v.color}20`,
                        }}
                      >
                        <PixelAvatar name={agent.name} size={24} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-medium text-[var(--text-primary)]">
                          {agent.name}
                        </span>
                        <span style={{ fontSize: 12 }}>{v.emoji}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)]">
                    {agent.role}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div style={statusDotStyle(agent.status)} />
                      <span className="text-[12px] capitalize text-[var(--text-secondary)]">
                        {agent.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                      style={{
                        background: `${v.color}12`,
                        border: `1px solid ${v.color}25`,
                        color: v.color,
                      }}
                    >
                      {modelLabel(agent.model)} {modelVersion(agent.model)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div style={healthDotStyle(agent.health)} />
                      <span className="text-[12px] capitalize text-[var(--text-secondary)]">
                        {agent.health}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {agent.sessionId ? (
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: v.color }}
                      >
                        {agent.sessionId}
                      </span>
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
  const store = useStore();
  const agents = store.agents;
  const [view, setView] = useState<"card" | "table">("card");
  const [panelAgentId, setPanelAgentId] = useState<string | null>(null);

  const panelAgent = panelAgentId ? agents.find((a) => a.id === panelAgentId) ?? null : null;

  const stats = useMemo(() => {
    const total = agents.length;
    const online = agents.filter((a) => a.status === "online").length;
    const busy = agents.filter((a) => a.status === "busy").length;
    const idle = agents.filter((a) => a.status === "idle").length;
    return { total, online, busy, idle };
  }, [agents]);

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
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
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
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onClick={() => setPanelAgentId(agent.id)} />
          ))}
        </div>
      ) : (
        <AgentTable agents={agents} />
      )}

      {/* Agent Detail Panel */}
      {panelAgent && (
        <AgentPanel agent={panelAgent} onClose={() => setPanelAgentId(null)} />
      )}
    </div>
  );
}
