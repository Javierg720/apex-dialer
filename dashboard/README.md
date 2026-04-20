# Dashboard — Apex Dialer

React 18 + TypeScript 5.3 + Vite 5 + Tailwind 3.4. State via Zustand, async via TanStack
Query, realtime via jsSIP + WebSocket. Routing via React Router 6.

> **Phase 0 (current):** Skeleton. Pings `/health`, shows a green badge on success.
> **Phase 1:** Real UI is migrated here from `Javierg720/exodus-dialer-backup`.

## Scripts

```bash
npm ci
npm run dev          # vite dev server on 5173
npm run build        # production bundle → dist/
npm run preview      # serve built bundle locally
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run format       # prettier --write
```

## Environment

Vite only exposes vars prefixed `VITE_`. See root `.env.template`:

- `VITE_API_BASE_URL` — where `src/lib/api.ts` points (default: `/api`)
- `VITE_WS_BASE_URL` — WebSocket origin for realtime call events

In dev behind nginx you can leave them at the defaults.
