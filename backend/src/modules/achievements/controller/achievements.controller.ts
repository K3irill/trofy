import { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import multer from 'multer'
import { achievementsService } from '../service/achievements.service'
import { GetAchievementsDto, CreateCategoryDto, CreateAchievementDto, CompleteAchievementDto, UpdateAchievementSettingsDto, CreateCommentDto, UpdateProgressDto } from '../dto/achievements.dto'
import { ApiError } from '../../../core/errors/ApiError'
import { AuthRequest } from '../../auth/middleware/auth.middleware'

// Настройка multer для загрузки файлов
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

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

export class AchievementsController {
  /**
   * GET /api/achievements/rarities - Получение всех возможных редкостей
   */
  async getRarities(req: Request, res: Response, next: NextFunction) {
    try {
      const rarities = await achievementsService.getRarities()
      res.json(rarities)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/achievements/categories - Получение всех категорий
   */
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await achievementsService.getCategories()
      res.json(categories)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/achievements/categories/with-stats - Получение всех категорий со статистикой пользователя
   */
  async getCategoriesWithStats(req: Request | AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.userId
      const categories = await achievementsService.getCategoriesWithStats(userId)
      res.json(categories)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/achievements/categories/:id - Получение категории по ID
   */
  async getCategoryById(req: Request | AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = (req as AuthRequest).user?.userId
      const category = await achievementsService.getCategoryById(id)
      res.json(category)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/achievements/categories/:id/with-stats - Получение категории по ID со статистикой пользователя
   */
  async getCategoryByIdWithStats(req: Request | AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = (req as AuthRequest).user?.userId
      const category = await achievementsService.getCategoryByIdWithStats(id, userId)
      res.json(category)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/achievements - Получение всех достижений с фильтрами
   */
  async getAchievements(req: Request | AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user?.userId

      // Очищаем пустые строки из query параметров и преобразуем типы
      const cleanedQuery: any = { ...req.query }
      if (cleanedQuery.rarity === '' || cleanedQuery.rarity === null || cleanedQuery.rarity === undefined) {
        delete cleanedQuery.rarity
      }
      if (cleanedQuery.categoryId === '' || cleanedQuery.categoryId === null || cleanedQuery.categoryId === undefined) {
        delete cleanedQuery.categoryId
      }
      if (cleanedQuery.query === '' || cleanedQuery.query === null || cleanedQuery.query === undefined) {
        delete cleanedQuery.query
      }
      if (cleanedQuery.sortBy === '' || cleanedQuery.sortBy === null || cleanedQuery.sortBy === undefined) {
        delete cleanedQuery.sortBy
      }
      // Преобразуем boolean строки
      if (cleanedQuery.unlocked === 'true') {
        cleanedQuery.unlocked = true
      } else if (cleanedQuery.unlocked === 'false') {
        cleanedQuery.unlocked = false
      } else if (cleanedQuery.unlocked === '' || cleanedQuery.unlocked === null || cleanedQuery.unlocked === undefined) {
        delete cleanedQuery.unlocked
      }
      // Преобразуем числа
      if (cleanedQuery.limit) {
        cleanedQuery.limit = parseInt(cleanedQuery.limit, 10)
      }
      if (cleanedQuery.offset) {
        cleanedQuery.offset = parseInt(cleanedQuery.offset, 10)
      }

      const dto = plainToInstance(GetAchievementsDto, cleanedQuery)

      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const result = await achievementsService.getAchievements(userId, dto)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/achievements/showcase/:type - Получение глобальных достижений для showcase
   * type: 'best' | 'recent'
   */
  async getShowcaseAchievements(req: Request | AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type } = req.params
      const userId = (req as AuthRequest).user?.userId
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10

      if (type !== 'best' && type !== 'recent') {
        return next(ApiError.badRequest('Invalid type. Must be "best" or "recent"'))
      }

      const achievements = await achievementsService.getGlobalShowcaseAchievements(
        type,
        limit,
        userId
      )
      res.json(achievements)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/achievements/categories/:categoryId/achievements - Получение достижений в категории
   */
  async getAchievementsByCategory(
    req: Request | AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.params
      const userId = (req as AuthRequest).user?.userId

      // Очищаем пустые строки из query параметров и преобразуем типы
      const cleanedQuery: any = { ...req.query }
      if (cleanedQuery.rarity === '' || cleanedQuery.rarity === null || cleanedQuery.rarity === undefined) {
        delete cleanedQuery.rarity
      }
      if (cleanedQuery.query === '' || cleanedQuery.query === null || cleanedQuery.query === undefined) {
        delete cleanedQuery.query
      }
      if (cleanedQuery.sortBy === '' || cleanedQuery.sortBy === null || cleanedQuery.sortBy === undefined) {
        delete cleanedQuery.sortBy
      }
      // Преобразуем boolean строки
      if (cleanedQuery.unlocked === 'true') {
        cleanedQuery.unlocked = true
      } else if (cleanedQuery.unlocked === 'false') {
        cleanedQuery.unlocked = false
      } else if (cleanedQuery.unlocked === '' || cleanedQuery.unlocked === null || cleanedQuery.unlocked === undefined) {
        delete cleanedQuery.unlocked
      }
      // Преобразуем числа
      if (cleanedQuery.limit) {
        cleanedQuery.limit = parseInt(cleanedQuery.limit, 10)
      }
      if (cleanedQuery.offset) {
        cleanedQuery.offset = parseInt(cleanedQuery.offset, 10)
      }

      const dto = plainToInstance(GetAchievementsDto, cleanedQuery)

      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const result = await achievementsService.getAchievementsByCategory(categoryId, userId, dto)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/achievements/:id - Получение достижения по ID
   */
  async getAchievementById(req: Request | AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = (req as AuthRequest).user?.userId

      const achievement = await achievementsService.getAchievementById(id, userId)
      res.json(achievement)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/achievements/categories - Создание категории (только для админов)
   */
  async createCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        throw ApiError.unauthorized('User not authenticated')
      }

      const dto = plainToInstance(CreateCategoryDto, req.body)
      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const category = await achievementsService.createCategory(dto, userId, true)
      res.status(201).json(category)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/achievements/categories/custom - Создание кастомной категории (для пользователей)
   */
  async createCustomCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        throw ApiError.unauthorized('User not authenticated')
      }

      const dto = plainToInstance(CreateCategoryDto, req.body)
      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const category = await achievementsService.createCategory(dto, userId, false)
      res.status(201).json(category)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/achievements - Создание достижения (только для админов)
   */
  async createAchievement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        throw ApiError.unauthorized('User not authenticated')
      }

      const dto = plainToInstance(CreateAchievementDto, req.body)
      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const achievement = await achievementsService.createAchievement(dto, userId, true)
      res.status(201).json(achievement)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/achievements/custom - Создание кастомного достижения (для пользователей)
   */
  async createCustomAchievement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        throw ApiError.unauthorized('User not authenticated')
      }

      const dto = plainToInstance(CreateAchievementDto, req.body)
      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const achievement = await achievementsService.createAchievement(dto, userId, false)
      res.status(201).json(achievement)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/achievements/:id/detail - Получение детальной информации о достижении
   */
  async getAchievementDetail(req: Request | AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = (req as AuthRequest).user?.userId
      const detail = await achievementsService.getAchievementDetail(id, userId)
      res.json(detail)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/achievements/:id/complete - Завершение достижения
   */
  async completeAchievement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const { id } = req.params
      const userId = req.user.userId
      const files = req.files as Express.Multer.File[]

      const dto = plainToInstance(CompleteAchievementDto, req.body)
      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const result = await achievementsService.completeAchievement(
        userId,
        id,
        dto,
        files || []
      )
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/achievements/user-achievements/:userAchievementId - Обновление выполненного достижения
   */
  async updateAchievement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const { userAchievementId } = req.params
      const userId = req.user.userId
      const files = req.files as Express.Multer.File[]

      const { UpdateAchievementDto } = await import('../dto/achievements.dto')
      const dto = plainToInstance(UpdateAchievementDto, req.body)
      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const result = await achievementsService.updateAchievement(
        userId,
        userAchievementId,
        dto,
        files || []
      )
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/achievements/user-achievements/:userAchievementId - Сброс выполнения достижения
   */
  async resetAchievement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const { userAchievementId } = req.params
      const userId = req.user.userId

      const result = await achievementsService.resetAchievement(userId, userAchievementId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PATCH /api/achievements/user-achievements/:userAchievementId - Обновление настроек
   */
  async updateAchievementSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const { userAchievementId } = req.params
      const userId = req.user.userId

      const dto = plainToInstance(UpdateAchievementSettingsDto, req.body)
      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const result = await achievementsService.updateAchievementSettings(
        userAchievementId,
        userId,
        dto
      )
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/achievements/user-achievements/:userAchievementId/favorite - Переключение избранного
   */
  async toggleFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const { userAchievementId } = req.params
      const userId = req.user.userId

      const result = await achievementsService.toggleFavorite(userId, userAchievementId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/achievements/user-achievements/:userAchievementId/comments - Получение комментариев
   */
  async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { userAchievementId } = req.params
      const limit = parseInt(req.query.limit as string) || 50
      const offset = parseInt(req.query.offset as string) || 0

      const comments = await achievementsService.getComments(userAchievementId, limit, offset)
      res.json(comments)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/achievements/user-achievements/:userAchievementId/comments - Создание комментария
   */
  async createComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const { userAchievementId } = req.params
      const userId = req.user.userId

      const dto = plainToInstance(CreateCommentDto, req.body)
      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const comment = await achievementsService.createComment(userId, userAchievementId, dto)
      res.status(201).json(comment)
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/achievements/user-achievements/:userAchievementId/comments/:commentId - Удаление комментария
   */
  async deleteComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const { commentId } = req.params
      const userId = req.user.userId

      const result = await achievementsService.deleteComment(commentId, userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/achievements/user-achievements/:userAchievementId/likes - Переключение лайка
   */
  async toggleLike(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const { userAchievementId } = req.params
      const userId = req.user.userId

      const result = await achievementsService.toggleLike(userId, userAchievementId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/achievements/user-achievements/:userAchievementId/photos - Загрузка фотографий
   */
  async uploadPhotos(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const { userAchievementId } = req.params
      const userId = req.user.userId
      const files = req.files as Express.Multer.File[]

      if (!files || files.length === 0) {
        throw ApiError.badRequest('No files provided')
      }

      const photos = await achievementsService.uploadPhotos(userAchievementId, userId, files)
      res.status(201).json(photos)
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/achievements/user-achievements/:userAchievementId/photos/:photoId - Удаление фотографии
   */
  async deletePhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const { photoId } = req.params
      const userId = req.user.userId

      const result = await achievementsService.deletePhoto(photoId, userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PATCH /api/achievements/:achievementId/progress - Обновление прогресса выполнения
   */
  async updateProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const { achievementId } = req.params
      const userId = req.user.userId

      if (!achievementId) {
        return next(ApiError.badRequest('Achievement ID is required'))
      }

      const dto = plainToInstance(UpdateProgressDto, req.body)
      if (!(await validateDto(dto, res, next))) return

      const result = await achievementsService.updateProgress(userId, achievementId, dto)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const achievementsController = new AchievementsController()
