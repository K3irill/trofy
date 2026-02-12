'use client'

import { useRef, useState } from 'react'
import { IoTimeOutline, IoCheckmarkCircle } from 'react-icons/io5'
import { AchievementCardContainer, AchievementIcon, AchievementInfo, AchievementName, AchievementStatus, StatusBadge } from './AchievementCard.styled'
import { renderIcon } from '@/lib/utils/iconUtils'

interface AchievementCardProps {
  achievement: {
    id: string
    icon: string
    unlocked: boolean
    name?: string
    description?: string
    progress?: number
    completion_date?: string
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

  const isCompleted = !!achievement.completion_date
  const isInProgress = achievement.unlocked && !isCompleted && (achievement.progress || 0) > 0
  const status = isCompleted ? 'completed' : isInProgress ? 'in_progress' : achievement.unlocked ? 'unlocked' : 'locked'

  return (
    <AchievementCardContainer
      ref={cardRef}
      $status={status}
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
      <AchievementIcon $status={status}>
        {renderIcon(achievement.icon, 'trophy')}
        {isCompleted && (
          <StatusBadge $status="completed">
            <IoCheckmarkCircle />
          </StatusBadge>
        )}
        {isInProgress && (
          <StatusBadge $status="in_progress">
            <IoTimeOutline />
          </StatusBadge>
        )}
      </AchievementIcon>
      <AchievementInfo>
        {achievement.name && <AchievementName>{achievement.name}</AchievementName>}
        <AchievementStatus $status={status}>
          {isCompleted ? 'Завершено' : isInProgress ? `В работе ${achievement.progress}%` : achievement.unlocked ? 'Открыто' : 'Не открыто'}
        </AchievementStatus>
      </AchievementInfo>
    </AchievementCardContainer>
  )
}
