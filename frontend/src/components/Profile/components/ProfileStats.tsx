'use client'

import { motion } from 'framer-motion'
import type { UserStats } from '@/store/api/userApi'
import {
  StatsSection,
  SectionTitle,
  Stats,
  StatItem,
  StatValue,
  StatLabel,
} from '../styled'

interface ProfileStatsProps {
  isAuthenticated: boolean
  stats?: UserStats
}

export function ProfileStats({ isAuthenticated, stats }: ProfileStatsProps) {
  return (
    <StatsSection>
      <SectionTitle>📊 Статистика</SectionTitle>
      <Stats>
        <StatItem>
          <StatValue
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.8 }}
          >
            {isAuthenticated && stats ? stats.total_achievements : '?'}
          </StatValue>
          <StatLabel>Всего</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.8 }}
          >
            {isAuthenticated && stats ? stats.achievements_by_rarity.rare : '?'}
          </StatValue>
          <StatLabel>Редких</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.8 }}
          >
            {isAuthenticated && stats ? stats.achievements_by_rarity.epic : '?'}
          </StatValue>
          <StatLabel>Эпических</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.8 }}
          >
            {isAuthenticated && stats ? `${stats.uniqueness_score}%` : '?'}
          </StatValue>
          <StatLabel>Уникальность</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.8 }}
          >
            {isAuthenticated && stats ? `+${stats.growth_rate}` : '?'}
          </StatValue>
          <StatLabel>Темп роста</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.8 }}
          >
            {isAuthenticated && stats && stats.fastest_achievement
              ? `${stats.fastest_achievement.days}д`
              : '?'}
          </StatValue>
          <StatLabel>Рекорд</StatLabel>
        </StatItem>
      </Stats>
    </StatsSection>
  )
}
