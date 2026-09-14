import { useEffect, useRef, useState } from "react";

import { orgNodePatchSchema } from "@/shared/api/org-tree-patch.schema";
import type { OrgNode } from "@/shared/api/org-tree.schema";

import {
  INITIAL_BACKOFF_MS,
  MAX_BACKOFF_MS,
  type SocketStatus,
} from "../org-dashboard.constants";

type UseOrgSocketParams = {
  isEnabled: boolean;
  onPatch: (node: OrgNode) => void;
};

function getSocketUrl(): string {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}/ws`;
}

export function useOrgSocket({ isEnabled, onPatch }: UseOrgSocketParams): SocketStatus {
  const [status, setStatus] = useState<SocketStatus>("offline");
  const onPatchRef = useRef(onPatch);
  onPatchRef.current = onPatch;

  useEffect(() => {
    if (!isEnabled) {
      setStatus("offline");
      return;
    }

    let isCancelled = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let attempt = 0;

    const clearTimer = () => {
      if (reconnectTimer !== null) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const connect = () => {
      if (isCancelled) {
        return;
      }

      setStatus(attempt === 0 ? "connecting" : "reconnecting");
      socket = new WebSocket(getSocketUrl());

      socket.onopen = () => {
        if (isCancelled) {
          return;
        }

        attempt = 0;
        setStatus("online");
      };

      socket.onmessage = (event) => {
        try {
          const parsed = orgNodePatchSchema.parse(JSON.parse(event.data));
          onPatchRef.current(parsed.node);
        } catch {
          // Невалидный кадр не рвёт соединение и не роняет UI.
        }
      };

      socket.onclose = () => {
        if (isCancelled) {
          return;
        }

        const delay = Math.min(MAX_BACKOFF_MS, INITIAL_BACKOFF_MS * 2 ** attempt);
        attempt += 1;
        setStatus("reconnecting");
        reconnectTimer = window.setTimeout(connect, delay);
      };

      socket.onerror = () => {
        socket?.close();
      };
    };

    connect();

    return () => {
      isCancelled = true;
      clearTimer();
      socket?.close();
    };
  }, [isEnabled]);

  return status;
}
