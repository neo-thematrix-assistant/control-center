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
// Real CLI mappings:
//   refresh_status  → openclaw status --json
//   list_sessions   → openclaw sessions list --json
//   list_cron       → openclaw cron list --json
//   gateway_restart → openclaw gateway restart
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockGateway, mockSessions, mockCronJobs } from "@/lib/mock-data";
import type { ActionResult } from "@/lib/types";

interface ActionRequestBody {
  action: string;
  params?: Record<string, string>;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ActionResult>> {
  try {
    let body: ActionRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body", error: "Could not parse request body" },
        { status: 400 }
      );
    }

    const { action, params } = body;

    if (!action || typeof action !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing required field: action", error: "action must be a non-empty string" },
        { status: 400 }
      );
    }

    switch (action) {
      case "refresh_status": {
        // TODO: const raw = await exec("openclaw status --json");
        // const data = JSON.parse(raw);
        return NextResponse.json({
          success: true,
          message: "Gateway status refreshed",
          data: mockGateway,
        });
      }

      case "list_sessions": {
        // TODO: const raw = await exec("openclaw sessions list --json");
        // const data = JSON.parse(raw);
        return NextResponse.json({
          success: true,
          message: `Returned ${mockSessions.length} sessions`,
          data: mockSessions,
        });
      }

      case "list_cron": {
        // TODO: const raw = await exec("openclaw cron list --json");
        // const data = JSON.parse(raw);
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

        // TODO: await exec("openclaw gateway restart");
        return NextResponse.json({
          success: true,
          message: "Gateway restart initiated",
          data: { action: "gateway_restart", initiatedAt: new Date().toISOString() },
        });
      }

      default: {
        return NextResponse.json(
          {
            success: false,
            message: `Unknown action: "${action}"`,
            error: `Supported actions: refresh_status, list_sessions, list_cron, gateway_restart`,
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
