import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../errors/ApiError'
import { Prisma } from '@prisma/client'

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Если это наш кастомный ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      status: err.statusCode,
    })
  }

  // Обработка ошибок Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Unique constraint violation',
        status: 409,
      })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Record not found',
        status: 404,
      })
    }
  }

  // Ошибка валидации JWT
  if (err.message === 'Invalid or expired token') {
    return res.status(401).json({
      error: 'Invalid or expired token',
      status: 401,
    })
  }

  // Неизвестная ошибка
  console.error('Unhandled error:', err)
  return res.status(500).json({
    error: 'Internal server error',
    status: 500,
  })
}
