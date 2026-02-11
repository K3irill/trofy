import { prisma } from '../../../shared/database'
import { ApiError } from '../../../core/errors/ApiError'
import { UpdateUserDto } from '../dto/user.dto'
import { formatUser } from '../../auth/service/auth.service'

export class UserService {
  /**
   * Обновление данных пользователя
   */
  async updateUser(userId: string, dto: UpdateUserDto) {
    const updateData: any = {}

    if (dto.bio !== undefined) {
      updateData.bio = dto.bio
    }

    if (dto.profile_theme_id !== undefined) {
      // Проверяем существование темы
      if (dto.profile_theme_id) {
        const theme = await prisma.profileTheme.findUnique({
          where: { id: dto.profile_theme_id },
        })

        if (!theme) {
          throw ApiError.notFound('Profile theme not found')
        }
      }
      updateData.profile_theme_id = dto.profile_theme_id || null
    }

    if (dto.privacy_settings) {
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { privacy_settings: true },
      })

      const currentSettings = (currentUser?.privacy_settings as any) || {
        show_achievements: true,
        show_level: true,
        show_profile: true,
      }

      updateData.privacy_settings = {
        ...currentSettings,
        ...dto.privacy_settings,
      }
    }

    if (dto.pinned_achievements !== undefined) {
      // Проверяем, что все достижения существуют и принадлежат пользователю
      if (dto.pinned_achievements.length > 0) {
        const userAchievements = await prisma.userAchievement.findMany({
          where: {
            user_id: userId,
            achievement_id: { in: dto.pinned_achievements },
          },
          select: { achievement_id: true },
        })

        const validAchievementIds = userAchievements.map((ua) => ua.achievement_id)
        const invalidIds = dto.pinned_achievements.filter((id) => !validAchievementIds.includes(id))

        if (invalidIds.length > 0) {
          throw ApiError.badRequest(
            `Some achievements not found or not unlocked: ${invalidIds.join(', ')}`
          )
        }
      }

      updateData.pinned_achievements = dto.pinned_achievements
    }

    if (dto.priority_achievements !== undefined) {
      // Проверяем, что все достижения существуют
      if (dto.priority_achievements.length > 0) {
        const achievements = await prisma.achievement.findMany({
          where: {
            id: { in: dto.priority_achievements },
          },
          select: { id: true },
        })

        const validAchievementIds = achievements.map((a) => a.id)
        const invalidIds = dto.priority_achievements.filter((id) => !validAchievementIds.includes(id))

        if (invalidIds.length > 0) {
          throw ApiError.badRequest(
            `Some achievements not found: ${invalidIds.join(', ')}`
          )
        }
      }

      updateData.priority_achievements = dto.priority_achievements
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        profile_theme: true,
        platformAccounts: true,
      },
    })

    return formatUser(user, true)
  }

  /**
   * Обновление streak при активности пользователя
   */
  async updateStreak(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true, last_activity_date: true },
    })

    if (!user) {
      throw ApiError.notFound('User not found')
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastActivity = user.last_activity_date
      ? new Date(user.last_activity_date)
      : null
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0)
    }

    let newStreak = user.streak || 0

    if (!lastActivity) {
      // Первая активность
      newStreak = 1
    } else {
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === 0) {
        // Активность уже была сегодня
        // Не обновляем streak
      } else if (daysDiff === 1) {
        // Активность вчера, продолжаем серию
        newStreak = (user.streak || 0) + 1
      } else {
        // Пропущены дни, сбрасываем серию
        newStreak = 1
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        streak: newStreak,
        last_activity_date: today,
      },
      include: {
        profile_theme: true,
        platformAccounts: true,
      },
    })

    return formatUser(updatedUser, true)
  }

  /**
   * Получение статистики пользователя
   */
  async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userAchievements: {
          include: {
            achievement: true,
          },
        },
      },
    })

    if (!user) {
      throw ApiError.notFound('User not found')
    }

    const totalAchievements = user.userAchievements.length
    const achievementsByRarity = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    }

    user.userAchievements.forEach((ua) => {
      const rarity = ua.achievement.rarity.toLowerCase() as keyof typeof achievementsByRarity
      if (rarity in achievementsByRarity) {
        achievementsByRarity[rarity]++
      }
    })

    // Вычисляем уникальность (процент редких достижений)
    const rareCount = achievementsByRarity.rare + achievementsByRarity.epic + achievementsByRarity.legendary
    const uniquenessScore = totalAchievements > 0
      ? Math.round((rareCount / totalAchievements) * 100)
      : 0

    // Вычисляем темп роста (XP за последние 7 дней)
    // Для упрощения используем общий XP / дни с регистрации
    const daysSinceRegistration = Math.max(
      1,
      Math.floor((new Date().getTime() - user.created_at.getTime()) / (1000 * 60 * 60 * 24))
    )
    const growthRate = Math.round(user.xp / daysSinceRegistration)

    // Находим самое быстрое достижение
    let fastestAchievement: { title: string; days: number } | null = null
    if (user.fastest_achievement_title && user.fastest_achievement_days) {
      fastestAchievement = {
        title: user.fastest_achievement_title,
        days: user.fastest_achievement_days,
      }
    }

    return {
      total_achievements: totalAchievements,
      achievements_by_rarity: achievementsByRarity,
      uniqueness_score: uniquenessScore,
      growth_rate: growthRate,
      fastest_achievement: fastestAchievement,
      streak: user.streak || 0,
      xp: user.xp,
      level: user.level,
    }
  }

  /**
   * Получение пользователя по ID
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile_theme: true,
        platformAccounts: true,
      },
    })

    if (!user) {
      throw ApiError.notFound('User not found')
    }

    return formatUser(user, true)
  }

  /**
   * Получение последних разблокированных достижений пользователя
   */
  async getRecentAchievements(userId: string, limit: number = 5) {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { user_id: userId },
      include: {
        achievement: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                icon_url: true,
              },
            },
          },
        },
      },
      orderBy: { unlocked_at: 'desc' },
      take: limit,
    })

    return userAchievements.map((ua) => ({
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
      unlocked_at: ua.unlocked_at.toISOString(),
      is_public: ua.is_public,
    }))
  }
}

export const userService = new UserService()
