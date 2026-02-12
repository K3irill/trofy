import { useState, useMemo } from 'react'
import { useGetAchievementByIdQuery } from '@/store/api/achievementsApi'
import { useUpdateMeMutation, useGetMeQuery } from '@/store/api/userApi'
import type { User } from '@/types'
import { Rarity } from '@/types'

interface TrophyData {
  id: string
  title: string
  icon: string
  rarity: Rarity
  categoryId: string
}

export function usePinnedAchievements(user: User) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)
  const [updateMe] = useUpdateMeMutation()
  
  // Получаем актуальные данные пользователя для автоматического обновления
  const { data: currentUser } = useGetMeQuery(undefined, {
    skip: !user.id,
  })

  // Используем актуальные данные из кэша или fallback на пропс
  const activeUser = currentUser || user
  const pinnedIds = activeUser.pinned_achievements || []
  const achievement1 = useGetAchievementByIdQuery(pinnedIds[0] || '', { skip: !pinnedIds[0] })
  const achievement2 = useGetAchievementByIdQuery(pinnedIds[1] || '', { skip: !pinnedIds[1] })
  const achievement3 = useGetAchievementByIdQuery(pinnedIds[2] || '', { skip: !pinnedIds[2] })

  const pinnedAchievements = useMemo(() => {
    const achievements: (TrophyData | null)[] = []
    const achievementData = [achievement1.data, achievement2.data, achievement3.data]

    for (let i = 0; i < 3; i++) {
      const achievement = achievementData[i]
      // Показываем только завершенные достижения (с completion_date)
      if (achievement && achievement.completion_date) {
        achievements.push({
          id: achievement.id,
          title: achievement.title,
          icon: achievement.icon_url || '🏆',
          rarity: achievement.rarity.toUpperCase() as Rarity,
          categoryId: achievement.category.id,
        })
      } else {
        achievements.push(null)
      }
    }

    return achievements
  }, [achievement1.data, achievement2.data, achievement3.data])

  const handleAddAchievement = (slotIndex: number) => {
    setSelectedSlotIndex(slotIndex)
    setModalOpen(true)
  }

  const handleSelectAchievement = async (achievementId: string) => {
    if (selectedSlotIndex === null) return

    const currentPinned = [...(activeUser.pinned_achievements || [])]
    const newPinned: string[] = []
    
    for (let i = 0; i < 3; i++) {
      if (i === selectedSlotIndex) {
        newPinned[i] = achievementId
      } else if (currentPinned[i]) {
        newPinned[i] = currentPinned[i]
      }
    }

    const filteredPinned = newPinned.filter((id): id is string => !!id).slice(0, 3)

    try {
      await updateMe({ pinned_achievements: filteredPinned }).unwrap()
      // После успешного обновления RTK Query автоматически обновит кэш через invalidatesTags
    } catch (error) {
      console.error('Failed to update pinned achievements:', error)
    }

    setModalOpen(false)
    setSelectedSlotIndex(null)
  }

  const handleRemoveAchievement = async (slotIndex: number) => {
    const currentPinned = [...(activeUser.pinned_achievements || [])]
    const newPinned = currentPinned.filter((_, index) => index !== slotIndex)

    try {
      await updateMe({ pinned_achievements: newPinned }).unwrap()
      // После успешного обновления RTK Query автоматически обновит кэш через invalidatesTags
    } catch (error) {
      console.error('Failed to remove pinned achievement:', error)
    }
  }

  return {
    pinnedAchievements,
    modalOpen,
    selectedSlotIndex,
    setModalOpen,
    setSelectedSlotIndex,
    handleAddAchievement,
    handleSelectAchievement,
    handleRemoveAchievement,
  }
}
