// ═══════════════════════════════════════════════════════════════
// API Route — POST /api/actions
// Executes a named action against the OpenClaw gateway.
//
// Request body:
//   { action: string, params?: Record<string, string> }
//
// Supported actions:
//   "refresh_status"   — re-fetch and return gateway status
//   "list_sessions"    — return current session list
//   "list_cron"        — return current cron job list
//   "gateway_restart"  — restarts the gateway (explicit guard required)
//
// Real CLI mappings (use execFile to prevent shell injection):
//   refresh_status  → execFile("openclaw", ["status", "--json"])
//   list_sessions   → execFile("openclaw", ["sessions", "list", "--json"])
//   list_cron       → execFile("openclaw", ["cron", "list", "--json"])
//   gateway_restart → execFile("openclaw", ["gateway", "restart"])
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockGateway, mockSessions, mockCronJobs } from "@/lib/mock-data";
import type { ActionResult } from "@/lib/types";

interface ActionRequestBody {
  action: string;
  params?: Record<string, string>;
}

const ALLOWED_ACTIONS = ["refresh_status", "list_sessions", "list_cron", "gateway_restart"] as const;
type AllowedAction = (typeof ALLOWED_ACTIONS)[number];

export async function POST(
  request: NextRequest
): Promise<NextResponse<ActionResult>> {
  try {
    let body: ActionRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { action, params } = body;

    // Validate action is a string and within allowed set
    if (
      !action ||
      typeof action !== "string" ||
      action.length > 50 ||
      !ALLOWED_ACTIONS.includes(action as AllowedAction)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or unsupported action",
          error: `Supported actions: ${ALLOWED_ACTIONS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    switch (action as AllowedAction) {
      case "refresh_status": {
        // TODO: wire to execFile("openclaw", ["status", "--json"])
        return NextResponse.json({
          success: true,
          message: "Gateway status refreshed",
          data: mockGateway,
        });
      }

      case "list_sessions": {
        // TODO: wire to execFile("openclaw", ["sessions", "list", "--json"])
        return NextResponse.json({
          success: true,
          message: `Returned ${mockSessions.length} sessions`,
          data: mockSessions,
        });
      }

      case "list_cron": {
        // TODO: wire to execFile("openclaw", ["cron", "list", "--json"])
        return NextResponse.json({
          success: true,
          message: `Returned ${mockCronJobs.length} cron jobs`,
          data: mockCronJobs,
        });
      }

      case "gateway_restart": {
        // Explicit guard — require confirmation param to prevent accidental restarts
        if (params?.confirm !== "true") {
          return NextResponse.json(
            {
              success: false,
              message: "gateway_restart requires explicit confirmation",
              error: 'Pass params: { confirm: "true" } to confirm this destructive action',
            },
            { status: 400 }
          );
        }

        // TODO: wire to execFile("openclaw", ["gateway", "restart"])
        return NextResponse.json({
          success: true,
          message: "Gateway restart initiated",
          data: { action: "gateway_restart", initiatedAt: new Date().toISOString() },
        });
      }
    }
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
