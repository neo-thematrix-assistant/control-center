# Mission Control

White-label AI operations dashboard for [OpenClaw](https://github.com/openclaw). Install globally, enter your org name, and you're running.

## Quick Start

```bash
npm install -g openclaw-mission-control
mission-control setup
mission-control dev
```

That's it. Open [http://localhost:3000](http://localhost:3000).

## What You Get

- **Overview** — live agent status, active tasks, system health at a glance
- **Tasks** — Kanban board with drag-and-drop
- **Calendar** — daily routines, automations, and cron schedule
- **Office** — 2D map showing where your agents are working
- **Projects** — progress tracking with assignee avatars
- **Agents** — card/table view of all agents
- **Team** — full team roster organized by department
- **Memory** — journal and long-term memory viewer
- **Docs** — document browser with content preview
- **System** — gateway controls, restart, health metrics

## How It Works

Mission Control connects to your local/remote OpenClaw gateway through the OpenClaw CLI. All API routes call `openclaw <command> --json` under the hood, and the server forwards `OPENCLAW_GATEWAY_URL` plus gateway auth (`OPENCLAW_GATEWAY_TOKEN` / `OPENCLAW_GATEWAY_PASSWORD`) when set. If the gateway is unreachable, the dashboard gracefully falls back to demo data so you can explore the UI immediately.

### Setup Options

**Interactive CLI** (recommended):
```bash
mission-control setup
```
Auto-detects your OpenClaw binary, workspace, and gateway token. Prompts for your organization name.

**In-browser wizard**:
Just run `mission-control dev` without setup — you'll be redirected to a setup page on first visit.

**Manual**:
Create `~/.config/openclaw-mission-control/.env.local`:
```env
ORG_NAME="Your Org Name"
DASHBOARD_SECRET=your-dashboard-secret
OPENCLAW_BIN=openclaw
WORKSPACE_PATH=~/.openclaw/workspace
OPENCLAW_GATEWAY_URL=
OPENCLAW_GATEWAY_TOKEN=your-token-here
# OPENCLAW_GATEWAY_PASSWORD=your-password-here
PORT=3000
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `mission-control setup` | Interactive first-time configuration |
| `mission-control dev` | Start development server |
| `mission-control start` | Start production server |
| `mission-control build` | Build for production |

## White Label

Set `ORG_NAME` to anything and Mission Control brands itself automatically — sidebar, page title, browser tab, and metadata all update. No code changes needed.

## Gateway Integration

Every API route tries the real OpenClaw CLI first, then falls back to mock data:

| Route | CLI Command |
|-------|-------------|
| `GET /api/status` | `openclaw status --json` |
| `GET /api/agents` | `openclaw agents list --json` |
| `GET /api/sessions` | `openclaw sessions list --json` |
| `GET /api/cron` | `openclaw cron list --json` |
| `GET /api/memory` | `openclaw memory list --json` |
| `GET /api/docs` | `openclaw docs list --json` |
| `GET /api/tasks` | `openclaw tasks list --json` |
| `POST /api/actions` | Various per action type |

## Security

- **Local only** — no authentication built in. Run behind a VPN, tailnet, or localhost.
- **No shell injection** — uses `execFile` (array args), never `exec` with string interpolation.
- **Input validation** — all API inputs are validated with length limits, type allowlists, and regex patterns.
- **No secrets in client** — API routes act as a backend-for-frontend; no credentials reach the browser.
- **Security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy all configured.
- **Gateway restart** requires explicit confirmation (`params.confirm = "true"`).
- **Config file** written with `0600` permissions.

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- React 19 client components
- Zero external UI library dependencies

## Contributing

```bash
git clone https://github.com/neo-thematrix-assistant/control-center.git
cd control-center/mission-control
npm install
npm run dev
```

PRs welcome. Please open an issue first for major changes.

## License

MIT
