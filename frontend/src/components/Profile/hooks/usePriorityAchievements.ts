import { useState, useMemo, useEffect } from 'react'
import { useGetAchievementByIdQuery } from '@/store/api/achievementsApi'
import { useGetAchievementDetailQuery } from '@/store/api/achievementDetailApi'
import { useUpdateMeMutation, useGetMeQuery } from '@/store/api/userApi'
import type { User } from '@/types'
import { Rarity } from '@/types'

interface TrophyData {
  id: string
  title: string
  icon: string
  rarity: Rarity
  categoryId: string
  progress?: number
}

export function usePriorityAchievements(user: User, isOwnProfile: boolean = false) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)
  const [updateMe] = useUpdateMeMutation()

  // Получаем актуальные данные пользователя для автоматического обновления только для своего профиля
  // Используем данные из кэша RTK Query, которые обновляются автоматически после мутации
  const { data: currentUser, refetch: refetchUser } = useGetMeQuery(undefined, {
    skip: !isOwnProfile,
  })

  // Используем актуальные данные из кэша только для своего профиля, иначе используем пропс
  const activeUser = isOwnProfile && currentUser ? currentUser : user
  const priorityIds = activeUser.priority_achievements || []

  // Для своего профиля используем Detail query (с userAchievement и прогрессом), для чужих - базовый query с forUserId
  const priorityAchievementDetail1 = useGetAchievementDetailQuery(priorityIds[0] || '', {
    skip: !priorityIds[0] || !isOwnProfile,
    refetchOnMountOrArgChange: true,
  })
  const priorityAchievementBasic1 = useGetAchievementByIdQuery(
    { id: priorityIds[0] || '', forUserId: !isOwnProfile ? user.id : undefined },
    {
      skip: !priorityIds[0] || isOwnProfile,
      refetchOnMountOrArgChange: true,
    }
  )
  const priorityAchievement1 = isOwnProfile ? priorityAchievementDetail1 : priorityAchievementBasic1

  const priorityAchievementDetail2 = useGetAchievementDetailQuery(priorityIds[1] || '', {
    skip: !priorityIds[1] || !isOwnProfile,
    refetchOnMountOrArgChange: true,
  })
  const priorityAchievementBasic2 = useGetAchievementByIdQuery(
    { id: priorityIds[1] || '', forUserId: !isOwnProfile ? user.id : undefined },
    {
      skip: !priorityIds[1] || isOwnProfile,
      refetchOnMountOrArgChange: true,
    }
  )
  const priorityAchievement2 = isOwnProfile ? priorityAchievementDetail2 : priorityAchievementBasic2

  const priorityAchievements = useMemo(() => {
    const achievements: (TrophyData | null)[] = []
    const achievementData = [priorityAchievement1.data, priorityAchievement2.data]

    // Создаем массив из 2 элементов, заполняя null для пустых слотов
    for (let i = 0; i < 2; i++) {
      const achievementId = priorityIds[i]
      const achievement = achievementData[i]

      // Проверяем, что ID есть, данные загружены и ID совпадает
      if (achievementId && achievement && achievement.id === achievementId) {
        if (isOwnProfile) {
          // Для своего профиля проверяем completion_date, is_hidden и прогресс
          const detailAchievement = achievement as any
          const isCompleted = detailAchievement.userAchievement?.completion_date !== undefined
          const isInProgress = achievement.unlocked && !isCompleted && (detailAchievement.userAchievement?.progress || 0) > 0
          const isNotStarted = !achievement.unlocked
          const isHidden = detailAchievement.userAchievement?.is_hidden || false

          // Показываем только "в работе" или недостигнутые (не завершенные) и не скрытые
          if (!isCompleted && !isHidden && (isInProgress || isNotStarted)) {
            achievements.push({
              id: achievement.id,
              title: achievement.title,
              icon: achievement.icon_url || null,
              rarity: achievement.rarity.toUpperCase() as Rarity,
              categoryId: achievement.category.id,
              progress: detailAchievement.userAchievement?.progress || 0,
            })
          } else {
            // Если достижение завершено или скрыто, не показываем его
            achievements.push(null)
          }
        } else {
          // Для чужих профилей показываем достижение, если оно есть
          // Данные уже отфильтрованы на бэкенде при получении профиля
          // Прогресс получаем через forUserId параметр
          achievements.push({
            id: achievement.id,
            title: achievement.title,
            icon: achievement.icon_url || null,
            rarity: achievement.rarity.toUpperCase() as Rarity,
            categoryId: achievement.category.id,
            progress: achievement.progress || 0,
          })
        }
      } else {
        achievements.push(null)
      }
    }

    return achievements
  }, [priorityIds, priorityAchievement1.data, priorityAchievement2.data, isOwnProfile])

  // Автоматически удаляем завершенные достижения из приоритета только для своего профиля
  useEffect(() => {
    if (!isOwnProfile) return

    const achievementData = [priorityAchievement1.data, priorityAchievement2.data]
    const completedIds: number[] = []

    for (let i = 0; i < 2; i++) {
      const achievementId = priorityIds[i]
      const achievement = achievementData[i]

      if (achievementId && achievement && achievement.id === achievementId) {
        const isCompleted = achievement.userAchievement?.completion_date !== undefined
        if (isCompleted) {
          completedIds.push(i)
        }
      }
    }

    if (completedIds.length > 0 && activeUser.priority_achievements) {
      const newPriority = activeUser.priority_achievements.filter((_, index) => !completedIds.includes(index))
      if (newPriority.length !== activeUser.priority_achievements.length) {
        updateMe({ priority_achievements: newPriority }).catch(console.error)
      }
    }
  }, [priorityIds, priorityAchievement1.data, priorityAchievement2.data, activeUser.priority_achievements, updateMe, isOwnProfile])

  const handleAddAchievement = (slotIndex: number) => {
    setSelectedSlotIndex(slotIndex)
    setModalOpen(true)
  }

  const handleSelectAchievement = async (achievementId: string) => {
    if (selectedSlotIndex === null || !isOwnProfile) return

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
    if (!isOwnProfile) return

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
