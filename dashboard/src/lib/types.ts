/**
 * Shared API response types.
 *
 * Phase 1: generated from backend OpenAPI via `make gen-types`. Until then,
 * add hand-rolled interfaces here as the backend contract grows.
 */

export interface HealthResponse {
  status: "ok" | "degraded" | "down";
}

export interface ApiErrorBody {
  detail?: string;
}
