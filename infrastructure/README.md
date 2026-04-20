# Infrastructure

Compose-managed runtime dependencies and edge config.

| Service    | Purpose                                | Exposed port    |
| ---------- | -------------------------------------- | --------------- |
| nginx      | TLS termination + reverse proxy        | 80, 443         |
| postgres   | Primary datastore (apex DB)            | internal        |
| redis      | Cache, pubsub, job queue               | internal        |
| prometheus | Scrape backend `/metrics`              | internal (9090) |
| grafana    | Dashboards + alerts                    | internal (3000) |

`nginx/` routes `/api/*` → `backend:8000` and everything else → `dashboard:80`.
