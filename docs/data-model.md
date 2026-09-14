# Модель данных

## Узел API

Плоский массив `GET /api/org-tree`:

| Поле | Тип | Смысл |
|---|---|---|
| `id` | string | стабильный идентификатор |
| `name` | string | название подразделения |
| `parentId` | string \| null | `null` у корня |
| `headcount` | int ≥ 0 | свои сотрудники узла, не потомки |
| `budget` | number ≥ 0 | свой бюджет узла |
| `performance` | 0–100 | эффективность узла |
| `updatedAt` | ISO datetime | момент последнего изменения |

Клиент валидирует схему через zod. Иерархия собирается на клиенте: `parentId → children`.

## Уровни

0 компания → 1 дивизион → 2 отдел → 3 команда.

## Агрегация

После первой загрузки — полный проход. На live-патче пересчитываются **только узел и предки**.

Для каждого узла обходим поддерево снизу вверх:

```
totalHeadcount(u) = headcount(u) + Σ totalHeadcount(child)
totalBudget(u)    = budget(u)    + Σ totalBudget(child)

weightedPerformance(u) =
  Σ (performance_i × headcount_i) / Σ headcount_i
  по самому u и всем потомкам
```

Это **не** среднее арифметическое по узлам. Пример, который ловит ошибку:

- отдел: 10 чел., performance 100
- команда: 90 чел., performance 0
- взвешенное = 10; простое среднее узлов = 50

Если суммарный headcount = 0, эффективность = 0 (без деления на ноль).

## Связь таблица → дерево

Клик по строке задаёт `selectedId`, раскрывает предков и скроллит узел в дереве.

## Контракт WebSocket-патча

Кадр `ws://<host>/ws`:

```json
{
  "type": "node.updated",
  "node": {
    "id": "team-core",
    "name": "Core",
    "parentId": "dep-platform",
    "headcount": 12,
    "budget": 1800000,
    "performance": 74,
    "updatedAt": "2026-09-14T11:20:00.000Z"
  }
}
```

- Один узел целиком, не diff-поля и не всё дерево.
- Клиент валидирует кадр zod-схемой; битый JSON игнорируется.
- `GET /api/org-tree` после патча отдаёт уже изменённый массив — сервер мутирует ту же память.

Инкрементальный пересчёт:

```
delta.headcount    = next.headcount - prev.headcount
delta.budget       = next.budget - prev.budget
delta.weightedSum  = next.perf×next.hc - prev.perf×prev.hc

для id ∈ {узел} ∪ предки:
  totalHeadcount += delta.headcount
  totalBudget    += delta.budget
  weightedPerformance = (oldPerf×oldHc + delta.weightedSum) / newHc
```
