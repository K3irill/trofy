'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Container from '@/components/Container/Container'
import { categories } from '../../page.constants'
import { AchievementDetail } from './types'
import { AchievementDetailView } from './AchievementDetailView'
import { AchievementActions } from './AchievementActions'
import { AchievementProgress } from './AchievementProgress'
import { AchievementCompletionForm } from './AchievementCompletionForm'
import { AchievementVerification } from './AchievementVerification'
import { AchievementApplause } from './AchievementApplause'
import { AchievementComments } from './AchievementComments'
import { AchievementPreviewModal } from './AchievementPreviewModal'
import {
  PageContainer,
  BackButton,
  AchievementHeader,
  AchievementIcon,
  AchievementTitle,
  AchievementDescription,
  ContentSection,
} from './page.styled'

// Мок данных для демонстрации
const getAchievementData = (categoryId: string, achievementId: string, isAuthenticated: boolean = false): AchievementDetail | null => {
  const category = categories.find(cat => cat.id === categoryId)
  if (!category) return null

  const achievement = category.achievements.find(ach => ach.id === achievementId)
  if (!achievement) return null

  // Для демонстрации создаем полные данные
  const requiresVerification = achievement.id === '1' || achievement.id === '9' // Пример: некоторые достижения требуют подтверждения

  return {
    id: achievement.id,
    categoryId: category.id,
    name: achievement.name || `Достижение ${achievement.id}`,
    description: achievement.description || 'Описание достижения',
    icon: achievement.icon,
    imageUrl: achievement.imageUrl,
    unlocked: achievement.unlocked,
    progress: achievement.unlocked ? 100 : (isAuthenticated ? 45 : undefined),
    maxProgress: 100,
    rarity: achievement.unlocked ? 'rare' : 'common',
    xpReward: achievement.unlocked ? 150 : 100,
    completionDate: achievement.unlocked ? '2024-01-15' : undefined,
    difficulty: achievement.unlocked ? 3 : undefined,
    impressions: achievement.unlocked ? 'Это было незабываемое впечатление!' : undefined,
    photos: achievement.unlocked ? ['/photo1.jpg', '/photo2.jpg'] : undefined,
    isMain: achievement.unlocked ? false : undefined,
    isFavorite: achievement.unlocked ? true : undefined,
    isHidden: false,
    requiresVerification: requiresVerification && achievement.unlocked,
    isVerified: achievement.unlocked && achievement.id === '1' ? true : (achievement.unlocked && achievement.id === '9' ? false : undefined),
    verificationCount: achievement.unlocked && requiresVerification ? (achievement.id === '1' ? 5 : 2) : undefined,
    canLike: true,
    canComment: true,
    likesCount: achievement.unlocked ? 12 : undefined,
    isLiked: achievement.unlocked ? false : undefined,
    commentsCount: achievement.unlocked ? 3 : undefined,
    ownerId: 'current-user',
    createdAt: '2024-01-01',
  }
}

export default function AchievementDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [isAuthenticated] = useState(true) // В реальном приложении получать из контекста/состояния
  const [currentUserId] = useState('current-user') // В реальном приложении получать из контекста/состояния
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [iconTransform, setIconTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 })

  const categoryId = params?.id as string
  const achievementId = params?.achievementId as string

  const achievement = getAchievementData(categoryId, achievementId, isAuthenticated)
  const isOwner = achievement?.ownerId === currentUserId

  const handleIconMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!achievement) return

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
    if (!achievement) return

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

  if (!achievement) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem' }}>🔍</div>
          <div style={{ color: '#9ca3af', fontSize: '1.125rem' }}>Достижение не найдено</div>
        </div>
      </Container>
    )
  }

  const category = categories.find(cat => cat.id === categoryId)

  return (
    <Container>
      <PageContainer>
        <BackButton onClick={() => router.back()}>
          ← Назад
        </BackButton>

        <AchievementHeader>
          <AchievementIcon
            unlocked={achievement.unlocked}
            onClick={() => setIsPreviewOpen(true)}
            onMouseMove={handleIconMouseMove}
            onMouseLeave={handleIconMouseLeave}
            onTouchMove={handleIconTouchMove}
            onTouchEnd={handleIconTouchEnd}
            style={{
              transform: `perspective(1000px) rotateX(${iconTransform.rotateX}deg) rotateY(${iconTransform.rotateY}deg) scale(${iconTransform.scale})`,
              transformStyle: 'preserve-3d',
            }}
          >
            {achievement.icon}
          </AchievementIcon>
          <div>
            <AchievementTitle>{achievement.name}</AchievementTitle>
            {category && (
              <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {category.icon} {category.name}
              </div>
            )}
          </div>
        </AchievementHeader>

        {achievement && (
          <AchievementPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            icon={achievement.icon}
            imageUrl={achievement.imageUrl}
            name={achievement.name}
            description={achievement.description}
            unlocked={achievement.unlocked}
          />
        )}

        <AchievementDescription>{achievement.description}</AchievementDescription>

        {isAuthenticated && (
          <>
            {achievement.unlocked ? (
              <ContentSection>
                <AchievementVerification achievement={achievement} isOwner={isOwner} />
                <AchievementDetailView achievement={achievement} />
                <AchievementApplause achievement={achievement} isOwner={isOwner} currentUserId={currentUserId} />
                <AchievementComments achievement={achievement} isOwner={isOwner} currentUserId={currentUserId} />
                <AchievementActions achievement={achievement} isOwner={isOwner} />
              </ContentSection>
            ) : (
              <ContentSection>
                <AchievementProgress achievement={achievement} />
                <AchievementCompletionForm achievement={achievement} />
                <AchievementActions achievement={achievement} />
              </ContentSection>
            )}
          </>
        )}

        {!isAuthenticated && (
          <ContentSection>
            <div style={{
              background: 'linear-gradient(145deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '2px solid rgba(55, 65, 81, 0.5)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <div style={{ color: '#f3f4f6', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Войдите, чтобы увидеть прогресс
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Зарегистрируйтесь или войдите, чтобы отслеживать прогресс и выполнять достижения
              </div>
            </div>
          </ContentSection>
        )}
      </PageContainer>
    </Container>
  )
}
