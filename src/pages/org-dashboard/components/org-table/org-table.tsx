import type { KeyboardEvent } from "react";

import { formatBudgetRub, formatPerformance } from "@/shared/lib/format-budget";
import type { OrgAggregate } from "@/shared/lib/aggregate-org-tree";

import type { SortDirection, SortKey } from "../../utils/table-rows";

import { EmptyFilter, SortHint, Table, TableWrap, Td, Th, Tr } from "./org-table.styles";

type Column = {
  key: SortKey;
  label: string;
};

const COLUMNS: Column[] = [
  { key: "name", label: "Подразделение" },
  { key: "level", label: "Уровень" },
  { key: "totalHeadcount", label: "Всего сотрудников" },
  { key: "totalBudget", label: "Бюджет суммарный" },
  { key: "weightedPerformance", label: "Средняя эффективность" },
];

type OrgTableProps = {
  rows: OrgAggregate[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  selectedId: string | null;
  flashedIds: Set<string>;
  onSort: (key: SortKey) => void;
  onReverseSort: () => void;
  onSelect: (id: string) => void;
};

const OrgTable = ({
  rows,
  sortKey,
  sortDirection,
  selectedId,
  flashedIds,
  onSort,
  onReverseSort,
  onSelect,
}: OrgTableProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (rows.length === 0) {
      return;
    }

    const currentIndex = selectedId ? rows.findIndex((row) => row.id === selectedId) : -1;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex < 0 ? 0 : Math.min(rows.length - 1, currentIndex + 1);
      const next = rows[nextIndex];
      if (next) {
        onSelect(next.id);
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
      const next = rows[nextIndex];
      if (next) {
        onSelect(next.id);
      }
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const first = rows[0];
      if (first) {
        onSelect(first.id);
      }
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const last = rows[rows.length - 1];
      if (last) {
        onSelect(last.id);
      }
      return;
    }

    if (event.key === "Enter" && currentIndex >= 0) {
      event.preventDefault();
      const current = rows[currentIndex];
      if (current) {
        onSelect(current.id);
      }
    }
  };

  if (rows.length === 0) {
    return <EmptyFilter>Ничего не найдено по текущему фильтру.</EmptyFilter>;
  }

  return (
    <TableWrap tabIndex={0} onKeyDown={handleKeyDown} aria-label="Таблица подразделений">
      <Table>
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <Th
                key={column.key}
                $isActive={sortKey === column.key}
                onClick={() => onSort(column.key)}
                onDoubleClick={onReverseSort}
              >
                {column.label}
                {sortKey === column.key && (
                  <SortHint>{sortDirection === "asc" ? "↑" : "↓"}</SortHint>
                )}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isFlashed = flashedIds.has(row.id);

            return (
              <Tr
                key={row.id}
                $isSelected={row.id === selectedId}
                onClick={() => onSelect(row.id)}
              >
                <Td>{row.name}</Td>
                <Td>{row.levelLabel}</Td>
                <Td $isFlashed={isFlashed}>{row.totalHeadcount}</Td>
                <Td $isFlashed={isFlashed}>{formatBudgetRub(row.totalBudget)}</Td>
                <Td $isFlashed={isFlashed}>{formatPerformance(row.weightedPerformance)}</Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </TableWrap>
  );
};

export { OrgTable };
