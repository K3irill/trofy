'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import styled, { DefaultTheme } from 'styled-components'
import { IoTimeOutline, IoCheckmarkCircle, IoHeart, IoPerson, IoGlobe, IoCreateOutline, IoPeople, IoLockClosed } from 'react-icons/io5'
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

const AchievementCardContainer = styled(motion.div) <{ $status: AchievementStatus; rarity?: string; $isFavorite?: boolean }>`
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
    if (props.$isFavorite) return `${props.theme.colors.primary}cc`
    if (props.$status === 'not_achieved') return `${props.theme.colors.dark[600]}80`
    const rarityColor = getRarityColor(props.theme, props.rarity)
    return `${rarityColor}80`
  }};
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  opacity: 1;
  box-shadow: ${(props) => props.$isFavorite ? `0 0 20px ${props.theme.colors.primary}40, 0 0 40px ${props.theme.colors.primary}20` : 'none'};

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 16px;
  }

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
    if (props.$isFavorite) return props.theme.colors.primary
    if (props.$status === 'not_achieved') return props.theme.colors.dark[600]
    return getRarityColor(props.theme, props.rarity)
  }};
    transform: translateY(-8px);
    box-shadow: ${(props) => {
    if (props.$isFavorite) {
      return `${props.theme.shadows.glass.medium}, 0 0 30px ${props.theme.colors.primary}60, 0 0 60px ${props.theme.colors.primary}30`
    }
    return `${props.theme.shadows.glass.medium}, ${props.$status !== 'not_achieved' ? getRarityGlow(props.theme, props.rarity) : 'none'}`
  }};
  }
`

const AchievementIcon = styled.div<{ $status: AchievementStatus }>`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  overflow: visible;
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
    object-fit: cover;
    border-radius: 14px;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    font-size: 2rem;
    border-radius: 12px;

    img {
      border-radius: 10px;
    }
  }
`

const IconImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    border-radius: 10px;
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
  word-break: break-all;

  @media (max-width: 768px) {
    max-width: 80%;
    font-size: 1rem;
  }
`

const AchievementDescription = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.light[300]};
  margin-bottom: 0.75rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

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

  @media (max-width: 768px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.6875rem;
    gap: 0.375rem;
  }
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

  @media (max-width: 768px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.6875rem;
    gap: 0.2rem;
  }
`

const CardContentWrapper = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  align-items: flex-start;

  @media (max-width: 768px) {
    gap: 0.75rem;
    flex-direction: column;
  }
`

const CardInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  align-items: flex-end;

  @media (max-width: 768px) {
    align-items: flex-start;
    width: 100%;
    gap: 0.375rem;
  }
`

const BadgesContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.375rem;
    width: 100%;
    justify-content: flex-start;
  }
`

const IconWrapper = styled.div<{ $transform: string }>`
  transform: ${(props) => props.$transform};
  transform-style: preserve-3d;
  flex-shrink: 0;
  position: relative;
  overflow: visible;

  @media (max-width: 768px) {
    align-self: center;
  }
`

const AchievementTypeBadge = styled.div<{ $isCustom: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: ${(props) => props.$isCustom 
    ? `linear-gradient(135deg, ${props.theme.colors.primary}33 0%, ${props.theme.colors.secondary}33 100%)`
    : `linear-gradient(135deg, ${props.theme.colors.dark[700]}e6 0%, ${props.theme.colors.dark[800]}f2 100%)`};
  border: 1px solid ${(props) => props.$isCustom 
    ? `${props.theme.colors.primary}80`
    : `${props.theme.colors.dark[600]}80`};
  border-radius: 8px;
  color: ${(props) => props.$isCustom 
    ? props.theme.colors.primary
    : props.theme.colors.light[300]};
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 10;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  svg {
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.6875rem;
    gap: 0.25rem;

    span{
      display: none;
    }

    svg {
      font-size: 0.75rem;
    }
  }
`

const AchievementEditButton = styled(motion.button)`
  position: absolute;
  top: 3.25rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => `linear-gradient(135deg, ${props.theme.colors.primary}33 0%, ${props.theme.colors.secondary}33 100%)`};
  border: 1px solid ${(props) => `${props.theme.colors.primary}80`};
  border-radius: 8px;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  z-index: 10;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.2s ease;

  svg {
    font-size: 1rem;
  }

  &:hover {
    background: ${(props) => `linear-gradient(135deg, ${props.theme.colors.primary}4d 0%, ${props.theme.colors.secondary}4d 100%)`};
    border-color: ${(props) => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;

    svg {
      font-size: 0.875rem;
    }
  }
`

