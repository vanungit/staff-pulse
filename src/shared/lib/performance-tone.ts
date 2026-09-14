export type PerformanceTone = "low" | "mid" | "high";

const LOW_MAX = 49;
const MID_MAX = 74;

export function getPerformanceTone(performance: number): PerformanceTone {
  if (performance <= LOW_MAX) {
    return "low";
  }

  if (performance <= MID_MAX) {
    return "mid";
  }

  return "high";
}
