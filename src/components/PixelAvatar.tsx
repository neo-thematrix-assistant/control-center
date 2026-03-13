"use client";

// ─── Agent visual identity (shared across all pages) ────────────────────────

export interface AgentVisuals {
  emoji: string;
  color: string;
  skinColor: string;
  hairColor: string;
  shirtColor: string;
}

export const AGENT_VISUALS: Record<string, AgentVisuals> = {
  henry:   { emoji: "\uD83D\uDC51", color: "#8b5cf6", skinColor: "#f0c8a0", hairColor: "#4a3728", shirtColor: "#8b5cf6" },
  alex:    { emoji: "\uD83D\uDC7E", color: "#6366f1", skinColor: "#d4a574", hairColor: "#1a1a2e", shirtColor: "#6366f1" },
  scout:   { emoji: "\uD83D\uDD2D", color: "#94a3b8", skinColor: "#f0c8a0", hairColor: "#8b6c47", shirtColor: "#64748b" },
  quill:   { emoji: "\u270D\uFE0F", color: "#eab308", skinColor: "#c68642", hairColor: "#2d1b00", shirtColor: "#ca8a04" },
  echo:    { emoji: "\uD83D\uDCE3", color: "#64748b", skinColor: "#f0c8a0", hairColor: "#3d2b1f", shirtColor: "#475569" },
  violet:  { emoji: "\uD83D\uDC9C", color: "#a855f7", skinColor: "#e8b88a", hairColor: "#6b21a8", shirtColor: "#9333ea" },
  codex:   { emoji: "\uD83D\uDCBB", color: "#f97316", skinColor: "#f0c8a0", hairColor: "#1c1c1c", shirtColor: "#ea580c" },
  charlie: { emoji: "\u2699\uFE0F", color: "#22c55e", skinColor: "#d4a574", hairColor: "#2d1b00", shirtColor: "#16a34a" },
  ralph:   { emoji: "\uD83D\uDD28", color: "#64748b", skinColor: "#f0c8a0", hairColor: "#5c4033", shirtColor: "#57534e" },
  pixel:   { emoji: "\uD83C\uDFA8", color: "#ec4899", skinColor: "#e8b88a", hairColor: "#ec4899", shirtColor: "#db2777" },
};

export function getVisuals(name: string): AgentVisuals {
  return AGENT_VISUALS[name.toLowerCase()] ?? { emoji: "\uD83E\uDD16", color: "#6366f1", skinColor: "#f0c8a0", hairColor: "#1a1a2e", shirtColor: "#6366f1" };
}

// ─── Unique pixel-art sprites per agent ──────────────────────────────────────

