import type { DashboardView } from "../../org-dashboard.constants";

import {
  SearchField,
  SearchInput,
  SearchLabel,
  Toolbar,
  ViewButton,
  ViewSwitch,
} from "./dashboard-toolbar.styles";

type DashboardToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  view: DashboardView;
  onViewChange: (view: DashboardView) => void;
  isSplitView: boolean;
};

const DashboardToolbar = ({
  search,
  onSearchChange,
  view,
  onViewChange,
  isSplitView,
}: DashboardToolbarProps) => {
  return (
    <Toolbar>
      <SearchField>
        <SearchLabel>Фильтр по названию</SearchLabel>
        <SearchInput
          id="org-search"
          type="search"
          value={search}
          placeholder="Например, Платформа"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </SearchField>
      {!isSplitView && (
        <ViewSwitch>
          <ViewButton
            type="button"
            $isActive={view === "tree"}
            onClick={() => onViewChange("tree")}
          >
            Дерево
          </ViewButton>
          <ViewButton
            type="button"
            $isActive={view === "table"}
            onClick={() => onViewChange("table")}
          >
            Таблица
          </ViewButton>
        </ViewSwitch>
      )}
    </Toolbar>
  );
};

export { DashboardToolbar };
