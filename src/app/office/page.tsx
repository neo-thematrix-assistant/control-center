"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { mockAgents, mockActivity } from "@/lib/mock-data";

// -- Types --

interface Pos {
  x: number;
  y: number;
}

interface OfficeAgent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  status: "online" | "busy" | "idle" | "offline";
  task?: string;
  pos: Pos;
  target: Pos;
  home: Pos;
}

// -- Constants --

const TILE = 48;
const COLS = 20;
const ROWS = 12;
const MAP_W = COLS * TILE;
const MAP_H = ROWS * TILE;

const AGENT_DEFS: {
  id: string;
  name: string;
  emoji: string;
  color: string;
  home: Pos;
}[] = [
  { id: "henry", name: "Henry", emoji: "\uD83D\uDC51", color: "#8b5cf6", home: { x: 13, y: 2 } },
  { id: "alex", name: "Alex", emoji: "\uD83D\uDC7E", color: "#6366f1", home: { x: 3, y: 3 } },
  { id: "scout", name: "Scout", emoji: "\uD83D\uDD2D", color: "#94a3b8", home: { x: 11, y: 5 } },
  { id: "quill", name: "Quill", emoji: "\u270D\uFE0F", color: "#eab308", home: { x: 4, y: 6 } },
  { id: "echo", name: "Echo", emoji: "\uD83D\uDCE3", color: "#64748b", home: { x: 7, y: 6 } },
  { id: "violet", name: "Violet", emoji: "\uD83D\uDC9C", color: "#a855f7", home: { x: 9, y: 6 } },
  { id: "codex", name: "Codex", emoji: "\uD83D\uDCBB", color: "#f97316", home: { x: 14, y: 6 } },
  { id: "charlie", name: "Charlie", emoji: "\u2699\uFE0F", color: "#22c55e", home: { x: 8, y: 8 } },
  { id: "ralph", name: "Ralph", emoji: "\uD83D\uDD28", color: "#64748b", home: { x: 6, y: 9 } },
  { id: "pixel", name: "Pixel", emoji: "\uD83C\uDFA8", color: "#ec4899", home: { x: 15, y: 9 } },
];

// Furniture positions
const DESKS: { x: number; y: number; w: number }[] = [
  { x: 2, y: 1, w: 2 },
  { x: 6, y: 1, w: 2 },
  { x: 10, y: 1, w: 2 },
  { x: 14, y: 1, w: 2 },
  { x: 2, y: 4, w: 2 },
  { x: 6, y: 4, w: 2 },
  { x: 10, y: 4, w: 2 },
  { x: 14, y: 4, w: 2 },
];

const MONITORS: Pos[] = [
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 7, y: 1 },
  { x: 10, y: 1 },
  { x: 14, y: 1 },
  { x: 15, y: 1 },
];

const PLANTS: Pos[] = [
  { x: 0, y: 10 },
  { x: 1, y: 10 },
  { x: 17, y: 9 },
  { x: 19, y: 5 },
];

const CONF_TABLE = { x: 8, y: 7, w: 4, h: 2 };

// -- Helpers --

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// -- Components --

function Tile({ x, y }: { x: number; y: number }) {
  const isDark = (x + y) % 2 === 0;
  return (
    <div
      className="absolute"
      style={{
        left: x * TILE,
        top: y * TILE,
        width: TILE,
        height: TILE,
        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
      }}
    />
  );
}

function Desk({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <div
      className="absolute rounded-sm"
      style={{
        left: x * TILE + 4,
        top: y * TILE + TILE - 14,
        width: w * TILE - 8,
        height: 14,
        background: "rgba(120,113,108,0.5)",
        border: "1px solid rgba(120,113,108,0.3)",
      }}
    />
  );
}

function Monitor({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute rounded-sm"
      style={{
        left: x * TILE + 10,
        top: y * TILE + 4,
        width: TILE - 20,
        height: TILE - 20,
        background: "rgba(59,130,246,0.6)",
        border: "1px solid rgba(59,130,246,0.4)",
        boxShadow: "0 0 8px rgba(59,130,246,0.3)",
      }}
    />
  );
}

function Plant({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute" style={{ left: x * TILE + 8, top: y * TILE }}>
      <div
        className="rounded-full"
        style={{
          width: TILE - 16,
          height: TILE - 16,
          background: "rgba(34,197,94,0.6)",
          border: "2px solid rgba(34,197,94,0.3)",
          boxShadow: "0 0 10px rgba(34,197,94,0.2)",
        }}
      />
      <div
        style={{
          width: 4,
          height: 12,
          background: "rgba(120,80,40,0.6)",
          margin: "-4px auto 0",
          borderRadius: 2,
        }}
      />
    </div>
  );
}

