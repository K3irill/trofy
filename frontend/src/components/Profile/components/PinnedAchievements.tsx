'use client'

import { useRouter } from 'next/navigation'
import { IoAddCircleOutline, IoClose, IoTrophy } from 'react-icons/io5'
import {
  RareTrophiesSection,
  SectionTitle,
  RareTrophiesGrid,
  TrophyCard,
  TrophyIcon,
  TrophyTitle,
  AddTrophyButton,
  AddTrophyIcon,
  AddTrophyText,
  RemoveButton,
} from '../styled'
import { renderIcon } from '@/lib/utils/iconUtils'

interface TrophyData {
  id: string
  title: string
  icon: string
  rarity: string
  categoryId: string
}

interface PinnedAchievementsProps {
  isAuthenticated: boolean
  pinnedAchievements: (TrophyData | null)[]
  onAdd: (index: number) => void
  onRemove: (index: number) => void
}

export function PinnedAchievements({
  isAuthenticated,
  pinnedAchievements,
  onAdd,
  onRemove,
}: PinnedAchievementsProps) {
  const router = useRouter()

  if (!isAuthenticated) return null

  const handleAchievementClick = (trophy: TrophyData) => {
    router.push(`/categories/${trophy.categoryId}/${trophy.id}`)
  }

  const handleRemoveClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    onRemove(index)
  }

  return (
    <RareTrophiesSection>
      <SectionTitle>
        <IoTrophy style={{ fontSize: '1.25rem' }} />
        Закрепленные достижения
      </SectionTitle>
      <RareTrophiesGrid>
        {pinnedAchievements.map((trophy, index) => (
          <div key={index}>
            {trophy ? (
              <TrophyCard
                isNew={false}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotateY: 15 }}
                onClick={() => handleAchievementClick(trophy)}
                transition={{ delay: 0.9 + index * 0.1 }}
                title="Нажмите, чтобы открыть детали достижения"
                style={{ position: 'relative' }}
              >
                <RemoveButton
                  onClick={(e) => handleRemoveClick(e, index)}
                  title="Открепить достижение"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoClose />
                </RemoveButton>
                <TrophyIcon rarity={trophy.rarity.toLowerCase()}>
                  {renderIcon(trophy.icon, '🏆')}
                </TrophyIcon>
                <TrophyTitle>{trophy.title}</TrophyTitle>
              </TrophyCard>
            ) : (
              <AddTrophyButton
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAdd(index)}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <AddTrophyIcon>
                  <IoAddCircleOutline />
                </AddTrophyIcon>
                <AddTrophyText>Добавить</AddTrophyText>
              </AddTrophyButton>
            )}
          </div>
        ))}
      </RareTrophiesGrid>
    </RareTrophiesSection>
  )
}
