import type { OrgAggregate } from "@/shared/lib/aggregate-org-tree";
import type { OrgNode } from "@/shared/api/org-tree.schema";

export type AggregateDelta = {
  headcount: number;
  budget: number;
  weightedSum: number;
};

export function getNodeDelta(previous: OrgNode, next: OrgNode): AggregateDelta {
  return {
    headcount: next.headcount - previous.headcount,
    budget: next.budget - previous.budget,
    weightedSum: next.performance * next.headcount - previous.performance * previous.headcount,
  };
}

/**
 * Двигаем только затронутый узел и предков. Остальные строки — те же ссылки.
 */
export function patchAggregates(
  rows: OrgAggregate[],
  ids: readonly string[],
  delta: AggregateDelta,
): OrgAggregate[] {
  if (delta.headcount === 0 && delta.budget === 0 && delta.weightedSum === 0) {
    return rows;
  }

  const affected = new Set(ids);

  return rows.map((row) => {
    if (!affected.has(row.id)) {
      return row;
    }

    const totalHeadcount = row.totalHeadcount + delta.headcount;
    const totalBudget = row.totalBudget + delta.budget;
    const previousWeightedSum = row.weightedPerformance * row.totalHeadcount;
    const weightedPerformance =
      totalHeadcount === 0 ? 0 : (previousWeightedSum + delta.weightedSum) / totalHeadcount;

    return {
      ...row,
      totalHeadcount,
      totalBudget,
      weightedPerformance,
    };
  });
}
