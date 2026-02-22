# Модуль Achievements (Достижения)

Модуль для работы с категориями и достижениями.

## Роуты

### Публичные роуты

#### `GET /api/achievements/categories`
Получение всех категорий достижений.

**Ответ:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "icon_url": "string | null",
    "is_custom": false,
    "achievements_count": 10,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### `GET /api/achievements/categories/with-stats`
Получение всех категорий со статистикой пользователя.

**Требуется авторизация:** Да

**Ответ:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "icon_url": "string | null",
    "is_custom": false,
    "achievements_count": 10,
    "unlocked_count": 5,
    "total_xp": 1000,
    "unlocked_xp": 500,
    "progress_percent": 50,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### `GET /api/achievements/rarities`
Получение всех возможных редкостей достижений.

**Ответ:**
```json
[
  { "value": "COMMON", "label": "Обычные" },
  { "value": "RARE", "label": "Редкие" },
  { "value": "EPIC", "label": "Эпические" },
  { "value": "LEGENDARY", "label": "Легендарные" }
]
```

#### `GET /api/achievements/categories/:id`
Получение категории по ID.

**Параметры:**
- `id` - UUID категории

**Ответ:**
```json
{
  "id": "uuid",
  "name": "string",
  "icon_url": "string | null",
  "is_custom": false,
  "achievements_count": 10,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /api/achievements/categories/:categoryId/achievements`
Получение достижений в конкретной категории.

**Параметры:**
- `categoryId` - UUID категории

**Query параметры:**
- `query` - поиск по названию и описанию (опционально)
- `rarity` - фильтр по редкости: `COMMON`, `RARE`, `EPIC`, `LEGENDARY` (опционально)
- `unlocked` - фильтр по разблокированности: `true`/`false` (опционально, только для авторизованных)
- `sortBy` - сортировка (опционально, см. ниже)
- `limit` - лимит результатов (1-100, по умолчанию 100)
- `offset` - смещение для пагинации (по умолчанию 0)

**Пример:**
```
GET /api/achievements/categories/123/achievements?rarity=EPIC&sortBy=xp-desc&limit=20
```

**Ответ:**
```json
{
  "achievements": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "icon_url": "string | null",
      "rarity": "common | rare | epic | legendary",
      "category": {
        "id": "uuid",
        "name": "string",
        "icon_url": "string | null"
      },
      "xp_reward": 100,
      "unlocked": false,
      "unlocked_at": "2024-01-01T00:00:00.000Z | null",
      "is_public": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0
}
```

#### `GET /api/achievements`
Получение всех достижений с фильтрами.

**Query параметры:**
- `query` - поиск по названию и описанию (опционально)
- `categoryId` - фильтр по категории (опционально)
- `rarity` - фильтр по редкости: `COMMON`, `RARE`, `EPIC`, `LEGENDARY` (опционально)
- `unlocked` - фильтр по разблокированности: `true`/`false` (опционально, только для авторизованных)
- `sortBy` - сортировка (опционально, см. ниже)
- `limit` - лимит результатов (1-100, по умолчанию 100)
- `offset` - смещение для пагинации (по умолчанию 0)

**Примеры:**

Поиск по запросу:
```
GET /api/achievements?query=победа
```

Фильтр по категории и редкости:
```
GET /api/achievements?categoryId=123&rarity=LEGENDARY
```

Только разблокированные (для авторизованных):
```
GET /api/achievements?unlocked=true
```

Сортировка по XP:
```
GET /api/achievements?sortBy=xp-desc&limit=10
```

Комбинированный запрос:
```
GET /api/achievements?query=победа&categoryId=123&rarity=EPIC&sortBy=date-desc&limit=20&offset=0
```

**Ответ:** Аналогичен ответу `/categories/:categoryId/achievements`

#### `GET /api/achievements/:id`
Получение достижения по ID.

**Параметры:**
- `id` - UUID достижения

**Ответ:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "icon_url": "string | null",
  "rarity": "common | rare | epic | legendary",
  "category": {
    "id": "uuid",
    "name": "string",
    "icon_url": "string | null"
  },
  "xp_reward": 100,
  "unlocked": false,
  "unlocked_at": "2024-01-01T00:00:00.000Z | null",
  "is_public": true,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## Сортировка (sortBy)

- `default` - порядок по умолчанию (по дате создания)
- `unlocked-asc` - сначала разблокированные
- `unlocked-desc` - сначала заблокированные
- `date-asc` - по дате разблокировки (старые сначала)
- `date-desc` - по дате разблокировки (новые сначала)
- `xp-asc` - по XP награде (меньше сначала)
- `xp-desc` - по XP награде (больше сначала)

