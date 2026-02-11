'use client'

import { motion } from 'framer-motion'
import { IoAddCircleOutline } from 'react-icons/io5'
import {
  CurrentGoalsSection,
  SectionTitle,
  GoalItem,
  GoalHeader,
  GoalIcon,
  GoalContent,
  GoalTitle,
  GoalProgress,
  GoalBar,
  GoalProgressBar,
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

interface PriorityAchievementsProps {
  isAuthenticated: boolean
  priorityAchievements: (TrophyData | null)[]
  onAdd: (index: number) => void
  onRemove: (index: number) => void
}

export function PriorityAchievements({
  isAuthenticated,
  priorityAchievements,
  onAdd,
  onRemove,
}: PriorityAchievementsProps) {
  return (
    <CurrentGoalsSection>
      <SectionTitle>📈 Сейчас в приоритете</SectionTitle>
      {isAuthenticated ? (
        priorityAchievements.map((achievement, index) => (
          <div key={index}>
            {achievement ? (
              <GoalItem
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                onClick={() => onRemove(index)}
                style={{ cursor: 'pointer' }}
                title="Нажмите, чтобы убрать из приоритета"
              >
                <GoalHeader>
                  <GoalIcon>
                    {achievement.icon.startsWith('http') || achievement.icon.startsWith('/') ? (
                      <img src={achievement.icon} alt={achievement.title} />
                    ) : (
                      achievement.icon
                    )}
                  </GoalIcon>
                  <GoalContent>
                    <GoalHeader style={{ marginBottom: 0 }}>
                      <GoalTitle>{achievement.title}</GoalTitle>
                      <GoalProgress>0%</GoalProgress>
                    </GoalHeader>
                    <GoalBar>
                      <GoalProgressBar
                        initial={{ width: 0 }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 1, delay: 1.3 + index * 0.1 }}
                      />
                    </GoalBar>
                  </GoalContent>
                </GoalHeader>
              </GoalItem>
            ) : (
              <AddTrophyButton
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAdd(index)}
                transition={{ delay: 1.2 + index * 0.1 }}
                style={{ minHeight: '80px', marginBottom: '0.75rem' }}
              >
                <AddTrophyIcon>
                  <IoAddCircleOutline />
                </AddTrophyIcon>
                <AddTrophyText>Добавить в приоритет</AddTrophyText>
              </AddTrophyButton>
            )}
          </div>
        ))
      ) : (
        <GoalItem
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GoalHeader>
            <GoalTitle>?</GoalTitle>
            <GoalProgress>?</GoalProgress>
          </GoalHeader>
          <GoalBar>
            <GoalProgressBar
              initial={{ width: 0 }}
              animate={{ width: 0 }}
              transition={{ duration: 0 }}
            />
          </GoalBar>
        </GoalItem>
      )}
    </CurrentGoalsSection>
  )
}
