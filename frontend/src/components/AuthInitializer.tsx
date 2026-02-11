'use client'

import { useGetMeQuery } from '@/store/api/authApi'
import { hasTokens } from '@/lib/auth/tokenStorage'
import { Loader } from '@/components/Loader'

interface AuthInitializerProps {
  children: React.ReactNode
}

/**
 * Компонент для инициализации авторизации - делает запрос getMe при наличии токенов
 * Показывает лоадер пока идет проверка авторизации
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
  const hasValidTokens = hasTokens()

  // Автоматически запрашиваем данные пользователя если есть токены
  const { isLoading, isUninitialized } = useGetMeQuery(undefined, {
    skip: !hasValidTokens, // Пропускаем запрос если нет токенов
  })

  // Показываем лоадер если есть токены и запрос еще идет или не начинался
  if (hasValidTokens && (isLoading || isUninitialized)) {
    return <Loader />
  }

  return <>{children}</>
}
