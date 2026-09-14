import cors from "cors";
import express from "express";

import { orgNodes } from "./data/org-nodes.ts";

const PORT = Number(process.env.PORT ?? 3001);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/org-tree", (_request, response) => {
  response.json(orgNodes);
});

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Staff Pulse API: http://127.0.0.1:${PORT}`);
});