### Защищенные роуты (только для админов)

#### `POST /api/achievements/categories`
Создание обычной категории достижений (только для админов).

**Требуется авторизация:** Да  
**Требуется админ:** Да

**Тело запроса:**
```json
{
  "name": "string",           // обязательное
  "icon_url": "string | null" // опционально (эмодзи или URL изображения)
}
```

**Ответ:**
```json
{
  "id": "uuid",
  "name": "string",
  "icon_url": "string | null",
  "is_custom": false,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### `POST /api/achievements`
Создание обычного достижения или нескольких достижений (только для админов).

**Требуется авторизация:** Да  
**Требуется админ:** Да

**Поддерживает два формата:**

1. **Создание одного достижения** (обратная совместимость):
```json
{
  "title": "string",                    // обязательное
  "description": "string",              // обязательное
  "icon_url": "string | null",          // опционально (эмодзи или URL изображения)
  "rarity": "COMMON | RARE | EPIC | LEGENDARY", // опционально, по умолчанию COMMON
  "category_id": "uuid",                // обязательное (UUID категории)
  "xp_reward": 100                      // опционально, по умолчанию 100 (1-10000)
}
```

**Ответ (один объект):**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "icon_url": "string | null",
  "rarity": "COMMON",
  "category": {
    "id": "uuid",
    "name": "string",
    "icon_url": "string | null"
  },
  "xp_reward": 100,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

2. **Создание нескольких достижений** (массив):
```json
[
  {
    "title": "string",
    "description": "string",
    "icon_url": "string | null",
    "rarity": "COMMON | RARE | EPIC | LEGENDARY",
    "category_id": "uuid",
    "xp_reward": 100
  },
  {
    "title": "string",
    "description": "string",
    "icon_url": "string | null",
    "rarity": "RARE",
    "category_id": "uuid",
    "xp_reward": 200
  }
]
```

**Ответ (массив объектов):**
```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "icon_url": "string | null",
    "rarity": "COMMON",
    "category": {
      "id": "uuid",
      "name": "string",
      "icon_url": "string | null"
    },
    "xp_reward": 100,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "icon_url": "string | null",
    "rarity": "RARE",
    "category": {
      "id": "uuid",
      "name": "string",
      "icon_url": "string | null"
    },
    "xp_reward": 200,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Примечания:**
- При создании нескольких достижений все они создаются в одной транзакции
- Если хотя бы одно достижение не может быть создано, вся операция откатывается
- Все достижения должны иметь валидные `category_id` (категории проверяются заранее)

### Защищенные роуты (для пользователей)

#### `POST /api/achievements/categories/custom`
Создание кастомной категории достижений (для пользователей).

**Требуется авторизация:** Да

**Тело запроса:**
```json
{
  "name": "string",           // обязательное
  "icon_url": "string | null" // опционально (эмодзи или URL изображения)
}
```

