"use client";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/15 text-green-400 border-green-500/20",
  online: "bg-green-500/15 text-green-400 border-green-500/20",
  healthy: "bg-green-500/15 text-green-400 border-green-500/20",
  busy: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  in_progress: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  idle: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  paused: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  review: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  planning: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  offline: "bg-red-500/15 text-red-400 border-red-500/20",
  stopped: "bg-red-500/15 text-red-400 border-red-500/20",
  error: "bg-red-500/15 text-red-400 border-red-500/20",
  done: "bg-green-500/15 text-green-400 border-green-500/20",
  completed: "bg-green-500/15 text-green-400 border-green-500/20",
  backlog: "bg-gray-500/15 text-gray-400 border-gray-500/20",
  degraded: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status] ?? "bg-gray-500/15 text-gray-400 border-gray-500/20";
  const sizeClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-1";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${colors} ${sizeClass}`}>
      <span className={`status-dot ${status}`} />
      {status.replace("_", " ")}
    </span>
  );
}
