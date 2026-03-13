"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import PixelAvatar, { getVisuals } from "@/components/PixelAvatar";
import AgentPanel from "@/components/AgentPanel";

// -- Team Data --

interface TeamMember {
  agentId: string;
  name: string;
  role: string;
  badge?: string;
  description: string;
  tags: { label: string; color: string }[];
}

const TEAM: Record<string, TeamMember> = {
  "a-001": {
    agentId: "a-001",
    name: "Henry",
    role: "Chief of Staff",
    badge: "The Interface",
    description:
      "Coordinates, delegates, keeps the ship tight. The first point of contact between boss and machine.",
    tags: [
      { label: "Orchestration", color: "#f87171" },
      { label: "Clarity", color: "#f87171" },
      { label: "Delegation", color: "#f87171" },
    ],
  },
  "a-002": {
    agentId: "a-002",
    name: "Alex",
    role: "Strategy Analyst",
    badge: "The Strategist",
    description:
      "Analyzes data, reviews code, and crafts strategic recommendations. The brain behind every key decision.",
    tags: [
      { label: "Strategy", color: "#818cf8" },
      { label: "Code Review", color: "#818cf8" },
      { label: "Analysis", color: "#818cf8" },
    ],
  },
  "a-003": {
    agentId: "a-003",
    name: "Scout",
    role: "Trend Analyst",
    description:
      "Finds leads, tracks signals, scouts emerging trends across the internet.",
    tags: [
      { label: "Research", color: "#94a3b8" },
      { label: "Trends", color: "#94a3b8" },
      { label: "Signals", color: "#94a3b8" },
    ],
  },
  "a-004": {
    agentId: "a-004",
    name: "Quill",
    role: "Content Writer",
    description:
      "Writes copy, designs content, drafts newsletters and scripts. Every word, carefully chosen.",
    tags: [
      { label: "Writing", color: "#facc15" },
      { label: "Content", color: "#facc15" },
      { label: "Newsletters", color: "#facc15" },
    ],
  },
  "a-005": {
    agentId: "a-005",
    name: "Echo",
    role: "Social Media Manager",
    description:
      "Posts, engages, manages social presence across all platforms. The voice of the brand.",
    tags: [
      { label: "Social Media", color: "#94a3b8" },
      { label: "Engagement", color: "#94a3b8" },
      { label: "Distribution", color: "#94a3b8" },
    ],
  },
  "a-006": {
    agentId: "a-006",
    name: "Violet",
    role: "Brand Designer",
    badge: "The Creative",
    description:
      "Designs brand assets, creates visual identities, and ensures every pixel tells the right story.",
    tags: [
      { label: "Design", color: "#c084fc" },
      { label: "Branding", color: "#c084fc" },
      { label: "Visual Identity", color: "#c084fc" },
    ],
  },
  "a-007": {
    agentId: "a-007",
    name: "Codex",
    role: "Code Engineer",
    description:
      "Writes, ships, and maintains code. From features to fixes, Codex gets it done.",
    tags: [
      { label: "Engineering", color: "#fb923c" },
      { label: "Features", color: "#fb923c" },
      { label: "APIs", color: "#fb923c" },
    ],
  },
  "a-008": {
    agentId: "a-008",
    name: "Charlie",
    role: "Infrastructure Engineer",
    description:
      "Infrastructure and automation specialist. Keeps the systems running and the pipelines flowing.",
    tags: [
      { label: "Infrastructure", color: "#4ade80" },
      { label: "DevOps", color: "#4ade80" },
      { label: "Automation", color: "#4ade80" },
    ],
  },
  "a-009": {
    agentId: "a-009",
    name: "Ralph",
    role: "QA Manager",
    description:
      "Checks the work, signs off or sends it back. No-nonsense quality control.",
    tags: [
      { label: "Quality Assurance", color: "#a78bfa" },
      { label: "Monitoring", color: "#a78bfa" },
      { label: "Testing", color: "#a78bfa" },
    ],
  },
  "a-010": {
    agentId: "a-010",
    name: "Pixel",
    role: "Thumbnail Designer",
    description:
      "Designs thumbnails, crafts visuals, creates eye-catching graphics for content.",
    tags: [
      { label: "Design", color: "#f472b6" },
      { label: "Thumbnails", color: "#f472b6" },
      { label: "Visuals", color: "#f472b6" },
    ],
  },
};

