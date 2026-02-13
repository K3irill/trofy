'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import styled, { DefaultTheme } from 'styled-components'
import { IoTimeOutline, IoCheckmarkCircle } from 'react-icons/io5'
import { Achievement } from './api'
import { renderIcon } from '@/lib/utils/iconUtils'

type AchievementStatus = 'not_achieved' | 'in_progress' | 'achieved'

const getRarityColor = (theme: DefaultTheme, rarity?: string) => {
  if (!rarity) return theme.colors.dark[600]
  const rarityColors = theme.colors.rarity
  switch (rarity) {
    case 'common':
      return rarityColors.base || theme.colors.light[300]
    case 'rare':
      return rarityColors.rare
    case 'epic':
      return rarityColors.epic
    case 'legendary':
      return rarityColors.legendary
    default:
      return theme.colors.dark[600]
  }
}

const getRarityGlow = (theme: DefaultTheme, rarity?: string) => {
  if (!rarity) return 'none'
  const rarityColor = getRarityColor(theme, rarity)
  return `0 0 20px ${rarityColor}40, 0 0 40px ${rarityColor}20`
}

const AchievementCardContainer = styled(motion.div) <{ $status: AchievementStatus; rarity?: string }>`
  background: linear-gradient(
    145deg,
    ${(props) => props.theme.colors.dark[700]}e6 0%,
    ${(props) => props.theme.colors.dark[800]}f2 100%
  );
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 2px solid
    ${(props) => {
    if (props.$status === 'not_achieved') return `${props.theme.colors.dark[600]}80`
    const rarityColor = getRarityColor(props.theme, props.rarity)
    return `${rarityColor}80`
  }};
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  opacity: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${(props) => {
    if (props.$status === 'not_achieved') return props.theme.colors.dark[600]
    const rarityColor = getRarityColor(props.theme, props.rarity)
    return rarityColor
  }} 0%,
      ${(props) => {
    if (props.$status === 'not_achieved') return props.theme.colors.dark[600]
    const rarityColor = getRarityColor(props.theme, props.rarity)
    return `${rarityColor}cc`
  }} 100%
    );
    transform: scaleX(${(props) => (props.$status !== 'not_achieved' ? 1 : 0)});
    transition: transform 0.4s ease;
  }

  &:hover {
    border-color: ${(props) => {
    if (props.$status === 'not_achieved') return props.theme.colors.dark[600]
    return getRarityColor(props.theme, props.rarity)
  }};
    transform: translateY(-8px);
    box-shadow: ${(props) => props.theme.shadows.glass.medium},
      ${(props) => (props.$status !== 'not_achieved' ? getRarityGlow(props.theme, props.rarity) : 'none')};
  }
`

const AchievementIcon = styled.div<{ $status: AchievementStatus }>`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: ${(props) => {
    if (props.$status === 'achieved') return `linear-gradient(135deg, ${props.theme.colors.success}33 0%, ${props.theme.colors.success}1a 100%)`
    if (props.$status === 'in_progress') return `linear-gradient(135deg, #ffa50033 0%, #ff8c001a 100%)`
    return `linear-gradient(135deg, ${props.theme.colors.dark[600]}80 0%, ${props.theme.colors.dark[700]}b3 100%)`
  }};
  border: 2px solid ${(props) => {
    if (props.$status === 'achieved') return `${props.theme.colors.success}80`
    if (props.$status === 'in_progress') return `#ffa50080`
    return `${props.theme.colors.dark[600]}80`
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  position: relative;
  transition: all 0.3s ease;
  filter: ${(props) => (props.$status === 'not_achieved' ? 'grayscale(0.6) brightness(0.7)' : 'none')};
  cursor: pointer;
  transform-style: preserve-3d;
  box-shadow: ${(props) => (props.$status !== 'not_achieved' ? props.theme.shadows.glow.primary : 'none')};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

const StatusBadge = styled.div<{ $status: 'achieved' | 'in_progress' }>`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  border: 2px solid ${(props) => props.theme.colors.dark.bg};
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
  transform: translateZ(30px);

  ${(props) =>
    props.$status === 'achieved' &&
    `
    background: linear-gradient(135deg, ${props.theme.colors.success} 0%, ${props.theme.colors.success}CC 100%);
    color: ${props.theme.colors.dark.bg};
  `}

  ${(props) =>
    props.$status === 'in_progress' &&
    `
    background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%);
    color: ${props.theme.colors.dark.bg};
  `}

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
    top: -6px;
    right: -6px;
  }
`

const AchievementStatus = styled.span<{ $status: AchievementStatus }>`
  font-size: 0.75rem;
  color: ${(props) => {
    if (props.$status === 'achieved') return props.theme.colors.success
    if (props.$status === 'in_progress') return '#ffa500'
    return props.theme.colors.light[300]
  }};
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
  }
`

const AchievementName = styled.h3`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.light[100]};
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

const AchievementDescription = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.light[300]};
  margin-bottom: 0.75rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.775rem;
  }
`

const AchievementCategory = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(props) => `${props.theme.colors.primary}1a`};
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.primary};
  border: 1px solid ${(props) => `${props.theme.colors.primary}33`};
