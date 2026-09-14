import {
  fetchOrgTree,
  ORG_TREE_CACHE_KEY,
  parseOrgTree,
} from "@/shared/api/fetch-org-tree";
import { DEFAULT_STALE_TIME_MS, useCachedQuery } from "@/shared/cache/use-cached-query";

export function useOrgTree() {
  return useCachedQuery({
    cacheKey: ORG_TREE_CACHE_KEY,
    fetcher: fetchOrgTree,
    parse: parseOrgTree,
    staleTimeMs: DEFAULT_STALE_TIME_MS,
  });
}
