import { prisma } from '../../../shared/database'
import { hashPassword, comparePassword } from '../../../core/utils/password'
import { generateTokens, verifyToken } from '../../../core/utils/jwt'
import { ApiError } from '../../../core/errors/ApiError'
import { calculateLevel } from '../../../shared/utils/levelCalculator'
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  LinkPlatformDto,
  PlatformType,
} from '../dto/auth.dto'

interface PrivacySettings {
  show_achievements: boolean
  show_level: boolean
  show_profile: boolean
}

interface UserResponse {
  id: string
  vk_id?: string | null
  username: string
  email?: string | null
  phone?: string | null
  xp: number
  level: number
  profile_theme: any
  privacy_settings: PrivacySettings
  created_at: string
  updated_at: string
  bio?: string | null
  badges?: string[]
  pinned_achievements?: string[]
  priority_achievements?: string[]
  streak?: number
  uniqueness_score?: number | null
  growth_rate?: number | null
  fastest_achievement?: {
    title: string
    days: number
  } | null
  platform_accounts?: any[]
  avatar_url?: string | null
  main_info_theme?: string | null
  background_icons?: string[]
}

/**
 * Форматирует пользователя для ответа с учетом приватности
 */
export function formatUser(
  user: any,
  isOwnProfile: boolean = false,
  viewerId?: string
): UserResponse {
  const privacy = user.privacy_settings as PrivacySettings

  // Если это свой профиль, возвращаем все данные
  if (isOwnProfile) {
    return {
      id: user.id,
      vk_id: user.vk_id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      xp: user.xp,
      level: user.level,
      profile_theme: user.profile_theme
        ? {
            id: user.profile_theme.id,
            name: user.profile_theme.name,
            preview_url: user.profile_theme.preview_url,
            cost: user.profile_theme.cost,
            xp_required: user.profile_theme.xp_required,
            profile_color: user.profile_theme.profile_color,
          }
        : {
            profile_color: 'dark',
          },
      privacy_settings: privacy,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
      bio: user.bio,
      badges: user.badges ? (Array.isArray(user.badges) ? user.badges : JSON.parse(user.badges)) : [],
      pinned_achievements: user.pinned_achievements
        ? (Array.isArray(user.pinned_achievements)
            ? user.pinned_achievements
            : JSON.parse(user.pinned_achievements))
        : [],
      priority_achievements: user.priority_achievements
        ? (Array.isArray(user.priority_achievements)
            ? user.priority_achievements
            : JSON.parse(user.priority_achievements))
        : [],
      main_info_theme: user.main_info_theme || null,
      background_icons: user.background_icons
        ? (Array.isArray(user.background_icons)
            ? user.background_icons
            : JSON.parse(user.background_icons))
        : [],
      streak: user.streak,
      uniqueness_score: user.uniqueness_score,
      growth_rate: user.growth_rate,
      fastest_achievement: user.fastest_achievement_title
        ? {
            title: user.fastest_achievement_title,
            days: user.fastest_achievement_days || 0,
          }
        : undefined,
      platform_accounts: user.platformAccounts
        ? user.platformAccounts.map((pa: any) => ({
            platform: pa.platform,
            platform_user_id: pa.platform_user_id,
            linked_at: pa.linked_at.toISOString(),
            username: pa.username,
            avatar_url: pa.avatar_url,
          }))
        : [],
      avatar_url: user.avatar_url || null,
    }
  }

  // Если профиль скрыт, возвращаем только базовую информацию
  if (!privacy.show_profile) {
    return {
      id: user.id,
      username: user.username,
      xp: 0,
      level: 0,
      profile_theme: { profile_color: 'dark' },
      privacy_settings: privacy,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    }
  }

  // Формируем ответ с учетом настроек приватности
  const response: UserResponse = {
    id: user.id,
    vk_id: privacy.show_profile ? user.vk_id : null,
    username: user.username,
    email: null, // Email никогда не показываем другим пользователям
    phone: null, // Phone никогда не показываем другим пользователям
    xp: privacy.show_level ? user.xp : 0,
    level: privacy.show_level ? user.level : 0,
    profile_theme: user.profile_theme
      ? {
          id: user.profile_theme.id,
          name: user.profile_theme.name,
          preview_url: user.profile_theme.preview_url,
          cost: user.profile_theme.cost,
          xp_required: user.profile_theme.xp_required,
          profile_color: user.profile_theme.profile_color,
        }
      : { profile_color: 'dark' },
    privacy_settings: privacy,
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
    bio: privacy.show_profile ? user.bio : null,
    badges: privacy.show_achievements && user.badges
      ? (Array.isArray(user.badges) ? user.badges : JSON.parse(user.badges))
      : [],
    pinned_achievements: privacy.show_achievements && user.pinned_achievements
      ? (Array.isArray(user.pinned_achievements)
          ? user.pinned_achievements
          : JSON.parse(user.pinned_achievements))
      : [],
    priority_achievements: privacy.show_achievements && user.priority_achievements
      ? (Array.isArray(user.priority_achievements)
          ? user.priority_achievements
          : JSON.parse(user.priority_achievements))
      : [],
    main_info_theme: privacy.show_profile ? (user.main_info_theme || null) : null,
    background_icons: privacy.show_profile && user.background_icons
      ? (Array.isArray(user.background_icons)
          ? user.background_icons
          : JSON.parse(user.background_icons))
      : [],
    streak: privacy.show_achievements ? user.streak : undefined,
    uniqueness_score: privacy.show_achievements ? user.uniqueness_score : null,
    growth_rate: privacy.show_achievements ? user.growth_rate : null,
    fastest_achievement: privacy.show_achievements && user.fastest_achievement_title
      ? {
          title: user.fastest_achievement_title,
          days: user.fastest_achievement_days || 0,
        }
      : undefined,
    platform_accounts: privacy.show_profile && user.platformAccounts
      ? user.platformAccounts.map((pa: any) => ({
          platform: pa.platform,
          platform_user_id: pa.platform_user_id,
          linked_at: pa.linked_at.toISOString(),
          username: pa.username,
          avatar_url: pa.avatar_url,
        }))
      : [],
    avatar_url: privacy.show_profile ? (user.avatar_url || null) : null,
  }

  return response
}

