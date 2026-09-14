import type { OrgNodeDto } from "../types.ts";

const PERFORMANCE_MIN = 0;
const PERFORMANCE_MAX = 100;
const HEADCOUNT_MIN = 1;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function applyLivePatch(nodes: OrgNodeDto[], now = Date.now()): OrgNodeDto | null {
  if (nodes.length === 0) {
    return null;
  }

  const index = now % nodes.length;
  const current = nodes[index];

  if (!current) {
    return null;
  }

  const headcountDelta = (now % 3) - 1;
  const performanceDelta = (now % 5) - 2;
  const budgetDelta = ((now % 7) - 3) * 10_000;

  const next: OrgNodeDto = {
    ...current,
    headcount: Math.max(HEADCOUNT_MIN, current.headcount + headcountDelta),
    performance: clamp(current.performance + performanceDelta, PERFORMANCE_MIN, PERFORMANCE_MAX),
    budget: Math.max(0, current.budget + budgetDelta),
    updatedAt: new Date(now).toISOString(),
  };

  nodes[index] = next;
  return next;
}
