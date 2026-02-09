'use client';

import { motion } from 'framer-motion';
import {
  CategoryCard,
  CategoryIcon,
  CategoryName,
  CategoryStats,
  StatItem,
  StatLabel,
  StatValue,
  ProgressRing,
  ProgressCircle,
  ProgressFill,
  ProgressText,
  AchievementPreview,
  PreviewItem,
  AchievementCount,
} from './CategoryCard.styled';

interface Category {
  id: string;
  name: string;
  icon: string;
  total: number;
  unlocked: number;
  achievements: Achievement[];
}

export const CategoryCardComponent = ({ category, onClick }: { category: Category; onClick: () => void }) => {
  const progress = Math.round((category.unlocked / category.total) * 100);

  return (
    <CategoryCard
      onClick={onClick}
      style={{ opacity: 1, transform: 'translateY(0)' }}
    >
      <ProgressRing viewBox="0 0 60 60">
        <ProgressCircle cx="30" cy="30" r="26" />
        <ProgressFill
          cx="30"
          cy="30"
          r="26"
          progress={progress}
          transform="rotate(-90)"
          transformOrigin="center"
        />
        <ProgressText x="30" y="32" textAnchor="middle">
          {progress}%
        </ProgressText>
      </ProgressRing>
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
            {achievement.unlocked && <AchievementCount>{category.achievements.filter(a => a.unlocked).length}</AchievementCount>}
          </PreviewItem>
        ))}
      </AchievementPreview>
    </CategoryCard>
  );
};
