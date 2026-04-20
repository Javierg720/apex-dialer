/**
 * WebSocket helper for realtime call / agent events.
 *
 * Phase 0: thin wrapper with auto-reconnect stub.
 * Phase 1: message typing + store dispatch (Zustand).
 */

export type EventHandler<T = unknown> = (payload: T) => void;

const WS_BASE: string = (import.meta.env.VITE_WS_BASE_URL ?? "/ws").replace(/\/$/, "");

export interface EventsClient {
  connect(): void;
  disconnect(): void;
  on<T = unknown>(type: string, handler: EventHandler<T>): () => void;
}

export function createEventsClient(path = ""): EventsClient {
  const url = `${WS_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const handlers = new Map<string, Set<EventHandler>>();
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  function open() {
    socket = new WebSocket(url);
    socket.onmessage = (msg) => {
      try {
        const parsed = JSON.parse(msg.data) as { type?: string; payload?: unknown };
        const type = parsed.type ?? "message";
        handlers.get(type)?.forEach((h) => h(parsed.payload));
      } catch {
        // ignore non-JSON frames in phase 0
      }
    };
    socket.onclose = () => {
      reconnectTimer = setTimeout(open, 2000);
    };
    socket.onerror = () => socket?.close();
  }

  return {
    connect() {
      if (socket && socket.readyState <= WebSocket.OPEN) return;
      open();
    },
    disconnect() {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
      socket = null;
    },
    on<T = unknown>(type: string, handler: EventHandler<T>) {
      if (!handlers.has(type)) handlers.set(type, new Set());
      handlers.get(type)!.add(handler as EventHandler);
      return () => {
        handlers.get(type)?.delete(handler as EventHandler);
      };
    },
  };
}