function ConfTable() {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: CONF_TABLE.x * TILE,
        top: CONF_TABLE.y * TILE + 4,
        width: CONF_TABLE.w * TILE,
        height: CONF_TABLE.h * TILE - 8,
        background: "rgba(148,163,184,0.15)",
        border: "1px solid rgba(148,163,184,0.1)",
      }}
    />
  );
}

function AgentSprite({
  agent,
  selected,
  onClick,
}: {
  agent: OfficeAgent;
  selected: boolean;
  onClick: () => void;
}) {
  const isActive = agent.status === "online" || agent.status === "busy";
  const bobClass = isActive ? "agent-bob" : "";

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-1000 ease-in-out ${bobClass}`}
      style={{
        left: agent.pos.x * TILE + TILE / 2 - 14,
        top: agent.pos.y * TILE + TILE / 2 - 20,
        zIndex: Math.floor(agent.pos.y) + 10,
      }}
      onClick={onClick}
    >
      {/* Task tooltip */}
      {agent.task && isActive && (
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[9px] font-medium"
          style={{
            background: "rgba(0,0,0,0.85)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#e2e8f0",
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {agent.task}
        </div>
      )}

      {/* Body */}
      <div
        className="relative rounded-lg flex items-center justify-center"
        style={{
          width: 28,
          height: 28,
          background: agent.color,
          border: selected
            ? "2px solid #fff"
            : `2px solid ${agent.color}`,
          boxShadow: isActive
            ? `0 0 12px ${agent.color}60, 0 2px 4px rgba(0,0,0,0.4)`
            : "0 2px 4px rgba(0,0,0,0.4)",
          opacity: agent.status === "offline" ? 0.4 : 1,
        }}
      >
        <span style={{ fontSize: 14, lineHeight: 1 }}>{agent.emoji}</span>

        {/* Status indicator */}
        <div
          className="absolute -bottom-0.5 -right-0.5 rounded-full"
          style={{
            width: 8,
            height: 8,
            background:
              agent.status === "online"
                ? "#22c55e"
                : agent.status === "busy"
                ? "#f59e0b"
                : agent.status === "idle"
                ? "#3b82f6"
                : "#6b7280",
            border: "2px solid rgba(15,15,20,1)",
            boxShadow:
              agent.status === "online"
                ? "0 0 6px rgba(34,197,94,0.7)"
                : agent.status === "busy"
                ? "0 0 6px rgba(245,158,11,0.7)"
                : "none",
          }}
        />
      </div>

      {/* Name */}
      <div
        className="text-center mt-1"
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: agent.status === "offline" ? "rgba(255,255,255,0.3)" : agent.color,
          textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          letterSpacing: "0.02em",
        }}
      >
        {agent.name}
      </div>
    </div>
  );
}

function AgentStatusCard({
  agent,
  selected,
  onClick,
}: {
  agent: OfficeAgent;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-all text-left"
      style={{
        background: selected
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${
          selected ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"
        }`,
        minWidth: 150,
      }}
    >
      <span style={{ fontSize: 18 }}>{agent.emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-semibold text-[var(--text-primary)] truncate">
          {agent.name}
        </div>
        <div className="text-[10px] text-[var(--text-muted)] truncate">
          {agent.task ? agent.task : "Click for memory"}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <div
            className="rounded-full"
            style={{
              width: 5,
              height: 5,
              background:
                agent.status === "online"
                  ? "#22c55e"
                  : agent.status === "busy"
                  ? "#f59e0b"
                  : agent.status === "idle"
                  ? "#3b82f6"
                  : "#6b7280",
            }}
          />
          <span className="text-[9px] text-[var(--text-muted)]">
            {agent.task || "Idle"}
          </span>
        </div>
      </div>
    </button>
  );
}

// -- Main Page --

