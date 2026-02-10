# Trofy Backend

Backend API для приложения Trofy - Достижения Жизни.

## Технологический стек

- **Express** - Node.js фреймворк
- **Prisma** - ORM для работы с PostgreSQL
- **PostgreSQL** - база данных
- **TypeScript** - типизация
- **JWT** - аутентификация
- **bcrypt** - хеширование паролей

## Установка

```bash
npm install
```

## Настройка окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Заполните переменные окружения:
- `DATABASE_URL` - строка подключения к PostgreSQL
- `JWT_SECRET` - секретный ключ для JWT токенов
- `VK_APP_ID` - ID приложения ВКонтакте
- `VK_APP_SECRET` - секретный ключ приложения ВКонтакте
- `PORT` - порт сервера (по умолчанию 3001)

## Миграции базы данных

```bash
# Генерация Prisma Client
npm run prisma:generate

# Создание и применение миграций
npm run prisma:migrate
```

## Запуск

```bash
# Режим разработки
npm run dev

# Сборка
npm run build

# Продакшн
npm start
```

## API Эндпоинты

### Auth
- `POST /api/auth/vk-login` - авторизация через ВКонтакте

### Users
- `GET /api/users/:id` - получить профиль пользователя
- `PUT /api/users/:id` - обновить профиль
- `GET /api/users/:id/achievements` - достижения пользователя

### Achievements
- `GET /api/achievements` - список всех достижений
- `POST /api/achievements/:id/unlock` - разблокировать достижение
- `GET /api/achievements/:id` - детали достижения

### Categories
- `GET /api/categories` - список категорий
- `POST /api/categories` - создать категорию (custom)

## Структура базы данных

- **User** - пользователи
- **Achievement** - достижения
- **Category** - категории
- **UserAchievement** - разблокированные достижения пользователей
- **ProfileTheme** - темы оформления профилей
