export const theme = {
  color: {
    bg: "#eef1f4",
    surface: "#ffffff",
    surfaceMuted: "#f6f8fa",
    line: "#d5dde5",
    text: "#1b2430",
    textMuted: "#5c6b7a",
    accent: "#0b6b6b",
    accentSoft: "#d7efef",
    danger: "#b42318",
    dangerSoft: "#fde8e6",
    warning: "#b54708",
    warningSoft: "#fef4e6",
    success: "#17663a",
    successSoft: "#e3f5ea",
    performanceLow: "#c0392b",
    performanceMid: "#c48a12",
    performanceHigh: "#1e7a45",
    header: "#13202e",
    headerText: "#f4f7fa",
    headerMuted: "#9aadc0",
  },
  space: {
    xs: "4px",
    s: "8px",
    m: "12px",
    l: "16px",
    xl: "24px",
    xxl: "32px",
  },
  radius: {
    s: "6px",
    m: "10px",
    l: "14px",
  },
  shadow: {
    card: "0 1px 2px rgba(19, 32, 46, 0.06), 0 8px 24px rgba(19, 32, 46, 0.06)",
    raised: "0 8px 28px rgba(19, 32, 46, 0.1)",
  },
  motion: {
    easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
    spring: "cubic-bezier(0.34, 1.3, 0.64, 1)",
    fast: "160ms",
    mid: "280ms",
    slow: "480ms",
  },
  font: {
    family:
      'Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  },
} as const;

export type AppTheme = typeof theme;