export class AuthService {
  /**
   * Регистрация нового пользователя
   */
  async register(dto: RegisterDto) {
    // Проверяем уникальность username, email, phone
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          ...(dto.email ? [{ email: dto.email }] : []),
          ...(dto.phone ? [{ phone: dto.phone }] : []),
        ],
      },
    })

    if (existingUser) {
      if (existingUser.username === dto.username) {
        throw ApiError.conflict('Username already taken')
      }
      if (dto.email && existingUser.email === dto.email) {
        throw ApiError.conflict('Email already registered')
      }
      if (dto.phone && existingUser.phone === dto.phone) {
        throw ApiError.conflict('Phone already registered')
      }
    }

    // Хешируем пароль
    const passwordHash = await hashPassword(dto.password)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        phone: dto.phone,
        password_hash: passwordHash,
      },
      include: {
        profile_theme: true,
        platformAccounts: true,
      },
    })

    // Генерируем токены
    const tokens = generateTokens(user.id)

    // Сохраняем refresh токен
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 дней

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token: tokens.refreshToken,
        expires_at: expiresAt,
      },
    })

    return {
      user: formatUser(user, true),
      tokens: {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_in: tokens.expiresIn,
      },
    }
  }

  /**
   * Вход пользователя
   */
  async login(dto: LoginDto) {
    // Ищем пользователя по email или phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.login },
          { phone: dto.login },
        ],
      },
      include: {
        profile_theme: true,
        platformAccounts: true,
      },
    })

    if (!user || !user.password_hash) {
      throw ApiError.unauthorized('Invalid credentials')
    }

    // Проверяем пароль
    const isPasswordValid = await comparePassword(dto.password, user.password_hash)
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid credentials')
    }

    // Обновляем серию подряд при входе
    const { userService } = await import('../../user/service/user.service')
    await userService.updateStreak(user.id)

    // Генерируем токены
    const tokens = generateTokens(user.id)

    // Сохраняем refresh токен
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 дней

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token: tokens.refreshToken,
        expires_at: expiresAt,
      },
    })

    // Получаем обновленного пользователя с актуальным streak
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile_theme: true,
        platformAccounts: true,
      },
    })

    return {
      user: formatUser(updatedUser!, true),
      tokens: {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_in: tokens.expiresIn,
      },
    }
  }

  /**
   * Обновление токена
   */
  async refreshToken(dto: RefreshTokenDto) {
    // Проверяем токен
    const payload = verifyToken(dto.refresh_token)

    if (payload.type !== 'refresh') {
      throw ApiError.unauthorized('Invalid token type')
    }

    // Проверяем наличие токена в БД
    const refreshTokenRecord = await prisma.refreshToken.findUnique({
      where: { token: dto.refresh_token },
      include: { user: true },
    })

    if (!refreshTokenRecord || refreshTokenRecord.expires_at < new Date()) {
      throw ApiError.unauthorized('Invalid or expired refresh token')
    }

    // Удаляем старый refresh токен
    await prisma.refreshToken.delete({
      where: { id: refreshTokenRecord.id },
    })

    // Генерируем новые токены
    const tokens = generateTokens(payload.userId)

    // Сохраняем новый refresh токен
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await prisma.refreshToken.create({
      data: {
        user_id: payload.userId,
        token: tokens.refreshToken,
        expires_at: expiresAt,
      },
    })

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_in: tokens.expiresIn,
    }
  }

  /**
   * Выход пользователя
   */
  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    })
  }

  /**
   * Получение текущего пользователя
   */
  async getMe(userId: string) {
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
   * Получение пользователя по ID (с учетом privacy_settings)
   */
  async getUserById(userId: string, viewerId?: string) {
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

    const isOwnProfile = viewerId === userId
    return formatUser(user, isOwnProfile, viewerId)
  }

  /**
   * Привязка платформы к аккаунту
   */
  async linkPlatform(userId: string, dto: LinkPlatformDto) {
    // Проверяем, не привязана ли уже эта платформа
    const existing = await prisma.platformAccount.findUnique({
      where: {
        platform_platform_user_id: {
          platform: dto.platform,
          platform_user_id: dto.platform_user_id,
        },
      },
    })

    if (existing && existing.user_id !== userId) {
      throw ApiError.conflict('Platform account already linked to another user')
    }

    // Создаем или обновляем привязку
    const platformAccount = await prisma.platformAccount.upsert({
      where: {
        platform_platform_user_id: {
          platform: dto.platform,
          platform_user_id: dto.platform_user_id,
        },
      },
      create: {
        user_id: userId,
        platform: dto.platform,
        platform_user_id: dto.platform_user_id,
      },
      update: {
        user_id: userId,
      },
    })

    // Возвращаем обновленного пользователя
    return this.getMe(userId)
  }
}

export const authService = new AuthService()
