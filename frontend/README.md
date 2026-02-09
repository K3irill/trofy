# Trofy - Достижения Жизни

Геймификация жизненных достижений в виде мини-приложения ВКонтакте.

## Технологический стек

### Frontend
- **Next.js 16** - React фреймворк с App Router
- **TypeScript** - типизация
- **RTK Toolkit** - управление состоянием
- **@tanstack/react-query** - API запросы
- **Styled Components** - стилизация
- **Framer Motion** - анимации
- **react-parallax-tilt** - 3D эффекты для карточек
- **@vkontakte/vk-bridge** - интеграция с ВКонтакте

### Backend
- **Express** - API сервер
- **Prisma** - ORM
- **PostgreSQL** - база данных
- **TypeScript** - типизация

## Установка

```bash
cd frontend
npm install
npm run dev
```

## Структура проекта

```
frontend/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React компоненты
│   ├── store/           # RTK store
│   ├── types/           # TypeScript типы
│   ├── lib/             # Утилиты
│   └── styles/          # Темы и стили
└── package.json
```

## Основные функции

- ✅ Геймерский дизайн с неоновыми эффектами
- ✅ Система достижений с редкостью (common, rare, epic, legendary)
- ✅ XP система и уровни
- ✅ Профили пользователей
- ✅ Паралакс эффекты для карточек
- ✅ Интеграция с ВКонтакте

## Запуск разработки

Frontend:
```bash
cd frontend
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```
