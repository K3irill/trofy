'use client'

import {
  CategoryCard,
  CategoryIcon,
  CategoryName,
  CategoryStats,
  StatItem,
  StatLabel,
  StatValue,
  ProgressRing,
  AchievementPreview,
  PreviewItem,
  AchievementCount,
} from './page.styled'
import { isImageUrl } from '@/lib/utils/iconUtils'

export interface Category {
  id: string
  name: string
  icon: string
  total: number
  unlocked: number
  achievements: Array<{
    id: string
    icon: string
    unlocked: boolean
    progress?: number
    completion_date?: string
  }>
}

interface CategoryCardProps {
  category: Category
  onClick: () => void
  isAuthenticated?: boolean
}

export const CategoryCardComponent = ({ category, onClick, isAuthenticated = false }: CategoryCardProps) => {
  const progress = category.total > 0 ? Math.round((category.unlocked / category.total) * 100) : 0
  const previewAchievements = category.achievements.slice(0, 8)
  const hasMoreAchievements = category.achievements.length > 8
  const remainingCount = category.total - previewAchievements.length

  return (
    <CategoryCard
      onClick={onClick}
      style={{ opacity: 1, transform: 'translateY(0)' }}
    >
      {isAuthenticated && <ProgressRing progress={progress} />}
      <CategoryIcon>
        {isImageUrl(category.icon) ? (
          <img
            src={category.icon}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          category.icon
        )}
      </CategoryIcon>
      <CategoryName>{category.name}</CategoryName>
      {isAuthenticated ? (
        <CategoryStats>
          <StatItem>
            <StatLabel>Доступно:</StatLabel>
            <StatValue>{category.unlocked}/{category.total}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Прогресс:</StatLabel>
            <StatValue>{progress}%</StatValue>
          </StatItem>
        </CategoryStats>
      ) : (
        <CategoryStats>
          <StatItem>
            <StatLabel>Всего достижений:</StatLabel>
            <StatValue>{category.total}</StatValue>
          </StatItem>
        </CategoryStats>
      )}
      <AchievementPreview>
        {previewAchievements.map((achievement) => {
          // Определяем статус на основе доступных данных
          // Если есть progress и completion_date, используем их, иначе только unlocked
          const status: 'not_achieved' | 'in_progress' | 'achieved' =
            achievement.completion_date
              ? 'achieved'
              : (achievement.progress || 0) > 0 && (achievement.progress || 0) <= 100
                ? 'in_progress'
                : 'not_achieved'

          return (
            <PreviewItem
              key={achievement.id}
              $status={status}
              style={{ opacity: 1, transform: 'scale(1)' }}
            >
              {isImageUrl(achievement.icon) ? (
                <img
                  src={achievement.icon}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                achievement.icon
              )}
            </PreviewItem>
          )
        })}
        {hasMoreAchievements && remainingCount > 0 && (
          <PreviewItem
            $status="unlocked"
            style={{ opacity: 1, transform: 'scale(1)', position: 'relative' }}
          >
            <span style={{ fontSize: '1.25rem', opacity: 0.6 }}>⋯</span>
            <AchievementCount>+{remainingCount}</AchievementCount>
          </PreviewItem>
        )}
      </AchievementPreview>
    </CategoryCard>
  )
}
