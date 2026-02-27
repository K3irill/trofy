'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { UserAchievement } from '@/store/api/userApi'
import {
  MainAchievementContainer,
  MainAchievementTiltWrapper,
  MainAchievementIcon,
  MainAchievementTitle,
  MainAchievementGlow,
} from '../styled'

interface MainAchievementProps {
  achievement: UserAchievement
  username: string
}

export function MainAchievement({ achievement, username }: MainAchievementProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    router.push(`/user/${username}/achievements/${achievement.category.id}/${achievement.id}`)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return '#FFD700'
      case 'epic':
        return '#9D4EDD'
      case 'rare':
        return '#4A90E2'
      default:
        return '#6B7280'
    }
  }

  const rarityColor = getRarityColor(achievement.rarity)

  return (
    <MainAchievementContainer 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MainAchievementGlow $rarityColor={rarityColor} />
      <MainAchievementTiltWrapper>
        <MainAchievementIcon
          $iconUrl={achievement.icon_url}
          $rarityColor={rarityColor}
          animate={{
            y: [0, -15, 0, 15, 0],
            x: [0, 10, 0, -10, 0],
            rotate: [0, 5, -5, 5, 0],
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{
            y: {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            x: {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            scale: {
              duration: 0.3,
            },
          }}
        >
          {achievement.icon_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                achievement.icon_url.startsWith('http')
                  ? achievement.icon_url
                  : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${achievement.icon_url}`
              }
              alt={achievement.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <span style={{ fontSize: '4rem' }}>🏆</span>
          )}
        </MainAchievementIcon>
        <MainAchievementTitle
          initial={false}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.2 }}
          $isVisible={isHovered}
        >
          {achievement.title}
        </MainAchievementTitle>
      </MainAchievementTiltWrapper>
    </MainAchievementContainer>
  )
}
