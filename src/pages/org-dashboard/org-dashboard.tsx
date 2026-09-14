import { useMemo, useState } from "react";

import {
  buildTree,
  DEFAULT_EXPANDED_DEPTH,
  getDefaultExpandedIds,
} from "@/shared/lib/build-tree";

import { OrgTree } from "./components/org-tree/org-tree";
import { StatusState } from "./components/status-state/status-state";
import { useOrgTree } from "./hooks/use-org-tree";
import {
  Brand,
  BrandName,
  Header,
  Main,
  Meta,
  Page,
  Panel,
  PanelTitle,
  Title,
} from "./org-dashboard.styles";

const OrgDashboard = () => {
  const { data, error, isLoading } = useOrgTree();
  const [expandedIds, setExpandedIds] = useState<Set<string> | null>(null);

  const roots = useMemo(() => (data ? buildTree(data) : []), [data]);

  const resolvedExpanded = useMemo(() => {
    if (expandedIds) {
      return expandedIds;
    }

    if (roots.length === 0) {
      return new Set<string>();
    }

    return getDefaultExpandedIds(roots, DEFAULT_EXPANDED_DEPTH);
  }, [expandedIds, roots]);

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

  const handleRetry = () => {
    window.location.reload();
  };

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
          <Panel>
            <PanelTitle>Дерево · второй уровень раскрыт</PanelTitle>
            <OrgTree
              roots={roots}
              expandedIds={resolvedExpanded}
              onToggle={handleToggle}
            />
          </Panel>
        )}
      </Main>
    </Page>
  );
};

export { OrgDashboard };
