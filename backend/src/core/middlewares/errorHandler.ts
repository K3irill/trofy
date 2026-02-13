import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../errors/ApiError'
import { Prisma } from '@prisma/client'
import { MulterError } from 'multer'

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Обработка Multer ошибок
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Размер файла превышает максимально допустимый (10MB)',
        status: 400,
      })
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Превышено максимальное количество файлов',
        status: 400,
      })
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Неожиданное поле файла',
        status: 400,
      })
    }
    return res.status(400).json({
      error: err.message || 'Ошибка загрузки файла',
      status: 400,
    })
  }

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
