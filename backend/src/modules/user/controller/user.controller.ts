import { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { userService } from '../service/user.service'
import { UpdateUserDto } from '../dto/user.dto'
import { ApiError } from '../../../core/errors/ApiError'
import { AuthRequest } from '../../auth/middleware/auth.middleware'

/**
 * Валидация DTO
 */
async function validateDto(dto: any, res: Response, next: NextFunction): Promise<boolean> {
  const errors = await validate(dto)
  if (errors.length > 0) {
    const messages = errors
      .map((error) => Object.values(error.constraints || {}))
      .flat()
    next(ApiError.badRequest(messages.join(', ')))
    return false
  }
  return true
}

export class UserController {
  /**
   * PATCH /api/users/me - Обновление данных текущего пользователя
   */
  async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const dto = plainToInstance(UpdateUserDto, req.body)

      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const user = await userService.updateUser(req.user.userId, dto)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/users/me - Получение данных текущего пользователя
   */
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      // Обновляем серию подряд при каждом запросе
      await userService.updateStreak(req.user.userId)

      const user = await userService.getUserById(req.user.userId)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/users/me/activity - Обновление streak при активности
   */
  async updateActivity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const user = await userService.updateStreak(req.user.userId)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/users/me/stats - Получение статистики пользователя
   */
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const stats = await userService.getUserStats(req.user.userId)
      res.json(stats)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/users/me/achievements/recent - Получение последних достижений пользователя
   */
  async getRecentAchievements(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5
      const achievements = await userService.getRecentAchievements(req.user.userId, limit)
      res.json(achievements)
    } catch (error) {
      next(error)
    }
  }
}

export const userController = new UserController()
