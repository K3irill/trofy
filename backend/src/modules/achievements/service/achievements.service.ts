import { prisma } from '../../../shared/database'
import { ApiError } from '../../../core/errors/ApiError'
import { GetAchievementsDto, Rarity, SortBy, CreateCategoryDto, CreateAchievementDto, CompleteAchievementDto, UpdateAchievementDto, UpdateAchievementSettingsDto, CreateCommentDto } from '../dto/achievements.dto'
import { saveFileFromBuffer, deleteFile, deleteAchievementFiles } from '../../../shared/utils/fileUpload'

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

    let userAchievements: Array<{
      achievement_id: string
      progress: number
      completion_date: Date | null
      achievement: {
        category_id: string
      }
    }> = []

    if (userId) {
      userAchievements = await prisma.userAchievement.findMany({
        where: {
          user_id: userId,
        },
        select: {
          achievement_id: true,
          progress: true,
          completion_date: true,
          achievement: {
            select: {
              category_id: true,
            },
          },
        },
      })

      userAchievementsSet = new Set(userAchievements.map((ua) => ua.achievement_id))

      // Подсчитываем только завершенные достижения по категориям (с completion_date)
      categoryUnlockedCounts = new Map()
      userAchievements.forEach((ua) => {
        // Считаем только завершенные достижения (с completion_date)
        if (ua.completion_date) {
          const categoryId = ua.achievement.category_id
          const currentCount = categoryUnlockedCounts!.get(categoryId) || 0
          categoryUnlockedCounts!.set(categoryId, currentCount + 1)
        }
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

        // Находим UserAchievement для этого достижения, если оно разблокировано
        const userAchievement = userId && userAchievements.length > 0
          ? userAchievements.find((ua) => ua.achievement_id === achievement.id)
          : null

        return {
          id: achievement.id,
          icon_url: achievement.icon_url,
          unlocked: isUnlocked,
          progress: userAchievement ? userAchievement.progress || 0 : undefined,
          completion_date: userAchievement?.completion_date?.toISOString() || undefined,
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
        progress: userAchievement ? (userAchievement as any).progress || 0 : undefined,
        completion_date: userAchievement?.completion_date?.toISOString(),
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
      progress: userAchievement ? (userAchievement as any).progress || 0 : undefined,
      completion_date: userAchievement?.completion_date?.toISOString(),
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

  /**
   * Получение детальной информации о достижении
   */
  async getAchievementDetail(achievementId: string, userId?: string) {
    const achievementData = await this.getAchievementById(achievementId, userId)

    // Если пользователь авторизован, получаем его UserAchievement
    let userAchievement = null
    let likesCount = 0
    let commentsCount = 0
    let isLiked = false
    let isFavorite = false
    let photos: any[] = []

    if (userId) {
      userAchievement = await prisma.userAchievement.findUnique({
        where: {
          user_id_achievement_id: {
            user_id: userId,
            achievement_id: achievementId,
          },
        },
        include: {
          photos: {
            orderBy: { order: 'asc' as any },
          },
        } as any,
      })

      if (userAchievement) {
        // Получаем статистику
        likesCount = await (prisma as any).achievementLike.count({
          where: { user_achievement_id: userAchievement.id },
        })

        commentsCount = await (prisma as any).achievementComment.count({
          where: {
            user_achievement_id: userAchievement.id,
            deleted_at: null,
          },
        })

        isLiked = !!(await (prisma as any).achievementLike.findUnique({
          where: {
            user_achievement_id_user_id: {
              user_achievement_id: userAchievement.id,
              user_id: userId,
            },
          },
        }))

        isFavorite = !!(await (prisma as any).achievementFavorite.findUnique({
          where: {
            user_id_user_achievement_id: {
              user_id: userId,
              user_achievement_id: userAchievement.id,
            },
          },
        }))

        photos = (userAchievement.photos as any[]).map((photo: any) => ({
          id: photo.id,
          url: photo.file_url,
          order: photo.order,
        }))
      }
    } else if (achievementData.unlocked) {
      // Для неавторизованных пользователей показываем статистику первого разблокировавшего
      const firstUserAchievement = await prisma.userAchievement.findFirst({
        where: {
          achievement_id: achievementId,
          is_public: true,
        },
        include: {
          photos: {
            orderBy: { order: 'asc' as any },
          },
        } as any,
        orderBy: { unlocked_at: 'asc' },
      })

      if (firstUserAchievement) {
        likesCount = await (prisma as any).achievementLike.count({
          where: { user_achievement_id: firstUserAchievement.id },
        })

        commentsCount = await (prisma as any).achievementComment.count({
          where: {
            user_achievement_id: firstUserAchievement.id,
            deleted_at: null,
          },
        })

        photos = (firstUserAchievement.photos as any[]).map((photo: any) => ({
          id: photo.id,
          url: photo.file_url,
          order: photo.order,
        }))
      }
    }

    return {
      ...achievementData,
      userAchievement: userAchievement
        ? {
          id: userAchievement.id,
          completion_date: userAchievement.completion_date?.toISOString(),
          difficulty: userAchievement.difficulty,
          impressions: userAchievement.impressions,
          is_main: userAchievement.is_main,
          is_hidden: userAchievement.is_hidden,
          can_like: userAchievement.can_like,
          can_comment: userAchievement.can_comment,
          is_public: userAchievement.is_public,
          progress: (userAchievement as any).progress || 0,
        }
        : null,
      likesCount,
      commentsCount,
      isLiked,
      isFavorite,
      photos,
    }
  }

  /**
   * Завершение достижения пользователем
   */
  async completeAchievement(
    userId: string,
    achievementId: string,
    dto: CompleteAchievementDto,
    photos?: MulterFile[]
  ) {
    // Проверяем существование достижения
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    })

    if (!achievement) {
      throw ApiError.notFound('Achievement not found')
    }

    // Проверяем, не завершено ли уже (проверяем наличие completion_date, а не просто существование UserAchievement)
    const existing = await prisma.userAchievement.findUnique({
      where: {
        user_id_achievement_id: {
          user_id: userId,
          achievement_id: achievementId,
        },
      },
    })

    if (existing && existing.completion_date) {
      throw ApiError.badRequest('Achievement already completed')
    }

    // Если UserAchievement уже существует (но без completion_date), обновляем его
    // Иначе создаем новый
    const userAchievement = existing
      ? await prisma.userAchievement.update({
        where: {
          user_id_achievement_id: {
            user_id: userId,
            achievement_id: achievementId,
          },
        },
        data: {
          completion_date: new Date(dto.completion_date),
          difficulty: dto.difficulty || null,
          impressions: dto.impressions || null,
          progress: 100, // Устанавливаем прогресс 100% при завершении
        },
      })
      : await prisma.userAchievement.create({
        data: {
          user_id: userId,
          achievement_id: achievementId,
          completion_date: new Date(dto.completion_date),
          difficulty: dto.difficulty || null,
          impressions: dto.impressions || null,
          progress: 100, // Устанавливаем прогресс 100% при завершении
        },
      })

    // Загружаем фотографии
    if (photos && photos.length > 0) {
      const photoPromises = photos.map(async (photo, index) => {
        const uploaded = await saveFileFromBuffer(
          photo.buffer,
          photo.originalname,
          photo.mimetype,
          userAchievement.id
        )

        return (prisma as any).achievementPhoto.create({
          data: {
            user_achievement_id: userAchievement.id,
            file_path: uploaded.path,
            file_url: uploaded.url,
            order: index,
          },
        })
      })

      await Promise.all(photoPromises)
    }

    // Обновляем XP пользователя
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: {
          increment: achievement.xp_reward,
        },
      },
    })

    return this.getAchievementDetail(achievementId, userId)
  }

  /**
   * Обновление выполненного достижения
   */
  async updateAchievement(
    userId: string,
    userAchievementId: string,
    dto: UpdateAchievementDto,
    photos?: MulterFile[]
  ) {
    // Проверяем существование UserAchievement и принадлежность пользователю
    const userAchievement = await prisma.userAchievement.findUnique({
      where: { id: userAchievementId },
      include: {
        photos: true,
      },
    })

    if (!userAchievement) {
      throw ApiError.notFound('User achievement not found')
    }

    if (userAchievement.user_id !== userId) {
      throw ApiError.forbidden('You can only update your own achievements')
    }

    // Обновляем данные
    const updateData: any = {}
    if (dto.completion_date) {
      updateData.completion_date = new Date(dto.completion_date)
    }
    if (dto.difficulty !== undefined) {
      updateData.difficulty = dto.difficulty || null
    }
    if (dto.impressions !== undefined) {
      updateData.impressions = dto.impressions || null
    }

    await prisma.userAchievement.update({
      where: { id: userAchievementId },
      data: updateData,
    })

    // Удаляем старые фотографии, если загружены новые
    if (photos && photos.length > 0) {
      // Удаляем все старые фотографии
      const oldPhotos = await (prisma as any).achievementPhoto.findMany({
        where: { user_achievement_id: userAchievementId },
      })

      for (const photo of oldPhotos) {
        // Удаляем файл с диска
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(process.cwd(), photo.file_path)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }

      await (prisma as any).achievementPhoto.deleteMany({
        where: { user_achievement_id: userAchievementId },
      })

      // Загружаем новые фотографии
      const photoPromises = photos.map(async (photo, index) => {
        const uploaded = await saveFileFromBuffer(
          photo.buffer,
          photo.originalname,
          photo.mimetype,
          userAchievementId
        )

        return (prisma as any).achievementPhoto.create({
          data: {
            user_achievement_id: userAchievementId,
            file_path: uploaded.path,
            file_url: uploaded.url,
            order: index,
          },
        })
      })

      await Promise.all(photoPromises)
    }

    return this.getAchievementDetail(userAchievement.achievement_id, userId)
  }

  /**
   * Сброс выполнения достижения
   */
  async resetAchievement(userId: string, userAchievementId: string) {
    // Проверяем существование UserAchievement и принадлежность пользователю
    const userAchievement = await prisma.userAchievement.findUnique({
      where: { id: userAchievementId },
      include: {
        achievement: true,
        photos: true,
      },
    })

    if (!userAchievement) {
      throw ApiError.notFound('User achievement not found')
    }

    if (userAchievement.user_id !== userId) {
      throw ApiError.forbidden('You can only reset your own achievements')
    }

    const achievementId = userAchievement.achievement_id
    const xpReward = userAchievement.achievement.xp_reward

    // Удаляем фотографии
    const fs = require('fs')
    const path = require('path')
    for (const photo of userAchievement.photos) {
      const filePath = path.join(process.cwd(), (photo as any).file_path)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    // Удаляем UserAchievement (каскадно удалятся все связанные данные)
    await prisma.userAchievement.delete({
      where: { id: userAchievementId },
    })

    // Уменьшаем XP пользователя
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: {
          decrement: xpReward,
        },
      },
    })

    return { success: true }
  }

  /**
   * Обновление настроек достижения
   */
  async updateAchievementSettings(
    userAchievementId: string,
    userId: string,
    dto: UpdateAchievementSettingsDto
  ) {
    // Проверяем права доступа
    const userAchievement = await prisma.userAchievement.findUnique({
      where: { id: userAchievementId },
    })

    if (!userAchievement) {
      throw ApiError.notFound('User achievement not found')
    }

    if (userAchievement.user_id !== userId) {
      throw ApiError.forbidden('You can only update your own achievements')
    }

    // Обновляем настройки
    const updated = await prisma.userAchievement.update({
      where: { id: userAchievementId },
      data: {
        is_main: dto.is_main !== undefined ? dto.is_main : userAchievement.is_main,
        is_hidden: dto.is_hidden !== undefined ? dto.is_hidden : userAchievement.is_hidden,
        can_like: dto.can_like !== undefined ? dto.can_like : userAchievement.can_like,
        can_comment: dto.can_comment !== undefined ? dto.can_comment : userAchievement.can_comment,
        is_public: dto.is_public !== undefined ? dto.is_public : userAchievement.is_public,
      },
    })

    return {
      id: updated.id,
      is_main: (updated as any).is_main,
      is_hidden: (updated as any).is_hidden,
      can_like: (updated as any).can_like,
      can_comment: (updated as any).can_comment,
      is_public: updated.is_public,
    }
  }

  /**
   * Переключение избранного
   */
  async toggleFavorite(userId: string, userAchievementId: string) {
    // Проверяем существование
    const userAchievement = await prisma.userAchievement.findUnique({
      where: { id: userAchievementId },
    })

    if (!userAchievement) {
      throw ApiError.notFound('User achievement not found')
    }

    // Разрешаем добавлять в избранное любые достижения, включая свои

    // Проверяем, публичное ли
    if (!userAchievement.is_public) {
      throw ApiError.forbidden('Cannot favorite private achievement')
    }

    const existing = await (prisma as any).achievementFavorite.findUnique({
      where: {
        user_id_user_achievement_id: {
          user_id: userId,
          user_achievement_id: userAchievementId,
        },
      },
    })

    if (existing) {
      await (prisma as any).achievementFavorite.delete({
        where: { id: existing.id },
      })
      return { isFavorite: false }
    } else {
      await (prisma as any).achievementFavorite.create({
        data: {
          user_id: userId,
          user_achievement_id: userAchievementId,
        },
      })
      return { isFavorite: true }
    }
  }

  /**
   * Получение комментариев
   */
  async getComments(userAchievementId: string, limit: number = 50, offset: number = 0) {
    const comments = await (prisma as any).achievementComment.findMany({
      where: {
        user_achievement_id: userAchievementId,
        deleted_at: null,
        parent_comment_id: null, // Только корневые комментарии
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        replies: {
          where: { deleted_at: null },
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: { created_at: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    })

    return comments.map((comment: any) => ({
      id: comment.id,
      userId: comment.user_id,
      username: comment.user.username,
      text: comment.text,
      createdAt: comment.created_at.toISOString(),
      replies: comment.replies.map((reply: any) => ({
        id: reply.id,
        userId: reply.user_id,
        username: reply.user.username,
        text: reply.text,
        createdAt: reply.created_at.toISOString(),
        parentCommentId: reply.parent_comment_id,
      })),
    }))
  }

  /**
   * Создание комментария
   */
  async createComment(userId: string, userAchievementId: string, dto: CreateCommentDto) {
    // Проверяем существование
    const userAchievement = await prisma.userAchievement.findUnique({
      where: { id: userAchievementId },
    })

    if (!userAchievement) {
      throw ApiError.notFound('User achievement not found')
    }

    // Проверяем, разрешены ли комментарии
    if (!(userAchievement as any).can_comment) {
      throw ApiError.forbidden('Comments are disabled for this achievement')
    }

    // Если это ответ, проверяем существование родительского комментария
    if (dto.parent_comment_id) {
      const parent = await (prisma as any).achievementComment.findUnique({
        where: { id: dto.parent_comment_id },
      })

      if (!parent || parent.user_achievement_id !== userAchievementId) {
        throw ApiError.notFound('Parent comment not found')
      }
    }

    const comment = await (prisma as any).achievementComment.create({
      data: {
        user_achievement_id: userAchievementId,
        user_id: userId,
        parent_comment_id: dto.parent_comment_id || null,
        text: dto.text,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return {
      id: comment.id,
      userId: comment.user_id,
      username: comment.user.username,
      text: comment.text,
      createdAt: comment.created_at.toISOString(),
      parentCommentId: comment.parent_comment_id,
    }
  }

  /**
   * Удаление комментария
   */
  async deleteComment(commentId: string, userId: string) {
    const comment = await (prisma as any).achievementComment.findUnique({
      where: { id: commentId },
      include: {
        userAchievement: true,
      },
    })

    if (!comment) {
      throw ApiError.notFound('Comment not found')
    }

    // Проверяем права: владелец комментария или владелец достижения
    if (comment.user_id !== userId && comment.userAchievement.user_id !== userId) {
      throw ApiError.forbidden('You can only delete your own comments or comments on your achievements')
    }

    // Soft delete
    await (prisma as any).achievementComment.update({
      where: { id: commentId },
      data: { deleted_at: new Date() },
    })

    return { success: true }
  }

  /**
   * Переключение лайка
   */
  async toggleLike(userId: string, userAchievementId: string) {
    // Проверяем существование
    const userAchievement = await prisma.userAchievement.findUnique({
      where: { id: userAchievementId },
    })

    if (!userAchievement) {
      throw ApiError.notFound('User achievement not found')
    }

    // Проверяем, разрешены ли лайки
    if (!(userAchievement as any).can_like) {
      throw ApiError.forbidden('Likes are disabled for this achievement')
    }

    const existing = await (prisma as any).achievementLike.findUnique({
      where: {
        user_achievement_id_user_id: {
          user_achievement_id: userAchievementId,
          user_id: userId,
        },
      },
    })

    if (existing) {
      await (prisma as any).achievementLike.delete({
        where: { id: existing.id },
      })
      return { isLiked: false }
    } else {
      await (prisma as any).achievementLike.create({
        data: {
          user_achievement_id: userAchievementId,
          user_id: userId,
        },
      })
      return { isLiked: true }
    }
  }

  /**
   * Загрузка фотографий
   */
  async uploadPhotos(
    userAchievementId: string,
    userId: string,
    photos: MulterFile[]
  ) {
    // Проверяем права доступа
    const userAchievement = await prisma.userAchievement.findUnique({
      where: { id: userAchievementId },
    })

    if (!userAchievement) {
      throw ApiError.notFound('User achievement not found')
    }

    if (userAchievement.user_id !== userId) {
      throw ApiError.forbidden('You can only upload photos to your own achievements')
    }

    // Получаем текущее количество фотографий для определения order
    const currentPhotosCount = await (prisma as any).achievementPhoto.count({
      where: { user_achievement_id: userAchievementId },
    })

    const uploadedPhotos = await Promise.all(
      photos.map(async (photo, index) => {
        const uploaded = await saveFileFromBuffer(
          photo.buffer,
          photo.originalname,
          photo.mimetype,
          userAchievementId
        )

        return (prisma as any).achievementPhoto.create({
          data: {
            user_achievement_id: userAchievementId,
            file_path: uploaded.path,
            file_url: uploaded.url,
            order: currentPhotosCount + index,
          },
        })
      })
    )

    return uploadedPhotos.map((photo) => ({
      id: photo.id,
      url: photo.file_url,
      order: photo.order,
    }))
  }

  /**
   * Удаление фотографии
   */
  async deletePhoto(photoId: string, userId: string) {
    const photo = await (prisma as any).achievementPhoto.findUnique({
      where: { id: photoId },
      include: {
        userAchievement: true,
      },
    })

    if (!photo) {
      throw ApiError.notFound('Photo not found')
    }

    if (photo.userAchievement.user_id !== userId) {
      throw ApiError.forbidden('You can only delete photos from your own achievements')
    }

    // Удаляем файл
    deleteFile(photo.file_path)

    // Удаляем запись из БД
    await (prisma as any).achievementPhoto.delete({
      where: { id: photoId },
    })

    return { success: true }
  }

  /**
   * Обновление прогресса выполнения достижения
   * Если UserAchievement не существует, создает его (разблокирует достижение)
   */
  async updateProgress(userId: string, achievementId: string, dto: UpdateProgressDto) {
    // Проверяем существование достижения
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    })

    if (!achievement) {
      throw ApiError.notFound('Achievement not found')
    }

    // Ищем существующий UserAchievement
    let userAchievement = await prisma.userAchievement.findUnique({
      where: {
        user_id_achievement_id: {
          user_id: userId,
          achievement_id: achievementId,
        },
      },
    })

    const progress = Math.max(0, dto.progress)

    if (userAchievement) {
      // Если UserAchievement существует, обновляем прогресс
      // Нельзя обновлять прогресс для завершенных достижений
      if (userAchievement.completion_date) {
        throw ApiError.badRequest('Cannot update progress for completed achievement')
      }

      userAchievement = await prisma.userAchievement.update({
        where: { id: userAchievement.id },
        data: {
          progress,
        },
      })
    } else {
      // Если UserAchievement не существует, создаем его (разблокируем достижение)
      // Только если прогресс > 0
      if (progress === 0) {
        throw ApiError.badRequest('Progress must be greater than 0 to unlock achievement')
      }

      userAchievement = await prisma.userAchievement.create({
        data: {
          user_id: userId,
          achievement_id: achievementId,
          progress,
        },
      })
    }

    return {
      success: true,
      progress: (userAchievement as any).progress,
      achievementId,
    }
  }
}

export const achievementsService = new AchievementsService()
