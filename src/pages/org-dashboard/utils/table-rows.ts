import type { OrgAggregate } from "@/shared/lib/aggregate-org-tree";

export type SortKey =
  | "name"
  | "level"
  | "totalHeadcount"
  | "totalBudget"
  | "weightedPerformance";

export type SortDirection = "asc" | "desc";

export function sortAggregates(
  rows: OrgAggregate[],
  key: SortKey,
  direction: SortDirection,
): OrgAggregate[] {
  const sign = direction === "asc" ? 1 : -1;

  return [...rows].sort((left, right) => {
    const leftValue = left[key];
    const rightValue = right[key];

    if (typeof leftValue === "string" && typeof rightValue === "string") {
      return leftValue.localeCompare(rightValue, "ru") * sign;
    }

    return (Number(leftValue) - Number(rightValue)) * sign;
  });
}
