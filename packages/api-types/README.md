# @apex/api-types

Shared TypeScript types generated from the backend's OpenAPI document.

## Regenerating

```bash
make gen-types
```

That script:

1. Boots the backend container (or reuses a running one).
2. Curls `http://backend:8000/openapi.json`.
3. Runs `openapi-typescript` to emit `index.d.ts` next to this README.
4. Formats the output with prettier.

Phase 0 ships only this placeholder. The generator script (`scripts/gen-api-types.sh`) is
a stub that prints instructions. Wire the real tool in Phase 1 once the backend has more
than a `/health` endpoint.

## Consumption

From the dashboard:

```ts
import type { paths } from "@apex/api-types";
type Health = paths["/health"]["get"]["responses"]["200"]["content"]["application/json"];
```
