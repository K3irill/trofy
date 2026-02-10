'use client'

import { useState } from 'react'
import { AchievementDetail } from './types'
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
}

export const AchievementApplause = ({ achievement, isOwner, currentUserId }: AchievementApplauseProps) => {
  const [likesCount, setLikesCount] = useState(achievement.likesCount || 0)
  const [isLiked, setIsLiked] = useState(achievement.isLiked || false)
  const [isToggling, setIsToggling] = useState(false)

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
    if (isToggling) return

    setIsToggling(true)
    
    // Оптимистичное обновление
    const newLiked = !isLiked
    const newCount = newLiked ? likesCount + 1 : Math.max(0, likesCount - 1)
    
    setIsLiked(newLiked)
    setLikesCount(newCount)

    try {
      // Здесь будет API вызов
      // await toggleApplause(achievement.id, newLiked)
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      // Откат при ошибке
      setIsLiked(!newLiked)
      setLikesCount(likesCount)
    } finally {
      setIsToggling(false)
    }
  }

  const handleRemoveAllLikes = () => {
    if (!isOwner) return
    
    if (confirm('Вы уверены, что хотите удалить все аплодисменты?')) {
      setLikesCount(0)
      setIsLiked(false)
      // Здесь будет API вызов
      // await removeAllApplause(achievement.id)
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
      
      {isOwner && likesCount > 0 && (
        <button
          onClick={handleRemoveAllLikes}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
          }}
        >
          Удалить все
        </button>
      )}
    </ApplauseContainer>
  )
}
