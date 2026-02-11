import type { User } from '@/types'

const USER_STORAGE_KEY = 'trofy_user'

/**
 * Сохраняет пользователя в localStorage
 */
export function saveUser(user: User): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}

/**
 * Получает пользователя из localStorage
 */
export function getUser(): User | null {
  if (typeof window === 'undefined') return null

  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY)
    if (!userStr) return null
    return JSON.parse(userStr) as User
  } catch (error) {
    console.error('Failed to get user:', error)
    return null
  }
}

/**
 * Очищает пользователя из localStorage
 */
export function clearUser(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(USER_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear user:', error)
  }
}
