export interface AchievementDetail {
  id: string
  categoryId: string
  name: string
  description: string
  icon: string
  imageUrl?: string // Изображение достижения (сгенерированное), не фотография пользователя
  unlocked: boolean
  progress?: number
  maxProgress?: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  completionDate?: string
  difficulty?: 1 | 2 | 3 | 4 | 5
  impressions?: string
  photos?: string[] // Фотографии, добавленные пользователем (URL)
  photosWithId?: Array<{ id: string; url: string }> // Фотографии с ID для удаления
  isMain?: boolean
  isFavorite?: boolean
  isHidden?: boolean
  requiresVerification?: boolean
  isVerified?: boolean
  verificationCount?: number
  canLike?: boolean
  canComment?: boolean
  likesCount?: number
  isLiked?: boolean
  commentsCount?: number
  ownerId?: string
  createdAt: string
}

export interface AchievementComment {
  id: string
  userId: string
  username: string
  avatar?: string
  text: string
  createdAt: string
  isOwner?: boolean
}

export interface AchievementVerification {
  id: string
  userId: string
  username: string
  avatar?: string
  verifiedAt: string
  reason?: string
}

export interface AchievementState {
  isAuthenticated: boolean
  achievement: AchievementDetail
}
