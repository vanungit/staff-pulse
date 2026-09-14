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
  onSort: (key: SortKey) => void;
  onReverseSort: () => void;
  onSelect: (id: string) => void;
};

const OrgTable = ({
  rows,
  sortKey,
  sortDirection,
  selectedId,
  onSort,
  onReverseSort,
  onSelect,
}: OrgTableProps) => {
  if (rows.length === 0) {
    return <EmptyFilter>Ничего не найдено по текущему фильтру.</EmptyFilter>;
  }

  return (
    <TableWrap>
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
          {rows.map((row) => (
            <Tr
              key={row.id}
              $isSelected={row.id === selectedId}
              onClick={() => onSelect(row.id)}
            >
              <Td>{row.name}</Td>
              <Td>{row.levelLabel}</Td>
              <Td>{row.totalHeadcount}</Td>
              <Td>{formatBudgetRub(row.totalBudget)}</Td>
              <Td>{formatPerformance(row.weightedPerformance)}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableWrap>
  );
};

export { OrgTable };
