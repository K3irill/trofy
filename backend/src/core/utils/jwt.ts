import jwt from 'jsonwebtoken'
import { config } from '../config'

export interface TokenPayload {
  userId: string
  type: 'access' | 'refresh'
}

/**
 * Генерирует access и refresh токены
 */
export function generateTokens(userId: string): {
  accessToken: string
  refreshToken: string
  expiresIn: number
} {
  const accessPayload: TokenPayload = {
    userId,
    type: 'access',
  }

  const refreshPayload: TokenPayload = {
    userId,
    type: 'refresh',
  }

  const accessToken = jwt.sign(accessPayload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
  })

  const refreshToken = jwt.sign(refreshPayload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  })

  // Вычисляем expires_in в секундах
  const expiresIn = parseExpiresIn(config.jwt.accessExpiresIn)

  return {
    accessToken,
    refreshToken,
    expiresIn,
  }
}

/**
 * Проверяет и декодирует токен
 */
export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, config.jwt.secret) as TokenPayload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

/**
 * Декодирует токен без проверки подписи
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload
  } catch (error) {
    return null
  }
}

/**
 * Парсит строку времени жизни токена в секунды
 */
function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/)
  if (!match) return 3600 // По умолчанию 1 час

  const value = parseInt(match[1], 10)
  const unit = match[2]

  switch (unit) {
    case 's':
      return value
    case 'm':
      return value * 60
    case 'h':
      return value * 3600
    case 'd':
      return value * 86400
    default:
      return 3600
  }
}
