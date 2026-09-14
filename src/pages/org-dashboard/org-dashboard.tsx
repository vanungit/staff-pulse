import { useEffect, useMemo, useState } from "react";

import { aggregateOrgTree } from "@/shared/lib/aggregate-org-tree";
import {
  buildTree,
  DEFAULT_EXPANDED_DEPTH,
  getDefaultExpandedIds,
} from "@/shared/lib/build-tree";
import { getAncestorIds } from "@/shared/lib/get-ancestor-ids";
import { useDebouncedValue } from "@/shared/lib/use-debounced-value";
import { useMediaQuery } from "@/shared/lib/use-media-query";

import { DashboardToolbar } from "./components/dashboard-toolbar/dashboard-toolbar";
import { OrgTable } from "./components/org-table/org-table";
import { OrgTree } from "./components/org-tree/org-tree";
import { StatusState } from "./components/status-state/status-state";
import { useOrgTree } from "./hooks/use-org-tree";
import {
  SEARCH_DEBOUNCE_MS,
  SPLIT_VIEW_QUERY,
  type DashboardView,
} from "./org-dashboard.constants";
import {
  Brand,
  BrandName,
  Header,
  Layout,
  Main,
  Meta,
  Page,
  Panel,
  PanelTitle,
  Title,
} from "./org-dashboard.styles";
import {
  filterAggregates,
  sortAggregates,
  type SortDirection,
  type SortKey,
} from "./utils/table-rows";

const OrgDashboard = () => {
  const { data, error, isLoading } = useOrgTree();
  const isSplitView = useMediaQuery(SPLIT_VIEW_QUERY);

  const [expandedIds, setExpandedIds] = useState<Set<string> | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<DashboardView>("tree");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const roots = useMemo(() => (data ? buildTree(data) : []), [data]);
  const aggregates = useMemo(() => (data ? aggregateOrgTree(data) : []), [data]);

  const tableRows = useMemo(() => {
    const filtered = filterAggregates(aggregates, debouncedSearch);
    return sortAggregates(filtered, sortKey, sortDirection);
  }, [aggregates, debouncedSearch, sortDirection, sortKey]);

  const resolvedExpanded = useMemo(() => {
    if (expandedIds) {
      return expandedIds;
    }

    if (roots.length === 0) {
      return new Set<string>();
    }

    return getDefaultExpandedIds(roots, DEFAULT_EXPANDED_DEPTH);
  }, [expandedIds, roots]);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    document
      .querySelector(`[data-node-id="${selectedId}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedId, view, isSplitView]);

  const handleToggle = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current ?? resolvedExpanded);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);

    if (!data) {
      return;
    }

    const ancestors = getAncestorIds(data, id);

    setExpandedIds((current) => {
      const next = new Set(current ?? resolvedExpanded);
      ancestors.forEach((ancestorId) => next.add(ancestorId));
      return next;
    });
  };

  const handleSort = (key: SortKey) => {
    setSortKey(key);

    if (key !== sortKey) {
      setSortDirection("asc");
    }
  };

  const handleReverseSort = () => {
    setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const shouldShowTree = isSplitView || view === "tree";
  const shouldShowTable = isSplitView || view === "table";

  return (
    <Page>
      <Header>
        <Brand>
          <BrandName>Staff Pulse</BrandName>
          <Title>Оргструктура</Title>
        </Brand>
        <Meta>{data ? `${data.length} подразделений` : "мониторинг"}</Meta>
      </Header>
      <Main>
        {isLoading && <StatusState kind="loading" />}
        {error && (
          <StatusState kind="error" message={error.message} onRetry={handleRetry} />
        )}
        {data && data.length === 0 && <StatusState kind="empty" />}
        {data && data.length > 0 && (
          <>
            <DashboardToolbar
              search={search}
              onSearchChange={setSearch}
              view={view}
              onViewChange={setView}
              isSplitView={isSplitView}
            />
            <Layout $isSplit={isSplitView}>
              {shouldShowTree && (
                <Panel>
                  <PanelTitle>Дерево · второй уровень раскрыт</PanelTitle>
                  <OrgTree
                    roots={roots}
                    expandedIds={resolvedExpanded}
                    selectedId={selectedId}
                    onToggle={handleToggle}
                    onSelect={handleSelect}
                  />
                </Panel>
              )}
              {shouldShowTable && (
                <Panel>
                  <PanelTitle>
                    Аналитика · суммы по потомкам, эффективность взвешена по headcount
                  </PanelTitle>
                  <OrgTable
                    rows={tableRows}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    selectedId={selectedId}
                    onSort={handleSort}
                    onReverseSort={handleReverseSort}
                    onSelect={handleSelect}
                  />
                </Panel>
              )}
            </Layout>
          </>
        )}
      </Main>
    </Page>
  );
};

export { OrgDashboard };
