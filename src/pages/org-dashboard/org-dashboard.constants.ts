export const SEARCH_DEBOUNCE_MS = 250;
export const SPLIT_VIEW_QUERY = "(min-width: 1280px)";
export const FADE_DURATION_MS = 1500;
export const TREE_EXPAND_MS = 240;
export const INITIAL_BACKOFF_MS = 500;
export const MAX_BACKOFF_MS = 16_000;

export type DashboardView = "tree" | "table";
export type SocketStatus = "connecting" | "online" | "reconnecting" | "offline";
