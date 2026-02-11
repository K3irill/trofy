import { useState, useMemo } from 'react'
import { useGetAchievementByIdQuery } from '@/store/api/achievementsApi'
import { useUpdateMeMutation } from '@/store/api/userApi'
import type { User } from '@/types'
import { Rarity } from '@/types'

interface TrophyData {
  id: string
  title: string
  icon: string
  rarity: Rarity
}

export function usePriorityAchievements(user: User) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)
  const [updateMe] = useUpdateMeMutation()

  const priorityIds = user.priority_achievements || []
  const priorityAchievement1 = useGetAchievementByIdQuery(priorityIds[0] || '', { skip: !priorityIds[0] })
  const priorityAchievement2 = useGetAchievementByIdQuery(priorityIds[1] || '', { skip: !priorityIds[1] })

  const priorityAchievements = useMemo(() => {
    const achievements: (TrophyData | null)[] = []
    const achievementData = [priorityAchievement1.data, priorityAchievement2.data]

    for (let i = 0; i < 2; i++) {
      if (achievementData[i]) {
        achievements.push({
          id: achievementData[i]!.id,
          title: achievementData[i]!.title,
          icon: achievementData[i]!.icon_url || '🏆',
          rarity: achievementData[i]!.rarity.toUpperCase() as Rarity,
        })
      } else {
        achievements.push(null)
      }
    }

    return achievements
  }, [priorityAchievement1.data, priorityAchievement2.data])

  const handleAddAchievement = (slotIndex: number) => {
    setSelectedSlotIndex(slotIndex)
    setModalOpen(true)
  }

  const handleSelectAchievement = async (achievementId: string) => {
    if (selectedSlotIndex === null) return

    const currentPriority = [...(user.priority_achievements || [])]
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
    } catch (error) {
      console.error('Failed to update priority achievements:', error)
    }

    setModalOpen(false)
    setSelectedSlotIndex(null)
  }

  const handleRemoveAchievement = async (slotIndex: number) => {
    const currentPriority = [...(user.priority_achievements || [])]
    currentPriority.splice(slotIndex, 1)

    try {
      await updateMe({ priority_achievements: currentPriority }).unwrap()
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