const FavoriteBadge = styled.div`
  position: absolute;
  top: 3.5rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.primary}cc 100%);
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.125rem;
  border: 2px solid ${(props) => props.theme.colors.dark.bg};
  box-shadow: ${(props) => props.theme.shadows.glow.primary}, 0 0 15px ${(props) => props.theme.colors.primary}60;
  z-index: 10;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: ${(props) => props.theme.shadows.glow.primary}, 0 0 15px ${(props) => props.theme.colors.primary}60;
    }
    50% {
      transform: scale(1.1);
      box-shadow: ${(props) => props.theme.shadows.glow.primary}, 0 0 25px ${(props) => props.theme.colors.primary}80;
    }
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 1rem;
    top: 0.75rem;
    right: 0.75rem;
  }
`

const CreatorInfo = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`

const CreatorLink = styled(Link)`
  color: rgba(0, 212, 255, 0.9);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: rgba(0, 212, 255, 1);
  }
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
  currentUserId?: string
  onEdit?: (achievement: Achievement) => void
}

export const AchievementCard = ({ achievement, onClick, currentUserId, onEdit }: AchievementCardProps) => {
  const [iconTransform, setIconTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 })

  // Определяем статус достижения
  // Для неавторизованных пользователей progress будет undefined
  const isAchieved = !!achievement.completion_date
  const progress = achievement.progress ?? undefined
  const isInProgress = !isAchieved && progress !== undefined && progress > 0 && progress <= 100
  const status: AchievementStatus = isAchieved
    ? 'achieved'
    : isInProgress
      ? 'in_progress'
      : 'not_achieved'
  
  const isCustom = achievement.is_custom || false
  const isOwner = currentUserId && achievement.creator_id === currentUserId
  // "Мои" - только если это кастомное и создано текущим пользователем
  // "Пользовательские" - если это кастомное, но создано другим пользователем
  const isMyCustom = isCustom && isOwner
  const isOtherCustom = isCustom && !isOwner

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
      $isFavorite={achievement.is_favorite}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {(isMyCustom || isOtherCustom || !isCustom) && (
        <AchievementTypeBadge $isCustom={isMyCustom || isOtherCustom}>
          {isMyCustom ? <IoPerson /> : isOtherCustom ? <IoPeople /> : <IoGlobe />}
          {isMyCustom && <span>Моя</span>}
          {isOtherCustom && <span>Пользовательская</span>}
          {!isCustom && <span>Глобальная</span>}
        </AchievementTypeBadge>
      )}
      {isOwner && onEdit && (
        <AchievementEditButton
          onClick={(e) => {
            e.stopPropagation()
            onEdit(achievement)
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoCreateOutline />
        </AchievementEditButton>
      )}
      {achievement.is_favorite && (
        <FavoriteBadge>
          <IoHeart />
        </FavoriteBadge>
      )}
      {achievement.is_public === false && (
        <AchievementTypeBadge $isCustom={false} style={{ 
          top: achievement.is_favorite ? '5.5rem' : '3.5rem', 
          right: '1rem', 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)', 
          border: '1px solid rgba(239, 68, 68, 0.4)', 
          color: '#ef4444',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.9
        }}>
          <IoLockClosed />
          <span>Приватное</span>
        </AchievementTypeBadge>
      )}
      <AchievementName>{achievement.name}</AchievementName>
      {achievement.creator_username && !isOwner && (
        <CreatorInfo>
          <span>Создатель:</span>
          <CreatorLink 
            href={`/user/${achievement.creator_username}`}
            onClick={(e) => e.stopPropagation()}
          >
            {achievement.creator_username}
          </CreatorLink>
        </CreatorInfo>
      )}
      {achievement.description && (
        <AchievementDescription>{achievement.description}</AchievementDescription>
      )}
      <CardContentWrapper>
        <IconWrapper
          $transform={`perspective(1000px) rotateX(${iconTransform.rotateX}deg) rotateY(${iconTransform.rotateY}deg) scale(${iconTransform.scale})`}
        >
          <AchievementIcon
            $status={status}
            onMouseMove={handleIconMouseMove}
            onMouseLeave={handleIconMouseLeave}
            onTouchMove={handleIconTouchMove}
            onTouchEnd={handleIconTouchEnd}
          >
            <IconImageWrapper>
              {renderIcon(achievement.icon, 'trophy')}
            </IconImageWrapper>
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
        </IconWrapper>
        <CardInfoWrapper>
          <AchievementStatus $status={status}>
            {isAchieved
              ? 'Достигнуто'
              : isInProgress && progress !== undefined
                ? `В работе ${progress}%`
                : 'Не достигнуто'}
          </AchievementStatus>
          <BadgesContainer>
            <AchievementCategory>
              <span>{achievement.categoryName}</span>
            </AchievementCategory>
            <RarityBadge rarity={achievement.rarity}>
              {getRarityLabel(achievement.rarity)}
            </RarityBadge>
          </BadgesContainer>
        </CardInfoWrapper>
      </CardContentWrapper>
    </AchievementCardContainer>
  )
}
