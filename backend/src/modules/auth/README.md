# Модуль Auth (Авторизация)

Модуль для аутентификации и авторизации пользователей.

## Роуты

### Публичные роуты

#### `POST /api/auth/register`
Регистрация нового пользователя.

**Тело запроса:**
```json
{
  "username": "string (обязательно, мин. 3 символа)",
  "email": "string (опционально, валидный email)",
  "phone": "string (опционально, формат +79991234567)",
  "password": "string (обязательно, мин. 6 символов)"
}
```

**Ответ:**
```json
{
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string | null",
    "phone": "string | null",
    "xp": 0,
    "level": 1,
    "profile_theme": {...},
    "privacy_settings": {...},
    ...
  },
  "tokens": {
    "access_token": "string",
    "refresh_token": "string",
    "expires_in": 3600
  }
}
```

#### `POST /api/auth/login`
Вход пользователя.

**Тело запроса:**
```json
{
  "login": "string (email или телефон)",
  "password": "string (мин. 6 символов)"
}
```

**Ответ:** Аналогичен ответу регистрации.

#### `POST /api/auth/refresh`
Обновление access токена.

**Тело запроса:**
```json
{
  "refresh_token": "string"
}
```

**Ответ:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "expires_in": 3600
}
```

#### `POST /api/auth/logout`
Выход пользователя.

**Заголовки:**
```
Authorization: Bearer <access_token>
```

**Тело запроса:**
```json
{
  "refresh_token": "string"
}
```

**Ответ:** `204 No Content`

### Защищенные роуты (требуют авторизации)

#### `GET /api/auth/me`
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
  "profile_theme": {...},
  "privacy_settings": {...},
  ...
}
```

#### `POST /api/auth/link-platform`
Привязка платформы к аккаунту (VK, Telegram).

**Заголовки:**
```
Authorization: Bearer <access_token>
```

**Тело запроса:**
```json
{
  "platform": "VK | TELEGRAM | WEB",
  "platform_user_id": "string",
  "access_token": "string (опционально)"
}
```

**Ответ:** Обновленные данные пользователя.

## DTO

### LoginDto
```typescript
{
  login: string      // email или телефон
  password: string   // мин. 6 символов
}
```

### RegisterDto
```typescript
{
  username: string   // мин. 3 символа
  email?: string     // валидный email
  phone?: string     // формат +79991234567
  password: string   // мин. 6 символов
}
```

### RefreshTokenDto
```typescript
{
  refresh_token: string
}
```

### LinkPlatformDto
```typescript
{
  platform: PlatformType        // VK | TELEGRAM | WEB
  platform_user_id: string
  access_token?: string
}
```

## Использование токенов

1. При успешной регистрации/входе сохраните токены в cookies или localStorage
2. Для защищенных роутов передавайте `access_token` в заголовке `Authorization: Bearer <token>`
3. При истечении `access_token` используйте `refresh_token` для получения нового
4. Токены автоматически проверяются middleware `authenticate`

## Ошибки

- `400 Bad Request` - невалидные данные
- `401 Unauthorized` - неверные credentials или отсутствует токен
- `409 Conflict` - пользователь уже существует
- `404 Not Found` - ресурс не найден
