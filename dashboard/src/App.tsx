import { useQuery } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import clsx from "clsx";

import { api } from "@/lib/api";
import type { HealthResponse } from "@/lib/types";
import Home from "@/pages/Home";

function HealthBadge() {
  const { data, isLoading, isError } = useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: () => api.get<HealthResponse>("/health"),
    refetchInterval: 15_000,
  });

  const label = isLoading ? "checking…" : isError ? "offline" : (data?.status ?? "unknown");
  const healthy = !isLoading && !isError && data?.status === "ok";

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition",
        healthy
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
          : "border-rose-500/40 bg-rose-500/10 text-rose-300",
      )}
      aria-live="polite"
    >
      <span
        className={clsx(
          "h-2 w-2 rounded-full",
          healthy ? "bg-emerald-400" : "bg-rose-400",
          !isError && isLoading && "animate-pulse",
        )}
      />
      backend: {label}
    </span>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800/60 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-apex-500 shadow-[0_0_24px_rgba(14,165,233,0.5)]" />
            <h1 className="text-xl font-semibold tracking-tight">Apex Dialer</h1>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              phase 0
            </span>
          </div>
          <HealthBadge />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}
