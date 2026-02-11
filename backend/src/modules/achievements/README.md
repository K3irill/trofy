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

## Особенности

1. **Авторизация опциональна**: Все роуты доступны без авторизации, но для авторизованных пользователей показывается статус разблокировки достижений
2. **Фильтр unlocked**: Доступен только для авторизованных пользователей
3. **Пагинация**: Используйте `limit` и `offset` для пагинации. В ответе возвращается `total` для расчета общего количества страниц
4. **Поиск**: Поиск работает по полям `title` и `description` (регистронезависимый)
5. **Редкость**: В ответе редкость возвращается в нижнем регистре (`common`, `rare`, `epic`, `legendary`), но в запросах используйте верхний регистр (`COMMON`, `RARE`, `EPIC`, `LEGENDARY`)

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

## Ошибки

- `400 Bad Request` - невалидные параметры запроса
- `404 Not Found` - категория или достижение не найдено
