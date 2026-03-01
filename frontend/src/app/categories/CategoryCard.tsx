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
import { CategoryTypeBadge, EditButton, CreatorInfo, CreatorLink, CategoryActions, LikeButton, FavoriteButton, LikesCount } from './CategoryCard.styled'
import { isImageUrl } from '@/lib/utils/iconUtils'
import { IoPerson, IoGlobe, IoCreateOutline, IoLockClosed, IoPeople, IoHeart, IoHeartOutline, IoStar, IoStarOutline } from 'react-icons/io5'
import { useToggleCategoryLikeMutation, useToggleCategoryFavoriteMutation } from '@/store/api/achievementsApi'
import { useToast } from '@/hooks/useToast'

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
  likes_count?: number
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
  isLiked?: boolean
  isFavorite?: boolean
}

export const CategoryCardComponent = ({ 
  category, 
  onClick, 
  isAuthenticated = false, 
  currentUserId,
  onEdit,
  isLiked,
  isFavorite,
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

  const [toggleLike, { isLoading: isLiking }] = useToggleCategoryLikeMutation()
  const [toggleFavorite, { isLoading: isFavoriting }] = useToggleCategoryFavoriteMutation()
  const { showToast } = useToast()

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) return
    try {
      await toggleLike({ categoryId: category.id }).unwrap()
    } catch (error) {
      showToast('Ошибка при изменении лайка', 'error')
    }
  }

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) return
    try {
      await toggleFavorite({ categoryId: category.id }).unwrap()
    } catch (error) {
      showToast('Ошибка при изменении избранного', 'error')
    }
  }

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
          top: isAuthenticated && !isOwner ? '3.5rem' : isAuthenticated ?  '5rem' : '2rem', 
          left: 'auto',
          right: '0.5rem',
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
      {isAuthenticated && (
        <CategoryActions>
          {isCustom && (
            <LikeButton
              $isLiked={!!isLiked}
              onClick={handleLike}
              disabled={isLiking}
              title={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
            >
              {isLiked ? <IoHeart /> : <IoHeartOutline />}
              {category.likes_count !== undefined && category.likes_count > 0 && (
                <LikesCount>{category.likes_count}</LikesCount>
              )}
            </LikeButton>
          )}
          <FavoriteButton
            $isFavorite={!!isFavorite}
            onClick={handleFavorite}
            disabled={isFavoriting}
            title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            {isFavorite ? <IoStar /> : <IoStarOutline />}
          </FavoriteButton>
        </CategoryActions>
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
              borderRadius: 'inherit',
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
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
                    borderRadius: '12px',
                    WebkitTransform: 'translateZ(0)',
                    transform: 'translateZ(0)',
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
