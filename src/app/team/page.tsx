"use client";

import { useState } from "react";

// -- Team Data --

interface TeamMember {
  id: string;
  name: string;
  role: string;
  badge?: string;
  description: string;
  tags: { label: string; color: string }[];
  avatar: { gradient: string; icon: string };
  machine?: string;
}

const henry: TeamMember = {
  id: "henry",
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
  avatar: { gradient: "from-emerald-500 to-teal-600", icon: "H" },
};

const operations: TeamMember[] = [
  {
    id: "charlie",
    name: "Charlie",
    role: "Infrastructure Engineer",
    description: "Infrastructure and automation specialist. Keeps the systems running and the pipelines flowing.",
    tags: [
      { label: "coding", color: "#60a5fa" },
      { label: "infrastructure", color: "#60a5fa" },
      { label: "automation", color: "#60a5fa" },
    ],
    avatar: { gradient: "from-emerald-500 to-green-600", icon: "C" },
  },
  {
    id: "ralph",
    name: "Ralph",
    role: "Foreman / QA Manager",
    description:
      "Checks the work, signs off or sends it back. No-nonsense quality control.",
    tags: [
      { label: "Quality Assurance", color: "#a78bfa" },
      { label: "Monitoring", color: "#a78bfa" },
      { label: "Demo Recording", color: "#a78bfa" },
    ],
    avatar: { gradient: "from-violet-500 to-purple-600", icon: "R" },
  },
];

const inputSignal: TeamMember[] = [
  {
    id: "scout",
    name: "Scout",
    role: "Trend Analyst",
    description:
      "Finds leads, tracks signals, scouts emerging trends across the internet.",
    tags: [
      { label: "research", color: "#94a3b8" },
      { label: "trends", color: "#94a3b8" },
      { label: "signals", color: "#94a3b8" },
    ],
    avatar: { gradient: "from-slate-500 to-gray-600", icon: "S" },
  },
  {
    id: "quill",
    name: "Quill",
    role: "Content Writer",
    description:
      "Writes copy, designs content, drafts newsletters and scripts.",
    tags: [
      { label: "writing", color: "#facc15" },
      { label: "content", color: "#facc15" },
      { label: "newsletters", color: "#facc15" },
    ],
    avatar: { gradient: "from-amber-500 to-yellow-600", icon: "Q" },
  },
];

const outputAction: TeamMember[] = [
  {
    id: "pixel",
    name: "Pixel",
    role: "Thumbnail Designer",
    description:
      "Designs thumbnails, crafts visuals, creates eye-catching graphics for content.",
    tags: [
      { label: "design", color: "#4ade80" },
      { label: "thumbnails", color: "#4ade80" },
      { label: "visuals", color: "#4ade80" },
    ],
    avatar: { gradient: "from-green-500 to-emerald-600", icon: "P" },
  },
  {
    id: "echo",
    name: "Echo",
    role: "Social Media Manager",
    description:
      "Posts, engages, manages social presence across all platforms.",
    tags: [
      { label: "social media", color: "#94a3b8" },
      { label: "engagement", color: "#94a3b8" },
      { label: "distribution", color: "#94a3b8" },
    ],
    avatar: { gradient: "from-slate-400 to-gray-500", icon: "E" },
  },
];

const allMembers = [henry, ...operations, ...inputSignal, ...outputAction];

// -- Components --

function AgentCard({
  member,
  expanded,
  onToggle,
}: {
  member: TeamMember;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-xl p-5 transition-all cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onClick={onToggle}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
      }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${member.avatar.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
        >
          {member.avatar.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-0.5">
            <span className="text-[14px] font-semibold text-[var(--text-primary)]">
              {member.name}
            </span>
            {member.badge && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(251,146,60,0.12)",
                  color: "#fb923c",
                  border: "1px solid rgba(251,146,60,0.25)",
                }}
              >
                {member.badge}
              </span>
            )}
          </div>
          <p className="text-[12px] text-[var(--text-muted)] mb-2">
            {member.role}
          </p>
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
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
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
          className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors flex-shrink-0 mt-1 uppercase tracking-wider font-medium"
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

function SectionDivider({
  label,
  icon,
}: {
  label: string;
  icon?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="flex-1 h-px"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />
      <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-widest font-medium flex items-center gap-1.5">
        {icon && <span>{icon}</span>}
        {label}
      </span>
      <div
        className="flex-1 h-px"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />
    </div>
  );
}

function VerticalConnector() {
  return (
    <div className="flex justify-center py-1">
      <div
        className="w-px h-10"
        style={{ background: "rgba(255,255,255,0.1)" }}
      />
    </div>
  );
}

// -- Main Page --

export default function TeamPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpandedId(expandedId === id ? null : id);

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
          {allMembers.length} AI agents across 3 machines, each with a real role
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
          <AgentCard
            member={henry}
            expanded={expandedId === henry.id}
            onToggle={() => toggle(henry.id)}
          />
        </div>

        <VerticalConnector />

        {/* Operations Section */}
        <SectionDivider label="OPERATIONS (Mac Studio 2)" icon="" />

        <div className="grid grid-cols-2 gap-4 mt-4">
          {operations.map((m) => (
            <AgentCard
              key={m.id}
              member={m}
              expanded={expandedId === m.id}
              onToggle={() => toggle(m.id)}
            />
          ))}
        </div>

        <VerticalConnector />

        {/* Input Signal / Output Action */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <SectionDivider label="INPUT SIGNAL" icon="&#x2193;" />
            <div className="space-y-4 mt-4">
              {inputSignal.map((m) => (
                <AgentCard
                  key={m.id}
                  member={m}
                  expanded={expandedId === m.id}
                  onToggle={() => toggle(m.id)}
                />
              ))}
            </div>
          </div>
          <div>
            <SectionDivider label="OUTPUT ACTION" icon="&#x2193;" />
            <div className="space-y-4 mt-4">
              {outputAction.map((m) => (
                <AgentCard
                  key={m.id}
                  member={m}
                  expanded={expandedId === m.id}
                  onToggle={() => toggle(m.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