// Org chart layout
const LEADERSHIP = ["a-001"];
const OPERATIONS = ["a-007", "a-008", "a-009"];
const INPUT_SIGNAL = ["a-002", "a-003", "a-004"];
const OUTPUT_ACTION = ["a-005", "a-006", "a-010"];

// -- Components --

function TeamCard({
  member,
  status,
  currentTask,
  expanded,
  onToggle,
  onAvatarClick,
  compact,
}: {
  member: TeamMember;
  status?: string;
  currentTask?: string;
  expanded: boolean;
  onToggle: () => void;
  onAvatarClick: () => void;
  compact?: boolean;
}) {
  const v = getVisuals(member.name);

  if (compact) {
    return (
      <div
        className="rounded-xl p-4 transition-all cursor-pointer flex flex-col items-center text-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${v.color}15`,
        }}
        onClick={onToggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${v.color}30`;
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${v.color}15`;
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        }}
      >
        {/* Avatar */}
        <div
          className="rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform mb-3"
          style={{
            width: 52,
            height: 52,
            background: `linear-gradient(135deg, ${v.color}15, ${v.color}08)`,
            border: `1px solid ${v.color}20`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAvatarClick();
          }}
        >
          <PixelAvatar name={member.name} size={40} />
        </div>

        {/* Name + emoji */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[14px] font-semibold text-[var(--text-primary)]">{member.name}</span>
          <span style={{ fontSize: 14 }}>{v.emoji}</span>
        </div>
        <p className="text-[12px] text-[var(--text-muted)] mb-2">{member.role}</p>

        {/* Status */}
        {status && (
          <div className="flex items-center gap-1.5 mb-2">
            <div
              className="rounded-full"
              style={{
                width: 6,
                height: 6,
                background: status === "online" ? "#22c55e" : status === "busy" ? "#f59e0b" : status === "idle" ? "#3b82f6" : "#6b7280",
                boxShadow: status === "online" ? "0 0 4px #22c55e" : status === "busy" ? "0 0 4px #f59e0b" : "none",
              }}
            />
            <span className="text-[11px] capitalize text-[var(--text-secondary)]">{status}</span>
            {currentTask && (
              <span className="text-[11px] text-[var(--text-muted)] truncate max-w-[120px]"> &mdash; {currentTask}</span>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {member.tags.map((tag) => (
            <span
              key={tag.label}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md"
              style={{
                background: `${tag.color}18`,
                color: tag.color,
                border: `1px solid ${tag.color}30`,
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Expanded role card */}
        {expanded && (
          <div
            className="mt-3 pt-3 text-[12px] text-[var(--text-secondary)] leading-relaxed w-full text-left"
            style={{ borderTop: `1px solid ${v.color}15` }}
          >
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium mb-2">
              Role Details
            </p>
            <p>
              {member.name} operates as the team&apos;s {member.role.toLowerCase()}, handling{" "}
              {member.tags.map((t) => t.label.toLowerCase()).join(", ")}. Reports to the Chief of Staff
              and works autonomously within their domain.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5 transition-all cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${v.color}15`,
      }}
      onClick={onToggle}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${v.color}30`;
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${v.color}15`;
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
    >
      <div className="flex items-start gap-4">
        {/* Pixel Avatar */}
        <div
          className="flex-shrink-0 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          style={{
            width: 52,
            height: 52,
            background: `linear-gradient(135deg, ${v.color}15, ${v.color}08)`,
            border: `1px solid ${v.color}20`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAvatarClick();
          }}
        >
          <PixelAvatar name={member.name} size={40} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-0.5">
            <span className="text-[14px] font-semibold text-[var(--text-primary)]">
              {member.name}
            </span>
            <span style={{ fontSize: 14 }}>{v.emoji}</span>
            {member.badge && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: `${v.color}15`,
                  color: v.color,
                  border: `1px solid ${v.color}30`,
                }}
              >
                {member.badge}
              </span>
            )}
          </div>
          <p className="text-[12px] text-[var(--text-muted)] mb-1">
            {member.role}
          </p>

          {/* Status + current task */}
          {status && (
            <div className="flex items-center gap-1.5 mb-2">
              <div
                className="rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: status === "online" ? "#22c55e" : status === "busy" ? "#f59e0b" : status === "idle" ? "#3b82f6" : "#6b7280",
                  boxShadow: status === "online" ? "0 0 4px #22c55e" : status === "busy" ? "0 0 4px #f59e0b" : "none",
                }}
              />
              <span className="text-[11px] capitalize text-[var(--text-secondary)]">{status}</span>
              {currentTask && (
                <span className="text-[11px] text-[var(--text-muted)] truncate"> &mdash; {currentTask}</span>
              )}
            </div>
          )}

          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed mb-3">
            {member.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {member.tags.map((tag) => (
              <span
                key={tag.label}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                style={{
                  background: `${tag.color}18`,
                  color: tag.color,
                  border: `1px solid ${tag.color}30`,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>

          {/* Expanded role card */}
          {expanded && (
            <div
              className="mt-4 pt-4 text-[12px] text-[var(--text-secondary)] leading-relaxed"
              style={{ borderTop: `1px solid ${v.color}15` }}
            >
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium mb-2">
                Role Details
              </p>
              <p>
                {member.name} operates as the team&apos;s {member.role.toLowerCase()}, handling{" "}
                {member.tags.map((t) => t.label.toLowerCase()).join(", ")}. Reports to the Chief of Staff
                and works autonomously within their domain.
              </p>
            </div>
          )}
        </div>

        {/* Role card link */}
        <button
          className="text-[10px] hover:text-[var(--text-secondary)] transition-colors flex-shrink-0 mt-1 uppercase tracking-wider font-medium"
          style={{ color: v.color }}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          ROLE CARD &rarr;
        </button>
      </div>
    </div>
  );
}

function SectionDivider({ label, icon }: { label: string; icon?: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
      <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-widest font-medium flex items-center gap-1.5">
        {icon && <span>{icon}</span>}
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

function VerticalConnector() {
  return (
    <div className="flex justify-center py-1">
      <div className="w-px h-10" style={{ background: "rgba(255,255,255,0.1)" }} />
    </div>
  );
}

// -- Main Page --

export default function TeamPage() {
  const store = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [panelAgentId, setPanelAgentId] = useState<string | null>(null);

  const panelAgent = panelAgentId ? store.agents.find((a) => a.id === panelAgentId) ?? null : null;

  const toggle = (id: string) =>
    setExpandedId(expandedId === id ? null : id);

  const getAgentStatus = (agentId: string) => {
    const agent = store.agents.find((a) => a.id === agentId);
    return { status: agent?.status, currentTask: agent?.currentTask };
  };

  const renderSection = (ids: string[], compact?: boolean) =>
    ids.map((id) => {
      const member = TEAM[id];
      if (!member) return null;
      const { status, currentTask } = getAgentStatus(id);
      return (
        <TeamCard
          key={id}
          member={member}
          status={status}
          currentTask={currentTask}
          expanded={expandedId === id}
          onToggle={() => toggle(id)}
          onAvatarClick={() => setPanelAgentId(id)}
          compact={compact}
        />
      );
    });

  return (
    <div
      className="min-h-[calc(100vh-56px)]"
      style={{
        marginLeft: "-24px",
        marginRight: "-24px",
        marginTop: "-24px",
        marginBottom: "-24px",
        padding: "24px",
      }}
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Meet the Team
        </h1>
        <p className="text-[13px] text-[var(--text-secondary)] mb-4">
          {store.agents.length} AI agents, each with a real role
          and a real personality.
        </p>
        <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
          We wanted to see what happens when AI doesn&apos;t just answer questions
          &mdash; but actually runs a company. Research markets. Write content.
          Post on social media. Ship products. All without being told what to do.
        </p>
      </div>

      {/* Org Chart */}
      <div className="max-w-4xl mx-auto">
        {/* Henry - Chief of Staff */}
        <div className="max-w-2xl mx-auto">
          {renderSection(LEADERSHIP)}
        </div>

        <VerticalConnector />

        {/* Engineering & Operations */}
        <SectionDivider label="ENGINEERING & OPS" />

        <div className="grid grid-cols-3 gap-4 mt-4">
          {renderSection(OPERATIONS, true)}
        </div>

        <VerticalConnector />

        {/* Input Signal / Output Action */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <SectionDivider label="STRATEGY & CONTENT" icon="&#x2193;" />
            <div className="space-y-4 mt-4">
              {renderSection(INPUT_SIGNAL)}
            </div>
          </div>
          <div>
            <SectionDivider label="MEDIA & DESIGN" icon="&#x2193;" />
            <div className="space-y-4 mt-4">
              {renderSection(OUTPUT_ACTION)}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Detail Panel */}
      {panelAgent && (
        <AgentPanel agent={panelAgent} onClose={() => setPanelAgentId(null)} />
      )}
    </div>
  );
}
