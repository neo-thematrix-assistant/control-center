"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { mockAgents, mockTasks, mockActivity } from "./mock-data";
import type { Agent, Task, ChatMessage, ActivityEvent } from "./types";

// ─── Store Shape ─────────────────────────────────────────────────────────────

interface Store {
  agents: Agent[];
  tasks: Task[];
  activity: ActivityEvent[];
  chatMessages: Record<string, ChatMessage[]>;

  // Mutations
  assignTask: (agentId: string, title: string, description?: string, priority?: Task["priority"], project?: string) => void;
  sendMessage: (agentId: string, content: string) => void;
  updateTaskStatus: (taskId: string, status: Task["status"]) => void;
  updateAgentStatus: (agentId: string, status: Agent["status"], task?: string) => void;
  addActivity: (message: string, type?: ActivityEvent["type"], severity?: ActivityEvent["severity"]) => void;
}

const StoreContext = createContext<Store | null>(null);

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

// Pre-seed some chat messages for agents with tasks
const INITIAL_CHAT: Record<string, ChatMessage[]> = {
  "a-001": [
    { id: "cm-001", agentId: "a-001", role: "agent", content: "Good morning. I've reviewed the pending tasks and started coordinating today's operations. Alex is on the auth PR, Quill is writing the blog post, and Charlie is fixing the pipeline timeout.", timestamp: "2026-03-13T09:00:00Z" },
  ],
  "a-004": [
    { id: "cm-002", agentId: "a-004", role: "agent", content: "I'm working on the Q1 blog post draft. Currently on section 3 — product roadmap highlights. Should have a first draft ready by end of day.", timestamp: "2026-03-13T13:00:00Z" },
  ],
  "a-008": [
    { id: "cm-003", agentId: "a-008", role: "agent", content: "Found the root cause of the pipeline timeout. It's a connection pool exhaustion issue when processing batches > 10k rows. Working on a fix now.", timestamp: "2026-03-13T13:30:00Z" },
  ],
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activity, setActivity] = useState<ActivityEvent[]>(mockActivity);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT);

  const addActivity = useCallback(
    (message: string, type: ActivityEvent["type"] = "task", severity: ActivityEvent["severity"] = "info") => {
      const event: ActivityEvent = {
        id: `ev-${Date.now()}`,
        type,
        message,
        timestamp: new Date().toISOString(),
        severity,
      };
      setActivity((prev) => [event, ...prev]);
    },
    []
  );

  const assignTask = useCallback(
    (agentId: string, title: string, description?: string, priority: Task["priority"] = "medium", project?: string) => {
      const agent = agents.find((a) => a.id === agentId);
      if (!agent) return;

      const now = new Date().toISOString();
      const taskId = `t-${Date.now()}`;

      // Create the task
      const newTask: Task = {
        id: taskId,
        title,
        description,
        status: "in_progress",
        priority,
        assignee: agent.name,
        project,
        tags: [],
        createdAt: now,
        updatedAt: now,
      };

      setTasks((prev) => [newTask, ...prev]);

      // Update agent status
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agentId
            ? { ...a, status: "busy" as const, currentTask: title, lastSeen: now }
            : a
        )
      );

      // Add chat message from system
      const msg: ChatMessage = {
        id: `cm-${Date.now()}`,
        agentId,
        role: "agent",
        content: `Got it. I'll start working on "${title}" right away.`,
        timestamp: now,
      };
      setChatMessages((prev) => ({
        ...prev,
        [agentId]: [...(prev[agentId] ?? []), msg],
      }));

      // Activity
      addActivity(`Task "${title}" assigned to ${agent.name}`, "task", "info");
    },
    [agents, addActivity]
  );

  const sendMessage = useCallback(
    (agentId: string, content: string) => {
      const now = new Date().toISOString();
      const agent = agents.find((a) => a.id === agentId);

      // User message
      const userMsg: ChatMessage = {
        id: `cm-${Date.now()}`,
        agentId,
        role: "user",
        content,
        timestamp: now,
      };

      // Simulated agent reply
      const replies = [
        `Understood. I'll look into that.`,
        `On it. I'll have an update for you shortly.`,
        `Good question. Let me check and get back to you.`,
        `Noted. I'll factor that into my current work.`,
        `Thanks for the heads up. Adjusting my approach accordingly.`,
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];

      const agentMsg: ChatMessage = {
        id: `cm-${Date.now() + 1}`,
        agentId,
        role: "agent",
        content: reply,
        timestamp: new Date(Date.now() + 1500).toISOString(),
      };

      setChatMessages((prev) => ({
        ...prev,
        [agentId]: [...(prev[agentId] ?? []), userMsg, agentMsg],
      }));

      if (agent) {
        addActivity(`Message sent to ${agent.name}`, "agent", "info");
      }
    },
    [agents, addActivity]
  );

  const updateTaskStatus = useCallback(
    (taskId: string, status: Task["status"]) => {
      const now = new Date().toISOString();
      let taskTitle = "";
      let taskAssignee = "";

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            taskTitle = t.title;
            taskAssignee = t.assignee ?? "";
            return { ...t, status, updatedAt: now };
          }
          return t;
        })
      );

      // If task is done, free up the agent
      if (status === "done" && taskAssignee) {
        setAgents((prev) =>
          prev.map((a) =>
            a.name === taskAssignee && a.currentTask === taskTitle
              ? { ...a, status: "idle" as const, currentTask: undefined, lastSeen: now }
              : a
          )
        );
      }

      if (taskTitle) {
        addActivity(`Task "${taskTitle}" moved to ${status.replace("_", " ")}`, "task", status === "done" ? "success" : "info");
      }
    },
    [addActivity]
  );

  const updateAgentStatus = useCallback(
    (agentId: string, status: Agent["status"], task?: string) => {
      const now = new Date().toISOString();
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agentId ? { ...a, status, currentTask: task, lastSeen: now } : a
        )
      );
    },
    []
  );

  return (
    <StoreContext.Provider
      value={{
        agents,
        tasks,
        activity,
        chatMessages,
        assignTask,
        sendMessage,
        updateTaskStatus,
        updateAgentStatus,
        addActivity,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
