import type { OrgNode } from "@/shared/api/org-tree.schema";

export function getAncestorIds(nodes: OrgNode[], id: string): string[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const ancestors: string[] = [];
  let current = byId.get(id);

  while (current?.parentId) {
    ancestors.push(current.parentId);
    current = byId.get(current.parentId);
  }

  return ancestors;
}
