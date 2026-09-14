import { ZodError } from "zod";

import { orgTreeSchema, type OrgNode } from "./org-tree.schema";

export const ORG_TREE_CACHE_KEY = "org-tree";

export async function fetchOrgTree(signal: AbortSignal): Promise<unknown> {
  const response = await fetch("/api/org-tree", { signal });

  if (!response.ok) {
    throw new Error(`Сервер вернул ${response.status}`);
  }

  return response.json();
}

export function parseOrgTree(raw: unknown): OrgNode[] {
  try {
    return orgTreeSchema.parse(raw);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error("Ответ /api/org-tree не соответствует схеме");
    }

    throw error;
  }
}
