import type { OrgNodeDto } from "../types.ts";

type NodeSeed = {
  id: string;
  name: string;
  children?: NodeSeed[];
};

/**
 * Иерархия: компания → дивизион → отдел → команда.
 * 47 узлов, 4 уровня. Метрики детерминированы от id — одни и те же
 * при каждом старте сервера, без Math.random.
 */
const ORG_SEED: NodeSeed = {
  id: "nordline",
  name: "Нордлайн",
  children: [
    {
      id: "div-eng",
      name: "Разработка",
      children: [
        {
          id: "dep-platform",
          name: "Платформа",
          children: [
            { id: "team-core", name: "Core" },
            { id: "team-infra", name: "Infra" },
            { id: "team-data", name: "Data Platform" },
            { id: "team-sre", name: "SRE" },
          ],
        },
        {
          id: "dep-product",
          name: "Продукт",
          children: [
            { id: "team-web", name: "Web" },
            { id: "team-mobile", name: "Mobile" },
            { id: "team-api", name: "API" },
            { id: "team-ds", name: "Design System" },
          ],
        },
        {
          id: "dep-qa",
          name: "QA",
          children: [
            { id: "team-qa-auto", name: "Автотесты" },
            { id: "team-qa-manual", name: "Ручное тестирование" },
          ],
        },
      ],
    },
    {
      id: "div-sales",
      name: "Коммерция",
      children: [
        {
          id: "dep-direct",
          name: "Прямые продажи",
          children: [
            { id: "team-enterprise", name: "Enterprise" },
            { id: "team-smb", name: "SMB" },
          ],
        },
        {
          id: "dep-partners",
          name: "Партнёры",
          children: [
            { id: "team-channel", name: "Channel" },
            { id: "team-alliance", name: "Alliance" },
          ],
        },
        {
          id: "dep-cs",
          name: "Customer Success",
          children: [
            { id: "team-onboarding", name: "Онбординг" },
            { id: "team-retention", name: "Удержание" },
          ],
        },
      ],
    },
    {
      id: "div-mkt",
      name: "Маркетинг",
      children: [
        {
          id: "dep-brand",
          name: "Бренд",
          children: [
            { id: "team-content", name: "Контент" },
            { id: "team-design", name: "Дизайн" },
          ],
        },
        {
          id: "dep-perf",
          name: "Performance",
          children: [
            { id: "team-paid", name: "Платный трафик" },
            { id: "team-seo", name: "SEO" },
          ],
        },
        {
          id: "dep-analytics",
          name: "Аналитика",
          children: [
            { id: "team-bi", name: "BI" },
            { id: "team-research", name: "Исследования" },
          ],
        },
      ],
    },
    {
      id: "div-ops",
      name: "Операции",
      children: [
        {
          id: "dep-hr",
          name: "HR",
          children: [
            { id: "team-recruiting", name: "Рекрутинг" },
            { id: "team-people", name: "People Ops" },
            { id: "team-lnd", name: "Обучение" },
          ],
        },
        {
          id: "dep-fin",
          name: "Финансы",
          children: [
            { id: "team-controlling", name: "Контроллинг" },
            { id: "team-treasury", name: "Казначейство" },
          ],
        },
        {
          id: "dep-it",
          name: "IT",
          children: [
            { id: "team-helpdesk", name: "Helpdesk" },
            { id: "team-security", name: "Безопасность" },
            { id: "team-networks", name: "Сети" },
          ],
        },
      ],
    },
  ],
};

function hashId(id: string): number {
  let hash = 2166136261;

  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function metricsFor(id: string): Pick<
  OrgNodeDto,
  "headcount" | "budget" | "performance" | "updatedAt"
> {
  const hash = hashId(id);
  const headcount = 4 + (hash % 28);
  const budget = (80 + (hash % 420)) * 10_000;
  const performance = 42 + (hash % 52);
  const minute = hash % 60;

  return {
    headcount,
    budget,
    performance,
    updatedAt: new Date(Date.UTC(2026, 8, 1, 9, minute, 0)).toISOString(),
  };
}

function flatten(seed: NodeSeed, parentId: string | null): OrgNodeDto[] {
  const node: OrgNodeDto = {
    id: seed.id,
    name: seed.name,
    parentId,
    ...metricsFor(seed.id),
  };

  const children = (seed.children ?? []).flatMap((child) => flatten(child, seed.id));

  return [node, ...children];
}

export const orgNodes: OrgNodeDto[] = flatten(ORG_SEED, null);
