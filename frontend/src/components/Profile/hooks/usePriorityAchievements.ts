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

export function usePriorityAchievements(user: User) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)
  const [updateMe] = useUpdateMeMutation()
  
  // Получаем актуальные данные пользователя для автоматического обновления
  // Используем данные из кэша RTK Query, которые обновляются автоматически после мутации
  const { data: currentUser, refetch: refetchUser } = useGetMeQuery(undefined, {
    // Пропускаем запрос только если пользователь не авторизован
    skip: !user.id,
  })

  // Используем актуальные данные из кэша или fallback на пропс
  const activeUser = currentUser || user
  const priorityIds = activeUser.priority_achievements || []
  
  // Запросы к достижениям - они автоматически обновятся при изменении priorityIds
  const priorityAchievement1 = useGetAchievementByIdQuery(priorityIds[0] || '', { 
    skip: !priorityIds[0],
    // Принудительно обновляем при изменении ID
    refetchOnMountOrArgChange: true,
  })
  const priorityAchievement2 = useGetAchievementByIdQuery(priorityIds[1] || '', { 
    skip: !priorityIds[1],
    // Принудительно обновляем при изменении ID
    refetchOnMountOrArgChange: true,
  })

  const priorityAchievements = useMemo(() => {
    const achievements: (TrophyData | null)[] = []
    const achievementData = [priorityAchievement1.data, priorityAchievement2.data]

    // Создаем массив из 2 элементов, заполняя null для пустых слотов
    for (let i = 0; i < 2; i++) {
      const achievementId = priorityIds[i]
      // Проверяем, что ID есть, данные загружены и ID совпадает
      if (achievementId && achievementData[i] && achievementData[i]!.id === achievementId) {
        achievements.push({
          id: achievementData[i]!.id,
          title: achievementData[i]!.title,
          icon: achievementData[i]!.icon_url || '🏆',
          rarity: achievementData[i]!.rarity.toUpperCase() as Rarity,
          categoryId: achievementData[i]!.category.id,
        })
      } else {
        achievements.push(null)
      }
    }

    return achievements
  }, [priorityIds, priorityAchievement1.data, priorityAchievement2.data])

  const handleAddAchievement = (slotIndex: number) => {
    setSelectedSlotIndex(slotIndex)
    setModalOpen(true)
  }

  const handleSelectAchievement = async (achievementId: string) => {
    if (selectedSlotIndex === null) return

    const currentPriority = [...(activeUser.priority_achievements || [])]
    const newPriority: string[] = []
    
    for (let i = 0; i < 2; i++) {
      if (i === selectedSlotIndex) {
        newPriority[i] = achievementId
      } else if (currentPriority[i]) {
        newPriority[i] = currentPriority[i]
      }
    }

    const filteredPriority = newPriority.filter((id): id is string => !!id).slice(0, 2)

    try {
      await updateMe({ priority_achievements: filteredPriority }).unwrap()
      // RTK Query автоматически обновит кэш через invalidatesTags: ['User']
    } catch (error) {
      console.error('Failed to update priority achievements:', error)
    }

    setModalOpen(false)
    setSelectedSlotIndex(null)
  }

  const handleRemoveAchievement = async (slotIndex: number) => {
    const currentPriority = [...(activeUser.priority_achievements || [])]
    const newPriority = currentPriority.filter((_, index) => index !== slotIndex)

    try {
      await updateMe({ priority_achievements: newPriority }).unwrap()
      // RTK Query автоматически обновит кэш через invalidatesTags: ['User']
      // Это обновит currentUser, который обновит priorityIds, что обновит запросы к достижениям
    } catch (error) {
      console.error('Failed to remove priority achievement:', error)
    }
  }

  return {
    priorityAchievements,
    modalOpen,
    selectedSlotIndex,
    setModalOpen,
    setSelectedSlotIndex,
    handleAddAchievement,
    handleSelectAchievement,
    handleRemoveAchievement,
  }
}
