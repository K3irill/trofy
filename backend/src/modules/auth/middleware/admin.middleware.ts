import { Response, NextFunction } from 'express'
import { prisma } from '../../../shared/database'
import { ApiError } from '../../../core/errors/ApiError'
import { AuthRequest } from './auth.middleware'

/**
 * Middleware для проверки прав администратора
 */
export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.userId

    if (!userId) {
      throw ApiError.unauthorized('User not authenticated')
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { is_admin: true },
    })

    if (!user || !user.is_admin) {
      throw ApiError.forbidden('Access denied. Admin only.')
    }

    next()
  } catch (error) {
    next(error)
  }
}
