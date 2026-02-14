import { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { userService } from '../service/user.service'
import { UpdateUserDto } from '../dto/user.dto'
import { ApiError } from '../../../core/errors/ApiError'
import { AuthRequest } from '../../auth/middleware/auth.middleware'
import { saveAvatar, validateFile } from '../../../shared/utils/fileUpload'

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

  /**
   * POST /api/users/me/avatar - Загрузка аватарки пользователя
   */
  async uploadAvatar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const file = req.file
      if (!file) {
        throw ApiError.badRequest('Файл не предоставлен')
      }

      const validation = validateFile(file)
      if (!validation.valid) {
        throw ApiError.badRequest(validation.error || 'Ошибка валидации файла')
      }

      const uploadedFile = await saveAvatar(file.buffer, file.mimetype, req.user.userId)
      const user = await userService.updateUser(req.user.userId, { avatar_url: uploadedFile.url })

      res.status(201).json({
        avatar_url: uploadedFile.url,
        user,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/users/:username - Получение профиля пользователя по username
   */
  async getUserByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params
      const viewerId = (req as any).user?.userId // Может быть undefined, если не авторизован

      const user = await userService.getUserByUsername(username, viewerId)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/users/:username/stats - Получение статистики пользователя
   */
  async getUserStatsByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params
      const viewerId = (req as any).user?.userId // Может быть undefined, если не авторизован

      const stats = await userService.getUserStatsByUsername(username, viewerId)
      res.json(stats)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/users/:username/achievements - Получение достижений пользователя
   */
  async getUserAchievementsByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params
      const viewerId = (req as any).user?.userId // Может быть undefined, если не авторизован

      const status = req.query.status as 'all' | 'achieved' | 'in_progress' | undefined
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined

      const achievements = await userService.getUserAchievementsByUsername(username, viewerId, {
        status,
        limit,
        offset,
      })
      res.json(achievements)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/users/:username/achievements/recent - Получение последних достижений пользователя
   */
  async getRecentAchievementsByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params
      const viewerId = (req as any).user?.userId // Может быть undefined, если не авторизован

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6

      const achievements = await userService.getRecentAchievementsByUsername(username, viewerId, limit)
      res.json(achievements)
    } catch (error) {
      next(error)
    }
  }
}

export const userController = new UserController()
