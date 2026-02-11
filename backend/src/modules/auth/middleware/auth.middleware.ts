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
 * Middleware для проверки JWT токена
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