export default function PixelAvatar({ name, size = 48 }: { name: string; size?: number }) {
  const v = getVisuals(name);
  const key = name.toLowerCase();

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      {key === "henry" && (
        <>
          {/* Crown */}
          <rect x="5" y="0" width="1" height="1" fill="#fbbf24" />
          <rect x="7" y="0" width="2" height="1" fill="#fbbf24" />
          <rect x="10" y="0" width="1" height="1" fill="#fbbf24" />
          <rect x="5" y="1" width="6" height="1" fill="#f59e0b" />
          {/* Hair */}
          <rect x="5" y="2" width="6" height="2" fill={v.hairColor} />
          <rect x="4" y="3" width="1" height="1" fill={v.hairColor} />
          <rect x="11" y="3" width="1" height="1" fill={v.hairColor} />
          {/* Face */}
          <rect x="5" y="3" width="6" height="4" fill={v.skinColor} />
          <rect x="4" y="4" width="1" height="2" fill={v.skinColor} />
          <rect x="11" y="4" width="1" height="2" fill={v.skinColor} />
          {/* Eyes */}
          <rect x="6" y="4" width="1" height="1" fill="#1a1a2e" />
          <rect x="9" y="4" width="1" height="1" fill="#1a1a2e" />
          {/* Suit jacket */}
          <rect x="4" y="7" width="8" height="5" fill={v.shirtColor} rx="1" />
          {/* Lapels */}
          <rect x="5" y="7" width="1" height="3" fill="#7c3aed" />
          <rect x="10" y="7" width="1" height="3" fill="#7c3aed" />
          {/* Tie */}
          <rect x="7" y="7" width="2" height="1" fill="#fbbf24" />
          <rect x="7.5" y="8" width="1" height="3" fill="#f59e0b" />
          {/* Arms */}
          <rect x="3" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          <rect x="11" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          {/* Hands */}
          <rect x="3" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          <rect x="11" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          {/* Pants */}
          <rect x="5" y="12" width="2" height="3" fill="#1e1b4b" />
          <rect x="9" y="12" width="2" height="3" fill="#1e1b4b" />
          {/* Shoes */}
          <rect x="4" y="14" width="3" height="1" fill="#1e293b" rx="0.5" />
          <rect x="9" y="14" width="3" height="1" fill="#1e293b" rx="0.5" />
        </>
      )}

      {key === "alex" && (
        <>
          {/* Hair - slicked back */}
          <rect x="5" y="1" width="6" height="2" fill={v.hairColor} />
          <rect x="4" y="2" width="1" height="2" fill={v.hairColor} />
          <rect x="11" y="2" width="1" height="2" fill={v.hairColor} />
          <rect x="5" y="1" width="6" height="1" fill="#0f0f23" />
          {/* Face */}
          <rect x="5" y="3" width="6" height="4" fill={v.skinColor} />
          <rect x="4" y="4" width="1" height="2" fill={v.skinColor} />
          <rect x="11" y="4" width="1" height="2" fill={v.skinColor} />
          {/* Glasses frame */}
          <rect x="5" y="4" width="3" height="2" fill="none" stroke="#94a3b8" strokeWidth="0.4" />
          <rect x="8" y="4" width="3" height="2" fill="none" stroke="#94a3b8" strokeWidth="0.4" />
          <rect x="7.5" y="4.5" width="1" height="0.4" fill="#94a3b8" />
          {/* Eyes behind glasses */}
          <rect x="6" y="4.5" width="1" height="1" fill="#1a1a2e" />
          <rect x="9" y="4.5" width="1" height="1" fill="#1a1a2e" />
          {/* Blazer */}
          <rect x="4" y="7" width="8" height="5" fill={v.shirtColor} rx="1" />
          {/* Inner shirt */}
          <rect x="7" y="7" width="2" height="4" fill="#e2e8f0" />
          {/* Blazer collar */}
          <rect x="5" y="7" width="2" height="1" fill="#4f46e5" />
          <rect x="9" y="7" width="2" height="1" fill="#4f46e5" />
          {/* Arms */}
          <rect x="3" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          <rect x="11" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          {/* Hands */}
          <rect x="3" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          <rect x="11" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          {/* Pants */}
          <rect x="5" y="12" width="2" height="3" fill="#1e293b" />
          <rect x="9" y="12" width="2" height="3" fill="#1e293b" />
          {/* Shoes */}
          <rect x="4" y="14" width="3" height="1" fill="#0f172a" rx="0.5" />
          <rect x="9" y="14" width="3" height="1" fill="#0f172a" rx="0.5" />
        </>
      )}

      {key === "scout" && (
        <>
          {/* Hoodie hood up */}
          <rect x="4" y="1" width="8" height="3" fill="#475569" rx="1" />
          <rect x="5" y="1" width="6" height="1" fill="#64748b" />
          {/* Face (smaller, inside hood) */}
          <rect x="5" y="3" width="6" height="4" fill={v.skinColor} />
          <rect x="4" y="4" width="1" height="2" fill={v.skinColor} />
          <rect x="11" y="4" width="1" height="2" fill={v.skinColor} />
          {/* Eyes */}
          <rect x="6" y="4" width="1" height="1" fill="#1a1a2e" />
          <rect x="9" y="4" width="1" height="1" fill="#1a1a2e" />
          {/* Hoodie body */}
          <rect x="4" y="7" width="8" height="5" fill="#475569" rx="1" />
          {/* Hood strings */}
          <rect x="6" y="7" width="0.5" height="2" fill="#94a3b8" />
          <rect x="9.5" y="7" width="0.5" height="2" fill="#94a3b8" />
          {/* Pocket */}
          <rect x="6" y="9" width="4" height="2" fill="#3f4758" rx="0.5" />
          {/* Arms */}
          <rect x="3" y="7" width="2" height="4" fill="#475569" rx="0.5" />
          <rect x="11" y="7" width="2" height="4" fill="#475569" rx="0.5" />
          {/* Hands */}
          <rect x="3" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          <rect x="11" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          {/* Cargo pants */}
          <rect x="5" y="12" width="2" height="3" fill="#78716c" />
          <rect x="9" y="12" width="2" height="3" fill="#78716c" />
          {/* Cargo pocket detail */}
          <rect x="5" y="13" width="1.5" height="1" fill="#6b6560" />
          <rect x="9.5" y="13" width="1.5" height="1" fill="#6b6560" />
          {/* Boots */}
          <rect x="4" y="14" width="3" height="1" fill="#44403c" rx="0.5" />
          <rect x="9" y="14" width="3" height="1" fill="#44403c" rx="0.5" />
        </>
      )}

      {key === "quill" && (
        <>
          {/* Hair - neat, side part */}
          <rect x="5" y="1" width="6" height="3" fill={v.hairColor} />
          <rect x="4" y="2" width="1" height="2" fill={v.hairColor} />
          <rect x="11" y="2" width="1" height="2" fill={v.hairColor} />
          {/* Side part line */}
          <rect x="7" y="1" width="0.5" height="1" fill="#1a0f00" />
          {/* Face */}
          <rect x="5" y="3" width="6" height="4" fill={v.skinColor} />
          <rect x="4" y="4" width="1" height="2" fill={v.skinColor} />
          <rect x="11" y="4" width="1" height="2" fill={v.skinColor} />
          {/* Eyes */}
          <rect x="6" y="4" width="1" height="1" fill="#1a1a2e" />
          <rect x="9" y="4" width="1" height="1" fill="#1a1a2e" />
          {/* White shirt underneath */}
          <rect x="4" y="7" width="8" height="5" fill="#e2e8f0" rx="1" />
          {/* Vest overlay */}
          <rect x="4" y="7" width="3" height="5" fill={v.shirtColor} rx="0.5" />
          <rect x="9" y="7" width="3" height="5" fill={v.shirtColor} rx="0.5" />
          {/* Vest buttons */}
          <rect x="6.5" y="8" width="0.8" height="0.8" fill="#a16207" rx="0.4" />
          <rect x="6.5" y="10" width="0.8" height="0.8" fill="#a16207" rx="0.4" />
          {/* Arms (white sleeves) */}
          <rect x="3" y="7" width="2" height="4" fill="#e2e8f0" rx="0.5" />
          <rect x="11" y="7" width="2" height="4" fill="#e2e8f0" rx="0.5" />
          {/* Hands */}
          <rect x="3" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          <rect x="11" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          {/* Pen in hand */}
          <rect x="12" y="9" width="0.5" height="2.5" fill="#fbbf24" />
          {/* Khaki pants */}
          <rect x="5" y="12" width="2" height="3" fill="#92400e" />
          <rect x="9" y="12" width="2" height="3" fill="#92400e" />
          {/* Loafers */}
          <rect x="4" y="14" width="3" height="1" fill="#78350f" rx="0.5" />
          <rect x="9" y="14" width="3" height="1" fill="#78350f" rx="0.5" />
        </>
      )}

      {key === "echo" && (
        <>
          {/* Hair */}
          <rect x="5" y="1" width="6" height="3" fill={v.hairColor} />
          <rect x="4" y="2" width="1" height="2" fill={v.hairColor} />
          <rect x="11" y="2" width="1" height="2" fill={v.hairColor} />
          {/* Headphones band */}
          <rect x="4" y="1" width="8" height="1" fill="#334155" rx="0.5" />
          {/* Headphone cups */}
          <rect x="3" y="3" width="2" height="3" fill="#334155" rx="0.5" />
          <rect x="11" y="3" width="2" height="3" fill="#334155" rx="0.5" />
          <rect x="3.3" y="3.5" width="1.4" height="2" fill="#1e293b" rx="0.3" />
          <rect x="11.3" y="3.5" width="1.4" height="2" fill="#1e293b" rx="0.3" />
          {/* Face */}
          <rect x="5" y="3" width="6" height="4" fill={v.skinColor} />
          <rect x="4" y="4" width="1" height="2" fill={v.skinColor} />
          <rect x="11" y="4" width="1" height="2" fill={v.skinColor} />
          {/* Eyes */}
          <rect x="6" y="4" width="1" height="1" fill="#1a1a2e" />
          <rect x="9" y="4" width="1" height="1" fill="#1a1a2e" />
          {/* Turtleneck */}
          <rect x="6" y="6.5" width="4" height="1" fill={v.shirtColor} />
          <rect x="4" y="7" width="8" height="5" fill={v.shirtColor} rx="1" />
          {/* Turtleneck fold lines */}
          <rect x="6.5" y="6.5" width="3" height="0.3" fill="#374151" />
          {/* Arms */}
          <rect x="3" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          <rect x="11" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          {/* Hands */}
          <rect x="3" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          <rect x="11" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          {/* Jeans */}
          <rect x="5" y="12" width="2" height="3" fill="#1e3a5f" />
          <rect x="9" y="12" width="2" height="3" fill="#1e3a5f" />
          {/* Sneakers */}
          <rect x="4" y="14" width="3" height="1" fill="#f8fafc" rx="0.5" />
          <rect x="9" y="14" width="3" height="1" fill="#f8fafc" rx="0.5" />
          <rect x="4" y="14.5" width="3" height="0.5" fill="#e2e8f0" rx="0.2" />
          <rect x="9" y="14.5" width="3" height="0.5" fill="#e2e8f0" rx="0.2" />
        </>
      )}

      {key === "violet" && (
        <>
          {/* Beret */}
          <rect x="4" y="0" width="8" height="2" fill="#7e22ce" rx="1" />
          <rect x="7" y="-0.5" width="2" height="1" fill="#7e22ce" rx="0.5" />
          {/* Hair flowing from under beret */}
          <rect x="4" y="2" width="8" height="2" fill={v.hairColor} />
          <rect x="3" y="3" width="2" height="3" fill={v.hairColor} />
          <rect x="11" y="3" width="2" height="2" fill={v.hairColor} />
          {/* Face */}
          <rect x="5" y="3" width="6" height="4" fill={v.skinColor} />
          <rect x="4" y="4" width="1" height="2" fill={v.skinColor} />
          <rect x="11" y="4" width="1" height="2" fill={v.skinColor} />
          {/* Eyes */}
          <rect x="6" y="4" width="1" height="1" fill="#1a1a2e" />
          <rect x="9" y="4" width="1" height="1" fill="#1a1a2e" />
          {/* Smock / paint apron */}
          <rect x="4" y="7" width="8" height="5" fill={v.shirtColor} rx="1" />
          {/* Paint splatter on smock */}
          <rect x="5" y="8" width="1" height="1" fill="#fbbf24" rx="0.5" />
          <rect x="9" y="9" width="1" height="1" fill="#60a5fa" rx="0.5" />
          <rect x="7" y="10" width="1" height="1" fill="#f87171" rx="0.5" />
          {/* Arms */}
          <rect x="3" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          <rect x="11" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          {/* Hands */}
          <rect x="3" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          <rect x="11" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          {/* Paintbrush in hand */}
          <rect x="12" y="8.5" width="0.5" height="3" fill="#92400e" />
          <rect x="11.8" y="8" width="1" height="1" fill="#f87171" rx="0.3" />
          {/* Leggings */}
          <rect x="5" y="12" width="2" height="3" fill="#1e1b4b" />
          <rect x="9" y="12" width="2" height="3" fill="#1e1b4b" />
          {/* Boots */}
          <rect x="4" y="14" width="3" height="1" fill="#581c87" rx="0.5" />
          <rect x="9" y="14" width="3" height="1" fill="#581c87" rx="0.5" />
        </>
      )}

      {key === "codex" && (
        <>
          {/* Hair - messy */}
          <rect x="5" y="1" width="6" height="2" fill={v.hairColor} />
          <rect x="4" y="1" width="1" height="2" fill={v.hairColor} />
          <rect x="11" y="1" width="1" height="2" fill={v.hairColor} />
          <rect x="6" y="0" width="1" height="1" fill={v.hairColor} />
          <rect x="9" y="0" width="1" height="1" fill={v.hairColor} />
          {/* Face */}
          <rect x="5" y="3" width="6" height="4" fill={v.skinColor} />
          <rect x="4" y="4" width="1" height="2" fill={v.skinColor} />
          <rect x="11" y="4" width="1" height="2" fill={v.skinColor} />
          {/* Eyes */}
          <rect x="6" y="4" width="1" height="1" fill="#1a1a2e" />
          <rect x="9" y="4" width="1" height="1" fill="#1a1a2e" />
          {/* Hoodie (hood down, strings visible) */}
          <rect x="4" y="7" width="8" height="5" fill={v.shirtColor} rx="1" />
          {/* Hood fold at neck */}
          <rect x="5" y="7" width="6" height="1" fill="#c2410c" rx="0.3" />
          {/* Terminal / code graphic on chest */}
          <rect x="6" y="8.5" width="4" height="2.5" fill="#1c1c1c" rx="0.3" />
          <rect x="6.5" y="9" width="1.5" height="0.4" fill="#4ade80" />
          <rect x="6.5" y="9.8" width="2.5" height="0.4" fill="#60a5fa" />
          {/* Arms */}
          <rect x="3" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          <rect x="11" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          {/* Hands */}
          <rect x="3" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          <rect x="11" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          {/* Dark jeans */}
          <rect x="5" y="12" width="2" height="3" fill="#1e293b" />
          <rect x="9" y="12" width="2" height="3" fill="#1e293b" />
          {/* Sneakers */}
          <rect x="4" y="14" width="3" height="1" fill="#f97316" rx="0.5" />
          <rect x="9" y="14" width="3" height="1" fill="#f97316" rx="0.5" />
        </>
      )}

      {key === "charlie" && (
        <>
          {/* Hard hat */}
          <rect x="4" y="0" width="8" height="2" fill="#fbbf24" rx="0.5" />
          <rect x="3" y="2" width="10" height="1" fill="#f59e0b" />
          {/* Hair (barely visible under hat) */}
          <rect x="4" y="3" width="1" height="1" fill={v.hairColor} />
          <rect x="11" y="3" width="1" height="1" fill={v.hairColor} />
          {/* Face */}
          <rect x="5" y="3" width="6" height="4" fill={v.skinColor} />
          <rect x="4" y="4" width="1" height="2" fill={v.skinColor} />
          <rect x="11" y="4" width="1" height="2" fill={v.skinColor} />
          {/* Eyes */}
          <rect x="6" y="4" width="1" height="1" fill="#1a1a2e" />
          <rect x="9" y="4" width="1" height="1" fill="#1a1a2e" />
          {/* Hi-vis vest over shirt */}
          <rect x="4" y="7" width="8" height="5" fill={v.shirtColor} rx="1" />
          {/* Reflective vest stripes */}
          <rect x="4" y="8" width="8" height="0.6" fill="#fde68a" />
          <rect x="4" y="10" width="8" height="0.6" fill="#fde68a" />
          {/* Diagonal cross stripes */}
          <rect x="6" y="7" width="0.5" height="5" fill="#fde68a" opacity="0.6" />
          <rect x="9.5" y="7" width="0.5" height="5" fill="#fde68a" opacity="0.6" />
          {/* Arms */}
          <rect x="3" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          <rect x="11" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          {/* Gloves */}
          <rect x="3" y="10" width="2" height="1.5" fill="#92400e" rx="0.5" />
          <rect x="11" y="10" width="2" height="1.5" fill="#92400e" rx="0.5" />
          {/* Work pants */}
          <rect x="5" y="12" width="2" height="3" fill="#44403c" />
          <rect x="9" y="12" width="2" height="3" fill="#44403c" />
          {/* Steel-toe boots */}
          <rect x="4" y="14" width="3" height="1.5" fill="#292524" rx="0.5" />
          <rect x="9" y="14" width="3" height="1.5" fill="#292524" rx="0.5" />
          <rect x="4.5" y="14" width="2" height="0.5" fill="#57534e" rx="0.2" />
          <rect x="9.5" y="14" width="2" height="0.5" fill="#57534e" rx="0.2" />
        </>
      )}

      {key === "ralph" && (
        <>
          {/* Hair - receding, neat */}
          <rect x="5" y="1" width="6" height="2" fill={v.hairColor} />
          <rect x="6" y="1" width="4" height="1" fill={v.hairColor} />
          <rect x="4" y="2" width="1" height="2" fill={v.hairColor} />
          <rect x="11" y="2" width="1" height="2" fill={v.hairColor} />
          {/* Face */}
          <rect x="5" y="3" width="6" height="4" fill={v.skinColor} />
          <rect x="4" y="4" width="1" height="2" fill={v.skinColor} />
          <rect x="11" y="4" width="1" height="2" fill={v.skinColor} />
          {/* Eyes */}
          <rect x="6" y="4" width="1" height="1" fill="#1a1a2e" />
          <rect x="9" y="4" width="1" height="1" fill="#1a1a2e" />
          {/* Mustache */}
          <rect x="6" y="5.5" width="4" height="0.8" fill={v.hairColor} rx="0.3" />
          {/* Plaid flannel shirt */}
          <rect x="4" y="7" width="8" height="5" fill={v.shirtColor} rx="1" />
          {/* Plaid pattern (horizontal) */}
          <rect x="4" y="8" width="8" height="0.5" fill="#78716c" />
          <rect x="4" y="10" width="8" height="0.5" fill="#78716c" />
          {/* Plaid pattern (vertical) */}
          <rect x="6" y="7" width="0.5" height="5" fill="#78716c" opacity="0.6" />
          <rect x="9.5" y="7" width="0.5" height="5" fill="#78716c" opacity="0.6" />
          {/* Collar */}
          <rect x="5" y="7" width="2" height="1" fill="#6b6560" />
          <rect x="9" y="7" width="2" height="1" fill="#6b6560" />
          {/* Arms */}
          <rect x="3" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          <rect x="11" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          {/* Hands */}
          <rect x="3" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          <rect x="11" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          {/* Clipboard in hand */}
          <rect x="12" y="8" width="2" height="3" fill="#d6d3d1" rx="0.3" />
          <rect x="12.3" y="8.5" width="1.4" height="0.3" fill="#a8a29e" />
          <rect x="12.3" y="9.2" width="1.4" height="0.3" fill="#a8a29e" />
          <rect x="12.3" y="9.9" width="1" height="0.3" fill="#a8a29e" />
          {/* Work pants */}
          <rect x="5" y="12" width="2" height="3" fill="#374151" />
          <rect x="9" y="12" width="2" height="3" fill="#374151" />
          {/* Shoes */}
          <rect x="4" y="14" width="3" height="1" fill="#1e293b" rx="0.5" />
          <rect x="9" y="14" width="3" height="1" fill="#1e293b" rx="0.5" />
        </>
      )}

      {key === "pixel" && (
        <>
          {/* Backwards cap */}
          <rect x="5" y="1" width="6" height="2" fill="#be185d" rx="0.5" />
          <rect x="4" y="2" width="2" height="1" fill="#9d174d" rx="0.3" />
          {/* Cap button on top */}
          <rect x="7.5" y="0.5" width="1" height="1" fill="#f9a8d4" rx="0.5" />
          {/* Hair poking out front */}
          <rect x="9" y="1" width="3" height="2" fill={v.hairColor} />
          <rect x="11" y="2" width="1" height="2" fill={v.hairColor} />
          {/* Face */}
          <rect x="5" y="3" width="6" height="4" fill={v.skinColor} />
          <rect x="4" y="4" width="1" height="2" fill={v.skinColor} />
          <rect x="11" y="4" width="1" height="2" fill={v.skinColor} />
          {/* Eyes */}
          <rect x="6" y="4" width="1" height="1" fill="#1a1a2e" />
          <rect x="9" y="4" width="1" height="1" fill="#1a1a2e" />
          {/* Graphic tee */}
          <rect x="4" y="7" width="8" height="5" fill={v.shirtColor} rx="1" />
          {/* Star graphic on tee */}
          <rect x="7" y="8" width="2" height="2" fill="#fbbf24" />
          <rect x="6.5" y="8.5" width="3" height="1" fill="#fbbf24" />
          <rect x="7.5" y="7.5" width="1" height="3" fill="#fbbf24" />
          {/* Arms */}
          <rect x="3" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          <rect x="11" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          {/* Bracelets */}
          <rect x="3" y="10" width="2" height="0.4" fill="#fbbf24" />
          <rect x="11" y="10" width="2" height="0.4" fill="#a855f7" />
          {/* Hands */}
          <rect x="3" y="10.5" width="2" height="1" fill={v.skinColor} rx="0.5" />
          <rect x="11" y="10.5" width="2" height="1" fill={v.skinColor} rx="0.5" />
          {/* Ripped jeans */}
          <rect x="5" y="12" width="2" height="3" fill="#1e3a5f" />
          <rect x="9" y="12" width="2" height="3" fill="#1e3a5f" />
          {/* Rip detail */}
          <rect x="5.5" y="13" width="1" height="0.5" fill="#2d5a8f" />
          <rect x="9.5" y="13.5" width="1" height="0.5" fill="#2d5a8f" />
          {/* High-top sneakers */}
          <rect x="4" y="14" width="3" height="1" fill="#ec4899" rx="0.5" />
          <rect x="9" y="14" width="3" height="1" fill="#ec4899" rx="0.5" />
          <rect x="5" y="14" width="1" height="0.4" fill="#f9a8d4" />
          <rect x="10" y="14" width="1" height="0.4" fill="#f9a8d4" />
        </>
      )}

      {/* Fallback for unknown agents */}
      {!["henry","alex","scout","quill","echo","violet","codex","charlie","ralph","pixel"].includes(key) && (
        <>
          <rect x="5" y="1" width="6" height="3" fill={v.hairColor} />
          <rect x="4" y="2" width="1" height="2" fill={v.hairColor} />
          <rect x="11" y="2" width="1" height="2" fill={v.hairColor} />
          <rect x="5" y="3" width="6" height="4" fill={v.skinColor} />
          <rect x="4" y="4" width="1" height="2" fill={v.skinColor} />
          <rect x="11" y="4" width="1" height="2" fill={v.skinColor} />
          <rect x="6" y="4" width="1" height="1" fill="#1a1a2e" />
          <rect x="9" y="4" width="1" height="1" fill="#1a1a2e" />
          <rect x="4" y="7" width="8" height="5" fill={v.shirtColor} rx="1" />
          <rect x="3" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          <rect x="11" y="7" width="2" height="4" fill={v.shirtColor} rx="0.5" />
          <rect x="3" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          <rect x="11" y="10" width="2" height="1" fill={v.skinColor} rx="0.5" />
          <rect x="5" y="12" width="2" height="3" fill="#374151" />
          <rect x="9" y="12" width="2" height="3" fill="#374151" />
          <rect x="4" y="14" width="3" height="1" fill="#1e293b" rx="0.5" />
          <rect x="9" y="14" width="3" height="1" fill="#1e293b" rx="0.5" />
        </>
      )}
    </svg>
  );
}
