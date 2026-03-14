// ═══════════════════════════════════════════════════════════════
// API Route — POST /api/auth
// Validates the dashboard secret and sets a session cookie
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mc_session";
const SECRET_PATTERN = /^[a-f0-9]+$/;

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const dashboardSecret = process.env.DASHBOARD_SECRET;

    if (!dashboardSecret) {
      return NextResponse.json(
        { error: "Dashboard not configured. Run setup first." },
        { status: 503 }
      );
    }

    let body: { secret: string };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const { secret } = body;

    if (
      !secret ||
      typeof secret !== "string" ||
      secret.length > 128 ||
      !SECRET_PATTERN.test(secret)
    ) {
      return NextResponse.json(
        { error: "Invalid secret format" },
        { status: 400 }
      );
    }

    // Constant-time comparison to prevent timing attacks
    const { timingSafeEqual } = require("crypto");
    const a = Buffer.from(secret);
    const b = Buffer.from(dashboardSecret);

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.json(
        { error: "Invalid secret" },
        { status: 401 }
      );
    }

    // Set session cookie
    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, dashboardSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
