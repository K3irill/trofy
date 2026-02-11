# Модуль User (Пользователь)

Модуль для управления данными пользователя.

## Роуты

Все роуты требуют авторизации (заголовок `Authorization: Bearer <access_token>`).

### `GET /api/users/me`
Получение данных текущего пользователя.

**Заголовки:**
```
Authorization: Bearer <access_token>
```

**Ответ:**
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string | null",
  "phone": "string | null",
  "xp": 0,
  "level": 1,
  "bio": "string | null",
  "profile_theme": {
    "id": "uuid",
    "name": "string",
    "profile_color": "string",
    ...
  },
  "privacy_settings": {
    "show_achievements": true,
    "show_level": true,
    "show_profile": true
  },
  "badges": [],
  "streak": 0,
  ...
}
```

### `PATCH /api/users/me`
Обновление данных пользователя.

**Заголовки:**
```
Authorization: Bearer <access_token>
```

**Тело запроса:**
```json
{
  "bio": "string (опционально, макс. 500 символов)",
  "profile_theme_id": "uuid (опционально, ID темы профиля)",
  "privacy_settings": {
    "show_achievements": true | false (опционально),
    "show_level": true | false (опционально),
    "show_profile": true | false (опционально)
  },
  "pinned_achievements": ["uuid1", "uuid2", ...] (опционально, макс. 6 ID достижений)
}
```

**Примеры:**

Обновление только bio:
```json
{
  "bio": "Новое описание профиля"
}
```

Обновление темы профиля:
```json
{
  "profile_theme_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

Обновление настроек приватности:
```json
{
  "privacy_settings": {
    "show_achievements": false,
    "show_level": true,
    "show_profile": true
  }
}
```

Комбинированное обновление:
```json
{
  "bio": "Обновленное описание",
  "profile_theme_id": "123e4567-e89b-12d3-a456-426614174000",
  "privacy_settings": {
    "show_achievements": false
  }
}
```

**Ответ:** Обновленные данные пользователя (аналогично GET /api/users/me)

### `POST /api/users/me/activity`
Обновление streak при активности пользователя. Вызывайте этот эндпоинт при любой активности пользователя (разблокировка достижения, выполнение задания и т.д.).

**Заголовки:**
```
Authorization: Bearer <access_token>
```

**Ответ:** Обновленные данные пользователя с актуальным streak

**Логика streak:**
- Если активность первая за день - streak увеличивается на 1
- Если активность была вчера - streak продолжается (+1)
- Если пропущены дни - streak сбрасывается до 1

### `GET /api/users/me/stats`
Получение статистики пользователя.

**Заголовки:**
```
Authorization: Bearer <access_token>
```

**Ответ:**
```json
{
  "total_achievements": 42,
  "achievements_by_rarity": {
    "common": 30,
    "rare": 8,
    "epic": 3,
    "legendary": 1
  },
  "uniqueness_score": 87,
  "growth_rate": 12,
  "fastest_achievement": {
    "title": "Быстрый старт",
    "days": 3
  } | null,
  "streak": 7,
  "xp": 1250,
  "level": 5
}
```

## DTO

### UpdateUserDto
```typescript
{
  bio?: string                    // макс. 500 символов
  profile_theme_id?: string        // UUID темы профиля
  privacy_settings?: {
    show_achievements?: boolean
    show_level?: boolean
    show_profile?: boolean
  }
  pinned_achievements?: string[]  // макс. 6 UUID достижений (только разблокированные)
}
```

### UpdateBioDto
```typescript
{
  bio?: string  // макс. 500 символов
}
```

### UpdatePrivacySettingsDto
```typescript
{
  show_achievements?: boolean
  show_level?: boolean
  show_profile?: boolean
}
```

### UpdateProfileThemeDto
```typescript
{
  profile_theme_id?: string  // UUID темы профиля
}
```

## Особенности

1. **Частичное обновление**: Можно обновлять только нужные поля, остальные останутся без изменений
2. **Валидация темы**: При обновлении `profile_theme_id` проверяется существование темы в БД
3. **Слияние настроек**: При обновлении `privacy_settings` происходит слияние с текущими настройками
4. **Pinned achievements**: Можно закрепить до 6 достижений. Проверяется, что все достижения разблокированы пользователем
5. **Streak**: Автоматически обновляется при вызове `/me/activity`. Учитывает пропущенные дни
6. **Статистика**: Автоматически вычисляется на основе достижений пользователя
7. **Автоматическое обновление**: Поле `updated_at` обновляется автоматически

## Ошибки

- `400 Bad Request` - невалидные данные (например, bio > 500 символов)
- `401 Unauthorized` - отсутствует или невалидный токен
- `404 Not Found` - тема профиля не найдена (при обновлении profile_theme_id)
