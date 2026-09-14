import { useEffect, useRef, useState } from "react";

import { ORG_TREE_CACHE_KEY } from "@/shared/api/fetch-org-tree";
import type { OrgNode } from "@/shared/api/org-tree.schema";
import { writeQueryCache } from "@/shared/cache/use-cached-query";
import { aggregateOrgTree, type OrgAggregate } from "@/shared/lib/aggregate-org-tree";
import { getAncestorIds } from "@/shared/lib/get-ancestor-ids";
import { getNodeDelta, patchAggregates } from "@/shared/lib/patch-aggregates";

import { FADE_DURATION_MS } from "../org-dashboard.constants";

type LiveOrgState = {
  nodes: OrgNode[];
  aggregates: OrgAggregate[];
};

export function useLiveOrgState(fetchedNodes: OrgNode[] | null) {
  const [live, setLive] = useState<LiveOrgState | null>(null);
  const [flashedIds, setFlashedIds] = useState<Set<string>>(new Set());
  const isHydratedRef = useRef(false);

  useEffect(() => {
    if (!fetchedNodes || isHydratedRef.current) {
      return;
    }

    isHydratedRef.current = true;
    setLive({
      nodes: fetchedNodes,
      aggregates: aggregateOrgTree(fetchedNodes),
    });
  }, [fetchedNodes]);

  const applyPatch = (nextNode: OrgNode) => {
    setLive((current) => {
      if (!current) {
        return current;
      }

      const previous = current.nodes.find((node) => node.id === nextNode.id);

      if (!previous) {
        return current;
      }

      const nodes = current.nodes.map((node) => (node.id === nextNode.id ? nextNode : node));
      const ids = [nextNode.id, ...getAncestorIds(nodes, nextNode.id)];

      writeQueryCache(ORG_TREE_CACHE_KEY, nodes);

      return {
        nodes,
        aggregates: patchAggregates(current.aggregates, ids, getNodeDelta(previous, nextNode)),
      };
    });

    setFlashedIds((current) => {
      const next = new Set(current);
      next.add(nextNode.id);
      return next;
    });

    window.setTimeout(() => {
      setFlashedIds((current) => {
        const next = new Set(current);
        next.delete(nextNode.id);
        return next;
      });
    }, FADE_DURATION_MS);
  };

  return {
    nodes: live?.nodes ?? fetchedNodes,
    aggregates: live?.aggregates ?? [],
    flashedIds,
    applyPatch,
  };
}
