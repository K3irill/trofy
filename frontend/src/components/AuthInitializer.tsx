'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setUser } from '@/store/slices/authSlice'
import { getUser } from '@/lib/auth/userStorage'
import { hasTokens } from '@/lib/auth/tokenStorage'

/**
 * Компонент для инициализации авторизации из localStorage на клиенте
 */
export function AuthInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Загружаем пользователя из localStorage только на клиенте
    const savedUser = getUser()
    const hasValidTokens = hasTokens()

    if (savedUser && hasValidTokens) {
      dispatch(setUser(savedUser))
    }
  }, [dispatch])

  return null
}
