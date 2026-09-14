import type { OrgNode } from "@/shared/api/org-tree.schema";

export type OrgTreeNode = OrgNode & {
  children: OrgTreeNode[];
  depth: number;
};

export function buildTree(nodes: OrgNode[]): OrgTreeNode[] {
  const byId = new Map<string, OrgTreeNode>();

  for (const node of nodes) {
    byId.set(node.id, { ...node, children: [], depth: 0 });
  }

  const roots: OrgTreeNode[] = [];

  for (const node of byId.values()) {
    if (node.parentId === null) {
      roots.push(node);
      continue;
    }

    const parent = byId.get(node.parentId);

    if (!parent) {
      roots.push(node);
      continue;
    }

    parent.children.push(node);
  }

  const assignDepth = (node: OrgTreeNode, depth: number) => {
    node.depth = depth;
    node.children.forEach((child) => assignDepth(child, depth + 1));
  };

  roots.forEach((root) => assignDepth(root, 0));

  return roots;
}

export function getDefaultExpandedIds(
  roots: OrgTreeNode[],
  maxExpandedDepth: number,
): Set<string> {
  const ids = new Set<string>();

  const walk = (node: OrgTreeNode) => {
    if (node.depth <= maxExpandedDepth) {
      ids.add(node.id);
      node.children.forEach(walk);
    }
  };

  roots.forEach(walk);

  return ids;
}

export const DEFAULT_EXPANDED_DEPTH = 1;
