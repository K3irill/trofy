import { useState, useMemo } from 'react'
import { useGetAchievementDetailQuery } from '@/store/api/achievementDetailApi'
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

export function usePinnedAchievements(user: User, isOwnProfile: boolean = false) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)
  const [updateMe] = useUpdateMeMutation()

  // Получаем актуальные данные пользователя для автоматического обновления только для своего профиля
  // Используем данные из кэша RTK Query, которые обновляются автоматически после мутации
  const { data: currentUser } = useGetMeQuery(undefined, {
    skip: !isOwnProfile,
  })

  // Используем актуальные данные из кэша только для своего профиля, иначе используем пропс
  const activeUser = isOwnProfile && currentUser ? currentUser : user
  const pinnedIds = activeUser.pinned_achievements || []
  
  // Для своего профиля используем Detail query (с userAchievement), для чужих - базовый query с forUserId
  const achievement1Detail = useGetAchievementDetailQuery(pinnedIds[0] || '', {
    skip: !pinnedIds[0] || !isOwnProfile,
    refetchOnMountOrArgChange: true,
  })
  const achievement1Basic = useGetAchievementByIdQuery(
    { id: pinnedIds[0] || '', forUserId: !isOwnProfile ? user.id : undefined },
    {
      skip: !pinnedIds[0] || isOwnProfile,
      refetchOnMountOrArgChange: true,
    }
  )
  const achievement1 = isOwnProfile ? achievement1Detail : achievement1Basic

  const achievement2Detail = useGetAchievementDetailQuery(pinnedIds[1] || '', {
    skip: !pinnedIds[1] || !isOwnProfile,
    refetchOnMountOrArgChange: true,
  })
  const achievement2Basic = useGetAchievementByIdQuery(
    { id: pinnedIds[1] || '', forUserId: !isOwnProfile ? user.id : undefined },
    {
      skip: !pinnedIds[1] || isOwnProfile,
      refetchOnMountOrArgChange: true,
    }
  )
  const achievement2 = isOwnProfile ? achievement2Detail : achievement2Basic

  const achievement3Detail = useGetAchievementDetailQuery(pinnedIds[2] || '', {
    skip: !pinnedIds[2] || !isOwnProfile,
    refetchOnMountOrArgChange: true,
  })
  const achievement3Basic = useGetAchievementByIdQuery(
    { id: pinnedIds[2] || '', forUserId: !isOwnProfile ? user.id : undefined },
    {
      skip: !pinnedIds[2] || isOwnProfile,
      refetchOnMountOrArgChange: true,
    }
  )
  const achievement3 = isOwnProfile ? achievement3Detail : achievement3Basic

  const pinnedAchievements = useMemo(() => {
    const achievements: (TrophyData | null)[] = []
    const achievementData = [achievement1.data, achievement2.data, achievement3.data]

    for (let i = 0; i < 3; i++) {
      const achievementId = pinnedIds[i]
      const achievement = achievementData[i]

      // Проверяем, что ID есть, данные загружены и ID совпадает
      if (achievementId && achievement && achievement.id === achievementId) {
        // Для своего профиля проверяем completion_date и is_hidden
        if (isOwnProfile) {
          const detailAchievement = achievement as any
          if (
            detailAchievement.userAchievement?.completion_date &&
            !detailAchievement.userAchievement?.is_hidden
          ) {
            achievements.push({
              id: achievement.id,
              title: achievement.title,
              icon: achievement.icon_url || null,
              rarity: achievement.rarity.toUpperCase() as Rarity,
              categoryId: achievement.category.id,
            })
          } else {
            achievements.push(null)
          }
        } else {
          // Для чужих профилей просто показываем достижение, если оно есть
          // Данные уже отфильтрованы на бэкенде при получении профиля
          achievements.push({
            id: achievement.id,
            title: achievement.title,
            icon: achievement.icon_url || null,
            rarity: achievement.rarity.toUpperCase() as Rarity,
            categoryId: achievement.category.id,
          })
        }
      } else {
        achievements.push(null)
      }
    }

    return achievements
  }, [pinnedIds, achievement1.data, achievement2.data, achievement3.data, isOwnProfile])

  const handleAddAchievement = (slotIndex: number) => {
    setSelectedSlotIndex(slotIndex)
    setModalOpen(true)
  }

  const handleSelectAchievement = async (achievementId: string) => {
    if (selectedSlotIndex === null || !isOwnProfile) return

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
    if (!isOwnProfile) return

    const currentPinned = [...(activeUser.pinned_achievements || [])]
    const newPinned = currentPinned.filter((_, index) => index !== slotIndex)

    try {
      await updateMe({ pinned_achievements: newPinned }).unwrap()
      // RTK Query автоматически обновит кэш через invalidatesTags: ['User']
      // Это обновит currentUser, который обновит pinnedIds, что обновит запросы к достижениям
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
