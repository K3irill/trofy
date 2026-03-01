// @ts-nocheck
import { prisma } from '../../../shared/database'
import { ApiError } from '../../../core/errors/ApiError'
import { GetAchievementsDto, Rarity, SortBy, CreateCategoryDto, CreateAchievementDto, CompleteAchievementDto, UpdateAchievementDto, UpdateAchievementSettingsDto, CreateCommentDto, UpdateCategoryDto, UpdateCustomAchievementDto } from '../dto/achievements.dto'
import { saveFileFromBuffer, deleteFile, deleteAchievementFiles } from '../../../shared/utils/fileUpload'
import { calculateLevel } from '../../../shared/utils/levelCalculator'

export class AchievementsService {
  private normalizeAllowedUserIds(value: any): string[] {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  }

  private canAccessByPrivacy(
    entity: { is_public?: boolean | null; allowed_user_ids?: any; creator_id?: string | null },
    viewerId?: string
  ) {
    const isPublic = (entity as any).is_public !== false
    if (isPublic) return true
    if (!viewerId) return false
    const allowedUserIds = this.normalizeAllowedUserIds((entity as any).allowed_user_ids)
    const creatorId = (entity as any).creator_id
    return creatorId === viewerId || allowedUserIds.includes(viewerId)
  }

  private ensureCanAccessCategory(category: any, viewerId?: string) {
    if (!this.canAccessByPrivacy(category, viewerId)) {
      // Возвращаем 403 для приватных категорий
      throw ApiError.forbidden('Category is private')
    }
  }

  private ensureCanAccessAchievement(achievement: any, viewerId?: string) {
    // Доступ к самому достижению
    if (!this.canAccessByPrivacy(achievement, viewerId)) {
      throw ApiError.forbidden('Achievement is private')
    }

    // И доступ к категории тоже (важно, если категория приватная)
    if (achievement.category && !this.canAccessByPrivacy(achievement.category, viewerId)) {
      throw ApiError.forbidden('Achievement is private')
    }
  }
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
   * Получение всех категорий (с учетом прав доступа)
   */
  async getCategories(viewerId?: string, excludeUserIds?: string[], favoriteOnly?: boolean) {
    const categories = await prisma.category.findMany({
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    })

    // Если нужны только избранные категории
    let favoriteCategoryIds: string[] = []
    if (favoriteOnly && viewerId) {
      const favorites = await (prisma as any).categoryFavorite.findMany({
        where: { user_id: viewerId },
        select: { category_id: true },
      })
      favoriteCategoryIds = favorites.map((f: any) => f.category_id)
    }

    // Фильтруем категории по правам доступа
    let filteredCategories = categories.filter((category) => {
      // Если нужны только избранные, проверяем наличие в избранном
      if (favoriteOnly && viewerId) {
        if (!favoriteCategoryIds.includes(category.id)) {
          return false
        }
      }

      // Фильтр по исключенным пользователям
      if (excludeUserIds && excludeUserIds.length > 0 && category.creator_id) {
        if (excludeUserIds.includes(category.creator_id)) {
          return false
        }
      }

      const isPublic = (category as any).is_public !== false
      const allowedUserIds = (category as any).allowed_user_ids || []
      const creatorId = category.creator_id

      // Если публичная - доступна всем
      if (isPublic) return true

      // Если приватная - доступна только создателю и пользователям из allowed_user_ids
      if (viewerId) {
        return creatorId === viewerId || allowedUserIds.includes(viewerId)
      }

      // Неавторизованные пользователи не видят приватные категории
      return false
    })

    // Получаем все достижения для всех категорий для фильтрации приватных
    const allCategoryAchievements = await prisma.achievement.findMany({
      where: {
        category_id: {
          in: filteredCategories.map((c) => c.id),
        },
      },
      select: {
        id: true,
        category_id: true,
        is_public: true,
        allowed_user_ids: true,
        creator_id: true,
      },
    })

    // Группируем достижения по категориям и фильтруем приватные
    const categoryAchievementCounts = new Map<string, number>()
    filteredCategories.forEach((category) => {
      const categoryAchievements = allCategoryAchievements.filter(
        (a) => a.category_id === category.id
      )
      const accessibleAchievements = categoryAchievements.filter((achievement) =>
        this.canAccessByPrivacy(achievement, viewerId)
      )
      categoryAchievementCounts.set(category.id, accessibleAchievements.length)
    })

    // Получаем информацию о лайках и избранном для категорий
    const likesAndFavorites = viewerId
      ? await this.getCategoriesWithLikesAndFavorites(viewerId, filteredCategories.map((c) => c.id))
      : new Map()

    const result = filteredCategories.map((category) => {
      const likeAndFavorite = likesAndFavorites.get(category.id) || { isLiked: false, isFavorite: false }
      return {
        id: category.id,
        name: category.name,
        icon_url: category.icon_url,
        is_custom: category.is_custom,
        creator_id: category.creator_id,
        creator_username: category.creator?.username || undefined,
        achievements_count: categoryAchievementCounts.get(category.id) || 0,
        is_liked: likeAndFavorite.isLiked,
        is_favorite: likeAndFavorite.isFavorite,
        created_at: category.created_at.toISOString(),
        updated_at: category.updated_at.toISOString(),
      }
    })

    return result
  }

