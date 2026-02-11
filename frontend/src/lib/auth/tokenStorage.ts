const ACCESS_TOKEN_KEY = 'trofy_access_token'
const REFRESH_TOKEN_KEY = 'trofy_refresh_token'
const TOKEN_EXPIRES_KEY = 'trofy_token_expires'

export interface Tokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

/**
 * Сохраняет токены в localStorage
 */
export function saveTokens(tokens: Tokens): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
    
    // Сохраняем время истечения токена
    const expiresAt = Date.now() + tokens.expires_in * 1000
    localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString())
  } catch (error) {
    console.error('Failed to save tokens:', error)
  }
}

/**
 * Получает access токен из localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null

  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  } catch (error) {
    console.error('Failed to get access token:', error)
    return null
  }
}

/**
 * Получает refresh токен из localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null

  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch (error) {
    console.error('Failed to get refresh token:', error)
    return null
  }
}

/**
 * Проверяет, истек ли access токен
 */
export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return true

  try {
    const expiresAt = localStorage.getItem(TOKEN_EXPIRES_KEY)
    if (!expiresAt) return true

    return Date.now() >= parseInt(expiresAt, 10)
  } catch (error) {
    console.error('Failed to check token expiration:', error)
    return true
  }
}

/**
 * Очищает все токены из localStorage
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRES_KEY)
  } catch (error) {
    console.error('Failed to clear tokens:', error)
  }
}

/**
 * Проверяет наличие токенов
 */
export function hasTokens(): boolean {
  return getAccessToken() !== null && getRefreshToken() !== null
}
