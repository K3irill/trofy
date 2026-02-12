'use client'

import { AchievementDetail } from './types'
import { useToggleLikeMutation } from '@/store/api/achievementDetailApi'
import { useToast } from '@/hooks/useToast'
import { IoHandRight, IoHandRightOutline } from 'react-icons/io5'
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
  achievementId?: string
}

export const AchievementApplause = ({ achievement, isOwner, currentUserId, userAchievementId, achievementId }: AchievementApplauseProps) => {
  const [toggleLike, { isLoading: isToggling }] = useToggleLikeMutation()
  const { showToast, ToastComponent } = useToast()

  const likesCount = achievement.likesCount || 0
  const isLiked = achievement.isLiked || false

  if (!achievement.unlocked) {
    return null
  }

  if (achievement.canLike === false) {
    return (
      <ApplauseContainer>
        <ApplauseDisabled>
          <IoHandRightOutline style={{ marginRight: '0.5rem' }} />
          Аплодисменты отключены владельцем
        </ApplauseDisabled>
      </ApplauseContainer>
    )
  }

  const handleToggleLike = async () => {
    if (isToggling || !userAchievementId || !achievementId) return

    try {
      await toggleLike({ userAchievementId, achievementId }).unwrap()
      showToast(isLiked ? 'Аплодисменты убраны' : 'Аплодисменты добавлены', 'success')
    } catch (error) {
      showToast('Ошибка при обновлении лайка', 'error')
    }
  }

  return (
    <ApplauseContainer>
      <ApplauseButton
        onClick={handleToggleLike}
        liked={isLiked}
        disabled={isToggling}
      >
        {isLiked ? <IoHandRight /> : <IoHandRightOutline />}
        <ApplauseCount>{likesCount}</ApplauseCount>
      </ApplauseButton>
      <ToastComponent />
    </ApplauseContainer>
  )
}
