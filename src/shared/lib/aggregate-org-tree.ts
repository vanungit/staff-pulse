import { buildTree, type OrgTreeNode } from "@/shared/lib/build-tree";
import type { OrgNode } from "@/shared/api/org-tree.schema";

export const LEVEL_LABELS = ["Компания", "Дивизион", "Отдел", "Команда"] as const;

export type OrgAggregate = {
  id: string;
  name: string;
  level: number;
  levelLabel: string;
  totalHeadcount: number;
  totalBudget: number;
  weightedPerformance: number;
};

type SubtreeTotals = {
  headcount: number;
  budget: number;
  weightedSum: number;
};

function levelLabel(depth: number): string {
  return LEVEL_LABELS[depth] ?? `Уровень ${depth + 1}`;
}

/**
 * Один проход снизу вверх (post-order).
 * Суммы = сам узел + все потомки.
 * Эффективность = Σ(performance_i × headcount_i) / Σ(headcount_i), не среднее по узлам.
 */
export function aggregateOrgTree(nodes: OrgNode[]): OrgAggregate[] {
  const roots = buildTree(nodes);
  const result: OrgAggregate[] = [];

  const walk = (node: OrgTreeNode): SubtreeTotals => {
    let headcount = node.headcount;
    let budget = node.budget;
    let weightedSum = node.performance * node.headcount;

    for (const child of node.children) {
      const childTotals = walk(child);
      headcount += childTotals.headcount;
      budget += childTotals.budget;
      weightedSum += childTotals.weightedSum;
    }

    result.push({
      id: node.id,
      name: node.name,
      level: node.depth,
      levelLabel: levelLabel(node.depth),
      totalHeadcount: headcount,
      totalBudget: budget,
      weightedPerformance: headcount === 0 ? 0 : weightedSum / headcount,
    });

    return { headcount, budget, weightedSum };
  };

  roots.forEach(walk);

  return result;
}
