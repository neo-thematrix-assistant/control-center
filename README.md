# OpenClaw Mission Control

Dark, command-center style dashboard for managing AI operations through OpenClaw Gateway.

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build && npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local` for OpenClaw integration:

```env
# OpenClaw Gateway endpoint (future use)
OPENCLAW_GATEWAY_URL=http://localhost:8080

# OpenClaw CLI path (future use)
OPENCLAW_CLI_PATH=openclaw

# Optional: workspace root for docs indexing
WORKSPACE_ROOT=/path/to/your/workspace
```

Currently all data is served from mock data (`src/lib/mock-data.ts`). Swap to real OpenClaw CLI calls by editing the API route handlers -- each has a comment showing the corresponding CLI command.

## Architecture

```
mission-control/
  src/
    app/
      page.tsx              # Overview dashboard
      layout.tsx            # Root layout with sidebar + header
      tasks/page.tsx        # Kanban board
      office/page.tsx       # 2D office map with agent presence
      agents/page.tsx       # Agent cards/table
      projects/page.tsx     # Project status cards
      calendar/page.tsx     # Routines + cron schedule
      memory/page.tsx       # Journal + long-term memory viewer
      docs/page.tsx         # Document browser + preview
      system/page.tsx       # System controls + gateway actions
      api/
        status/route.ts     # GET  - gateway status
        sessions/route.ts   # GET  - session list
        agents/route.ts     # GET  - agent list
        cron/route.ts       # GET  - cron jobs
        memory/route.ts     # GET  - memory entries (?type=journal|long_term)
        docs/route.ts       # GET  - document index (?id= for full content)
        tasks/route.ts      # GET/POST - task CRUD
        actions/route.ts    # POST - system actions (refresh, restart, etc.)
    components/
      Sidebar.tsx           # Navigation sidebar
      Header.tsx            # Top header bar
      KPICard.tsx           # Reusable KPI metric card
      StatusBadge.tsx       # Status indicator badge
    lib/
      types.ts              # Shared TypeScript types
      mock-data.ts          # Mock data for all modules
```

## OpenClaw Integration

The API routes are thin adapters designed to call OpenClaw CLI/Gateway and normalize responses. Each route file contains a comment showing the real command:

| Route | OpenClaw Command |
|-------|-----------------|
| `GET /api/status` | `openclaw status --json` |
| `GET /api/sessions` | `openclaw sessions list --json` |
| `GET /api/agents` | `openclaw subagents list --json` |
| `GET /api/cron` | `openclaw cron list --json` |
| `GET /api/memory` | `openclaw memory search --json` |
| `POST /api/actions` | Various: `openclaw status`, `openclaw gateway restart`, etc. |

To connect to a real OpenClaw instance, replace the mock data imports in each route with `child_process.exec()` calls or HTTP requests to the Gateway API.

## Security Notes

- **Local/tailnet only**: This dashboard has no authentication. Run it behind a VPN, tailnet, or localhost only.
- **Gateway restart** requires explicit confirmation (POST body must include `params.confirm = "true"`).
- **Path traversal**: The docs endpoint validates document IDs against a known index; it does not serve arbitrary filesystem paths.
- **No secrets in client**: API routes act as a BFF layer; no credentials are exposed to the browser.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** v4
- **React** client components with HTML5 drag-and-drop
- No external UI library dependencies

## Implemented vs TODO

### Implemented (v1)
- [x] Overview with KPI cards, session list, tasks, gateway health, activity stream
- [x] Tasks Kanban with drag-and-drop between columns
- [x] Office 2D map with agent desks and mode controls (All Working/Gather/Meeting/Watercooler)
- [x] Agents page with card/table view toggle
- [x] Memory viewer with Long-Term/Journal tabs and content preview
- [x] Docs browser with search, file list, and content preview
- [x] Calendar with daily schedule, always-running automations, and cron table
- [x] Projects with progress bars and status cards
- [x] System controls with confirmation modal for dangerous actions
- [x] 8 API route handlers with typed responses
- [x] Shared components (Sidebar, Header, KPICard, StatusBadge)
- [x] Dark mission-control theme throughout

### TODO (Next Phase)
- [ ] Wire API routes to real OpenClaw Gateway/CLI
- [ ] WebSocket/SSE for live session updates
- [ ] Memory write flows (create/edit journal entries)
- [ ] Real document indexing from workspace filesystem
- [ ] Task persistence (currently in-memory only)
- [ ] Search functionality (global search bar)
- [ ] Agent communication (send messages to sessions)
- [ ] Notification system (real alerts from gateway events)
- [ ] Mobile responsive refinements
- [ ] Authentication layer (if exposed beyond localhost)
