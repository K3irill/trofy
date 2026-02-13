import { prisma } from '../../../shared/database'
import { ApiError } from '../../../core/errors/ApiError'
import { UpdateUserDto } from '../dto/user.dto'
import { formatUser } from '../../auth/service/auth.service'
import { calculateLevel } from '../../../shared/utils/levelCalculator'

export class UserService {
  /**
   * Обновление серии подряд (streak)
   * Засчитывается если пользователь зашел сегодня
   * Если не зашел вчера - обнуляется
   */
  async updateStreak(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        streak: true,
        last_activity_date: true,
      },
    })

    if (!user) {
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let newStreak = user.streak || 0

    if (user.last_activity_date) {
      const lastActivity = new Date(user.last_activity_date)
      lastActivity.setHours(0, 0, 0, 0)

      if (lastActivity.getTime() === today.getTime()) {
        // Уже заходил сегодня - не обновляем streak
        return
      } else if (lastActivity.getTime() === yesterday.getTime()) {
        // Заходил вчера - увеличиваем streak
        newStreak = (user.streak || 0) + 1
      } else {
        // Не заходил вчера - обнуляем streak
        newStreak = 1 // Начинаем новую серию с сегодняшнего дня
      }
    } else {
      // Первый вход - начинаем серию
      newStreak = 1
    }

    // Обновляем streak и last_activity_date
    await prisma.user.update({
      where: { id: userId },
      data: {
        streak: newStreak,
        last_activity_date: today,
      },
    })

    return newStreak
  }

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

    if (dto.main_info_theme !== undefined) {
      // Валидация темы блока основной информации
      const validThemes = [
        'midnight',
        'deepBlue',
        'velvetPurple',
        'forest',
        'cosmic',
        'sunset',
        'nebula',
        'aurora',
        'gold',
        'platinum',
        'dragonScale',
        'frostedGlass',
      ]
      if (dto.main_info_theme && !validThemes.includes(dto.main_info_theme)) {
        throw ApiError.badRequest('Invalid main_info_theme')
      }
      updateData.main_info_theme = dto.main_info_theme || null
    }

    if (dto.background_icons !== undefined) {
      // Валидация иконок для фона
      if (dto.background_icons.length > 10) {
        throw ApiError.badRequest('Maximum 10 background icons allowed')
      }
      updateData.background_icons = dto.background_icons
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

    if (dto.avatar_url !== undefined) {
      updateData.avatar_url = dto.avatar_url
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

    // Считаем только завершенные достижения (с completion_date)
    const completedAchievements = user.userAchievements.filter((ua) => ua.completion_date !== null)

    const totalAchievements = completedAchievements.length
    const achievementsByRarity = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    }

    completedAchievements.forEach((ua) => {
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

    // Проверяем и исправляем уровень, если он не соответствует XP
    const correctLevel = calculateLevel(user.xp)
    if (user.level !== correctLevel) {
      await prisma.user.update({
        where: { id: userId },
        data: { level: correctLevel },
      })
      user.level = correctLevel
    }

    return formatUser(user, true)
  }

  /**
   * Получение последних достигнутых достижений пользователя
   */
  async getRecentAchievements(userId: string, limit: number = 5) {
    const userAchievements = await prisma.userAchievement.findMany({
      where: {
        user_id: userId,
        completion_date: { not: null }, // Только достигнутые достижения
        is_hidden: false, // Исключаем скрытые достижения
      },
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
      orderBy: { completion_date: 'desc' }, // Сортируем по дате завершения
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
      unlocked_at: ua.completion_date?.toISOString() || null, // Дата завершения для достигнутых
      start_at: ua.unlocked_at.toISOString(), // Дата начала работы
      is_achieved: !!ua.completion_date, // Явный флаг достижения
      is_public: ua.is_public,
      is_hidden: ua.is_hidden, // Добавляем поле is_hidden
    }))
  }
}

export const userService = new UserService()