`

const RarityBadge = styled.div<{ rarity?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: ${(props) => {
    if (!props.rarity) return `${props.theme.colors.dark[600]}80`
    const rarityColor = getRarityColor(props.theme, props.rarity)
    return `${rarityColor}1a`
  }};
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => {
    if (!props.rarity) return props.theme.colors.light[300]
    return getRarityColor(props.theme, props.rarity)
  }};
  border: 1px solid ${(props) => {
    if (!props.rarity) return `${props.theme.colors.dark[600]}33`
    const rarityColor = getRarityColor(props.theme, props.rarity)
    return `${rarityColor}33`
  }};
  text-transform: capitalize;
  box-shadow: ${(props) => {
    if (!props.rarity) return 'none'
    const rarityColor = getRarityColor(props.theme, props.rarity)
    return `0 0 8px ${rarityColor}20`
  }};
`

const getRarityLabel = (rarity?: string) => {
  switch (rarity) {
    case 'common':
      return 'Обычное'
    case 'rare':
      return 'Редкое'
    case 'epic':
      return 'Эпическое'
    case 'legendary':
      return 'Легендарное'
    default:
      return 'Обычное'
  }
}

interface AchievementCardProps {
  achievement: Achievement
  onClick?: () => void
}

export const AchievementCard = ({ achievement, onClick }: AchievementCardProps) => {
  const [iconTransform, setIconTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 })

  // Определяем статус достижения
  const isAchieved = !!achievement.completion_date
  const progress = achievement.progress || 0
  const isInProgress = !isAchieved && progress > 0 && progress <= 100
  const status: AchievementStatus = isAchieved
    ? 'achieved'
    : isInProgress
      ? 'in_progress'
      : 'not_achieved'

  const handleIconMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -15
    const rotateY = ((x - centerX) / centerX) * 15

    setIconTransform({
      rotateX,
      rotateY,
      scale: 1.05,
    })
  }

  const handleIconMouseLeave = () => {
    setIconTransform({ rotateX: 0, rotateY: 0, scale: 1 })
  }

  const handleIconTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -15
    const rotateY = ((x - centerX) / centerX) * 15

    setIconTransform({
      rotateX,
      rotateY,
      scale: 1.05,
    })
  }

  const handleIconTouchEnd = () => {
    setIconTransform({ rotateX: 0, rotateY: 0, scale: 1 })
  }

  return (
    <AchievementCardContainer
      $status={status}
      rarity={achievement.rarity}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <AchievementName>{achievement.name}</AchievementName>
      {achievement.description && (
        <AchievementDescription>{achievement.description}</AchievementDescription>
      )}
      <div style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'flex-start' }}>
        <AchievementIcon
          $status={status}
          onMouseMove={handleIconMouseMove}
          onMouseLeave={handleIconMouseLeave}
          onTouchMove={handleIconTouchMove}
          onTouchEnd={handleIconTouchEnd}
          style={{
            transform: `perspective(1000px) rotateX(${iconTransform.rotateX}deg) rotateY(${iconTransform.rotateY}deg) scale(${iconTransform.scale})`,
            transformStyle: 'preserve-3d',
            flexShrink: 0,
          }}
        >
          {renderIcon(achievement.icon, 'trophy')}
          {isAchieved && (
            <StatusBadge $status="achieved">
              <IoCheckmarkCircle />
            </StatusBadge>
          )}
          {isInProgress && (
            <StatusBadge $status="in_progress">
              <IoTimeOutline />
            </StatusBadge>
          )}
        </AchievementIcon>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, alignItems: 'flex-end' }}>
          <AchievementStatus $status={status}>
            {isAchieved
              ? 'Достигнуто'
              : isInProgress
                ? `В работе ${achievement.progress}%`
                : 'Не достигнуто'}
          </AchievementStatus>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
            <AchievementCategory>
              <span>{achievement.categoryName}</span>
            </AchievementCategory>
            <RarityBadge rarity={achievement.rarity}>
              {getRarityLabel(achievement.rarity)}
            </RarityBadge>
          </div>
        </div>
      </div>
    </AchievementCardContainer>
  )
}
