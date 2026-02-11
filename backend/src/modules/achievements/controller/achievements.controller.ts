import { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { achievementsService } from '../service/achievements.service'
import { GetAchievementsDto, CreateCategoryDto, CreateAchievementDto } from '../dto/achievements.dto'
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
}

export const achievementsController = new AchievementsController()
