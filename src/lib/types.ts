// ═══════════════════════════════════════════════════════════════
// OpenClaw Mission Control — Shared Types
// ═══════════════════════════════════════════════════════════════

export interface Session {
  id: string;
  name: string;
  model: string;
  status: "active" | "idle" | "stopped" | "error";
  startedAt: string;
  lastActivity: string;
  messageCount: number;
  metadata?: Record<string, unknown>;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: "online" | "busy" | "idle" | "offline";
  avatar?: string;
  sessionId?: string;
  lastSeen: string;
  health: "healthy" | "degraded" | "unhealthy";
  currentTask?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "backlog" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignee?: string;
  project?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MemoryEntry {
  id: string;
  type: "journal" | "long_term";
  title: string;
  date: string;
  preview: string;
  content: string;
  wordCount: number;
  file?: string;
}

export interface DocEntry {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  modifiedAt: string;
  preview: string;
  content?: string;
  category?: string;
  wordCount?: number;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  command: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  status: "active" | "paused" | "error";
}

export interface Routine {
  id: string;
  name: string;
  schedule: string;
  time: string;
  duration: number; // minutes
  type: "daily" | "weekly" | "always_running";
  enabled: boolean;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "planning";
  owner: string;
  progress: number;
  description?: string;
  taskCount: number;
  completedTasks: number;
  updatedAt: string;
}

export interface GatewayStatus {
  status: "online" | "offline" | "degraded";
  version: string;
  uptime: number;
  activeSessions: number;
  totalSessions: number;
  cronJobs: number;
  memoryUsage?: number;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface ActivityEvent {
  id: string;
  type: "session" | "task" | "agent" | "system" | "cron";
  message: string;
  timestamp: string;
  severity?: "info" | "warning" | "error" | "success";
}

export interface ActionResult {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  timestamp: string;
}
