import type { OrgAggregate } from "@/shared/lib/aggregate-org-tree";

export type OrgSearchFilter = {
  nameIncludes?: string;
  level?: number;
  minPerformance?: number;
  maxPerformance?: number;
  minHeadcount?: number;
  maxHeadcount?: number;
  minBudget?: number;
};

export type ParsedOrgSearch = {
  mode: "structured" | "fallback";
  filter: OrgSearchFilter;
};

const LEVEL_PATTERNS: { pattern: RegExp; level: number }[] = [
  { pattern: /компан(?:ия|ии|ию|ий)/i, level: 0 },
  { pattern: /дивизион(?:ы|а|ов|е)?/i, level: 1 },
  { pattern: /отдел(?:ы|а|ов|е)?/i, level: 2 },
  { pattern: /команд(?:а|ы|у|е|ой)?/i, level: 3 },
];

function parseNumber(raw: string): number {
  return Number(raw.replace(",", "."));
}

function budgetMultiplier(unit: string | undefined): number {
  if (!unit) {
    return 1;
  }

  if (/млн|миллион/i.test(unit)) {
    return 1_000_000;
  }

  if (/тыс|тысяч/i.test(unit)) {
    return 1_000;
  }

  return 1;
}

function hasStructuredFields(filter: OrgSearchFilter): boolean {
  return (
    filter.level !== undefined ||
    filter.minPerformance !== undefined ||
    filter.maxPerformance !== undefined ||
    filter.minHeadcount !== undefined ||
    filter.maxHeadcount !== undefined ||
    filter.minBudget !== undefined
  );
}

/**
 * Детерминированный разбор NL → фильтр того же контракта, что вернул бы LLM.
 * Нет внешнего API: так поиск работает в Docker без ключей.
 */
export function parseOrgSearch(query: string): ParsedOrgSearch {
  const trimmed = query.trim();

  if (!trimmed) {
    return { mode: "fallback", filter: {} };
  }

  let rest = trimmed;
  const filter: OrgSearchFilter = {};

  for (const { pattern, level } of LEVEL_PATTERNS) {
    if (pattern.test(rest)) {
      filter.level = level;
      rest = rest.replace(pattern, " ");
      break;
    }
  }

  const performanceHigh = rest.match(
    /эффективност\p{L}*\s+(?:выше|больше|от|>=|>)\s*(\d+(?:[.,]\d+)?)/iu,
  );
  const performanceLow = rest.match(
    /эффективност\p{L}*\s+(?:ниже|меньше|до|<=|<)\s*(\d+(?:[.,]\d+)?)/iu,
  );

  if (performanceHigh?.[1]) {
    filter.minPerformance = parseNumber(performanceHigh[1]);
    rest = rest.replace(performanceHigh[0], " ");
  }

  if (performanceLow?.[1]) {
    filter.maxPerformance = parseNumber(performanceLow[1]);
    rest = rest.replace(performanceLow[0], " ");
  }

  const headcountHigh = rest.match(
    /(?:больше|выше|от|>)\s*(\d+)\s*(?:чел(?:овек)?|сотрудник\p{L}*)/iu,
  );
  const headcountLow = rest.match(
    /(?:меньше|ниже|до|<)\s*(\d+)\s*(?:чел(?:овек)?|сотрудник\p{L}*)/iu,
  );

  if (headcountHigh?.[1]) {
    filter.minHeadcount = Number(headcountHigh[1]);
    rest = rest.replace(headcountHigh[0], " ");
  }

  if (headcountLow?.[1]) {
    filter.maxHeadcount = Number(headcountLow[1]);
    rest = rest.replace(headcountLow[0], " ");
  }

  const budgetHigh = rest.match(
    /бюджет\p{L}*\s+(?:больше|выше|от|>)\s*(\d+(?:[.,]\d+)?)\s*(млн|миллион(?:а|ов)?|тыс(?:яч)?\.?)?/iu,
  );

  if (budgetHigh?.[1]) {
    filter.minBudget = parseNumber(budgetHigh[1]) * budgetMultiplier(budgetHigh[2]);
    rest = rest.replace(budgetHigh[0], " ");
  }

  const stopWords = new Set(["с", "и", "по", "для", "где", "у", "в", "на"]);
  const leftover = rest
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0 && !stopWords.has(word.toLocaleLowerCase("ru")))
    .join(" ");

  if (leftover) {
    filter.nameIncludes = leftover;
  }

  if (hasStructuredFields(filter)) {
    return { mode: "structured", filter };
  }

  return {
    mode: "fallback",
    filter: { nameIncludes: trimmed },
  };
}

export function applyOrgSearchFilter(
  rows: OrgAggregate[],
  filter: OrgSearchFilter,
): OrgAggregate[] {
  return rows.filter((row) => {
    if (
      filter.nameIncludes &&
      !row.name.toLocaleLowerCase("ru").includes(filter.nameIncludes.toLocaleLowerCase("ru"))
    ) {
      return false;
    }

    if (filter.level !== undefined && row.level !== filter.level) {
      return false;
    }

    if (filter.minPerformance !== undefined && row.weightedPerformance < filter.minPerformance) {
      return false;
    }

    if (filter.maxPerformance !== undefined && row.weightedPerformance > filter.maxPerformance) {
      return false;
    }

    if (filter.minHeadcount !== undefined && row.totalHeadcount < filter.minHeadcount) {
      return false;
    }

    if (filter.maxHeadcount !== undefined && row.totalHeadcount > filter.maxHeadcount) {
      return false;
    }

    if (filter.minBudget !== undefined && row.totalBudget < filter.minBudget) {
      return false;
    }

    return true;
  });
}

export function describeSearch(parsed: ParsedOrgSearch): string {
  if (parsed.mode === "fallback") {
    return parsed.filter.nameIncludes
      ? `Текстовый поиск: «${parsed.filter.nameIncludes}»`
      : "";
  }

  const parts: string[] = [];
  const { filter } = parsed;

  if (filter.level !== undefined) {
    parts.push(["компания", "дивизион", "отдел", "команда"][filter.level] ?? `уровень ${filter.level}`);
  }

  if (filter.minPerformance !== undefined) {
    parts.push(`эффективность ≥ ${filter.minPerformance}`);
  }

  if (filter.maxPerformance !== undefined) {
    parts.push(`эффективность ≤ ${filter.maxPerformance}`);
  }

  if (filter.minHeadcount !== undefined) {
    parts.push(`сотрудников ≥ ${filter.minHeadcount}`);
  }

  if (filter.maxHeadcount !== undefined) {
    parts.push(`сотрудников ≤ ${filter.maxHeadcount}`);
  }

  if (filter.minBudget !== undefined) {
    parts.push(`бюджет ≥ ${filter.minBudget.toLocaleString("ru-RU")}`);
  }

  if (filter.nameIncludes) {
    parts.push(`название: «${filter.nameIncludes}»`);
  }

  return `AI-фильтр: ${parts.join(", ")}`;
}
