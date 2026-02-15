import { Middleware } from '@reduxjs/toolkit'
import { isTokenExpired, getRefreshToken, getAccessToken, clearTokens } from '@/lib/auth/tokenStorage'
import { logout } from '../slices/authSlice'

/**
 * Middleware для проверки истечения токена и автоматического logout
 * при отсутствии refresh токена
 */
export const authMiddleware: Middleware = (store) => (next) => (action) => {
  // Проверяем, что action имеет тип
  if (!action || typeof action !== 'object' || !('type' in action)) {
    return next(action)
  }

  // Пропускаем проверку для самого действия logout, чтобы избежать бесконечного цикла
  if (action.type === logout.type) {
    return next(action)
  }

  // Пропускаем проверку для действий темы, чтобы избежать проблем при смене темы
  if (typeof action.type === 'string' && action.type.startsWith('theme/')) {
    return next(action)
  }

  // Пропускаем все действия RTK Query API - они обрабатываются через baseQueryWithReauth
  // RTK Query действия имеют формат: 'api/executeQuery' или 'api/executeMutation'
  if (typeof action.type === 'string' && action.type.startsWith('api/')) {
    return next(action)
  }

  // Проверяем истечение токена только если токен существует
  // Для неавторизованных пользователей (без токена) не делаем logout
  if (typeof window !== 'undefined') {
    const accessToken = getAccessToken()

    // Если токен есть, проверяем его истечение
    if (accessToken && isTokenExpired()) {
      const refreshToken = getRefreshToken()

      // Если нет refresh токена, делаем logout
      if (!refreshToken) {
        clearTokens()
        // Используем next вместо dispatch, чтобы избежать повторного прохождения через middleware
        return next(logout())
      }
      // Если есть refresh токен, RTK Query автоматически обновит токен через baseQueryWithReauth
    }
  }

  return next(action)
}
