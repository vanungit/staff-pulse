import { createServer } from "node:http";

import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";

import { orgNodes } from "./data/org-nodes.ts";
import { applyLivePatch } from "./live/apply-live-patch.ts";

const PORT = Number(process.env.PORT ?? 3001);
const LIVE_INTERVAL_MS = Number(process.env.LIVE_INTERVAL_MS ?? 2500);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/org-tree", (_request, response) => {
  response.json(orgNodes);
});

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

const server = createServer(app);
const sockets = new WebSocketServer({ server, path: "/ws" });

function broadcast(payload: unknown): void {
  const raw = JSON.stringify(payload);

  for (const client of sockets.clients) {
    if (client.readyState === client.OPEN) {
      client.send(raw);
    }
  }
}

setInterval(() => {
  const node = applyLivePatch(orgNodes);

  if (!node) {
    return;
  }

  broadcast({ type: "node.updated", node });
}, LIVE_INTERVAL_MS);

server.listen(PORT, () => {
  console.log(`Staff Pulse API: http://127.0.0.1:${PORT}`);
});
