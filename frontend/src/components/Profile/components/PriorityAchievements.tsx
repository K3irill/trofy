'use client'

import { useRouter } from 'next/navigation'
import { IoAddCircleOutline, IoClose, IoFlag } from 'react-icons/io5'
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
  AddGoalButton,
  AddTrophyIcon,
  AddTrophyText,
  RemoveButton,
  CurrentGoals,
} from '../styled'
import { renderIcon } from '@/lib/utils/iconUtils'

interface TrophyData {
  id: string
  title: string
  icon: string
  rarity: string
  categoryId: string
  progress?: number
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
  const router = useRouter()

  const handleAchievementClick = (achievement: TrophyData) => {
    router.push(`/categories/${achievement.categoryId}/${achievement.id}`)
  }

  const handleRemoveClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    onRemove(index)
  }

  return (
    <CurrentGoalsSection>
      <SectionTitle>
        <IoFlag style={{ fontSize: '1.25rem' }} />
        Сейчас в приоритете
      </SectionTitle>
      <CurrentGoals>
        {isAuthenticated ? (
          priorityAchievements.map((achievement, index) => (
            <div key={index}>
              {achievement ? (
                <GoalItem
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  onClick={() => handleAchievementClick(achievement)}
                  style={{ cursor: 'pointer', position: 'relative' }}
                  title="Нажмите, чтобы открыть детали достижения"
                  $isComplete={(achievement.progress || 0) >= 100}
                >
                  <RemoveButton
                    onClick={(e) => handleRemoveClick(e, index)}
                    title="Убрать из приоритета"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IoClose />
                  </RemoveButton>
                  <GoalHeader>
                    <GoalIcon>
                      {renderIcon(achievement.icon, '🏆')}
                    </GoalIcon>
                    <GoalContent>
                      <GoalHeader style={{ marginBottom: 0 }}>
                        <GoalTitle>{achievement.title}</GoalTitle>
                        <GoalProgress $isComplete={(achievement.progress || 0) >= 100}>
                          {achievement.progress || 0}%
                        </GoalProgress>
                      </GoalHeader>
                      <GoalBar>
                        <GoalProgressBar
                          initial={{ width: 0 }}
                          animate={{ width: `${achievement.progress || 0}%` }}
                          transition={{ duration: 1, delay: 1.3 + index * 0.1 }}
                          $isComplete={(achievement.progress || 0) >= 100}
                        />
                      </GoalBar>
                    </GoalContent>
                  </GoalHeader>
                </GoalItem>
              ) : (
                <AddGoalButton
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAdd(index)}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <AddTrophyIcon>
                    <IoAddCircleOutline />
                  </AddTrophyIcon>
                  <AddTrophyText>Добавить в приоритет</AddTrophyText>
                </AddGoalButton>
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
      </CurrentGoals>
    </CurrentGoalsSection>
  )
}
