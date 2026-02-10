'use client'

import { useRef, useState } from 'react'
import { AchievementCardContainer, AchievementIcon, AchievementInfo, AchievementName, AchievementStatus, UnlockedBadge } from './AchievementCard.styled'

interface AchievementCardProps {
  achievement: {
    id: string
    icon: string
    unlocked: boolean
    name?: string
    description?: string
  }
  onClick: () => void
}

export const AchievementCard = ({ achievement, onClick }: AchievementCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10

    setTransform({
      rotateX,
      rotateY,
      scale: 1.05,
    })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const touch = e.touches[0]
    const rect = cardRef.current.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10

    setTransform({
      rotateX,
      rotateY,
      scale: 1.05,
    })
  }

  const handleTouchEnd = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 })
  }

  return (
    <AchievementCardContainer
      ref={cardRef}
      unlocked={achievement.unlocked}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
        transformStyle: 'preserve-3d',
      }}
    >
      <AchievementIcon unlocked={achievement.unlocked}>
        {achievement.icon}
        {achievement.unlocked && <UnlockedBadge>✓</UnlockedBadge>}
      </AchievementIcon>
      <AchievementInfo>
        {achievement.name && <AchievementName>{achievement.name}</AchievementName>}
        <AchievementStatus unlocked={achievement.unlocked}>
          {achievement.unlocked ? 'Разблокировано' : 'Заблокировано'}
        </AchievementStatus>
      </AchievementInfo>
    </AchievementCardContainer>
  )
}