**Ответ:**
```json
{
  "id": "uuid",
  "name": "string",
  "icon_url": "string | null",
  "is_custom": true,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Особенности:**
- Созданная категория будет иметь `is_custom = true`
- `creator_id` будет установлен в ID текущего пользователя
- Пользователь может создавать достижения только в своих кастомных категориях

#### `POST /api/achievements/custom`
Создание кастомного достижения (для пользователей).

**Требуется авторизация:** Да

**Тело запроса:**
```json
{
  "title": "string",                    // обязательное
  "description": "string",              // обязательное
  "icon_url": "string | null",          // опционально (эмодзи или URL изображения)
  "rarity": "COMMON | RARE | EPIC | LEGENDARY", // опционально, по умолчанию COMMON
  "category_id": "uuid",                // обязательное (UUID своей кастомной категории)
  "xp_reward": 100                      // опционально, по умолчанию 100 (1-10000)
}
```

**Ответ:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "icon_url": "string | null",
  "rarity": "COMMON",
  "category": {
    "id": "uuid",
    "name": "string",
    "icon_url": "string | null"
  },
  "xp_reward": 100,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Особенности:**
- Пользователь может создавать достижения только в своих кастомных категориях (`is_custom = true` и `creator_id = userId`)
- При попытке создать достижение в чужой или обычной категории вернется ошибка `403 Forbidden`

## Особенности

1. **Авторизация опциональна**: Все GET роуты доступны без авторизации, но для авторизованных пользователей показывается статус разблокировки достижений
2. **Фильтр unlocked**: Доступен только для авторизованных пользователей
3. **Пагинация**: Используйте `limit` и `offset` для пагинации. В ответе возвращается `total` для расчета общего количества страниц
4. **Поиск**: Поиск работает по полям `title` и `description` (регистронезависимый)
5. **Редкость**: В ответе редкость возвращается в нижнем регистре (`common`, `rare`, `epic`, `legendary`), но в запросах используйте верхний регистр (`COMMON`, `RARE`, `EPIC`, `LEGENDARY`)
6. **Кастомные категории и достижения**: Пользователи могут создавать свои категории и достижения, которые помечаются как `is_custom = true` и привязаны к создателю через `creator_id`
7. **Права доступа**: Админы создают обычные категории и достижения (`is_custom = false`), пользователи - кастомные (`is_custom = true`)

## DTO

### GetAchievementsDto
```typescript
{
  query?: string                    // поиск по названию и описанию
  categoryId?: string               // UUID категории
  rarity?: Rarity                   // COMMON | RARE | EPIC | LEGENDARY
  unlocked?: boolean                // только для авторизованных
  sortBy?: SortBy                   // см. варианты сортировки выше
  limit?: number                    // 1-100, по умолчанию 100
  offset?: number                   // по умолчанию 0
}
```

### CreateCategoryDto
```typescript
{
  name: string                       // обязательное, название категории
  icon_url?: string                 // опционально, эмодзи или URL изображения
}
```

### CreateAchievementDto
```typescript
{
  title: string                     // обязательное, название достижения
  description: string               // обязательное, описание достижения
  icon_url?: string                 // опционально, эмодзи или URL изображения
  rarity?: Rarity                   // опционально, по умолчанию COMMON
  category_id: string               // обязательное, UUID категории
  xp_reward?: number                // опционально, по умолчанию 100 (1-10000)
}
```

## Примеры использования

### Получить все категории
```bash
GET /api/achievements/categories
```

### Получить достижения в категории с фильтрами
```bash
GET /api/achievements/categories/123/achievements?rarity=LEGENDARY&sortBy=xp-desc
```

### Поиск достижений
```bash
GET /api/achievements?query=победа&categoryId=123
```

### Получить только разблокированные достижения (авторизованным)
```bash
GET /api/achievements?unlocked=true
Authorization: Bearer <access_token>
```

### Пагинация
```bash
# Первая страница (20 элементов)
GET /api/achievements?limit=20&offset=0

# Вторая страница
GET /api/achievements?limit=20&offset=20

# Третья страница
GET /api/achievements?limit=20&offset=40
```

### Создание категории (админ)
```bash
POST /api/achievements/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Спорт",
  "icon_url": "🏃"
}
```

### Создание категории (пользователь)
```bash
POST /api/achievements/categories/custom
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "name": "Мои цели",
  "icon_url": "🎯"
}
```

### Создание достижения (админ)
```bash
POST /api/achievements
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Пробежать 5 км",
  "description": "Пробежать дистанцию 5 километров",
  "icon_url": "🏃",
  "rarity": "COMMON",
  "category_id": "uuid-категории",
  "xp_reward": 100
}
```

### Создание нескольких достижений (админ)
```bash
POST /api/achievements
Authorization: Bearer <admin_token>
Content-Type: application/json

[
  {
    "title": "Пробежать 5 км",
    "description": "Пробежать дистанцию 5 километров",
    "icon_url": "🏃",
    "rarity": "COMMON",
    "category_id": "uuid-категории",
    "xp_reward": 100
  },
  {
    "title": "Пробежать 10 км",
    "description": "Пробежать дистанцию 10 километров",
    "icon_url": "🏃‍♂️",
    "rarity": "RARE",
    "category_id": "uuid-категории",
    "xp_reward": 200
  }
]
```

### Удаление достижения (админ)
```bash
DELETE /api/achievements/:id
Authorization: Bearer <admin_token>

# Пример:
DELETE /api/achievements/1f626804-ec74-46e6-9fb3-a51a71b4558f
Authorization: Bearer <admin_token>
```

**Ответ:**
```json
{
  "success": true,
  "message": "Achievement deleted successfully"
}
```

**Особенности:**
- Удалить можно только системные достижения (не кастомные)
- При удалении каскадно удаляются все связанные `UserAchievement` и фотографии
- Удаление доступно только для админов

### Создание достижения (пользователь)
```bash
POST /api/achievements/custom
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "title": "Моя цель",
  "description": "Описание моей цели",
  "icon_url": "⭐",
  "rarity": "RARE",
  "category_id": "uuid-своей-кастомной-категории",
  "xp_reward": 150
}
```

## Ошибки

- `400 Bad Request` - невалидные параметры запроса
- `401 Unauthorized` - требуется авторизация
- `403 Forbidden` - недостаточно прав (требуется админ или попытка создать достижение в чужой категории)
- `404 Not Found` - категория или достижение не найдено
