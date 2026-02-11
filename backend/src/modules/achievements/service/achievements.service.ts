import { prisma } from '../../../shared/database'
import { ApiError } from '../../../core/errors/ApiError'
import { GetAchievementsDto, Rarity, SortBy, CreateCategoryDto, CreateAchievementDto } from '../dto/achievements.dto'

export class AchievementsService {
  /**
   * Получение всех возможных редкостей
   */
  async getRarities() {
    return [
      { value: 'COMMON', label: 'Обычные' },
      { value: 'RARE', label: 'Редкие' },
      { value: 'EPIC', label: 'Эпические' },
      { value: 'LEGENDARY', label: 'Легендарные' },
    ]
  }

  /**
   * Получение всех категорий
   */
  async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            achievements: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    })

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      icon_url: category.icon_url,
      is_custom: category.is_custom,
      achievements_count: category._count.achievements,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
    }))
  }

  /**
   * Получение всех категорий со статистикой пользователя
   */
  async getCategoriesWithStats(userId?: string) {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            achievements: true,
          },
        },
        achievements: {
          take: 8,
          orderBy: {
            created_at: 'asc',
          },
          select: {
            id: true,
            icon_url: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    })

    // Если userId передан, получаем статистику разблокированных достижений
    let userAchievementsSet: Set<string> | null = null
    let categoryUnlockedCounts: Map<string, number> | null = null

    if (userId) {
      const userAchievements = await prisma.userAchievement.findMany({
        where: {
          user_id: userId,
        },
        select: {
          achievement_id: true,
          achievement: {
            select: {
              category_id: true,
            },
          },
        },
      })

      userAchievementsSet = new Set(userAchievements.map((ua) => ua.achievement_id))

      // Подсчитываем разблокированные достижения по категориям
      categoryUnlockedCounts = new Map()
      userAchievements.forEach((ua) => {
        const categoryId = ua.achievement.category_id
        const currentCount = categoryUnlockedCounts!.get(categoryId) || 0
        categoryUnlockedCounts!.set(categoryId, currentCount + 1)
      })
    }

    return categories.map((category) => {
      const unlockedCount = userId && categoryUnlockedCounts
        ? categoryUnlockedCounts.get(category.id) || 0
        : 0

      const achievementsPreview = category.achievements.map((achievement) => {
        const isUnlocked = userId && userAchievementsSet
          ? userAchievementsSet.has(achievement.id)
          : false

        return {
          id: achievement.id,
          icon_url: achievement.icon_url,
          unlocked: isUnlocked,
        }
      })

      return {
        id: category.id,
        name: category.name,
        icon_url: category.icon_url,
        is_custom: category.is_custom,
        total: category._count.achievements,
        unlocked: unlockedCount,
        achievements_preview: achievementsPreview,
        created_at: category.created_at.toISOString(),
        updated_at: category.updated_at.toISOString(),
      }
    })
  }

  /**
   * Получение категории по ID
   */
  async getCategoryById(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            achievements: true,
          },
        },
      },
    })

    if (!category) {
      throw ApiError.notFound('Category not found')
    }

    return {
      id: category.id,
      name: category.name,
      icon_url: category.icon_url,
      is_custom: category.is_custom,
      achievements_count: category._count.achievements,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
    }
  }

  /**
   * Получение категории по ID со статистикой пользователя
   */
  async getCategoryByIdWithStats(categoryId: string, userId?: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            achievements: true,
          },
        },
      },
    })

    if (!category) {
      throw ApiError.notFound('Category not found')
    }

    let unlockedCount = 0
    if (userId) {
      const userAchievements = await prisma.userAchievement.findMany({
        where: {
          user_id: userId,
          achievement: {
            category_id: categoryId,
          },
        },
        select: {
          achievement_id: true,
        },
      })
      unlockedCount = userAchievements.length
    }

    return {
      id: category.id,
      name: category.name,
      icon_url: category.icon_url,
      is_custom: category.is_custom,
      total: category._count.achievements,
      unlocked: unlockedCount,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
    }
  }

  /**
   * Получение достижений в категории
   */
  async getAchievementsByCategory(
    categoryId: string,
    userId?: string,
    dto?: GetAchievementsDto
  ) {
    // Проверяем существование категории
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      throw ApiError.notFound('Category not found')
    }

    return this.getAchievements(userId, { ...dto, categoryId })
  }

  /**
   * Получение всех достижений с фильтрами
   */
  async getAchievements(userId?: string, dto?: GetAchievementsDto) {
    const where: any = {}

    // Фильтр по категории
    if (dto?.categoryId) {
      where.category_id = dto.categoryId
    }

    // Фильтр по редкости
    if (dto?.rarity) {
      where.rarity = dto.rarity
    }

    // Фильтр по поисковому запросу
    if (dto?.query) {
      where.OR = [
        { title: { contains: dto.query, mode: 'insensitive' } },
        { description: { contains: dto.query, mode: 'insensitive' } },
      ]
    }

    // Получаем достижения
    const includeConfig: any = {
      category: {
        select: {
          id: true,
          name: true,
          icon_url: true,
        },
      },
    }

    if (userId) {
      includeConfig.userAchievements = {
        where: {
          user_id: userId,
        },
      }
    }

    const achievements = await prisma.achievement.findMany({
      where,
      include: includeConfig,
      take: dto?.limit || 100,
      skip: dto?.offset || 0,
    })

    // Форматируем результат
    let formatted = achievements.map((achievement) => {
      const userAchievement = userId && achievement.userAchievements
        ? achievement.userAchievements.find((ua) => ua.user_id === userId)
        : null

      return {
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon_url: achievement.icon_url,
        rarity: achievement.rarity.toLowerCase() as 'common' | 'rare' | 'epic' | 'legendary',
        category: {
          id: achievement.category.id,
          name: achievement.category.name,
          icon_url: achievement.category.icon_url,
        },
        xp_reward: achievement.xp_reward,
        unlocked: !!userAchievement,
        unlocked_at: userAchievement?.unlocked_at.toISOString(),
        is_public: userAchievement?.is_public ?? true,
        created_at: achievement.created_at.toISOString(),
      }
    })

    // Фильтр по разблокированности (если указан)
    // Для фильтра по unlocked требуется авторизация
    if (dto?.unlocked !== undefined) {
      if (!userId) {
        // Если запрос без авторизации, но указан фильтр unlocked, возвращаем пустой массив
        // так как для неавторизованных пользователей все достижения считаются незаблокированными
        return {
          achievements: [],
          total: 0,
          limit: dto?.limit || 100,
          offset: dto?.offset || 0,
        }
      }
      formatted = formatted.filter((a) => a.unlocked === dto.unlocked)
    }

    // Сортировка
    if (dto?.sortBy) {
      switch (dto.sortBy) {
        case SortBy.UNLOCKED_ASC:
          formatted.sort((a, b) => {
            if (a.unlocked === b.unlocked) return 0
            return a.unlocked ? -1 : 1
          })
          break
        case SortBy.UNLOCKED_DESC:
          formatted.sort((a, b) => {
            if (a.unlocked === b.unlocked) return 0
            return a.unlocked ? 1 : -1
          })
          break
        case SortBy.DATE_ASC:
          formatted.sort((a, b) => {
            if (!a.unlocked_at && !b.unlocked_at) return 0
            if (!a.unlocked_at) return 1
            if (!b.unlocked_at) return -1
            return a.unlocked_at.localeCompare(b.unlocked_at)
          })
          break
        case SortBy.DATE_DESC:
          formatted.sort((a, b) => {
            if (!a.unlocked_at && !b.unlocked_at) return 0
            if (!a.unlocked_at) return 1
            if (!b.unlocked_at) return -1
            return b.unlocked_at.localeCompare(a.unlocked_at)
          })
          break
        case SortBy.XP_ASC:
          formatted.sort((a, b) => a.xp_reward - b.xp_reward)
          break
        case SortBy.XP_DESC:
          formatted.sort((a, b) => b.xp_reward - a.xp_reward)
          break
      }
    }

    // Получаем общее количество для пагинации
    const total = await prisma.achievement.count({ where })

    return {
      achievements: formatted,
      total,
      limit: dto?.limit || 100,
      offset: dto?.offset || 0,
    }
  }

  /**
   * Получение достижения по ID
   */
  async getAchievementById(achievementId: string, userId?: string) {
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
      include: (() => {
        const includeConfig: any = {
          category: {
            select: {
              id: true,
              name: true,
              icon_url: true,
            },
          },
        }

        if (userId) {
          includeConfig.userAchievements = {
            where: {
              user_id: userId,
            },
          }
        }

        return includeConfig
      })(),
    })

    if (!achievement) {
      throw ApiError.notFound('Achievement not found')
    }

    const userAchievement = userId && achievement.userAchievements
      ? achievement.userAchievements.find((ua) => ua.user_id === userId)
      : null

    return {
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      icon_url: achievement.icon_url,
      rarity: achievement.rarity.toLowerCase() as 'common' | 'rare' | 'epic' | 'legendary',
      category: {
        id: achievement.category.id,
        name: achievement.category.name,
        icon_url: achievement.category.icon_url,
      },
      xp_reward: achievement.xp_reward,
      unlocked: !!userAchievement,
      unlocked_at: userAchievement?.unlocked_at.toISOString(),
      is_public: userAchievement?.is_public ?? true,
      created_at: achievement.created_at.toISOString(),
      updated_at: achievement.updated_at.toISOString(),
    }
  }

  /**
   * Создание категории (для админов - обычная, для пользователей - кастомная)
   */
  async createCategory(dto: CreateCategoryDto, userId: string, isAdmin: boolean = false) {
    const category = await prisma.category.create({
      data: {
        name: dto.name,
        icon_url: dto.icon_url || null,
        is_custom: !isAdmin, // Для админов is_custom = false, для пользователей = true
        creator_id: !isAdmin ? userId : null, // Для пользователей сохраняем creator_id
      },
    })

    return {
      id: category.id,
      name: category.name,
      icon_url: category.icon_url,
      is_custom: category.is_custom,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
    }
  }

  /**
   * Создание достижения (для админов - обычное, для пользователей - кастомное)
   */
  async createAchievement(dto: CreateAchievementDto, userId: string, isAdmin: boolean = false) {
    // Проверяем существование категории
    const category = await prisma.category.findUnique({
      where: { id: dto.category_id },
    })

    if (!category) {
      throw ApiError.notFound('Category not found')
    }

    // Если пользователь создает достижение, проверяем что категория его или кастомная
    if (!isAdmin) {
      if (!category.is_custom || category.creator_id !== userId) {
        throw ApiError.forbidden('You can only create achievements in your own custom categories')
      }
    }

    const achievement = await prisma.achievement.create({
      data: {
        title: dto.title,
        description: dto.description,
        icon_url: dto.icon_url || null,
        rarity: dto.rarity || Rarity.COMMON,
        category_id: dto.category_id,
        xp_reward: dto.xp_reward || 100,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon_url: true,
          },
        },
      },
    })

    return {
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      icon_url: achievement.icon_url,
      rarity: achievement.rarity,
      category: {
        id: achievement.category.id,
        name: achievement.category.name,
        icon_url: achievement.category.icon_url,
      },
      xp_reward: achievement.xp_reward,
      created_at: achievement.created_at.toISOString(),
      updated_at: achievement.updated_at.toISOString(),
    }
  }
}

export const achievementsService = new AchievementsService()
