import { useEffect, useState } from "react";

export const DEFAULT_STALE_TIME_MS = 5_000;

type CacheEntry = {
  data: unknown;
  fetchedAt: number;
};

const queryCache = new Map<string, CacheEntry>();

type UseCachedQueryParams<T> = {
  cacheKey: string;
  fetcher: (signal: AbortSignal) => Promise<unknown>;
  parse: (raw: unknown) => T;
  staleTimeMs?: number;
};

export type CachedQueryResult<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
};

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException
    ? error.name === "AbortError"
    : error instanceof Error && error.name === "AbortError";
}

function readCached<T>(
  cacheKey: string,
  parse: (raw: unknown) => T,
): T | null {
  const entry = queryCache.get(cacheKey);

  if (!entry) {
    return null;
  }

  try {
    return parse(entry.data);
  } catch {
    queryCache.delete(cacheKey);
    return null;
  }
}

function isFresh(entry: CacheEntry | undefined, staleTimeMs: number): boolean {
  if (!entry) {
    return false;
  }

  return Date.now() - entry.fetchedAt < staleTimeMs;
}

export function useCachedQuery<T>({
  cacheKey,
  fetcher,
  parse,
  staleTimeMs = DEFAULT_STALE_TIME_MS,
}: UseCachedQueryParams<T>): CachedQueryResult<T> {
  const [data, setData] = useState<T | null>(() => readCached(cacheKey, parse));
  const [error, setError] = useState<Error | null>(null);
  const [isValidating, setIsValidating] = useState(() => {
    const entry = queryCache.get(cacheKey);
    return !isFresh(entry, staleTimeMs);
  });

  useEffect(() => {
    const controller = new AbortController();
    const entry = queryCache.get(cacheKey);

    if (isFresh(entry, staleTimeMs)) {
      setData(readCached(cacheKey, parse));
      setIsValidating(false);
      return () => controller.abort();
    }

    let isCancelled = false;

    const run = async () => {
      setIsValidating(true);

      try {
        const raw = await fetcher(controller.signal);
        const parsed = parse(raw);

        if (isCancelled) {
          return;
        }

        queryCache.set(cacheKey, { data: raw, fetchedAt: Date.now() });
        setData(parsed);
        setError(null);
      } catch (caught) {
        if (isCancelled || isAbortError(caught)) {
          return;
        }

        const nextError =
          caught instanceof Error ? caught : new Error("Неизвестная ошибка запроса");

        setError(nextError);

        if (!entry) {
          setData(null);
        }
      } finally {
        if (!isCancelled) {
          setIsValidating(false);
        }
      }
    };

    void run();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [cacheKey, fetcher, parse, staleTimeMs]);

  const isLoading = data === null && error === null;

  return { data, error, isLoading, isValidating };
}

export function writeQueryCache(cacheKey: string, data: unknown): void {
  queryCache.set(cacheKey, { data, fetchedAt: Date.now() });
}

export function readQueryCache(cacheKey: string): unknown {
  return queryCache.get(cacheKey)?.data;
}
