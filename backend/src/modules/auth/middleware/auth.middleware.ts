import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../../../core/utils/jwt'
import { ApiError } from '../../../core/errors/ApiError'
import { prisma } from '../../../shared/database'

export interface AuthRequest extends Request {
  user?: {
    id: string
    userId: string
  }
}

/**
 * Middleware для опциональной проверки JWT токена
 * Если токен есть и валиден, устанавливает req.user, но не требует обязательного наличия токена
 */
export async function optionalAuthenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Токен не передан - это нормально для опциональной аутентификации
      return next()
    }

    const token = authHeader.substring(7)

    try {
      const payload = verifyToken(token)

      if (payload.type !== 'access') {
        // Неверный тип токена - просто пропускаем
        return next()
      }

      // Проверяем существование пользователя
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true },
      })

      if (user) {
        req.user = {
          id: payload.userId,
          userId: payload.userId,
        }
      }
    } catch (error) {
      // Если токен невалиден, просто пропускаем без ошибки
      // Это опциональная аутентификация
    }

    next()
  } catch (error) {
    // В случае любой ошибки просто продолжаем без аутентификации
    next()
  }
}

/**
 * Middleware для проверки JWT токена (обязательный)
 */
export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided')
    }

    const token = authHeader.substring(7)

    const payload = verifyToken(token)

    if (payload.type !== 'access') {
      throw ApiError.unauthorized('Invalid token type')
    }

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true },
    })

    if (!user) {
      throw ApiError.unauthorized('User not found')
    }

    req.user = {
      id: payload.userId,
      userId: payload.userId,
    }

    next()
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error)
    }
    return next(ApiError.unauthorized('Invalid token'))
  }
}
