"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/": "Overview",
  "/tasks": "Tasks",
  "/office": "Office",
  "/agents": "Agents",
  "/projects": "Projects",
  "/calendar": "Calendar",
  "/memory": "Memory",
  "/docs": "Documents",
  "/system": "System",
};

export default function Header() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Mission Control";

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-semibold text-[var(--text-primary)]">{title}</h1>
        <span className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-0.5 rounded-md">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick search */}
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-1.5">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[var(--text-muted)]">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[12px] text-[var(--text-muted)]">Search...</span>
          <kbd className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--border-color)] ml-4">
            /
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--text-secondary)]">
            <path d="M4 6a4 4 0 018 0v2l1.5 2.5H2.5L4 8V6z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 12a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold">
          OP
        </div>
      </div>
    </header>
  );
}
