import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '@/lib/auth/tokenStorage'
import type { TokenResponse } from '@/types/auth'

// Базовый URL API (будет настроен позже через переменные окружения)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken()
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    // Добавляем content-type только если есть body
    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json')
    }
    return headers
  },
})

// Кастомный baseQuery с автоматическим refresh токена и обработкой ошибок
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  // Логируем результат для отладки
  console.log('baseQueryWithReauth full result:', result)

  // Обрабатываем ошибки от бэкенда
  if (result.error) {
    // Бэкенд возвращает { error: string, status: number }
    // Преобразуем в формат, понятный RTK Query
    if (result.error.status && 'data' in result.error) {
      const errorData = result.error.data as any
      if (errorData && typeof errorData === 'object' && 'error' in errorData) {
        // Извлекаем сообщение об ошибке из ответа бэкенда
        result.error.data = errorData.error || errorData.message || 'Произошла ошибка'
      }
    }
  }

  // Если получили 401, пытаемся обновить токен
  if (result.error && result.error.status === 401) {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      clearTokens()
      return result
    }

    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refresh_token: refreshToken },
      },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      // Сохраняем новые токены
      saveTokens(refreshResult.data as TokenResponse)
      // Повторяем оригинальный запрос с новым токеном
      result = await baseQuery(args, api, extraOptions)

      // Обрабатываем ошибки повторного запроса
      if (result.error && 'data' in result.error) {
        const errorData = result.error.data as any
        if (errorData && typeof errorData === 'object' && 'error' in errorData) {
          result.error.data = errorData.error || errorData.message || 'Произошла ошибка'
        }
      }
    } else {
      // Если refresh не удался, очищаем токены
      clearTokens()
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Achievement', 'Category', 'UserAchievement', 'Notifications', 'AchievementDetail', 'Comment', 'Like'],
  endpoints: () => ({}),
})
