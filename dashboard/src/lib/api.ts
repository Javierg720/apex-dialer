/**
 * Thin fetch wrapper. Real client (retries, auth, request IDs) lands in Phase 1.
 */

const BASE_URL: string = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body: unknown = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      isJson && body && typeof body === "object" && "detail" in body
        ? String((body as { detail?: unknown }).detail ?? res.statusText)
        : res.statusText;
    throw new ApiError(res.status, message, body);
  }

  return body as T;
}

export const api = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, data?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: "POST",
      body: data === undefined ? undefined : JSON.stringify(data),
    }),
  put: <T>(path: string, data?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: "PUT",
      body: data === undefined ? undefined : JSON.stringify(data),
    }),
  del: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: "DELETE" }),
};
