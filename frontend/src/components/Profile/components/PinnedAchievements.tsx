'use client'

import { motion } from 'framer-motion'
import { IoAddCircleOutline } from 'react-icons/io5'
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
} from '../styled'

interface TrophyData {
  id: string
  title: string
  icon: string
  rarity: string
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
  if (!isAuthenticated) return null

  return (
    <RareTrophiesSection>
      <SectionTitle>🏆 Закрепленные достижения</SectionTitle>
      <RareTrophiesGrid>
        {pinnedAchievements.map((trophy, index) => (
          <div key={index}>
            {trophy ? (
              <TrophyCard
                isNew={false}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotateY: 15 }}
                onClick={() => onRemove(index)}
                transition={{ delay: 0.9 + index * 0.1 }}
                title="Нажмите, чтобы открепить"
              >
                <TrophyIcon rarity={trophy.rarity.toLowerCase()}>
                  {trophy.icon}
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