  /**
   * Получение всех категорий со статистикой пользователя
   */
  async getCategoriesWithStats(userId?: string, excludeUserIds?: string[], favoriteOnly?: boolean) {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            achievements: true,
          },
        },
        creator: {
          select: {
            id: true,
            username: true,
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
            is_public: true,
            allowed_user_ids: true,
            creator_id: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    })

    // Если нужны только избранные категории
    let favoriteCategoryIds: string[] = []
    if (favoriteOnly && userId) {
      const favorites = await (prisma as any).categoryFavorite.findMany({
        where: { user_id: userId },
        select: { category_id: true },
      })
      favoriteCategoryIds = favorites.map((f: any) => f.category_id)
    }

    // Фильтруем категории по правам доступа
    let filteredCategories = categories.filter((category) => {
      // Если нужны только избранные, проверяем наличие в избранном
      if (favoriteOnly && userId) {
        if (!favoriteCategoryIds.includes(category.id)) {
          return false
        }
      }

      // Фильтр по исключенным пользователям
      if (excludeUserIds && excludeUserIds.length > 0 && category.creator_id) {
        if (excludeUserIds.includes(category.creator_id)) {
          return false
        }
      }

      const isPublic = (category as any).is_public !== false
      const allowedUserIds = (category as any).allowed_user_ids || []
      const creatorId = category.creator_id

      // Если публичная - доступна всем
      if (isPublic) return true

      // Если приватная - доступна только создателю и пользователям из allowed_user_ids
      if (userId) {
        return creatorId === userId || allowedUserIds.includes(userId)
      }

      // Неавторизованные пользователи не видят приватные категории
      return false
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
    }

    // Получаем все достижения для всех категорий для фильтрации приватных
    const allCategoryAchievements = await prisma.achievement.findMany({
      where: {
        category_id: {
          in: filteredCategories.map((c) => c.id),
        },
      },
      select: {
        id: true,
        category_id: true,
        is_public: true,
        allowed_user_ids: true,
        creator_id: true,
      },
    })

    // Группируем достижения по категориям и фильтруем приватные
    const categoryAchievementCounts = new Map<string, number>()
    const accessibleAchievementIdsByCategory = new Map<string, Set<string>>()

    filteredCategories.forEach((category) => {
      const categoryAchievements = allCategoryAchievements.filter(
        (a) => a.category_id === category.id
      )
      const accessibleAchievements = categoryAchievements.filter((achievement) =>
        this.canAccessByPrivacy(achievement, userId)
      )
      categoryAchievementCounts.set(category.id, accessibleAchievements.length)

      // Сохраняем ID доступных достижений для каждой категории
      accessibleAchievementIdsByCategory.set(
        category.id,
        new Set(accessibleAchievements.map((a) => a.id))
      )
    })

    // Подсчитываем только завершенные и доступные достижения по категориям
    if (userId && userAchievements.length > 0) {
      categoryUnlockedCounts = new Map()
      userAchievements.forEach((ua) => {
        // Считаем только завершенные достижения (с completion_date)
        if (ua.completion_date) {
          const categoryId = ua.achievement.category_id
          const accessibleIds = accessibleAchievementIdsByCategory.get(categoryId)

          // Проверяем, что достижение доступно пользователю
          if (accessibleIds && accessibleIds.has(ua.achievement_id)) {
            const currentCount = categoryUnlockedCounts!.get(categoryId) || 0
            categoryUnlockedCounts!.set(categoryId, currentCount + 1)
          }
        }
      })
    }

    const result = filteredCategories.map((category) => {
      const total = categoryAchievementCounts.get(category.id) || 0
      const unlockedCount = userId && categoryUnlockedCounts
        ? categoryUnlockedCounts.get(category.id) || 0
        : 0

      // Фильтруем достижения по правам доступа
      const accessibleAchievements = category.achievements.filter((achievement: any) => {
        const isPublic = achievement.is_public !== false
        const allowedUserIds = achievement.allowed_user_ids || []
        const creatorId = achievement.creator_id

        if (isPublic) return true
        if (userId) {
          return creatorId === userId || allowedUserIds.includes(userId)
        }
        return false
      })

      const achievementsPreview = accessibleAchievements.map((achievement: any) => {
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

      // Преобразуем JSON поле в массив, если это строка
      let allowedUserIds: string[] = []
      if ((category as any).allowed_user_ids) {
        if (typeof (category as any).allowed_user_ids === 'string') {
          allowedUserIds = JSON.parse((category as any).allowed_user_ids)
        } else if (Array.isArray((category as any).allowed_user_ids)) {
          allowedUserIds = (category as any).allowed_user_ids
        }
      }

      return {
        id: category.id,
        name: category.name,
        icon_url: category.icon_url,
        is_custom: category.is_custom,
        creator_id: category.creator_id || undefined,
        creator_username: category.creator?.username || undefined,
        is_public: (category as any).is_public,
        allowed_user_ids: allowedUserIds,
        total,
        unlocked: unlockedCount,
        achievements_preview: achievementsPreview,
        is_liked: false, // Будет заполнено позже
        is_favorite: false, // Будет заполнено позже
        created_at: category.created_at.toISOString(),
        updated_at: category.updated_at.toISOString(),
      }
    })

    // Получаем информацию о лайках и избранном для категорий
    const likesAndFavorites = userId
      ? await this.getCategoriesWithLikesAndFavorites(userId, filteredCategories.map((c) => c.id))
      : new Map()

    // Добавляем информацию о лайках и избранном
    return result.map((category) => {
      const likeAndFavorite = likesAndFavorites.get(category.id) || { isLiked: false, isFavorite: false }
      return {
        ...category,
        is_liked: likeAndFavorite.isLiked,
        is_favorite: likeAndFavorite.isFavorite,
      }
    })
  }

  /**
   * Получение категории по ID
   */
  async getCategoryById(categoryId: string, viewerId?: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    if (!category) {
      throw ApiError.notFound('Category not found')
    }

    this.ensureCanAccessCategory(category, viewerId)

    // Получаем все достижения в категории для фильтрации приватных
    const allAchievements = await prisma.achievement.findMany({
      where: {
        category_id: categoryId,
      },
      select: {
        id: true,
        is_public: true,
        allowed_user_ids: true,
        creator_id: true,
      },
    })

    // Фильтруем достижения по доступу (только доступные для текущего пользователя)
    const accessibleAchievements = allAchievements.filter((achievement) =>
      this.canAccessByPrivacy(achievement, viewerId)
    )

    const achievements_count = accessibleAchievements.length

    // Преобразуем JSON поле в массив, если это строка
    let allowedUserIds: string[] = []
    if (category.allowed_user_ids) {
      if (typeof category.allowed_user_ids === 'string') {
        allowedUserIds = JSON.parse(category.allowed_user_ids)
      } else if (Array.isArray(category.allowed_user_ids)) {
        allowedUserIds = category.allowed_user_ids
      }
    }

    // Получаем количество лайков и информацию о лайке/избранном для текущего пользователя
    const [likesCount, likesAndFavorites] = await Promise.all([
      (prisma as any).categoryLike.count({
        where: { category_id: category.id },
      }),
      viewerId
        ? this.getCategoriesWithLikesAndFavorites(viewerId, [category.id])
        : Promise.resolve(new Map()),
    ])

    const likeAndFavorite = likesAndFavorites.get(category.id) || { isLiked: false, isFavorite: false }

    return {
      id: category.id,
      name: category.name,
      icon_url: category.icon_url,
      is_custom: category.is_custom,
      creator_id: category.creator_id || undefined,
      creator_username: category.creator?.username || undefined,
      is_public: category.is_public,
      allowed_user_ids: allowedUserIds,
      achievements_count,
      likes_count: likesCount,
      is_liked: likeAndFavorite.isLiked,
      is_favorite: likeAndFavorite.isFavorite,
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
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    if (!category) {
      throw ApiError.notFound('Category not found')
    }

    // Проверка доступа к категории (для приватных)
    this.ensureCanAccessCategory(category, userId)

    // Получаем все достижения в категории для фильтрации приватных
    const allAchievements = await prisma.achievement.findMany({
      where: {
        category_id: categoryId,
      },
      select: {
        id: true,
        is_public: true,
        allowed_user_ids: true,
        creator_id: true,
      },
    })

    // Фильтруем достижения по доступу (только доступные для текущего пользователя)
    const accessibleAchievements = allAchievements.filter((achievement) =>
      this.canAccessByPrivacy(achievement, userId)
    )

    const total = accessibleAchievements.length

    let unlockedCount = 0
    if (userId) {
      // Подсчитываем только завершенные достижения из доступных (с completion_date)
      const accessibleAchievementIds = accessibleAchievements.map((a) => a.id)
      const userAchievements = await prisma.userAchievement.findMany({
        where: {
          user_id: userId,
          achievement_id: {
            in: accessibleAchievementIds,
          },
          completion_date: {
            not: null,
          },
        },
        select: {
          achievement_id: true,
        },
      })
      unlockedCount = userAchievements.length
    }

    // Преобразуем JSON поле в массив, если это строка
    let allowedUserIds: string[] = []
    if (category.allowed_user_ids) {
      if (typeof category.allowed_user_ids === 'string') {
        allowedUserIds = JSON.parse(category.allowed_user_ids)
      } else if (Array.isArray(category.allowed_user_ids)) {
        allowedUserIds = category.allowed_user_ids
      }
    }

    // Получаем количество лайков и информацию о лайке/избранном для текущего пользователя
    const [likesCount, likesAndFavorites] = await Promise.all([
      (prisma as any).categoryLike.count({
        where: { category_id: category.id },
      }),
      userId
        ? this.getCategoriesWithLikesAndFavorites(userId, [category.id])
        : Promise.resolve(new Map()),
    ])

    const likeAndFavorite = likesAndFavorites.get(category.id) || { isLiked: false, isFavorite: false }

    return {
      id: category.id,
      name: category.name,
      icon_url: category.icon_url,
      is_custom: category.is_custom,
      creator_id: category.creator_id || undefined,
      creator_username: category.creator?.username || undefined,
      is_public: (category as any).is_public,
      allowed_user_ids: allowedUserIds,
      total,
      unlocked: unlockedCount,
      likes_count: likesCount,
      is_liked: likeAndFavorite.isLiked,
      is_favorite: likeAndFavorite.isFavorite,
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
    // Проверяем существование категории и права доступа
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      throw ApiError.notFound('Category not found')
    }

    // Проверяем права доступа к категории
    const isPublic = (category as any).is_public !== false
    const allowedUserIds = this.normalizeAllowedUserIds((category as any).allowed_user_ids)
    const creatorId = category.creator_id

    // Если категория приватная, проверяем доступ
    if (!isPublic) {
      if (!userId) {
        // Не светим существование приватной категории
        throw ApiError.notFound('Category not found')
      }
      if (creatorId !== userId && !allowedUserIds.includes(userId)) {
        throw ApiError.notFound('Category not found')
      }
    }

    return this.getAchievements(userId, { ...dto, categoryId })
  }

  /**
   * Получение глобальных достижений с информацией о владельце
   * Для showcase - лучшие и последние достижения всех пользователей
   */
  async getGlobalShowcaseAchievements(
    type: 'best' | 'recent',
    limit: number = 10,
    currentUserId?: string
  ) {
    const where: any = {
      completion_date: { not: null }, // Только завершенные
      is_hidden: false, // Не скрытые
      // is_public проверяется в userAchievement, но нам нужно проверять achievement.is_public
      // Поэтому убираем отсюда и проверяем после запроса через canAccessByPrivacy
    }

    const userAchievements = await prisma.userAchievement.findMany({
      where,
      include: {
        achievement: {
          select: {
            id: true,
            title: true,
            description: true,
            icon_url: true,
            rarity: true,
            xp_reward: true,
            is_public: true,
            allowed_user_ids: true,
            creator_id: true,
            created_at: true,
            updated_at: true,
            category: {
              select: {
                id: true,
                name: true,
                icon_url: true,
                is_public: true,
                allowed_user_ids: true,
                creator_id: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            privacy_settings: true,
          },
        },
      },
      // Для "recent" сортируем по дате завершения, для "best" получим все и отсортируем в коде
      orderBy: type === 'recent' ? { completion_date: 'desc' } : { completion_date: 'desc' },
      take: type === 'best' ? limit * 3 : limit, // Для best берем больше, чтобы потом отсортировать по XP
    })

    // Фильтруем достижения из приватных категорий и приватные достижения
    const filteredUserAchievements = userAchievements.filter((ua) => {
      const category = ua.achievement.category as any
      const achievement = ua.achievement as any

      // Проверяем доступ к категории
      if (!this.canAccessByPrivacy(category, currentUserId)) {
        return false
      }

      // Проверяем доступ к достижению (должно быть публичным, но для надежности проверяем)
      if (!this.canAccessByPrivacy(achievement, currentUserId)) {
        return false
      }

      // Фильтруем достижения приватных пользователей
      const isOwnAchievement = currentUserId && ua.user_id === currentUserId
      if (!isOwnAchievement && ua.user.privacy_settings) {
        const privacy = typeof ua.user.privacy_settings === 'string' 
          ? JSON.parse(ua.user.privacy_settings) 
          : ua.user.privacy_settings
        
        // Если профиль скрыт или достижения скрыты, не показываем
        if (privacy.show_profile === false || privacy.show_achievements === false) {
          return false
        }
      }

      return true
    })

    // Для "best" сортируем по XP и берем топ
    if (type === 'best') {
      filteredUserAchievements.sort((a, b) => {
        const xpA = a.achievement.xp_reward
        const xpB = b.achievement.xp_reward
        return xpB - xpA
      })
      filteredUserAchievements.splice(limit) // Оставляем только топ limit
    }

    return filteredUserAchievements.map((ua) => {
      const isCurrentUser = currentUserId && ua.user_id === currentUserId
      return {
        id: ua.achievement.id,
        title: ua.achievement.title,
        description: ua.achievement.description,
        icon_url: ua.achievement.icon_url,
        rarity: ua.achievement.rarity.toLowerCase() as 'common' | 'rare' | 'epic' | 'legendary',
        category: {
          id: ua.achievement.category.id,
          name: ua.achievement.category.name,
          icon_url: ua.achievement.category.icon_url,
        },
        xp_reward: ua.achievement.xp_reward,
        unlocked: isCurrentUser,
        unlocked_at: ua.unlocked_at.toISOString(),
        completion_date: ua.completion_date?.toISOString(),
        owner: {
          id: ua.user.id,
          username: ua.user.username,
          privacy_settings: ua.user.privacy_settings 
            ? (typeof ua.user.privacy_settings === 'string' 
                ? JSON.parse(ua.user.privacy_settings) 
                : ua.user.privacy_settings)
            : null,
        },
        is_current_user: isCurrentUser,
      }
    })
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
          is_public: true,
          allowed_user_ids: true,
          creator_id: true,
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

    // Форматируем результат и фильтруем по правам доступа
    let formatted = achievements
      .filter((achievement) => {
        // Фильтр по исключенным пользователям
        if (dto?.excludeUserIds && dto.excludeUserIds.length > 0) {
          const creatorId = (achievement as any).creator_id
          if (creatorId && dto.excludeUserIds.includes(creatorId)) {
            return false
          }
        }

        const isPublic = (achievement as any).is_public !== false
        const allowedUserIds = this.normalizeAllowedUserIds((achievement as any).allowed_user_ids)
        const creatorId = (achievement as any).creator_id

        // Категория тоже должна быть доступна
        if (!this.canAccessByPrivacy((achievement as any).category, userId)) {
          return false
        }

        // Если публичное - доступно всем
        if (isPublic) return true

        // Если приватное - доступно только создателю и пользователям из allowed_user_ids
        if (userId) {
          return creatorId === userId || allowedUserIds.includes(userId)
        }

        // Неавторизованные пользователи не видят приватные достижения
        return false
      })
      .map((achievement) => {
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
          is_custom: !!achievement.creator_id, // Пользовательское достижение определяется по наличию creator_id
          creator_id: achievement.creator_id || undefined,
          creator_username: achievement.creator?.username || undefined,
          created_at: achievement.created_at.toISOString(),
          progress: userAchievement ? (userAchievement as any).progress || 0 : undefined,
          completion_date: userAchievement?.completion_date?.toISOString(),
          is_hidden: userAchievement?.is_hidden || false,
          user_achievement: userAchievement ? {
            is_hidden: userAchievement.is_hidden,
          } : undefined,
        }
      })

    // Не фильтруем скрытые достижения - владелец должен видеть все свои достижения
    // Скрытие работает только для других пользователей (в других запросах)

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
              is_public: true,
              allowed_user_ids: true,
              creator_id: true,
            },
          },
          creator: {
            select: {
              id: true,
              username: true,
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

    // Проверка доступа (приватное достижение нельзя открыть по прямой ссылке без прав)
    this.ensureCanAccessAchievement(achievement, userId)

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
      is_public: achievement.is_public !== undefined ? achievement.is_public : true,
      creator_id: achievement.creator_id || undefined,
      creator_username: achievement.creator?.username || undefined,
      is_custom: !!achievement.creator_id,
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
        is_public: dto.is_public !== undefined ? dto.is_public : true,
        allowed_user_ids: dto.allowed_user_ids ? dto.allowed_user_ids : [],
      },
    })

    return {
      id: category.id,
      name: category.name,
      icon_url: category.icon_url,
      is_custom: category.is_custom,
      is_public: (category as any).is_public,
      allowed_user_ids: (category as any).allowed_user_ids || [],
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
        creator_id: !isAdmin ? userId : null,
        is_public: dto.is_public !== undefined ? dto.is_public : true,
        allowed_user_ids: dto.allowed_user_ids ? dto.allowed_user_ids : [],
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
      is_public: (achievement as any).is_public,
      allowed_user_ids: (achievement as any).allowed_user_ids || [],
      created_at: achievement.created_at.toISOString(),
      updated_at: achievement.updated_at.toISOString(),
    }
  }

  /**
   * Обновление иконки категории
   */
  async updateCategoryIcon(categoryId: string, iconUrl: string) {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { icon_url: iconUrl },
    })

    return {
      id: category.id,
      name: category.name,
      icon_url: category.icon_url,
      is_custom: category.is_custom,
      creator_id: category.creator_id || undefined,
      is_public: (category as any).is_public,
      allowed_user_ids: (category as any).allowed_user_ids || [],
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
    }
  }

  /**
   * Обновление категории (только для создателя)
   */
  async updateCategory(categoryId: string, dto: UpdateCategoryDto, userId: string) {
    // Проверяем, что категория существует и пользователь является создателем
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      throw new Error('Category not found')
    }

    if (!category.is_custom || category.creator_id !== userId) {
      throw new Error('You can only update your own custom categories')
    }

    const updateData: any = {}
    if (dto.name !== undefined) updateData.name = dto.name
    if (dto.is_public !== undefined) updateData.is_public = dto.is_public
    if (dto.allowed_user_ids !== undefined) {
      // Prisma JSON поля принимают объекты напрямую
      updateData.allowed_user_ids = dto.allowed_user_ids
    }

    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
    })

    // Преобразуем JSON поле в массив, если это строка
    let allowedUserIds: string[] = []
    if (updated.allowed_user_ids) {
      if (typeof updated.allowed_user_ids === 'string') {
        allowedUserIds = JSON.parse(updated.allowed_user_ids)
      } else if (Array.isArray(updated.allowed_user_ids)) {
        allowedUserIds = updated.allowed_user_ids
      }
    }

    return {
      id: updated.id,
      name: updated.name,
      icon_url: updated.icon_url,
      is_custom: updated.is_custom,
      creator_id: updated.creator_id || undefined,
      is_public: updated.is_public,
      allowed_user_ids: allowedUserIds,
      created_at: updated.created_at.toISOString(),
      updated_at: updated.updated_at.toISOString(),
    }
  }

  /**
   * Обновление достижения (только для создателя)
   */
  async updateCustomAchievement(achievementId: string, dto: UpdateCustomAchievementDto, userId: string) {
    // Проверяем, что достижение существует и пользователь является создателем
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
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

    if (!achievement) {
      throw new Error('Achievement not found')
    }

    if (!achievement.creator_id || achievement.creator_id !== userId) {
      throw new Error('You can only update your own custom achievements')
    }

    const updateData: any = {}
    if (dto.title !== undefined) updateData.title = dto.title
    if (dto.description !== undefined) updateData.description = dto.description
    if (dto.rarity !== undefined) updateData.rarity = dto.rarity
    if (dto.category_id !== undefined) updateData.category_id = dto.category_id
    if (dto.xp_reward !== undefined) updateData.xp_reward = dto.xp_reward
    if (dto.is_public !== undefined) updateData.is_public = dto.is_public
    if (dto.allowed_user_ids !== undefined) {
      // Prisma JSON поля принимают объекты напрямую
      updateData.allowed_user_ids = dto.allowed_user_ids
    }

    const updated = await prisma.achievement.update({
      where: { id: achievementId },
      data: updateData,
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

    // Преобразуем JSON поле в массив, если это строка
    let allowedUserIds: string[] = []
    if (updated.allowed_user_ids) {
      if (typeof updated.allowed_user_ids === 'string') {
        allowedUserIds = JSON.parse(updated.allowed_user_ids)
      } else if (Array.isArray(updated.allowed_user_ids)) {
        allowedUserIds = updated.allowed_user_ids
      }
    }

    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      icon_url: updated.icon_url,
      rarity: updated.rarity,
      category: {
        id: updated.category.id,
        name: updated.category.name,
        icon_url: updated.category.icon_url,
      },
      xp_reward: updated.xp_reward,
      creator_id: updated.creator_id || undefined,
      is_custom: !!updated.creator_id,
      is_public: updated.is_public,
      allowed_user_ids: allowedUserIds,
      created_at: updated.created_at.toISOString(),
      updated_at: updated.updated_at.toISOString(),
    }
  }

  /**
   * Обновление иконки достижения
   */
  async updateAchievementIcon(achievementId: string, iconUrl: string) {
    const achievement = await prisma.achievement.update({
      where: { id: achievementId },
      data: { icon_url: iconUrl },
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
      is_public: (achievement as any).is_public,
      allowed_user_ids: (achievement as any).allowed_user_ids || [],
      created_at: achievement.created_at.toISOString(),
      updated_at: achievement.updated_at.toISOString(),
    }
  }

  /**
   * Создание нескольких достижений за раз (для админов - обычные, для пользователей - кастомные)
   */
  async createAchievements(dtos: CreateAchievementDto[], userId: string, isAdmin: boolean = false) {
    if (!dtos || dtos.length === 0) {
      throw ApiError.badRequest('Achievements array cannot be empty')
    }

    // Проверяем все категории заранее
    const categoryIds = [...new Set(dtos.map(dto => dto.category_id))]
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    })

    if (categories.length !== categoryIds.length) {
      throw ApiError.notFound('One or more categories not found')
    }

    const categoryMap = new Map(categories.map(cat => [cat.id, cat]))

    // Если пользователь создает достижения, проверяем права на все категории
    if (!isAdmin) {
      for (const dto of dtos) {
        const category = categoryMap.get(dto.category_id)
        if (!category || !category.is_custom || category.creator_id !== userId) {
          throw ApiError.forbidden('You can only create achievements in your own custom categories')
        }
      }
    }

    // Создаем все достижения в транзакции
    const achievements = await prisma.$transaction(
      dtos.map(dto =>
        prisma.achievement.create({
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
      )
    )

    return achievements.map(achievement => ({
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
    }))
  }

  /**
   * Удаление кастомной категории (только для создателя)
   */
  async deleteCustomCategory(categoryId: string, userId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        achievements: true,
      },
    })

    if (!category) {
      throw new Error('Category not found')
    }

    if (!category.is_custom || category.creator_id !== userId) {
      throw new Error('You can only delete your own custom categories')
    }

    // Удаляем все изображения категории
    if (category.icon_url) {
      const fs = require('fs')
      const path = require('path')
      const iconPath = category.icon_url.replace(/^\/uploads\//, '')
      const uploadsBase = process.cwd().includes('backend')
        ? path.join(process.cwd(), 'uploads')
        : path.join(process.cwd(), 'backend', 'uploads')
      const fullPath = path.join(uploadsBase, iconPath)
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
      }
    }

    // Удаляем категорию (каскадно удалятся все достижения)
    await prisma.category.delete({
      where: { id: categoryId },
    })

    return { success: true, message: 'Category deleted successfully' }
  }

  /**
   * Удаление кастомного достижения (только для создателя)
   */
  async deleteCustomAchievement(achievementId: string, userId: string) {
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
      include: {
        category: true,
        userAchievements: {
          include: {
            photos: true,
          },
        },
      },
    })

    if (!achievement) {
      throw new Error('Achievement not found')
    }

    if (!achievement.creator_id || achievement.creator_id !== userId) {
      throw new Error('You can only delete your own custom achievements')
    }

    // Удаляем изображение достижения
    if (achievement.icon_url) {
      const fs = require('fs')
      const path = require('path')
      const iconPath = achievement.icon_url.replace(/^\/uploads\//, '')
      const uploadsBase = process.cwd().includes('backend')
        ? path.join(process.cwd(), 'uploads')
        : path.join(process.cwd(), 'backend', 'uploads')
      const fullPath = path.join(uploadsBase, iconPath)
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
      }
    }

    // Удаляем все связанные фотографии
    const fs = require('fs')
    const path = require('path')
    for (const userAchievement of achievement.userAchievements) {
      for (const photo of userAchievement.photos) {
        const filePath = path.join(process.cwd(), (photo as any).file_path)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }
    }

    // Удаляем достижение (каскадно удалятся все связанные UserAchievement)
    await prisma.achievement.delete({
      where: { id: achievementId },
    })

    return { success: true, message: 'Achievement deleted successfully' }
  }

  /**
   * Удаление достижения (только для админов, только системные достижения)
   */
  async deleteAchievement(achievementId: string) {
    // Проверяем существование достижения
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
      include: {
        category: true,
        userAchievements: {
          include: {
            photos: true,
          },
        },
      },
    })

    if (!achievement) {
      throw ApiError.notFound('Achievement not found')
    }

    // Проверяем, что это системное достижение (не кастомное)
    // Кастомные достижения находятся в кастомных категориях
    if (achievement.category.is_custom) {
      throw ApiError.forbidden('Cannot delete custom achievements. Only system achievements can be deleted.')
    }

    // Удаляем все связанные фотографии
    const fs = require('fs')
    const path = require('path')
    for (const userAchievement of achievement.userAchievements) {
      for (const photo of userAchievement.photos) {
        const filePath = path.join(process.cwd(), (photo as any).file_path)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }
    }

    // Удаляем достижение (каскадно удалятся все связанные UserAchievement)
    await prisma.achievement.delete({
      where: { id: achievementId },
    })

    return { success: true, message: 'Achievement deleted successfully' }
  }

  /**
   * Получение детальной информации о достижении
   */
  async getAchievementDetail(achievementId: string, userId?: string, currentUserId?: string) {
    // Сначала получаем достижение напрямую из БД для проверки доступа
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon_url: true,
            is_public: true,
            allowed_user_ids: true,
            creator_id: true,
          },
        },
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    if (!achievement) {
      throw ApiError.notFound('Achievement not found')
    }

    // Проверка доступа для текущего пользователя (viewer), а не владельца достижения
    // userId - это владелец достижения, currentUserId - это кто смотрит
    this.ensureCanAccessAchievement(achievement, currentUserId)

    // Теперь получаем базовые данные достижения
    const achievementData = {
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
      unlocked: false, // Будет установлено ниже на основе userAchievement
      unlocked_at: null as string | null,
      is_public: achievement.is_public !== undefined ? achievement.is_public : true,
      creator_id: achievement.creator_id || undefined,
      creator_username: achievement.creator?.username || undefined,
      is_custom: !!achievement.creator_id,
      created_at: achievement.created_at.toISOString(),
      updated_at: achievement.updated_at.toISOString(),
      progress: undefined as number | undefined,
      completion_date: undefined as string | undefined,
    }

    // Если передан userId (владелец достижения), получаем его UserAchievement
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

        // Проверяем лайк и избранное для текущего пользователя (если он авторизован)
        if (currentUserId) {
          isLiked = !!(await (prisma as any).achievementLike.findUnique({
            where: {
              user_achievement_id_user_id: {
                user_achievement_id: userAchievement.id,
                user_id: currentUserId,
              },
            },
          }))

          isFavorite = !!(await (prisma as any).achievementFavorite.findUnique({
            where: {
              user_id_user_achievement_id: {
                user_id: currentUserId,
                user_achievement_id: userAchievement.id,
              },
            },
          }))
        }

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

    // Проверяем, что дата выполнения не в будущем
    const completionDate = new Date(dto.completion_date)
    const today = new Date()
    today.setHours(23, 59, 59, 999) // Устанавливаем конец дня для сравнения
    if (completionDate > today) {
      throw ApiError.badRequest('Дата выполнения не может быть в будущем')
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

    // Обновляем XP пользователя и пересчитываем уровень
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    })

    if (!user) {
      throw ApiError.notFound('User not found')
    }

    const newXP = user.xp + achievement.xp_reward
    const newLevel = calculateLevel(newXP)

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXP,
        level: newLevel,
      },
    })

    return this.getAchievementDetail(achievementId, userId, userId)
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

    // Проверяем, что дата выполнения не в будущем (если она передана)
    if (dto.completion_date) {
      const completionDate = new Date(dto.completion_date)
      const today = new Date()
      today.setHours(23, 59, 59, 999) // Устанавливаем конец дня для сравнения
      if (completionDate > today) {
        throw ApiError.badRequest('Дата выполнения не может быть в будущем')
      }
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

    return this.getAchievementDetail(userAchievement.achievement_id, userId, userId)
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

    // Уменьшаем XP пользователя и пересчитываем уровень
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    })

    if (!user) {
      throw ApiError.notFound('User not found')
    }

    const newXP = Math.max(0, user.xp - xpReward)
    const newLevel = calculateLevel(newXP)

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXP,
        level: newLevel,
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
    // Максимальное количество главных достижений (в будущем можно увеличить до 3)
    const MAX_MAIN_ACHIEVEMENTS = 1

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

    // Если устанавливается is_main = true, нужно снять статус с других главных достижений
    if (dto.is_main === true && !userAchievement.is_main) {
      // Находим все другие главные достижения этого пользователя
      const otherMainAchievements = await prisma.userAchievement.findMany({
        where: {
          user_id: userId,
          is_main: true,
          id: { not: userAchievementId },
        },
      })

      // Если уже достигнут лимит главных достижений, снимаем статус с других
      // Сейчас MAX_MAIN_ACHIEVEMENTS = 1, поэтому снимаем со всех
      // В будущем, когда будет 3, снимаем только если уже есть 3 главных
      if (otherMainAchievements.length >= MAX_MAIN_ACHIEVEMENTS) {
        // Снимаем статус со всех других главных достижений
        // В будущем, когда MAX_MAIN_ACHIEVEMENTS = 3, нужно будет снимать только с лишних
        const achievementsToUnset = otherMainAchievements.slice(0, otherMainAchievements.length - (MAX_MAIN_ACHIEVEMENTS - 1))

        if (achievementsToUnset.length > 0) {
          await prisma.userAchievement.updateMany({
            where: {
              id: { in: achievementsToUnset.map(a => a.id) },
            },
            data: {
              is_main: false,
            },
          })
        }
      }
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

    // Можно добавлять в избранное только свои достижения
    if (userAchievement.user_id !== userId) {
      throw ApiError.forbidden('You can only favorite your own achievements')
    }

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
            avatar_url: true,
          },
        },
        replies: {
          where: { deleted_at: null },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar_url: true,
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
      avatarUrl: comment.user.avatar_url,
      text: comment.text,
      createdAt: comment.created_at.toISOString(),
      replies: comment.replies.map((reply: any) => ({
        id: reply.id,
        userId: reply.user_id,
        username: reply.user.username,
        avatarUrl: reply.user.avatar_url,
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
            avatar_url: true,
          },
        },
        userAchievement: {
          select: {
            user_id: true,
            achievement: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    })

    // Создаем уведомление владельцу достижения, если это не он сам
    if (userAchievement.user_id !== userId) {
      const commenter = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      })

      const achievementTitle = (comment.userAchievement as any)?.achievement?.title || 'достижению'
      await prisma.notification.create({
        data: {
          user_id: userAchievement.user_id,
          title: 'Новый комментарий',
          message: `${commenter?.username || 'Пользователь'} оставил комментарий к вашему достижению "${achievementTitle}"`,
          type: 'info',
        },
      })
    }

    return {
      id: comment.id,
      userId: comment.user_id,
      username: comment.user.username,
      avatarUrl: comment.user.avatar_url,
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

      // Создаем уведомление владельцу достижения, если это не он сам
      if (userAchievement.user_id !== userId) {
        const liker = await prisma.user.findUnique({
          where: { id: userId },
          select: { username: true },
        })

        const achievement = await prisma.achievement.findUnique({
          where: { id: userAchievement.achievement_id },
          select: { title: true },
        })

        await prisma.notification.create({
          data: {
            user_id: userAchievement.user_id,
            title: 'Новый аплодисмент',
            message: `${liker?.username || 'Пользователь'} поставил аплодисмент вашему достижению "${achievement?.title || ''}"`,
            type: 'info',
          },
        })
      }

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

  /**
   * Получение роадмапа для UserAchievement
   */
  async getRoadmap(userId: string, userAchievementId: string) {
    // Проверяем, что UserAchievement принадлежит пользователю
    const userAchievement = await prisma.userAchievement.findUnique({
      where: { id: userAchievementId },
      include: { roadmap: true },
    })

    if (!userAchievement) {
      throw ApiError.notFound('UserAchievement not found')
    }

    // Пользователь может видеть свой роадмап или любой публичный роадмап
    if (userAchievement.user_id !== userId && !userAchievement.is_public) {
      throw ApiError.forbidden('Access denied')
    }

    if (!userAchievement.roadmap) {
      return null
    }

    return {
      id: userAchievement.roadmap.id,
      user_achievement_id: userAchievement.roadmap.user_achievement_id,
      data: userAchievement.roadmap.data as any,
      created_at: userAchievement.roadmap.created_at,
      updated_at: userAchievement.roadmap.updated_at,
    }
  }

  /**
   * Создание или обновление роадмапа для UserAchievement
   */
  async createOrUpdateRoadmap(userId: string, userAchievementId: string, dto: any) {
    // Проверяем, что UserAchievement принадлежит пользователю
    const userAchievement = await prisma.userAchievement.findUnique({
      where: { id: userAchievementId },
      include: { roadmap: true },
    })

    if (!userAchievement) {
      throw ApiError.notFound('UserAchievement not found')
    }

    // Только владелец может создавать/редактировать роадмап
    if (userAchievement.user_id !== userId) {
      throw ApiError.forbidden('Only the owner can create or update roadmap')
    }

    const roadmapData = {
      nodes: dto.nodes,
      edges: dto.edges,
    }

    if (userAchievement.roadmap) {
      // Обновляем существующий роадмап
      const updated = await prisma.roadmap.update({
        where: { id: userAchievement.roadmap.id },
        data: {
          data: roadmapData as any,
        },
      })

      return {
        id: updated.id,
        user_achievement_id: updated.user_achievement_id,
        data: updated.data as any,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
      }
    } else {
      // Создаем новый роадмап
      const created = await prisma.roadmap.create({
        data: {
          user_achievement_id: userAchievementId,
          data: roadmapData as any,
        },
      })

      return {
        id: created.id,
        user_achievement_id: created.user_achievement_id,
        data: created.data as any,
        created_at: created.created_at,
        updated_at: created.updated_at,
      }
    }
  }

  /**
   * Переключение лайка категории
   */
  async toggleCategoryLike(userId: string, categoryId: string) {
    // Проверяем существование категории
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      throw ApiError.notFound('Category not found')
    }

    // Лайки можно ставить только пользовательским категориям
    if (!category.is_custom) {
      throw ApiError.forbidden('Can only like custom categories')
    }

    // Проверяем доступ к категории
    if (!this.canAccessByPrivacy(category, userId)) {
      throw ApiError.forbidden('Category is private')
    }

    const existing = await (prisma as any).categoryLike.findUnique({
      where: {
        category_id_user_id: {
          category_id: categoryId,
          user_id: userId,
        },
      },
    })

    if (existing) {
      await (prisma as any).categoryLike.delete({
        where: { id: existing.id },
      })
      return { isLiked: false }
    } else {
      await (prisma as any).categoryLike.create({
        data: {
          category_id: categoryId,
          user_id: userId,
        },
      })
      return { isLiked: true }
    }
  }

  /**
   * Переключение избранного для категории
   */
  async toggleCategoryFavorite(userId: string, categoryId: string) {
    // Проверяем существование категории
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      throw ApiError.notFound('Category not found')
    }

    // Проверяем доступ к категории
    if (!this.canAccessByPrivacy(category, userId)) {
      throw ApiError.forbidden('Category is private')
    }

    const existing = await (prisma as any).categoryFavorite.findUnique({
      where: {
        category_id_user_id: {
          category_id: categoryId,
          user_id: userId,
        },
      },
    })

    if (existing) {
      await (prisma as any).categoryFavorite.delete({
        where: { id: existing.id },
      })
      return { isFavorite: false }
    } else {
      await (prisma as any).categoryFavorite.create({
        data: {
          category_id: categoryId,
          user_id: userId,
        },
      })
      return { isFavorite: true }
    }
  }

  /**
   * Получение информации о лайках и избранном для категорий
   */
  async getCategoriesWithLikesAndFavorites(viewerId?: string, categoryIds?: string[]) {
    if (!viewerId || !categoryIds || categoryIds.length === 0) {
      return new Map()
    }

    const [likes, favorites] = await Promise.all([
      (prisma as any).categoryLike.findMany({
        where: {
          user_id: viewerId,
          category_id: { in: categoryIds },
        },
        select: { category_id: true },
      }),
      (prisma as any).categoryFavorite.findMany({
        where: {
          user_id: viewerId,
          category_id: { in: categoryIds },
        },
        select: { category_id: true },
      }),
    ])

    const likedCategoryIds = new Set(likes.map((l: any) => l.category_id))
    const favoritedCategoryIds = new Set(favorites.map((f: any) => f.category_id))

    const result = new Map()
    categoryIds.forEach((id) => {
      result.set(id, {
        isLiked: likedCategoryIds.has(id),
        isFavorite: favoritedCategoryIds.has(id),
      })
    })

    return result
  }
}

export const achievementsService = new AchievementsService()
