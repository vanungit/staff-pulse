# Архитектура

## Слои (этап 01)

```
UI (pages/org-dashboard)
  → hooks/use-org-tree
    → cache/use-cached-query   stale-while-revalidate, 5s
      → api/fetch-org-tree     fetch + AbortController
        → zod parse            невалидный ответ = ошибка UI
  → lib/build-tree             плоский массив → дерево
```

Направление зависимостей: страница → shared. Shared не знает про конкретный экран.

## Поток данных

1. `OrgDashboard` монтируется и вызывает `useOrgTree`.
2. Кэш проверяет ключ `org-tree`. Если запись моложе 5 секунд — сеть не трогаем.
3. Иначе `fetch('/api/org-tree', { signal })`. При размонтировании `AbortController.abort()`.
4. Сырой JSON парсится zod-схемой. `ZodError` превращается в понятную ошибку, данные в кэш не пишутся.
5. Плоский массив превращается в дерево (`parentId`). Второй уровень (дивизионы) раскрыт по умолчанию.

## Состояния UI

| Состояние | Условие |
|---|---|
| loading | нет данных и нет ошибки |
| error | сеть / не-2xx / схема не сошлась |
| empty | валидный массив длины 0 |
| success | есть узлы, рисуем дерево |

## Слои (этап 02)

```
OrgDashboard
  → aggregateOrgTree(nodes)     useMemo, один проход post-order
  → filter + sort               чистые функции, debounce 250мс на вводе
  → OrgTable / OrgTree          общий selectedId
```

На ширине ≥1280px — split-view. Ниже — переключатель «Дерево / Таблица».

Клик по строке таблицы раскрывает предков и подсвечивает узел в дереве.

## Почему свой кэш, а не TanStack Query

См. [ADR-001](./adr/001-cache-layer.md). Коротко: бюджет бандла ≤200 КБ gzip на этапе 04, плюс нужно уметь объяснить каждый байт кэш-слоя на собеседовании.

Таблица — нативная, см. [ADR-002](./adr/002-native-table.md).

## Слои (этап 03)

```
HTTP snapshot → useLiveOrgState (hydrate + aggregates)
WS /ws        → zod patch → applyPatch
                 → заменить узел в плоском массиве
                 → patchAggregates(узел + предки)
                 → fade 1.5s, без полного рефетча
```

Обрыв сокета: экспоненциальный backoff 500мс → 16с. Индикатор в шапке.

Раскрытие дерева: `grid-template-rows: 0fr / 1fr`. `prefers-reduced-motion: reduce` отключает transition и fade.

См. [ADR-003](./adr/003-websocket.md).

## Слои (этап 04)

```
строка поиска
  → debounce 250мс
  → parseOrgSearch        structured | fallback
  → applyOrgSearchFilter  на уже посчитанных агрегатах
```

Production: `web` (nginx, gzip, статика) проксирует `/api` и `/ws` на `api`. Клиент ходит относительными путями — один origin.

См. [ADR-004](./adr/004-ai-search.md).
