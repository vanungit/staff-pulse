import { describe, expect, it } from "vitest";

import type { OrgNode } from "@/shared/api/org-tree.schema";

import { aggregateOrgTree } from "./aggregate-org-tree";
import { getAncestorIds } from "./get-ancestor-ids";
import { getNodeDelta, patchAggregates } from "./patch-aggregates";

function node(
  partial: Pick<OrgNode, "id" | "name" | "parentId" | "headcount" | "budget" | "performance">,
): OrgNode {
  return {
    ...partial,
    updatedAt: "2026-09-01T09:00:00.000Z",
  };
}

const seed: OrgNode[] = [
  node({
    id: "div",
    name: "Дивизион",
    parentId: null,
    headcount: 2,
    budget: 10,
    performance: 40,
  }),
  node({
    id: "dep",
    name: "Отдел",
    parentId: "div",
    headcount: 3,
    budget: 20,
    performance: 60,
  }),
  node({
    id: "team",
    name: "Команда",
    parentId: "dep",
    headcount: 5,
    budget: 30,
    performance: 80,
  }),
  node({
    id: "other",
    name: "Другой отдел",
    parentId: "div",
    headcount: 4,
    budget: 40,
    performance: 20,
  }),
];

describe("patchAggregates", () => {
  it("совпадает с полным пересчётом только для узла и предков", () => {
    const previous = seed;
    const nextTeam: OrgNode = {
      ...seed[2]!,
      headcount: 8,
      budget: 50,
      performance: 90,
    };
    const nextNodes = previous.map((item) => (item.id === "team" ? nextTeam : item));
    const full = aggregateOrgTree(nextNodes);
    const incremental = patchAggregates(
      aggregateOrgTree(previous),
      ["team", ...getAncestorIds(nextNodes, "team")],
      getNodeDelta(seed[2]!, nextTeam),
    );

    for (const id of ["team", "dep", "div"]) {
      const left = incremental.find((row) => row.id === id);
      const right = full.find((row) => row.id === id);
      expect(left?.totalHeadcount).toBe(right?.totalHeadcount);
      expect(left?.totalBudget).toBe(right?.totalBudget);
      expect(left?.weightedPerformance).toBeCloseTo(right?.weightedPerformance ?? 0, 10);
    }
  });

  it("не создаёт новые объекты для незатронутых строк", () => {
    const rows = aggregateOrgTree(seed);
    const otherBefore = rows.find((row) => row.id === "other");
    const nextTeam: OrgNode = { ...seed[2]!, headcount: 6 };
    const next = patchAggregates(
      rows,
      ["team", "dep", "div"],
      getNodeDelta(seed[2]!, nextTeam),
    );

    expect(next.find((row) => row.id === "other")).toBe(otherBefore);
  });
});
