import { useEffect, useMemo, useRef, useState } from "react";

import { aggregateOrgTree } from "@/shared/lib/aggregate-org-tree";
import {
  buildTree,
  DEFAULT_EXPANDED_DEPTH,
  getDefaultExpandedIds,
} from "@/shared/lib/build-tree";
import { getAncestorIds } from "@/shared/lib/get-ancestor-ids";
import {
  applyOrgSearchFilter,
  describeSearch,
  parseOrgSearch,
} from "@/shared/lib/parse-org-search";
import { scrollChildIntoView } from "@/shared/lib/scroll-child-into-view";
import { useDebouncedValue } from "@/shared/lib/use-debounced-value";
import { useMediaQuery } from "@/shared/lib/use-media-query";

import { ConnectionIndicator } from "./components/connection-indicator/connection-indicator";
import { DashboardToolbar } from "./components/dashboard-toolbar/dashboard-toolbar";
import { OrgTable } from "./components/org-table/org-table";
import { OrgTree } from "./components/org-tree/org-tree";
import { StatusState } from "./components/status-state/status-state";
import { useLiveOrgState } from "./hooks/use-live-org-state";
import { useOrgSocket } from "./hooks/use-org-socket";
import { useOrgTree } from "./hooks/use-org-tree";
import {
  SEARCH_DEBOUNCE_MS,
  SPLIT_VIEW_QUERY,
  TREE_EXPAND_MS,
  type DashboardView,
} from "./org-dashboard.constants";
import {
  Brand,
  BrandName,
  Header,
  HeaderAside,
  Layout,
  Main,
  Meta,
  Page,
  Panel,
  PanelBody,
  PanelTitle,
  Title,
} from "./org-dashboard.styles";
import { sortAggregates, type SortDirection, type SortKey } from "./utils/table-rows";

const OrgDashboard = () => {
  const { data, error, isLoading } = useOrgTree();
  const { nodes, aggregates: liveAggregates, flashedIds, applyPatch } = useLiveOrgState(data);
  const socketStatus = useOrgSocket({
    isEnabled: Boolean(nodes && nodes.length > 0),
    onPatch: applyPatch,
  });
  const isSplitView = useMediaQuery(SPLIT_VIEW_QUERY);
  const treeScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const [expandedIds, setExpandedIds] = useState<Set<string> | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<DashboardView>("tree");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const aggregates = useMemo(() => {
    if (liveAggregates.length > 0) {
      return liveAggregates;
    }

    return nodes ? aggregateOrgTree(nodes) : [];
  }, [liveAggregates, nodes]);

  const roots = useMemo(() => (nodes ? buildTree(nodes) : []), [nodes]);

  const parsedSearch = useMemo(() => parseOrgSearch(debouncedSearch), [debouncedSearch]);
  const searchHint = describeSearch(parsedSearch);
  const searchMode = debouncedSearch.trim() ? parsedSearch.mode : "idle";

  const tableRows = useMemo(() => {
    const filtered = applyOrgSearchFilter(aggregates, parsedSearch.filter);
    return sortAggregates(filtered, sortKey, sortDirection);
  }, [aggregates, parsedSearch, sortDirection, sortKey]);

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

    const treeSelector = `[data-node-id="${CSS.escape(selectedId)}"]`;
    const rowSelector = `[data-row-id="${CSS.escape(selectedId)}"]`;

    const frameId = window.requestAnimationFrame(() => {
      scrollChildIntoView(treeScrollRef.current, treeSelector);
      scrollChildIntoView(tableScrollRef.current, rowSelector);
    });

    const timerId = window.setTimeout(() => {
      scrollChildIntoView(treeScrollRef.current, treeSelector);
      scrollChildIntoView(tableScrollRef.current, rowSelector);
    }, TREE_EXPAND_MS);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timerId);
    };
  }, [isSplitView, selectedId, view, resolvedExpanded]);

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

    if (!nodes) {
      return;
    }

    const ancestors = getAncestorIds(nodes, id);

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
        <HeaderAside>
          <Meta>{nodes ? `${nodes.length} подразделений` : "мониторинг"}</Meta>
          <ConnectionIndicator status={socketStatus} />
        </HeaderAside>
      </Header>
      <Main>
        {isLoading && <StatusState kind="loading" />}
        {error && (
          <StatusState kind="error" message={error.message} onRetry={handleRetry} />
        )}
        {data && data.length === 0 && <StatusState kind="empty" />}
        {nodes && nodes.length > 0 && (
          <>
            <DashboardToolbar
              search={search}
              searchHint={searchHint}
              searchMode={searchMode}
              onSearchChange={setSearch}
              view={view}
              onViewChange={setView}
              isSplitView={isSplitView}
            />
            <Layout $isSplit={isSplitView}>
              {shouldShowTree && (
                <Panel>
                  <PanelTitle>Дерево · второй уровень раскрыт</PanelTitle>
                  <PanelBody ref={treeScrollRef}>
                    <OrgTree
                      roots={roots}
                      expandedIds={resolvedExpanded}
                      selectedId={selectedId}
                      flashedIds={flashedIds}
                      onToggle={handleToggle}
                      onSelect={handleSelect}
                    />
                  </PanelBody>
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
                    flashedIds={flashedIds}
                    scrollRef={tableScrollRef}
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
