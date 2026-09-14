# Staff Pulse

Дашборд оргструктуры: дерево, аналитическая таблица со взвешенной агрегацией и live-патчи по WebSocket.

## Запуск одной командой

```bash
docker compose up --build
```

Открыть http://localhost:8080

Конфиг — переменные в `.env.example` (`PORT`, `LIVE_INTERVAL_MS`, `WEB_PORT`). Для локальной разработки без Docker:

```bash
npm install
npm run dev
```

Клиент: http://localhost:5173 · API: http://127.0.0.1:3001/api/org-tree

```bash
npm test
npm run build && npm run check:bundle
```

Сейчас js+css ≈ **109 КБ gzip** при лимите 200 КБ.

## Что умеет

- Интерактивное дерево, второй уровень раскрыт
- Таблица: суммы по потомкам, эффективность = Σ(perf × headcount) / Σ(headcount)
- Сортировка (клик / двойной клик — наоборот), дебаунс поиска 250мс
- Split-view от 1280px
- WebSocket-патчи без полного рефетча, backoff, fade 1.5с
- AI-поиск: «команды с эффективностью выше 80»; если не разобрали — обычный текстовый поиск
- Клавиатура таблицы: стрелки, Home/End, Enter
- `prefers-reduced-motion`

Стек: React + Vite + TypeScript, styled-components, zod. Без UI-библиотек, без auth и БД.

## Документация

- [Архитектура](docs/architecture.md)
- [Модель данных](docs/data-model.md)
- [ADR](docs/adr/)
- Скриншоты: [docs/screenshots/split-view.png](docs/screenshots/split-view.png), [mobile](docs/screenshots/mobile-tree.png) (сняты headless Chrome; живой UI использует системные шрифты)

## Этапы (теги)

| Тег | Коммит |
|---|---|
| `step/1` | foundation: API, кэш, дерево |
| `step/2` | таблица и агрегация |
| `step/3` | live-обновления |
| `step/4` | Docker, nginx, AI-поиск |

## AI в разработке

Работали поэтапно в Cursor, не одним промптом на всё ТЗ. После каждого этапа — коммит и тег.

### Этап 01

**Сгенерировано:** каркас Vite/TS, тема styled-components, нарезка `org-dashboard` / `org-tree` / `status-state`, мок-иерархия Нордлайн.

**Переписано руками:** `useCachedQuery` (свой SWR на 5с + AbortController). Не взяли TanStack Query — лимит бандла 200 КБ gzip и чтобы объяснить слой на собеседовании. Zod: `ZodError` → одно сообщение, невалид в кэш не пишем.

Генератор первым делом предлагает MUI/Ant — оба запрещены ТЗ.

### Этап 02

**Сгенерировано:** вёрстка таблицы, toolbar, split-view.

**Переписано руками:** `aggregateOrgTree`. Черновик считал среднее по узлам (`sum(perf)/n`). Нужно взвешенное по headcount. Контрактный тест: 10 человек × 100 и 90 × 0 → **10**, не 50.

### Этап 03

**Сгенерировано:** каркас WS-хука, индикатор, collapse.

**Переписано руками:** `patchAggregates` — только узел и предки. Генерация вызывала полный `aggregateOrgTree` на каждый кадр. Backoff и `onPatch` через ref, чтобы сокет не пересоздавался. Fade только у изменённого узла, иначе корень мигал бы каждые 2.5с.

### Этап 04

**Сгенерировано:** Docker/nginx-черновик.

**Переписано руками:** `parseOrgSearch` — тот же контракт фильтра, что вернул бы LLM, плюс явный fallback. Внешний LLM не подключали: ключ ломает `docker compose up`, а ревьюеру важнее увидеть fallback, чем обёртку над API.

Подробные заметки по ходу работы: [docs/ai-notes.md](docs/ai-notes.md).
