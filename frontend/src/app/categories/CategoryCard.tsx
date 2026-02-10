'use client'

import { Category } from './page.constants'
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

interface CategoryCardProps {
  category: Category
  onClick: () => void
}

export const CategoryCardComponent = ({ category, onClick }: CategoryCardProps) => {
  const progress = Math.round((category.unlocked / category.total) * 100)
  const unlockedCount = category.achievements.filter(a => a.unlocked).length

  return (
    <CategoryCard
      onClick={onClick}
      style={{ opacity: 1, transform: 'translateY(0)' }}
    >
      <ProgressRing progress={progress} />
      <CategoryIcon>{category.icon}</CategoryIcon>
      <CategoryName>{category.name}</CategoryName>
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
      <AchievementPreview>
        {category.achievements.slice(0, 8).map((achievement) => (
          <PreviewItem
            key={achievement.id}
            unlocked={achievement.unlocked}
            style={{ opacity: 1, transform: 'scale(1)' }}
          >
            {achievement.icon}
          </PreviewItem>
        ))}
        {unlockedCount > 0 && (
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
