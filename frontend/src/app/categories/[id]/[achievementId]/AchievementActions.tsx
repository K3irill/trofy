'use client'

import { AchievementDetail } from './types'
import {
  useUpdateAchievementSettingsMutation,
  useToggleFavoriteMutation,
} from '@/store/api/achievementDetailApi'
import {
  ActionsContainer,
  ActionButton,
  ActionGroup,
} from './AchievementActions.styled'

interface AchievementActionsProps {
  achievement: AchievementDetail
  isOwner?: boolean
  onUpdate?: (updates: Partial<AchievementDetail>) => void
  userAchievementId?: string
}

export const AchievementActions = ({ achievement, isOwner = false, onUpdate, userAchievementId }: AchievementActionsProps) => {
  const [updateSettings] = useUpdateAchievementSettingsMutation()
  const [toggleFavorite] = useToggleFavoriteMutation()

  const isMain = achievement.isMain || false
  const isFavorite = achievement.isFavorite || false
  const isHidden = achievement.isHidden || false
  const canLike = achievement.canLike !== false
  const canComment = achievement.canComment !== false

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

  const handleToggleMain = async () => {
    if (!userAchievementId) return
    try {
      await updateSettings({
        userAchievementId,
        data: { is_main: !isMain },
      }).unwrap()
      onUpdate?.({ isMain: !isMain })
    } catch (error) {
      alert('Ошибка при обновлении настроек')
    }
  }

  const handleToggleFavorite = async () => {
    if (!userAchievementId) return
    try {
      await toggleFavorite(userAchievementId).unwrap()
      onUpdate?.({ isFavorite: !isFavorite })
    } catch (error) {
      alert('Ошибка при обновлении избранного')
    }
  }

  const handleToggleHidden = async () => {
    if (!userAchievementId) return
    try {
      await updateSettings({
        userAchievementId,
        data: { is_hidden: !isHidden },
      }).unwrap()
      onUpdate?.({ isHidden: !isHidden })
    } catch (error) {
      alert('Ошибка при обновлении настроек')
    }
  }

  const handleToggleLikes = async () => {
    if (!userAchievementId) return
    try {
      await updateSettings({
        userAchievementId,
        data: { can_like: !canLike },
      }).unwrap()
      onUpdate?.({ canLike: !canLike })
    } catch (error) {
      alert('Ошибка при обновлении настроек')
    }
  }

  const handleToggleComments = async () => {
    if (!userAchievementId) return
    try {
      await updateSettings({
        userAchievementId,
        data: { can_comment: !canComment },
      }).unwrap()
      onUpdate?.({ canComment: !canComment })
    } catch (error) {
      alert('Ошибка при обновлении настроек')
    }
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
