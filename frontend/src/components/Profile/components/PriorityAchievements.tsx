'use client'

import { useRouter } from 'next/navigation'
import { IoAddCircleOutline, IoClose, IoFlag, IoEllipseOutline } from 'react-icons/io5'
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
  onAdd?: (index: number) => void
  onRemove?: (index: number) => void
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
    onRemove?.(index)
  }

  return (
    <CurrentGoalsSection>
      <SectionTitle>
        <IoFlag style={{ fontSize: '1.25rem' }} />
        Сейчас в приоритете
      </SectionTitle>
      <CurrentGoals>
        {priorityAchievements.map((achievement, index) => (
          <div key={achievement ? achievement.id : `empty-${index}`}>
            {achievement ? (
              <GoalItem
                key={achievement.id}
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleAchievementClick(achievement)}
                style={{ cursor: 'pointer', position: 'relative', opacity: 1 }}
                title="Нажмите, чтобы открыть детали достижения"
                $isComplete={(achievement.progress || 0) >= 100}
              >
                {onRemove && (
                  <RemoveButton
                    onClick={(e) => handleRemoveClick(e, index)}
                    title="Убрать из приоритета"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IoClose />
                  </RemoveButton>
                )}
                <GoalHeader>
                  <GoalIcon>
                    {renderIcon(achievement.icon, 'trophy')}
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
            ) : onAdd ? (
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
            ) : (
              <GoalItem
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                style={{ cursor: 'default', opacity: 0.5 }}
                $isComplete={false}
              >
                <GoalHeader>
                  <GoalIcon>
                    <IoEllipseOutline size={24} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                  </GoalIcon>
                  <GoalContent>
                    <GoalHeader style={{ marginBottom: 0 }}>
                      <GoalTitle style={{ opacity: 0.5 }}>Пусто</GoalTitle>
                      <GoalProgress $isComplete={false} style={{ opacity: 0.5 }}>
                        -
                      </GoalProgress>
                    </GoalHeader>
                    <GoalBar>
                      <GoalProgressBar
                        initial={{ width: 0 }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 0 }}
                        $isComplete={false}
                      />
                    </GoalBar>
                  </GoalContent>
                </GoalHeader>
              </GoalItem>
            )}
          </div>
        ))}
      </CurrentGoals>
    </CurrentGoalsSection>
  )
}
