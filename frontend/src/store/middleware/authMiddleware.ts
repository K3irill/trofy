import { Middleware } from '@reduxjs/toolkit'
import { isTokenExpired, getRefreshToken, clearTokens } from '@/lib/auth/tokenStorage'
import { logout } from '../slices/authSlice'

/**
 * Middleware для проверки истечения токена и автоматического logout
 * при отсутствии refresh токена
 */
export const authMiddleware: Middleware = (store) => (next) => (action) => {
  // Пропускаем проверку для самого действия logout, чтобы избежать бесконечного цикла
  if (action.type === logout.type) {
    return next(action)
  }

  // Пропускаем проверку для действий темы, чтобы избежать проблем при смене темы
  if (action.type?.startsWith('theme/')) {
    return next(action)
  }

  // Проверяем истечение токена только для действий, связанных с авторизацией
  // или для действий, которые требуют авторизации
  if (typeof window !== 'undefined' && isTokenExpired()) {
    const refreshToken = getRefreshToken()

    // Если нет refresh токена, делаем logout
    if (!refreshToken) {
      clearTokens()
      // Используем next вместо dispatch, чтобы избежать повторного прохождения через middleware
      return next(logout())
    }
    // Если есть refresh токен, RTK Query автоматически обновит токен через baseQueryWithReauth
  }

  return next(action)
}
