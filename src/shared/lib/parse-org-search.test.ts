import { describe, expect, it } from "vitest";

import { applyOrgSearchFilter, parseOrgSearch } from "./parse-org-search";
import type { OrgAggregate } from "./aggregate-org-tree";

const rows: OrgAggregate[] = [
  {
    id: "team-core",
    name: "Core",
    level: 3,
    levelLabel: "Команда",
    totalHeadcount: 12,
    totalBudget: 2_000_000,
    weightedPerformance: 82,
  },
  {
    id: "dep-platform",
    name: "Платформа",
    level: 2,
    levelLabel: "Отдел",
    totalHeadcount: 40,
    totalBudget: 8_000_000,
    weightedPerformance: 70,
  },
];

describe("parseOrgSearch", () => {
  it("собирает структурированный фильтр из естественного языка", () => {
    const parsed = parseOrgSearch("команды с эффективностью выше 80");

    expect(parsed.mode).toBe("structured");
    expect(parsed.filter).toEqual({
      level: 3,
      minPerformance: 80,
    });
  });

  it("падает в текстовый поиск, если структуру не разобрать", () => {
    const parsed = parseOrgSearch("платформа");

    expect(parsed.mode).toBe("fallback");
    expect(parsed.filter).toEqual({ nameIncludes: "платформа" });
  });

  it("понимает бюджет в миллионах", () => {
    const parsed = parseOrgSearch("отделы с бюджетом больше 5 млн");

    expect(parsed.mode).toBe("structured");
    expect(parsed.filter.level).toBe(2);
    expect(parsed.filter.minBudget).toBe(5_000_000);
  });
});

describe("applyOrgSearchFilter", () => {
  it("оставляет только команды с эффективностью ≥ 80", () => {
    const parsed = parseOrgSearch("команды с эффективностью выше 80");
    const result = applyOrgSearchFilter(rows, parsed.filter);

    expect(result.map((row) => row.id)).toEqual(["team-core"]);
  });

  it("fallback ищет по подстроке названия", () => {
    const parsed = parseOrgSearch("платформа");
    const result = applyOrgSearchFilter(rows, parsed.filter);

    expect(result.map((row) => row.id)).toEqual(["dep-platform"]);
  });
});
