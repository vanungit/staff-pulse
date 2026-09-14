import type { OrgTreeNode } from "@/shared/lib/build-tree";

import { OrgTreeNodeView } from "./org-tree-node";
import { TreeList } from "./org-tree.styles";

type OrgTreeProps = {
  roots: OrgTreeNode[];
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
};

const OrgTree = ({ roots, expandedIds, onToggle }: OrgTreeProps) => {
  return (
    <TreeList role="tree">
      {roots.map((root) => (
        <OrgTreeNodeView
          key={root.id}
          node={root}
          expandedIds={expandedIds}
          onToggle={onToggle}
        />
      ))}
    </TreeList>
  );
};

export { OrgTree };
