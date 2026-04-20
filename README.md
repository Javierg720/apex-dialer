# Apex Dialer

Production-grade AI voice dialer platform. Fuses a FastAPI + Postgres + Asterisk backend
(telephony, real-time transcription, TTS, predictive outbound) with a React 18 operator
dashboard (live call monitoring, agent UX, campaign management).

This repo is the **monorepo shell**. Phase 1 fills it by migrating:

- `Javierg720/ringai` → `backend/` (FastAPI scale + Asterisk + Pipecat-style bot)
- `Javierg720/exodus-dialer-backup` → `dashboard/` (React + Vite + Tailwind operator UI)

Ties go to the backend stack — RingAI's choices win.

## Quickstart

```bash
cp .env.template .env    # edit secrets
make up                  # docker compose up --build -d
make logs                # follow logs
open http://localhost    # dashboard via nginx
```

Health check: `curl http://localhost/api/health`

## Architecture

```
                           ┌─────────────────────────┐
                           │      nginx (80/443)     │
                           │  reverse proxy + TLS    │
                           └──────────┬──────────────┘
                                      │
                ┌─────────────────────┴──────────────────────┐
                │                                            │
                ▼                                            ▼
    ┌────────────────────┐                        ┌─────────────────────┐
    │  dashboard (React) │                        │  backend (FastAPI)  │
    │  Vite + Tailwind   │◀── REST / WS ─────────▶│  async SQLAlchemy   │
    │  TanStack Query    │                        │  Alembic migrations │
    │  Zustand + jsSIP   │                        │  panoramisk / AMI   │
    └────────────────────┘                        └─────┬──────────┬────┘
                                                        │          │
                                           ┌────────────┘          └────────────┐
                                           ▼                                    ▼
                                  ┌─────────────────┐                 ┌──────────────────┐
                                  │  Postgres 16    │                 │    Redis 7       │
                                  │  calls, agents, │                 │  pubsub, cache,  │
                                  │  campaigns, DNC │                 │  rate limit, job │
                                  └─────────────────┘                 └──────────────────┘

              ┌────────────────────────┐       ┌────────────────────────┐
              │   Prometheus (9090)    │◀──────│  backend /metrics      │
              │   scrape + alert       │       └────────────────────────┘
              └───────────┬────────────┘
                          ▼
              ┌────────────────────────┐
              │     Grafana (3000)     │
              │  dashboards + alerts   │
              └────────────────────────┘
```

## Layout

- **`backend/`** — FastAPI 0.110+, Python 3.11, SQLAlchemy 2 async, Alembic, Pydantic v2,
  Panoramisk (Asterisk AMI), Deepgram + Groq + Piper (STT/LLM/TTS). Tests via pytest-asyncio.
- **`dashboard/`** — Vite 5, React 18, TypeScript 5.3 strict, Tailwind 3.4, TanStack Query 5,
  Zustand 4, React Router 6, Framer Motion, Recharts, WaveSurfer, jsSIP.
- **`infrastructure/`** — nginx edge config, Postgres init, Prometheus scrape config,
  Grafana datasources.
- **`packages/api-types/`** — Shared TypeScript types generated from backend OpenAPI
  (placeholder; real generator lands in Phase 1).
- **`docs/`** — Architecture, runbook, API contract.
- **`scripts/`** — Dev helpers (`dev.sh`, `migrate.sh`, `gen-api-types.sh`).

## Phase 1 Migration Notes

When source lands, **do not** merge both dependency trees — the backend stack from RingAI
wins. Dashboard keeps EXODUS's Vite + Tailwind setup; do not port Next.js. All calls from
the dashboard must go through `/api/*` (proxied by nginx) so dev and prod share one origin.

## Development

```bash
make up         # start full stack
make down       # stop + remove containers
make logs       # tail logs
make migrate    # run alembic upgrade head
make test       # backend pytest + dashboard lint+typecheck+build
make lint       # ruff + eslint
make fmt        # black + prettier
make gen-types  # regenerate packages/api-types from OpenAPI
make clean      # remove volumes (destructive)
```

## License

MIT — see [LICENSE](./LICENSE).
