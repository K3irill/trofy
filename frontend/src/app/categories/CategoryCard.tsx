'use client'

import Link from 'next/link'
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
import { CategoryTypeBadge, EditButton, CreatorInfo, CreatorLink } from './CategoryCard.styled'
import { isImageUrl } from '@/lib/utils/iconUtils'
import { IoPerson, IoGlobe, IoCreateOutline, IoLockClosed, IoPeople } from 'react-icons/io5'

export interface Category {
  id: string
  name: string
  icon: string
  total: number
  unlocked: number
  is_custom?: boolean
  creator_id?: string
  creator_username?: string
  is_public?: boolean
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
  currentUserId?: string
  onEdit?: (category: Category) => void
}

export const CategoryCardComponent = ({ 
  category, 
  onClick, 
  isAuthenticated = false, 
  currentUserId,
  onEdit 
}: CategoryCardProps) => {
  const progress = category.total > 0 ? Math.round((category.unlocked / category.total) * 100) : 0
  const previewAchievements = category.achievements.slice(0, 8)
  const hasMoreAchievements = category.achievements.length > 8
  const remainingCount = category.total - previewAchievements.length
  const isCustom = category.is_custom || false
  const isOwner = currentUserId && category.creator_id === currentUserId
  // "Мои" - только если это кастомная и создана текущим пользователем
  // "Пользовательские" - если это кастомная, но создана другим пользователем
  const isMyCustom = isCustom && isOwner
  const isOtherCustom = isCustom && !isOwner
  const isPrivate = category.is_public === false

  return (
    <CategoryCard
      onClick={onClick}
      style={{ 
        opacity: 1, 
        transform: 'translateY(0)',
        border: isPrivate ? '2px solid rgba(239, 68, 68, 0.6)' : undefined,
        background: isPrivate 
          ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)'
          : undefined
      }}
    >
      {isAuthenticated && <ProgressRing progress={progress} />}
      <CategoryTypeBadge $isCustom={isMyCustom || isOtherCustom}>
        {isMyCustom ? <IoPerson /> : isOtherCustom ? <IoPeople /> : <IoGlobe />}
        <span>
          {isMyCustom ? 'Моя' : isOtherCustom ? 'Пользовательская' : 'Глобальная'}
        </span>
      </CategoryTypeBadge>
      {isOwner && onEdit && (
        <EditButton
          onClick={(e) => {
            e.stopPropagation()
            onEdit(category)
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoCreateOutline />
        </EditButton>
      )}
      {isPrivate && (
        <CategoryTypeBadge $isCustom={false} style={{ 
          top: isAuthenticated && !isOwner ? '3.5rem' : isAuthenticated ?  '6.5rem' : '2rem', 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)', 
          border: '1px solid rgba(239, 68, 68, 0.4)', 
          color: '#ef4444',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.9
        }}>
          <IoLockClosed />
          <span>Приватная</span>
        </CategoryTypeBadge>
      )}
      <CategoryIcon>
        {isImageUrl(category.icon) ? (
          <img
            src={category.icon}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          category.icon
        )}
      </CategoryIcon>
      <CategoryName>{category.name}</CategoryName>
      {category.creator_username && !isOwner && (
        <CreatorInfo>
          <span>Создатель:</span>
          <CreatorLink 
            href={`/user/${category.creator_username}`}
            onClick={(e) => e.stopPropagation()}
          >
            {category.creator_username}
          </CreatorLink>
        </CreatorInfo>
      )}
      {isAuthenticated ? (
        <CategoryStats>
          <StatItem>
            <StatLabel>Доступно:</StatLabel>
            <StatValue>{category.unlocked}/{category.total}</StatValue>
          </StatItem>
          <StatItem id='progress'>
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
                    objectFit: 'cover',
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
