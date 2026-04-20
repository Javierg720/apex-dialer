# Architecture

## Goals

- Sub-200ms round-trip for agent UI actions.
- Sub-800ms end-to-end for "caller speaks → AI responds" in autonomous mode.
- Horizontal scale on dialer workers; vertical on Postgres until replicas earn their keep.
- Strict compliance posture (TCPA, state DNC, call recording disclosure).

## Services

### backend (FastAPI)
- HTTP API for dashboard + webhooks.
- WebSocket gateway for live call events.
- Dialer worker pool (asyncio) — pacing, lead queue, campaign orchestration.
- AMI bridge (panoramisk) — originates calls, listens for channel events.
- Voice pipeline: Deepgram (STT) → Groq (LLM) → Piper / edge-tts (TTS).

### dashboard (React + Vite)
- Operator UX, agent console, campaign management, compliance reports.
- Realtime updates via WebSocket subscription to `/ws/calls`.
- jsSIP for optional soft-phone mode in-browser.

### Data plane
- **Postgres 16** — system of record: leads, calls, recordings metadata, agents, DNC.
- **Redis 7** — session cache, lead queue, pubsub for dialer events, rate limits.

### Edge
- **nginx** — TLS termination, `/api` and `/ws` routing, static asset serving.

### Observability
- **Prometheus** scrapes `backend:/metrics`.
- **Grafana** provisions a Prometheus datasource; dashboards land under
  `infrastructure/grafana/dashboards/`.

## Phase plan

1. **Phase 0 (this repo)** — monorepo skeleton, CI, compose, health check. ← we are here.
2. **Phase 1** — migrate RingAI backend + EXODUS dashboard. No new features, just fit.
3. **Phase 2** — unify auth, add RBAC, generate api-types, wire realtime end-to-end.
4. **Phase 3** — compliance hardening, call-recording lifecycle, audit trail.
5. **Phase 4** — multi-tenant, k8s, HA Postgres.
