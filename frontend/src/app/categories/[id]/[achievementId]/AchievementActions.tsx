'use client'

import { useState } from 'react'
import { AchievementDetail } from './types'
import {
  ActionsContainer,
  ActionButton,
  ActionGroup,
} from './AchievementActions.styled'

interface AchievementActionsProps {
  achievement: AchievementDetail
  isOwner?: boolean
  onUpdate?: (updates: Partial<AchievementDetail>) => void
}

export const AchievementActions = ({ achievement, isOwner = false, onUpdate }: AchievementActionsProps) => {
  const [isMain, setIsMain] = useState(achievement.isMain || false)
  const [isFavorite, setIsFavorite] = useState(achievement.isFavorite || false)
  const [isHidden, setIsHidden] = useState(achievement.isHidden || false)
  const [canLike, setCanLike] = useState(achievement.canLike !== false)
  const [canComment, setCanComment] = useState(achievement.canComment !== false)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: achievement.name,
        text: achievement.description,
        url: window.location.href,
      }).catch(() => {
        // Fallback: копирование в буфер обмена
        navigator.clipboard.writeText(window.location.href)
        alert('Ссылка скопирована в буфер обмена!')
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Ссылка скопирована в буфер обмена!')
    }
  }

  const handleToggleMain = () => {
    setIsMain(!isMain)
    // Здесь будет API вызов
    console.log('Set as main:', !isMain)
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Здесь будет API вызов
    console.log('Toggle favorite:', !isFavorite)
  }

  const handleToggleHidden = () => {
    setIsHidden(!isHidden)
    // Здесь будет API вызов
    console.log('Toggle hidden:', !isHidden)
    onUpdate?.({ isHidden: !isHidden })
  }

  const handleToggleLikes = () => {
    setCanLike(!canLike)
    // Здесь будет API вызов
    console.log('Toggle likes:', !canLike)
    onUpdate?.({ canLike: !canLike })
  }

  const handleToggleComments = () => {
    setCanComment(!canComment)
    // Здесь будет API вызов
    console.log('Toggle comments:', !canComment)
    onUpdate?.({ canComment: !canComment })
  }

  return (
    <ActionsContainer>
      <ActionGroup>
        <ActionButton onClick={handleShare} variant="primary">
          <span>🔗</span>
          Поделиться
        </ActionButton>
      </ActionGroup>

      <ActionGroup>
        <ActionButton
          onClick={handleToggleMain}
          variant={isMain ? 'active' : 'secondary'}
        >
          <span>{isMain ? '⭐' : '☆'}</span>
          {isMain ? 'Главное' : 'Сделать главным'}
        </ActionButton>

        <ActionButton
          onClick={handleToggleFavorite}
          variant={isFavorite ? 'active' : 'secondary'}
        >
          <span>{isFavorite ? '❤️' : '🤍'}</span>
          {isFavorite ? 'В избранном' : 'В избранное'}
        </ActionButton>

        <ActionButton
          onClick={handleToggleHidden}
          variant={isHidden ? 'warning' : 'secondary'}
        >
          <span>{isHidden ? '👁️‍🗨️' : '👁️'}</span>
          {isHidden ? 'Скрыто' : 'Скрыть'}
        </ActionButton>
      </ActionGroup>

      {isOwner && achievement.unlocked && (
        <ActionGroup>
          <ActionButton
            onClick={handleToggleLikes}
            variant={!canLike ? 'warning' : 'secondary'}
          >
            <span>{canLike ? '👏' : '🚫'}</span>
            {canLike ? 'Аплодисменты включены' : 'Аплодисменты отключены'}
          </ActionButton>

          <ActionButton
            onClick={handleToggleComments}
            variant={!canComment ? 'warning' : 'secondary'}
          >
            <span>{canComment ? '💬' : '🚫'}</span>
            {canComment ? 'Комментарии включены' : 'Комментарии отключены'}
          </ActionButton>
        </ActionGroup>
      )}
    </ActionsContainer>
  )
}
