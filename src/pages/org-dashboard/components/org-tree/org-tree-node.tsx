import { getPerformanceTone } from "@/shared/lib/performance-tone";
import type { OrgTreeNode } from "@/shared/lib/build-tree";

import {
  Chevron,
  Headcount,
  NestedList,
  NodeName,
  NodeRow,
  PerformanceBadge,
  PerformanceDot,
  ToggleButton,
  TreeItem,
} from "./org-tree.styles";

type OrgTreeNodeViewProps = {
  node: OrgTreeNode;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
};

const OrgTreeNodeView = ({ node, expandedIds, onToggle }: OrgTreeNodeViewProps) => {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const tone = getPerformanceTone(node.performance);

  return (
    <TreeItem>
      <NodeRow>
        <ToggleButton
          type="button"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-label={isExpanded ? `Свернуть ${node.name}` : `Раскрыть ${node.name}`}
          $isHidden={!hasChildren}
          onClick={() => onToggle(node.id)}
        >
          <Chevron $isExpanded={isExpanded} />
        </ToggleButton>
        <NodeName>{node.name}</NodeName>
        <Headcount>{node.headcount} чел.</Headcount>
        <PerformanceBadge $tone={tone} title="Эффективность узла">
          <PerformanceDot $tone={tone} />
          {node.performance}
        </PerformanceBadge>
      </NodeRow>
      {hasChildren && isExpanded && (
        <NestedList>
          {node.children.map((child) => (
            <OrgTreeNodeView
              key={child.id}
              node={child}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </NestedList>
      )}
    </TreeItem>
  );
};

export { OrgTreeNodeView };
