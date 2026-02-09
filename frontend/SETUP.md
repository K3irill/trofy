# Frontend Setup Instructions

## Установка зависимостей

```bash
cd frontend
npm install
```

## Запуск проекта

```bash
npm run dev
```

Приложение будет доступно по адресу http://localhost:3000

## Зависимости

Все необходимые зависимости уже добавлены в package.json:
- @reduxjs/toolkit
- @tanstack/react-query
- @vkontakte/vk-bridge
- framer-motion
- react-parallax-tilt
- react-redux
- styled-components

Если после npm install все еще есть ошибки с react-redux, попробуйте:
```bash
npm install react-redux
```
