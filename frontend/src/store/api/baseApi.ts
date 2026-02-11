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
    // Автоматически добавляем access токен в заголовки
    const token = getAccessToken()
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('content-type', 'application/json')
    return headers
  },
})

// Кастомный baseQuery с автоматическим refresh токена
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  // Если получили 401, пытаемся обновить токен
  if (result.error && result.error.status === 401) {
    const refreshToken = getRefreshToken()

    if (refreshToken) {
      // Пытаемся обновить токен
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
      } else {
        // Если refresh не удался, очищаем токены
        clearTokens()
        // Можно диспатчить logout action здесь, если нужно
      }
    } else {
      // Нет refresh токена, очищаем все
      clearTokens()
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Achievement', 'Category', 'UserAchievement'],
  endpoints: () => ({}),
})
