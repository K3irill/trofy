'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { useGetMeQuery } from '@/store/api/userApi'
import {
  useGetAchievementDetailQuery,
} from '@/store/api/achievementDetailApi'
import { renderIcon } from '@/lib/utils/iconUtils'
import Container from '@/components/Container/Container'
import { BlockLoader } from '@/components/Loader/BlockLoader'
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

export default function AchievementDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { data: currentUser } = useGetMeQuery(undefined, { skip: !isAuthenticated })
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [iconTransform, setIconTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 })

  const categoryId = params?.id as string
  const achievementId = params?.achievementId as string

  const {
    data: achievementDetail,
    isLoading,
    error,
  } = useGetAchievementDetailQuery(achievementId, { skip: !achievementId })

  // Преобразуем данные из API в формат компонентов
  const achievement = achievementDetail
    ? {
      id: achievementDetail.id,
      categoryId: achievementDetail.category.id,
      name: achievementDetail.title,
      description: achievementDetail.description,
      icon: achievementDetail.icon_url || '🏆',
      imageUrl: achievementDetail.photos?.[0]?.url,
      unlocked: achievementDetail.unlocked,
      progress: achievementDetail.unlocked ? 100 : undefined,
      maxProgress: 100,
      rarity: achievementDetail.rarity,
      xpReward: achievementDetail.xp_reward,
      completionDate: achievementDetail.userAchievement?.completion_date,
      difficulty: achievementDetail.userAchievement?.difficulty as 1 | 2 | 3 | 4 | 5 | undefined,
      impressions: achievementDetail.userAchievement?.impressions,
      photos: achievementDetail.photos?.map((p) => p.url),
      isMain: achievementDetail.userAchievement?.is_main,
      isFavorite: achievementDetail.isFavorite,
      isHidden: achievementDetail.userAchievement?.is_hidden,
      requiresVerification: false, // TODO: реализовать позже
      isVerified: undefined,
      verificationCount: undefined,
      canLike: achievementDetail.userAchievement?.can_like ?? true,
      canComment: achievementDetail.userAchievement?.can_comment ?? true,
      likesCount: achievementDetail.likesCount,
      isLiked: achievementDetail.isLiked,
      commentsCount: achievementDetail.commentsCount,
      ownerId: achievementDetail.userAchievement?.id ? currentUser?.id : undefined,
      createdAt: achievementDetail.created_at,
    }
    : null

  const isOwner = achievement?.ownerId === currentUser?.id

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

  if (isLoading) {
    return (
      <Container>
        <BlockLoader text="Загрузка достижения..." />
      </Container>
    )
  }

  if (error || !achievementDetail || !achievement) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem' }}>🔍</div>
          <div style={{ color: '#9ca3af', fontSize: '1.125rem' }}>Достижение не найдено</div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <PageContainer>
        <BackButton onClick={() => router.back()}>
          ← Назад
        </BackButton>

        <AchievementHeader>
          <AchievementIcon
            $unlocked={achievement.unlocked}
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
            {renderIcon(achievementDetail.icon_url, '🏆')}
          </AchievementIcon>
          <div>
            <AchievementTitle>{achievement.name}</AchievementTitle>
            <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {renderIcon(achievementDetail.category.icon_url, '📁')} {achievementDetail.category.name}
            </div>
          </div>
        </AchievementHeader>

        {achievementDetail && (
          <AchievementPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            icon={achievementDetail.icon_url}
            name={achievementDetail.title}
            description={achievementDetail.description}
            unlocked={achievementDetail.unlocked}
          />
        )}

        <AchievementDescription>{achievement.description}</AchievementDescription>

        {isAuthenticated && (
          <>
            {achievement.unlocked ? (
              <ContentSection>
                <AchievementVerification achievement={achievement} isOwner={isOwner} />
                <AchievementDetailView achievement={achievement} />
                <AchievementApplause achievement={achievement} isOwner={isOwner} currentUserId={currentUser?.id} userAchievementId={achievementDetail.userAchievement?.id} />
                <AchievementComments achievement={achievement} isOwner={isOwner} currentUserId={currentUser?.id} userAchievementId={achievementDetail.userAchievement?.id} />
                <AchievementActions achievement={achievement} isOwner={isOwner} userAchievementId={achievementDetail.userAchievement?.id} />
              </ContentSection>
            ) : (
              <ContentSection>
                <AchievementProgress achievement={achievement} />
                <AchievementCompletionForm achievement={achievement} achievementId={achievementId} onComplete={() => {
                  // Обновление данных после завершения
                  window.location.reload()
                }} />
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
