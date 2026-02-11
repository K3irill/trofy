const ACCESS_TOKEN_KEY = 'trofy_access_token'
const REFRESH_TOKEN_KEY = 'trofy_refresh_token'
const TOKEN_EXPIRES_KEY = 'trofy_token_expires'

export interface Tokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

/**
 * Утилита для работы с cookies
 */
function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

/**
 * Сохраняет токены в cookies
 */
export function saveTokens(tokens: Tokens): void {
  if (typeof window === 'undefined') return

  try {
    // Access токен - 1 день (expires_in в секундах)
    const accessTokenDays = Math.floor(tokens.expires_in / 86400) || 1
    setCookie(ACCESS_TOKEN_KEY, tokens.access_token, accessTokenDays)

    // Refresh токен - 7 дней (httpOnly недоступен для чтения, но устанавливаем)
    setCookie(REFRESH_TOKEN_KEY, tokens.refresh_token, 7)

    // Сохраняем время истечения access токена в localStorage для проверки
    const expiresAt = Date.now() + tokens.expires_in * 1000
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString())
    }
  } catch (error) {
    console.error('Failed to save tokens:', error)
  }
}

/**
 * Получает access токен из cookies
 */
export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_KEY)
}

/**
 * Получает refresh токен из cookies (null если httpOnly)
 */
export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_KEY)
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
 * Очищает все токены из cookies и localStorage
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return

  try {
    deleteCookie(ACCESS_TOKEN_KEY)
    deleteCookie(REFRESH_TOKEN_KEY)
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_EXPIRES_KEY)
    }
  } catch (error) {
    console.error('Failed to clear tokens:', error)
  }
}

/**
 * Проверяет наличие токенов
 */
export function hasTokens(): boolean {
  // Refresh токен httpOnly, проверяем только access токен
  return getAccessToken() !== null
}