export default function OfficePage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agents, setAgents] = useState<OfficeAgent[]>(() =>
    AGENT_DEFS.map((def) => {
      const mock = mockAgents.find(
        (a) => a.name.toLowerCase() === def.name.toLowerCase()
      );
      return {
        ...def,
        status: mock?.status ?? "idle",
        task: mock?.currentTask,
        pos: { ...def.home },
        target: { ...def.home },
      };
    })
  );

  const animFrame = useRef<number>(0);

  // Random movement for active agents
  const moveAgents = useCallback(() => {
    setAgents((prev) =>
      prev.map((agent) => {
        // Only move active agents
        if (agent.status === "offline") return agent;

        const dx = agent.target.x - agent.pos.x;
        const dy = agent.target.y - agent.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If close to target, pick new target
        if (dist < 0.1) {
          const isActive =
            agent.status === "online" || agent.status === "busy";
          // Active agents wander more, idle agents stay near home
          const range = isActive ? 3 : 1;
          return {
            ...agent,
            pos: { ...agent.target },
            target: {
              x: Math.max(
                1,
                Math.min(
                  COLS - 2,
                  agent.home.x + (Math.random() - 0.5) * range * 2
                )
              ),
              y: Math.max(
                1,
                Math.min(
                  ROWS - 2,
                  agent.home.y + (Math.random() - 0.5) * range * 2
                )
              ),
            },
          };
        }

        // Move toward target
        const speed = 0.03;
        return {
          ...agent,
          pos: {
            x: lerp(agent.pos.x, agent.target.x, speed),
            y: lerp(agent.pos.y, agent.target.y, speed),
          },
        };
      })
    );

    animFrame.current = requestAnimationFrame(moveAgents);
  }, []);

  useEffect(() => {
    animFrame.current = requestAnimationFrame(moveAgents);
    return () => cancelAnimationFrame(animFrame.current);
  }, [moveAgents]);

  // Activity feed
  const recentActivity = mockActivity.slice(0, 5);

  return (
    <div
      className="flex flex-col min-h-[calc(100vh-56px)]"
      style={{
        marginLeft: "-24px",
        marginRight: "-24px",
        marginTop: "-24px",
        marginBottom: "-24px",
      }}
    >
      {/* Main area: Map + Activity sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Office Map */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "rgba(15,15,20,1)" }}>
          <div
            className="relative mx-auto"
            style={{
              width: MAP_W,
              height: MAP_H,
              marginTop: 16,
            }}
          >
            {/* Checkerboard floor */}
            {Array.from({ length: ROWS }, (_, y) =>
              Array.from({ length: COLS }, (_, x) => (
                <Tile key={`${x}-${y}`} x={x} y={y} />
              ))
            )}

            {/* Furniture */}
            {DESKS.map((d, i) => (
              <Desk key={`desk-${i}`} x={d.x} y={d.y} w={d.w} />
            ))}
            {MONITORS.map((m, i) => (
              <Monitor key={`mon-${i}`} x={m.x} y={m.y} />
            ))}
            {PLANTS.map((p, i) => (
              <Plant key={`plant-${i}`} x={p.x} y={p.y} />
            ))}
            <ConfTable />

            {/* Agents */}
            {agents.map((agent) => (
              <AgentSprite
                key={agent.id}
                agent={agent}
                selected={selectedAgent === agent.id}
                onClick={() =>
                  setSelectedAgent(
                    selectedAgent === agent.id ? null : agent.id
                  )
                }
              />
            ))}

            {/* Task banner for selected or active task */}
            {(() => {
              const activeTask = agents.find(
                (a) => a.task && (a.status === "online" || a.status === "busy")
              );
              if (!activeTask) return null;
              return (
                <div
                  className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg z-50"
                  style={{
                    background: "rgba(0,0,0,0.85)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <span className="text-[12px] font-medium text-[var(--text-primary)]">
                    {activeTask.task}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right sidebar - Activity */}
        <div
          className="w-[240px] flex-shrink-0 flex flex-col p-4"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium mb-3">
            Recent Activity
          </div>
          {recentActivity.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[var(--text-muted)] opacity-40"
              >
                <path
                  d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 15l-5-5h10l-5 5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <p className="text-[11px] text-[var(--text-muted)]">
                No recent activity
              </p>
              <p className="text-[10px] text-[var(--text-muted)] opacity-60">
                Events will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto flex-1">
              {recentActivity.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg p-2.5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{
                        background:
                          event.severity === "success"
                            ? "#22c55e"
                            : event.severity === "warning"
                            ? "#f59e0b"
                            : event.severity === "error"
                            ? "#ef4444"
                            : "#3b82f6",
                      }}
                    />
                    <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                      {event.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom agent status bar */}
      <div
        className="flex-shrink-0 overflow-x-auto"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div className="flex gap-2 p-3 min-w-max">
          {agents.map((agent) => (
            <AgentStatusCard
              key={agent.id}
              agent={agent}
              selected={selectedAgent === agent.id}
              onClick={() =>
                setSelectedAgent(
                  selectedAgent === agent.id ? null : agent.id
                )
              }
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes agent-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .agent-bob {
          animation: agent-bob 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
