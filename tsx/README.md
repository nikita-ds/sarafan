# TSX export (prototype)

Эта папка содержит TSX-компоненты экранов, собранные по референсам из `design/screens/`.

Важно: это **экспорт компонентов**, он сам по себе не запускается в браузере без React-сборки (Vite/Next и т.п.).

## Что внутри
- `screens/*` — экраны (Splash, Role, Registration, и т.д.)
- `components/*` — общий каркас (Topbar, BottomSheet)
- `ui/*` — примитивы (Button, Input, Card)
- `router/*` — простой hash-router hook `useHashRoute`
- `state/*` — типы/моковое состояние (localStorage)

Сейчас собраны маршруты:
`splash`, `role`, `reg`, `city`, `photo`, `client-home`, `category`, `business`, `requests`, `biz-home`, `profile`.

## Как подключить в свой проект
1. Скопируй папку `tsx/` в свой React+TS проект.
2. Убедись, что включены CSS Modules (`*.module.css`).
3. Импортируй и отрендери `App` из `tsx/App.tsx`.

Зависимости в твоём проекте должны включать `react`/`react-dom` и типы (обычно это уже есть).

## Роутинг
Используются маршруты вида `#splash`, `#role`, `#reg`, … (hash).
