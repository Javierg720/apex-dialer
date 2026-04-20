# API Contract

The backend publishes a single OpenAPI document at `/openapi.json`. The dashboard must
consume only typed clients generated from that document — no hand-rolled fetches against
undocumented endpoints.

## Current surface (Phase 0)

| Method | Path      | Description             | Response                        |
| ------ | --------- | ----------------------- | ------------------------------- |
| GET    | `/health` | Liveness probe          | `{ "status": "ok" }`            |
| GET    | `/`       | Service metadata        | `{ "name": string, "version": string }` |

## Versioning

- Phase 1+ endpoints land under `/api/v1/`.
- Breaking changes bump to `/api/v2/` with a deprecation window of at least one minor release.
- Deprecations must be flagged in `docs/api-contract.md` and surfaced in the OpenAPI `deprecated` flag.

## Errors

```json
{
  "detail": "human-readable message",
  "code": "stable.error.code",
  "request_id": "uuid"
}
```

`request_id` propagates through structured logs so incidents are traceable across
backend, nginx, and dashboard telemetry.
