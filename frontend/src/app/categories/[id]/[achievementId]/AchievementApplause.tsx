'use client'

import { AchievementDetail } from './types'
import { useToggleLikeMutation } from '@/store/api/achievementDetailApi'
import {
  ApplauseContainer,
  ApplauseButton,
  ApplauseCount,
  ApplauseDisabled,
} from './AchievementApplause.styled'

interface AchievementApplauseProps {
  achievement: AchievementDetail
  isOwner: boolean
  currentUserId?: string
  userAchievementId?: string
}

export const AchievementApplause = ({ achievement, isOwner, currentUserId, userAchievementId }: AchievementApplauseProps) => {
  const [toggleLike, { isLoading: isToggling }] = useToggleLikeMutation()

  const likesCount = achievement.likesCount || 0
  const isLiked = achievement.isLiked || false

  if (!achievement.unlocked) {
    return null
  }

  if (achievement.canLike === false) {
    return (
      <ApplauseContainer>
        <ApplauseDisabled>
          👏 Аплодисменты отключены владельцем
        </ApplauseDisabled>
      </ApplauseContainer>
    )
  }

  const handleToggleLike = async () => {
    if (isToggling || !userAchievementId) return

    try {
      await toggleLike(userAchievementId).unwrap()
    } catch (error) {
      alert('Ошибка при обновлении лайка')
    }
  }

  return (
    <ApplauseContainer>
      <ApplauseButton
        onClick={handleToggleLike}
        liked={isLiked}
        disabled={isToggling}
      >
        <span>{isLiked ? '👏' : '👋'}</span>
        <ApplauseCount>{likesCount}</ApplauseCount>
      </ApplauseButton>

    </ApplauseContainer>
  )
}
