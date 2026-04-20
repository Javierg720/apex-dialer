# Runbook

## Bring the stack up

```bash
cp .env.template .env
make up
make logs
```

Dashboard: http://localhost
API:       http://localhost/api/health

## Common problems

### `backend` unhealthy

1. `make logs` and grep for stack traces.
2. `docker compose exec backend env | grep DATABASE_URL` — must point at `postgres:5432`.
3. `docker compose exec postgres pg_isready -U apex` — confirms the DB accepts connections.
4. If migrations are out of date: `make migrate`.

### `postgres` won't start after volume change

The init.sql script only runs on an *empty* data dir. If you changed it,
`make clean` wipes the volume and re-bootstraps.

### Dashboard shows "backend: offline"

- Hit `http://localhost/api/health` directly in the browser.
- If that 502s, nginx can't reach the backend — check the backend container is up
  and on the `apex-net` network.

## Backups (prod)

- Postgres: `pg_basebackup` nightly + WAL archiving to S3.
- Redis: `BGSAVE` for state we actually care about (queues dump + reload on cold start).
- Grafana: dashboards are provisioned from `infrastructure/grafana/dashboards/`, so git is the source of truth.

## Incident checklist

- [ ] Page on-call.
- [ ] Snapshot Prometheus graphs for the incident window.
- [ ] Capture `docker compose logs --since 15m` into the ticket.
- [ ] Preserve any active-call recordings referenced in the timeframe.
- [ ] Post-mortem within 72h.
