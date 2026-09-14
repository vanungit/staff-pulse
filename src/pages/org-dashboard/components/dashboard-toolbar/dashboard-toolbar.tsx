import type { DashboardView } from "../../org-dashboard.constants";

import {
  SearchField,
  SearchHint,
  SearchInput,
  SearchLabel,
  Toolbar,
  ViewButton,
  ViewSwitch,
} from "./dashboard-toolbar.styles";

type DashboardToolbarProps = {
  search: string;
  searchHint: string;
  searchMode: "structured" | "fallback" | "idle";
  onSearchChange: (value: string) => void;
  view: DashboardView;
  onViewChange: (view: DashboardView) => void;
  isSplitView: boolean;
};

const DashboardToolbar = ({
  search,
  searchHint,
  searchMode,
  onSearchChange,
  view,
  onViewChange,
  isSplitView,
}: DashboardToolbarProps) => {
  return (
    <Toolbar>
      <SearchField>
        <SearchLabel>AI-поиск</SearchLabel>
        <SearchInput
          id="org-search"
          type="search"
          value={search}
          placeholder="команды с эффективностью выше 80"
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <SearchHint $mode={searchMode}>{searchHint}</SearchHint>
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
