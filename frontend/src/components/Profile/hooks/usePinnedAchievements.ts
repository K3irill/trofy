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

export function usePinnedAchievements(user: User) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)
  const [updateMe] = useUpdateMeMutation()

  const pinnedIds = user.pinned_achievements || []
  const achievement1 = useGetAchievementByIdQuery(pinnedIds[0] || '', { skip: !pinnedIds[0] })
  const achievement2 = useGetAchievementByIdQuery(pinnedIds[1] || '', { skip: !pinnedIds[1] })
  const achievement3 = useGetAchievementByIdQuery(pinnedIds[2] || '', { skip: !pinnedIds[2] })

  const pinnedAchievements = useMemo(() => {
    const achievements: (TrophyData | null)[] = []
    const achievementData = [achievement1.data, achievement2.data, achievement3.data]

    for (let i = 0; i < 3; i++) {
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
  }, [achievement1.data, achievement2.data, achievement3.data])

  const handleAddAchievement = (slotIndex: number) => {
    setSelectedSlotIndex(slotIndex)
    setModalOpen(true)
  }

  const handleSelectAchievement = async (achievementId: string) => {
    if (selectedSlotIndex === null) return

    const currentPinned = [...(user.pinned_achievements || [])]
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
    } catch (error) {
      console.error('Failed to update pinned achievements:', error)
    }

    setModalOpen(false)
    setSelectedSlotIndex(null)
  }

  const handleRemoveAchievement = async (slotIndex: number) => {
    const currentPinned = [...(user.pinned_achievements || [])]
    currentPinned.splice(slotIndex, 1)

    try {
      await updateMe({ pinned_achievements: currentPinned }).unwrap()
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
