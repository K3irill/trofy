'use client'

import { useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { useGetMeQuery } from '@/store/api/userApi'
import {
  useGetAchievementDetailQuery,
} from '@/store/api/achievementDetailApi'
import { useToast } from '@/hooks/useToast'
import { renderIcon } from '@/lib/utils/iconUtils'
import Container from '@/components/Container/Container'
import { BlockLoader } from '@/components/Loader/BlockLoader'
import { IoArrowBack, IoFolderOpen, IoLockClosed, IoSearch, IoEyeOff, IoStar, IoHeart, IoCloseCircle } from 'react-icons/io5'
import { AchievementDetailView } from './AchievementDetailView'
import { AchievementActions } from './AchievementActions'
import { AchievementProgress } from './AchievementProgress'
import { AchievementCompletionForm } from './AchievementCompletionForm'
import { StatusBadge } from './StatusBadge'
import { AchievementVerification } from './AchievementVerification'
import { AchievementApplause } from './AchievementApplause'
import { AchievementComments } from './AchievementComments'
import { AchievementPreviewModal } from './AchievementPreviewModal'
import { AchievementSettingsMenu } from './AchievementSettingsMenu'
import { StartWorkButton } from './StartWorkButton'
import { RoadmapBlock } from './RoadmapBlock'
import {
  PageContainer,
  BackButton,
  HiddenBanner,
  AchievementHeader,
  AchievementIcon,
  AchievementTitle,
  AchievementDescription,
  AchievementIndicators,
  IndicatorIcon,
  ContentSection,
} from './page.styled'

export default function AchievementDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { data: currentUser } = useGetMeQuery(undefined, { skip: !isAuthenticated })
  const { showToast, ToastComponent } = useToast()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [iconTransform, setIconTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 })
  const [isEditing, setIsEditing] = useState(false)
  const detailViewRef = useRef<HTMLDivElement>(null)
  const [actionsRef, setActionsRef] = useState<{
    handleEdit: () => void
    handleReset: () => void
    handleToggleMain: () => void
    handleToggleFavorite: () => void
    handleToggleHidden: () => void
    handleToggleLikes: () => void
    handleToggleComments: () => void
  } | null>(null)

  const categoryId = params?.id as string
  const achievementId = params?.achievementId as string

  const {
    data: achievementDetail,
    isLoading,
    error,
    refetch,
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
      unlocked: achievementDetail.unlocked || !!achievementDetail.userAchievement, // unlocked если есть UserAchievement
      progress: achievementDetail.userAchievement?.progress || 0,
      maxProgress: 100,
      rarity: achievementDetail.rarity,
      xpReward: achievementDetail.xp_reward,
      completionDate: achievementDetail.userAchievement?.completion_date,
      difficulty: achievementDetail.userAchievement?.difficulty as 1 | 2 | 3 | 4 | 5 | undefined,
      impressions: achievementDetail.userAchievement?.impressions,
      photos: achievementDetail.photos?.map((p) => p.url),
      photosWithId: achievementDetail.photos?.map((p) => ({ id: p.id, url: p.url })),
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
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <IoSearch style={{ color: '#9ca3af', fontSize: '4rem', width: '4rem', height: '4rem' }} />
          </div>
          <div style={{ color: '#9ca3af', fontSize: '1.125rem' }}>Достижение не найдено</div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <PageContainer>
        <BackButton onClick={() => router.back()}>
          <IoArrowBack /> Назад
        </BackButton>

        {achievement.isHidden && (
          <HiddenBanner>
            <IoEyeOff />
            <span>Это достижение скрыто от других пользователей</span>
          </HiddenBanner>
        )}

        <AchievementHeader>
          {isAuthenticated && (
            <AchievementSettingsMenu
              achievement={{
                isMain: achievement.isMain,
                isFavorite: achievement.isFavorite,
                isHidden: achievement.isHidden,
                canLike: achievement.canLike,
                canComment: achievement.canComment,
                unlocked: achievement.unlocked,
                completion_date: achievementDetail.userAchievement?.completion_date,
              }}
              isOwner={isOwner}
              onEdit={() => {
                const isCompleted = achievementDetail.userAchievement?.completion_date
                if (isOwner && isCompleted) {
                  setIsEditing(true)
                  // Закрываем меню и скроллим к блоку редактирования
                  setTimeout(() => {
                    detailViewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 100)
                }
              }}
              onReset={() => {
                if (actionsRef?.handleReset) {
                  actionsRef.handleReset()
                }
              }}
              onToggleMain={() => {
                if (actionsRef?.handleToggleMain) {
                  actionsRef.handleToggleMain()
                }
              }}
              onToggleFavorite={() => {
                if (actionsRef?.handleToggleFavorite) {
                  actionsRef.handleToggleFavorite()
                }
              }}
              onToggleHidden={() => {
                if (actionsRef?.handleToggleHidden) {
                  actionsRef.handleToggleHidden()
                }
              }}
              onToggleLikes={() => {
                if (actionsRef?.handleToggleLikes) {
                  actionsRef.handleToggleLikes()
                }
              }}
              onToggleComments={() => {
                if (actionsRef?.handleToggleComments) {
                  actionsRef.handleToggleComments()
                }
              }}
              onShare={() => {
                if (navigator.share) {
                  navigator.share({
                    title: achievement.name,
                    text: achievement.description,
                    url: window.location.href,
                  }).catch(() => {
                    navigator.clipboard.writeText(window.location.href)
                    showToast('Ссылка скопирована в буфер обмена!', 'success')
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  showToast('Ссылка скопирована в буфер обмена!', 'success')
                }
              }}
            />
          )}
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
            {renderIcon(achievementDetail.icon_url, 'trophy')}
          </AchievementIcon>
          <div style={{ flex: 1 }}>
            <AchievementTitle>{achievement.name}</AchievementTitle>
            <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IoFolderOpen /> {achievementDetail.category.name}
            </div>
            {isAuthenticated && achievement.unlocked && (
              <AchievementIndicators>
                {achievement.isHidden && (
                  <IndicatorIcon title="Скрыто от других пользователей">
                    <IoEyeOff />
                  </IndicatorIcon>
                )}
                {achievement.isMain && (
                  <IndicatorIcon title="Главное достижение">
                    <IoStar />
                  </IndicatorIcon>
                )}
                {achievement.isFavorite && (
                  <IndicatorIcon title="В избранном">
                    <IoHeart />
                  </IndicatorIcon>
                )}
                {achievement.canLike === false && (
                  <IndicatorIcon title="Аплодисменты отключены" $warning>
                    <IoCloseCircle />
                  </IndicatorIcon>
                )}
                {achievement.canComment === false && (
                  <IndicatorIcon title="Комментарии отключены" $warning>
                    <IoCloseCircle />
                  </IndicatorIcon>
                )}
              </AchievementIndicators>
            )}
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
            {(() => {
              const isAchieved = !!achievementDetail.userAchievement?.completion_date
              const progress = achievementDetail.userAchievement?.progress || 0
              const isInProgress = !isAchieved && progress > 0 && progress <= 100
              const isNotAchieved = !isAchieved && progress === 0

              // Достигнуто - показываем детали выполнения
              if (isAchieved) {
                return (
                  <ContentSection>
                    <StatusBadge status="achieved" />
                    
                    {/* Блок "Роадмап" для достигнутых достижений */}
                    {achievementDetail.userAchievement?.id && (
                      <div>
                        <RoadmapBlock
                          userAchievementId={achievementDetail.userAchievement.id}
                          achievementId={achievementId}
                          isOwner={isOwner}
                        />
                      </div>
                    )}

                    <AchievementVerification achievement={achievement} isOwner={isOwner} />
                    <div ref={detailViewRef} id="achievement-detail-view">
                      <AchievementDetailView
                        achievement={achievement}
                        isEditing={isEditing}
                        onCancel={() => setIsEditing(false)}
                        userAchievementId={achievementDetail.userAchievement?.id}
                        achievementId={achievementId}
                        onUpdate={() => {
                          setIsEditing(false)
                          refetch()
                        }}
                      />
                    </div>
                    <AchievementApplause achievement={achievement} isOwner={isOwner} currentUserId={currentUser?.id} userAchievementId={achievementDetail.userAchievement?.id} achievementId={achievementId} />
                    <AchievementComments achievement={achievement} isOwner={isOwner} currentUserId={currentUser?.id} userAchievementId={achievementDetail.userAchievement?.id} />
                    <AchievementActions
                      achievement={achievement}
                      isOwner={isOwner}
                      userAchievementId={achievementDetail.userAchievement?.id}
                      achievementId={achievementId}
                      onUpdate={(updates) => {
                        refetch()
                      }}
                      onActionsReady={setActionsRef}
                    />
                  </ContentSection>
                )
              }

              // В работе или не начато - показываем форму завершения
              const currentProgress = achievementDetail.userAchievement?.progress || 0
              const isProgressComplete = currentProgress >= 100

              return (
                <ContentSection>
                  {isInProgress ? (
                    <StatusBadge status="in_progress" />
                  ) : isNotAchieved ? (
                    <StatusBadge status="not_achieved" />
                  ) : null}
                  
                  {/* Кнопка "Взять в работу" для не достигнутых достижений */}
                  {isNotAchieved && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <StartWorkButton
                        achievementId={achievementId}
                        onStart={() => {
                          refetch()
                        }}
                      />
                    </div>
                  )}

                  {/* Блок "Роадмап" для достижений в работе или достигнутых */}
                  {(isInProgress || isAchieved) && achievementDetail.userAchievement?.id && (
                    <div >
                      <RoadmapBlock
                        userAchievementId={achievementDetail.userAchievement.id}
                        achievementId={achievementId}
                        isOwner={isOwner}
                      />
                    </div>
                  )}

                  <AchievementProgress
                    achievement={achievement}
                    achievementId={achievementId}
                    onUpdate={() => {
                      refetch()
                    }}
                    isInteractive={true}
                  />
                  <AchievementCompletionForm
                    achievement={achievement}
                    achievementId={achievementId}
                    isComplete={isProgressComplete}
                    onComplete={() => {
                      refetch()
                    }}
                  />
                  <AchievementActions
                    achievement={achievement}
                    isOwner={isOwner}
                    userAchievementId={achievementDetail.userAchievement?.id}
                    achievementId={achievementId}
                    onUpdate={(updates) => {
                      refetch()
                    }}
                    onActionsReady={setActionsRef}
                  />
                </ContentSection>
              )
            })()}
          </>
        )}

        {!isAuthenticated && (
          <ContentSection>
            <div style={{
              background: 'linear-gradient(145deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%)',
              borderRadius: '20px',
              padding: '3rem 2rem',
              border: '2px solid rgba(55, 65, 81, 0.6)',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <IoLockClosed style={{ color: '#9ca3af' }} />
              </div>
              <div style={{ color: '#f3f4f6', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Войдите, чтобы увидеть прогресс
              </div>
              <div style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: '1.6' }}>
                Зарегистрируйтесь или войдите, чтобы отслеживать прогресс и выполнять достижения
              </div>
            </div>
          </ContentSection>
        )}
      </PageContainer>
      <ToastComponent />
    </Container>
  )
}
