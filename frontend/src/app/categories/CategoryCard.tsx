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
  }>
}

interface CategoryCardProps {
  category: Category
  onClick: () => void
  isAuthenticated?: boolean
}

export const CategoryCardComponent = ({ category, onClick, isAuthenticated = false }: CategoryCardProps) => {
  const progress = category.total > 0 ? Math.round((category.unlocked / category.total) * 100) : 0
  const unlockedCount = category.achievements.filter(a => a.unlocked).length

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
        {category.achievements.slice(0, 8).map((achievement) => (
          <PreviewItem
            key={achievement.id}
            unlocked={achievement.unlocked}
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
        ))}
        {isAuthenticated && unlockedCount > 0 && (
          <PreviewItem
            unlocked={true}
            style={{ opacity: 1, transform: 'scale(1)' }}
          >
            🔒
            <AchievementCount>+{unlockedCount}</AchievementCount>
          </PreviewItem>
        )}
      </AchievementPreview>
    </CategoryCard>
  )
}
