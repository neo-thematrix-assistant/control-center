// ═══════════════════════════════════════════════════════════════
// Middleware — auth + setup redirect
// 1. If not configured → redirect to /setup
// 2. If configured → validate session cookie on all routes
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mc_session";

// Routes that don't require authentication
const PUBLIC_PATHS = ["/setup", "/api/setup", "/login", "/api/auth"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static assets
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  const dashboardSecret = process.env.DASHBOARD_SECRET || "";
  const isConfigured = !!(dashboardSecret && process.env.ORG_NAME);

  // ── Not configured: redirect to setup ───────────────────────
  if (!isConfigured) {
    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/setup", request.url));
  }

  // ── Configured: check auth on all non-public routes ─────────
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME);
  const isAuthed = sessionCookie?.value === dashboardSecret;

  if (!isAuthed) {
    // API routes get 401, page routes get redirected to login
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
