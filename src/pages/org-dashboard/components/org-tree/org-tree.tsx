import type { OrgTreeNode } from "@/shared/lib/build-tree";

import { OrgTreeNodeView } from "./org-tree-node";
import { TreeList } from "./org-tree.styles";

type OrgTreeProps = {
  roots: OrgTreeNode[];
  expandedIds: Set<string>;
  selectedId: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
};

const OrgTree = ({ roots, expandedIds, selectedId, onToggle, onSelect }: OrgTreeProps) => {
  return (
    <TreeList role="tree">
      {roots.map((root) => (
        <OrgTreeNodeView
          key={root.id}
          node={root}
          expandedIds={expandedIds}
          selectedId={selectedId}
          onToggle={onToggle}
          onSelect={onSelect}
        />
      ))}
    </TreeList>
  );
};

export { OrgTree };
