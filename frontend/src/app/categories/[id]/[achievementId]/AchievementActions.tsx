'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { AchievementDetail } from './types'
import {
  useUpdateAchievementSettingsMutation,
  useToggleFavoriteMutation,
  useResetAchievementMutation,
} from '@/store/api/achievementDetailApi'
import { AchievementEditForm } from './AchievementEditForm'
import {
  ActionsContainer,
} from './AchievementActions.styled'
import { useToast } from '@/hooks/useToast'
import { useConfirm } from '@/hooks/useConfirm'

interface AchievementActionsProps {
  achievement: AchievementDetail
  isOwner?: boolean
  onUpdate?: (updates: Partial<AchievementDetail>) => void
  userAchievementId?: string
  achievementId?: string
  onActionsReady?: (actions: {
    handleEdit: () => void
    handleReset: () => void
    handleToggleMain: () => void
    handleToggleFavorite: () => void
    handleToggleHidden: () => void
    handleToggleLikes: () => void
    handleToggleComments: () => void
  }) => void
}

export const AchievementActions = ({ achievement, isOwner = false, onUpdate, userAchievementId, achievementId, onActionsReady }: AchievementActionsProps) => {
  const [updateSettings] = useUpdateAchievementSettingsMutation()
  const [toggleFavorite] = useToggleFavoriteMutation()
  const [resetAchievement] = useResetAchievementMutation()
  const { showToast, ToastComponent } = useToast()
  const { confirm, ConfirmComponent } = useConfirm()

  const isMain = achievement.isMain || false
  const isFavorite = achievement.isFavorite || false
  const isHidden = achievement.isHidden || false
  const canLike = achievement.canLike !== false
  const canComment = achievement.canComment !== false

  // Используем ref для onUpdate, чтобы избежать пересоздания функций
  const onUpdateRef = useRef(onUpdate)
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: achievement.name,
        text: achievement.description,
        url: window.location.href,
      }).catch(() => {
        // Fallback: копирование в буфер обмена
        navigator.clipboard.writeText(window.location.href)
        showToast('Ссылка скопирована в буфер обмена!', 'success')
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showToast('Ссылка скопирована в буфер обмена!', 'success')
    }
  }

  const handleToggleMain = useCallback(async () => {
    if (!userAchievementId || !achievementId || !isOwner) return
    try {
      await updateSettings({
        userAchievementId,
        achievementId,
        data: { is_main: !isMain },
      }).unwrap()
      onUpdateRef.current?.({ isMain: !isMain })
      showToast('Настройки обновлены', 'success')
    } catch (error) {
      showToast('Ошибка при обновлении настроек', 'error')
    }
  }, [userAchievementId, achievementId, isMain, updateSettings])

  const handleToggleFavorite = useCallback(async () => {
    if (!userAchievementId || !achievementId) return
    // Избранное можно добавлять для любых достижений
    try {
      await toggleFavorite({ userAchievementId, achievementId }).unwrap()
      onUpdateRef.current?.({ isFavorite: !isFavorite })
      showToast(isFavorite ? 'Убрано из избранного' : 'Добавлено в избранное', 'success')
    } catch (error) {
      showToast('Ошибка при обновлении избранного', 'error')
    }
  }, [userAchievementId, achievementId, isFavorite, toggleFavorite])

  const handleToggleHidden = useCallback(async () => {
    if (!userAchievementId || !achievementId || !isOwner) return
    try {
      await updateSettings({
        userAchievementId,
        achievementId,
        data: { is_hidden: !isHidden },
      }).unwrap()
      onUpdateRef.current?.({ isHidden: !isHidden })
      showToast(isHidden ? 'Достижение показано' : 'Достижение скрыто', 'success')
    } catch (error) {
      showToast('Ошибка при обновлении настроек', 'error')
    }
  }, [userAchievementId, achievementId, isHidden, updateSettings, showToast])

  const handleToggleLikes = useCallback(async () => {
    if (!userAchievementId || !achievementId || !isOwner) return
    try {
      await updateSettings({
        userAchievementId,
        achievementId,
        data: { can_like: !canLike },
      }).unwrap()
      onUpdateRef.current?.({ canLike: !canLike })
      showToast(canLike ? 'Аплодисменты отключены' : 'Аплодисменты включены', 'success')
    } catch (error) {
      showToast('Ошибка при обновлении настроек', 'error')
    }
  }, [userAchievementId, achievementId, canLike, updateSettings, showToast])

  const handleToggleComments = useCallback(async () => {
    if (!userAchievementId || !achievementId || !isOwner) return
    try {
      await updateSettings({
        userAchievementId,
        achievementId,
        data: { can_comment: !canComment },
      }).unwrap()
      onUpdateRef.current?.({ canComment: !canComment })
      showToast(canComment ? 'Комментарии отключены' : 'Комментарии включены', 'success')
    } catch (error) {
      showToast('Ошибка при обновлении настроек', 'error')
    }
  }, [userAchievementId, achievementId, canComment, updateSettings])

  const handleReset = useCallback(async () => {
    if (!userAchievementId || !achievementId || !isOwner) return

    const confirmed = await confirm({
      title: 'Сбросить выполнение достижения?',
      message: 'Вы уверены, что хотите сбросить выполнение этого достижения? Все данные (дата выполнения, сложность, впечатления, фотографии) будут удалены. Это действие нельзя отменить.',
      confirmText: 'Сбросить',
      cancelText: 'Отмена',
      type: 'danger',
    })

    if (!confirmed) return

    try {
      await resetAchievement({ userAchievementId, achievementId }).unwrap()
      onUpdateRef.current?.({ unlocked: false })
      showToast('Выполнение достижения сброшено', 'success')
      // onUpdate вызовет refetch в родительском компоненте
    } catch (error) {
      showToast('Ошибка при сбросе достижения', 'error')
    }
  }, [userAchievementId, achievementId, resetAchievement, confirm, showToast])

  // Создаем стабильный объект с функциями
  const actions = useMemo(() => ({
    handleEdit: () => {
      // Редактирование теперь управляется из page.tsx
    },
    handleReset,
    handleToggleMain,
    handleToggleFavorite,
    handleToggleHidden,
    handleToggleLikes,
    handleToggleComments,
  }), [handleReset, handleToggleMain, handleToggleFavorite, handleToggleHidden, handleToggleLikes, handleToggleComments])

  // Передаем функции в родительский компонент
  useEffect(() => {
    if (onActionsReady) {
      onActionsReady(actions)
    }
  }, [onActionsReady, actions])

  return (
    <>
      <ActionsContainer>
        {/* Форма редактирования теперь в AchievementDetailView */}
      </ActionsContainer>
      <ToastComponent />
      <ConfirmComponent />
    </>
  )
}
