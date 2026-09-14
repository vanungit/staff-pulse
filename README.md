# Staff Pulse

Дашборд оргструктуры: дерево подразделений с численностью и эффективностью.

## Запуск

```bash
npm install
npm run dev
```

Клиент: http://localhost:5173  
API: http://127.0.0.1:3001/api/org-tree

## Стек

React + Vite + TypeScript, styled-components, zod. Без UI-библиотек, без auth и БД.

```bash
npm test
```

## Этапы

- `step/1` — foundation: API, кэш, дерево
- `step/2` — таблица и агрегация
- `step/3` — live-обновления
- `step/4` — Docker, nginx, AI-поиск
