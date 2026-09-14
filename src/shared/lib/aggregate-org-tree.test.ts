import { describe, expect, it } from "vitest";

import type { OrgNode } from "@/shared/api/org-tree.schema";

import { aggregateOrgTree } from "./aggregate-org-tree";

function node(
  partial: Pick<OrgNode, "id" | "name" | "parentId" | "headcount" | "budget" | "performance">,
): OrgNode {
  return {
    ...partial,
    updatedAt: "2026-09-01T09:00:00.000Z",
  };
}

describe("aggregateOrgTree", () => {
  it("для листа совпадает с собственными метриками", () => {
    const rows = aggregateOrgTree([
      node({
        id: "leaf",
        name: "Команда",
        parentId: null,
        headcount: 8,
        budget: 100_000,
        performance: 70,
      }),
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.totalHeadcount).toBe(8);
    expect(rows[0]?.totalBudget).toBe(100_000);
    expect(rows[0]?.weightedPerformance).toBe(70);
  });

  it("считает взвешенное среднее, а не среднее по узлам", () => {
    const rows = aggregateOrgTree([
      node({
        id: "parent",
        name: "Отдел",
        parentId: null,
        headcount: 10,
        budget: 50_000,
        performance: 100,
      }),
      node({
        id: "child",
        name: "Команда",
        parentId: "parent",
        headcount: 90,
        budget: 150_000,
        performance: 0,
      }),
    ]);

    const parent = rows.find((row) => row.id === "parent");

    expect(parent?.totalHeadcount).toBe(100);
    expect(parent?.totalBudget).toBe(200_000);
    expect(parent?.weightedPerformance).toBe(10);
  });

  it("включает узел и всех потомков, не только прямых детей", () => {
    const rows = aggregateOrgTree([
      node({
        id: "div",
        name: "Дивизион",
        parentId: null,
        headcount: 2,
        budget: 10,
        performance: 50,
      }),
      node({
        id: "dep",
        name: "Отдел",
        parentId: "div",
        headcount: 3,
        budget: 20,
        performance: 50,
      }),
      node({
        id: "team",
        name: "Команда",
        parentId: "dep",
        headcount: 5,
        budget: 30,
        performance: 50,
      }),
    ]);

    const division = rows.find((row) => row.id === "div");

    expect(division?.totalHeadcount).toBe(10);
    expect(division?.totalBudget).toBe(60);
    expect(division?.weightedPerformance).toBe(50);
  });

  it("не делит на ноль, если headcount всего поддерева = 0", () => {
    const rows = aggregateOrgTree([
      node({
        id: "empty",
        name: "Пустой",
        parentId: null,
        headcount: 0,
        budget: 0,
        performance: 80,
      }),
    ]);

    expect(rows[0]?.weightedPerformance).toBe(0);
  });

  it("для пустого списка возвращает пустой массив", () => {
    expect(aggregateOrgTree([])).toEqual([]);
  });
});
