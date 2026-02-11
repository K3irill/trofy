import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useRef, useEffect } from 'react'
import { Rarity } from '@/types'
import { ProfileProps } from './types'
import { SectionMarker } from '@/components/SectionMarker'
import { useUpdateMeMutation, useGetStatsQuery } from '@/store/api/userApi'
import { useAppSelector } from '@/store/hooks'
import { useGetAchievementByIdQuery } from '@/store/api/achievementsApi'
import { PinnedAchievementsModal } from './PinnedAchievementsModal'
import { IoAddCircleOutline } from 'react-icons/io5'
import {
  ProfileContainer,
  Avatar,
  Username,
  Level,
  XPBar,
  XPProgress,
  XPText,
  Stats,
  StatItem,
  StatValue,
  StatLabel,
  StatusContainer,
  StatusInput,
  BadgesContainer,
  Badge,
  SectionTitle,
  RareTrophiesSection,
  RareTrophiesGrid,
  TrophyCard,
  TrophyIcon,
  TrophyTitle,
  AddTrophyButton,
  AddTrophyIcon,
  AddTrophyText,
  CurrentGoalsSection,
  GoalItem,
  GoalHeader,
  GoalTitle,
  GoalProgress,
  GoalBar,
  GoalProgressBar,
  StreakContainer,
  StreakFlame,
  StreakText,
  StreakDays,
  ShareButton,
  ParticlesContainer,
  Particle,
  MainInfoWrap,
  MainInfo,
  StatsSection,
  mapProfileColorToTheme,
  QuickActionsSection,
  QuickActionButton,
  ButtonIcon,
  ButtonText,
  ProfileTitleWrap,
  ProfileOverlay,
  OverlayTitle,
} from './styled'
import { Button } from '@/components/ui/Button'

interface TrophyData {
  id: string
  title: string
  icon: string
  rarity: Rarity
  isNew?: boolean
}

interface GoalData {
  title: string
  current: number
  total: number
}

export const Profile = ({ user, isAuthenticated = true, onLoginClick }: ProfileProps) => {
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [updateMe] = useUpdateMeMutation()
  const { data: stats } = useGetStatsQuery(undefined, {
    skip: !isAuthenticated,
  })

  const [status, setStatus] = useState('')
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const statusInputRef = useRef<HTMLTextAreaElement>(null)

  // Используем status только при редактировании, иначе user.bio
  const displayStatus = isEditingStatus ? status : (user.bio || '')

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    if (statusInputRef.current && isEditingStatus) {
      statusInputRef.current.style.height = 'auto'
      statusInputRef.current.style.height = `${statusInputRef.current.scrollHeight}px`
    }
  }, [status, isEditingStatus])
  const [showParticles, setShowParticles] = useState(false)

  const particlePositions = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      x: 20 + (i * 137) % 60,
      y: 20 + (i * 89) % 60,
    })),
    []
  )

  const xpToNextLevel = Math.pow(user.level, 2) * 100
  const currentLevelXP = Math.pow(user.level - 1, 2) * 100
  const progress = Math.max(0, Math.min(100, ((user.xp - currentLevelXP) / (xpToNextLevel - currentLevelXP)) * 100))

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)

  // Получаем данные закрепленных достижений
  const pinnedIds = user.pinned_achievements || []
  const achievement1 = useGetAchievementByIdQuery(pinnedIds[0] || '', { skip: !pinnedIds[0] })
  const achievement2 = useGetAchievementByIdQuery(pinnedIds[1] || '', { skip: !pinnedIds[1] })
  const achievement3 = useGetAchievementByIdQuery(pinnedIds[2] || '', { skip: !pinnedIds[2] })

  const pinnedAchievements = useMemo(() => {
    const achievements: (TrophyData | null)[] = []

    // Добавляем достижения по порядку
    const achievementData = [achievement1.data, achievement2.data, achievement3.data]

    for (let i = 0; i < 3; i++) {
      if (achievementData[i]) {
        achievements.push({
          id: achievementData[i]!.id,
          title: achievementData[i]!.title,
          icon: achievementData[i]!.icon_url || '🏆',
          rarity: achievementData[i]!.rarity.toUpperCase() as Rarity,
        })
      } else {
        achievements.push(null)
      }
    }

    return achievements
  }, [achievement1.data, achievement2.data, achievement3.data])

  const handleAddAchievement = (slotIndex: number) => {
    setSelectedSlotIndex(slotIndex)
    setModalOpen(true)
  }

  const handleSelectAchievement = async (achievementId: string) => {
    if (selectedSlotIndex === null) return

    const currentPinned = [...(user.pinned_achievements || [])]

    // Создаем массив из 3 элементов, заполняя пустые слоты
    const newPinned: string[] = []
    for (let i = 0; i < 3; i++) {
      if (i === selectedSlotIndex) {
        // В выбранный слот ставим новое достижение
        newPinned[i] = achievementId
      } else if (currentPinned[i]) {
        // Сохраняем существующие достижения
        newPinned[i] = currentPinned[i]
      }
    }

    // Убираем undefined и ограничиваем до 3
    const filteredPinned = newPinned.filter((id): id is string => !!id).slice(0, 3)

    try {
      await updateMe({ pinned_achievements: filteredPinned }).unwrap()
    } catch (error) {
      console.error('Failed to update pinned achievements:', error)
    }

    setModalOpen(false)
    setSelectedSlotIndex(null)
  }

  const handleRemoveAchievement = async (slotIndex: number) => {
    const currentPinned = [...(user.pinned_achievements || [])]
    currentPinned.splice(slotIndex, 1)

    try {
      await updateMe({ pinned_achievements: currentPinned }).unwrap()
    } catch (error) {
      console.error('Failed to remove pinned achievement:', error)
    }
  }

  const currentGoals: GoalData[] = [
    { title: 'Прочитано 23/50 книг', current: 23, total: 50 },
    { title: 'Осталось 3 дня до отпуска', current: 4, total: 7 },
  ]

  const handleShare = () => {
    setShowParticles(true)
    setTimeout(() => setShowParticles(false), 2000)
    navigator.clipboard?.writeText(`Мой профиль trofy.art/u/${user.username}`)
  }

  return (
    <ProfileContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      $isBlurred={!isAuthenticated}
    >
      <ParticlesContainer>
        <AnimatePresence>
          {showParticles && particlePositions.map((pos, i) => (
            <Particle
              key={i}
              color={['#00d4ff', '#ffd700', '#ff6b6b', '#a855f7'][i % 4]}
              initial={{
                x: '50%',
                y: '50%',
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: `${pos.x}%`,
                y: `${pos.y}%`,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, delay: i * 0.05 }}
            />
          ))}
        </AnimatePresence>
      </ParticlesContainer>

      <ProfileTitleWrap>
        <SectionMarker />
        <h2 style={{ color: '#f3f4f6', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Профиль</h2>
      </ProfileTitleWrap>
      <MainInfoWrap>
        <MainInfo profileTheme={mapProfileColorToTheme(user.profile_theme.profile_color || 'dark')}>


          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar>👤</Avatar>
          </div>

          <Username>{user.username}</Username>

          <BadgesContainer>
            {user.badges?.map((badge, index) => (
              <Badge
                key={badge}
                rarity={badge === 'Легенда' ? 'legendary' : badge === 'Первооткрыватель' ? 'epic' : 'rare'}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                {badge}
              </Badge>
            ))}
          </BadgesContainer>
          <StatusContainer>
            <AnimatePresence mode="wait">
              {isEditingStatus ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <StatusInput
                    ref={statusInputRef}
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value)
                      // Автоматическое изменение высоты
                      if (statusInputRef.current) {
                        statusInputRef.current.style.height = 'auto'
                        statusInputRef.current.style.height = `${statusInputRef.current.scrollHeight}px`
                      }
                    }}
                    onBlur={async () => {
                      setIsEditingStatus(false)
                      if (isAuthenticated && currentUser && status !== (user.bio || '')) {
                        try {
                          await updateMe({ bio: status }).unwrap()
                        } catch (error) {
                          console.error('Failed to update bio:', error)
                        }
                      }
                      setStatus('')
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        setIsEditingStatus(false)
                        if (isAuthenticated && currentUser && status !== (user.bio || '')) {
                          try {
                            await updateMe({ bio: status }).unwrap()
                          } catch (error) {
                            console.error('Failed to update bio:', error)
                          }
                        }
                        setStatus('')
                      }
                    }}
                    onFocus={() => {
                      setStatus(user.bio || '')
                    }}
                    maxLength={500}
                    autoFocus
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setIsEditingStatus(true)
                    setStatus(user.bio || '')
                  }}
                  style={{
                    color: displayStatus ? '#f3f4f6' : 'rgba(156, 163, 175, 0.5)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {displayStatus || 'Напишите свой статус...'}
                </motion.div>
              )}
            </AnimatePresence>
          </StatusContainer>

          <Level>Level {user.level}</Level>

          <XPBar>
            <XPProgress
              initial={{ width: 0 }}
              animate={{
                width: `${progress}%`,
                filter: progress > 80 ? ['hue-rotate(0deg)', 'hue-rotate(360deg)'] : 'none',
              }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </XPBar>
          <XPText>{user.xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</XPText>
        </MainInfo>
        <div>

          <CurrentGoalsSection>
            <SectionTitle>📈 Сейчас в работе</SectionTitle>
            {isAuthenticated ? (
              currentGoals.map((goal, index) => (
                <GoalItem
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <GoalHeader>
                    <GoalTitle>{goal.title}</GoalTitle>
                    <GoalProgress>{goal.current}/{goal.total}</GoalProgress>
                  </GoalHeader>
                  <GoalBar>
                    <GoalProgressBar
                      initial={{ width: 0 }}
                      animate={{ width: `${(goal.current / goal.total) * 100}%` }}
                      transition={{ duration: 1, delay: 1.3 + index * 0.1 }}
                    />
                  </GoalBar>
                </GoalItem>
              ))
            ) : (
              <GoalItem
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GoalHeader>
                  <GoalTitle>?</GoalTitle>
                  <GoalProgress>?</GoalProgress>
                </GoalHeader>
                <GoalBar>
                  <GoalProgressBar
                    initial={{ width: 0 }}
                    animate={{ width: 0 }}
                    transition={{ duration: 0 }}
                  />
                </GoalBar>
              </GoalItem>
            )}
          </CurrentGoalsSection>
          <StreakContainer
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <StreakFlame
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🔥
            </StreakFlame>
            <div>
              <StreakText>Серия подряд</StreakText>
              <StreakDays>
                {isAuthenticated && stats ? stats.streak : isAuthenticated ? (user.streak || 0) : '?'}
              </StreakDays>
            </div>
          </StreakContainer>

          <QuickActionsSection>
            <QuickActionButton
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ButtonIcon>🏆</ButtonIcon>
              <ButtonText>Мои достижения</ButtonText>
            </QuickActionButton>
            <QuickActionButton
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ButtonIcon>📋</ButtonIcon>
              <ButtonText>Задания</ButtonText>
            </QuickActionButton>
            <QuickActionButton
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ButtonIcon>💎</ButtonIcon>
              <ButtonText>Коллекции</ButtonText>
            </QuickActionButton>
            <QuickActionButton
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ButtonIcon>📜</ButtonIcon>
              <ButtonText>История</ButtonText>
            </QuickActionButton>
          </QuickActionsSection>

        </div>
      </MainInfoWrap>



      {isAuthenticated && (
        <RareTrophiesSection>
          <SectionTitle>🏆 Закрепленные достижения</SectionTitle>
          <RareTrophiesGrid>
            {pinnedAchievements.map((trophy, index) => (
              <div key={index}>
                {trophy ? (
                  <TrophyCard
                    isNew={false}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05, rotateY: 15 }}
                    onClick={() => handleRemoveAchievement(index)}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    title="Нажмите, чтобы открепить"
                  >
                    <TrophyIcon rarity={trophy.rarity.toLowerCase()}>
                      {trophy.icon}
                    </TrophyIcon>
                    <TrophyTitle>{trophy.title}</TrophyTitle>
                  </TrophyCard>
                ) : (
                  <AddTrophyButton
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddAchievement(index)}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <AddTrophyIcon>
                      <IoAddCircleOutline />
                    </AddTrophyIcon>
                    <AddTrophyText>Добавить</AddTrophyText>
                  </AddTrophyButton>
                )}
              </div>
            ))}
          </RareTrophiesGrid>
        </RareTrophiesSection>
      )}

      <PinnedAchievementsModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedSlotIndex(null)
        }}
        onSelect={handleSelectAchievement}
        currentPinned={user.pinned_achievements || []}
      />


      <StatsSection>
        <SectionTitle>📊 Статистика</SectionTitle>
        <Stats>
          <StatItem>
            <StatValue initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}>
              {isAuthenticated && stats ? stats.total_achievements : '?'}
            </StatValue>
            <StatLabel>Всего</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}>
              {isAuthenticated && stats ? stats.achievements_by_rarity.rare : '?'}
            </StatValue>
            <StatLabel>Редких</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}>
              {isAuthenticated && stats ? stats.achievements_by_rarity.epic : '?'}
            </StatValue>
            <StatLabel>Эпических</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}>
              {isAuthenticated && stats ? `${stats.uniqueness_score}%` : '?'}
            </StatValue>
            <StatLabel>Уникальность</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}>
              {isAuthenticated && stats ? `+${stats.growth_rate}` : '?'}
            </StatValue>
            <StatLabel>Темп роста</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}>
              {isAuthenticated && stats && stats.fastest_achievement
                ? `${stats.fastest_achievement.days}д`
                : '?'}
            </StatValue>
            <StatLabel>Рекорд</StatLabel>
          </StatItem>
        </Stats>
      </StatsSection>




      {isAuthenticated && (
        <ShareButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
        >
          <span>📤</span> Поделиться профилем
        </ShareButton>
      )}

      {!isAuthenticated && (
        <ProfileOverlay>
          <OverlayTitle>Авторизуйтесь, чтобы увидеть статистику</OverlayTitle>
          {onLoginClick && (

            <Button
              variant="primary"
              size="md"
              onClick={onLoginClick}
            >
              Войти
            </Button>
          )}
        </ProfileOverlay>
      )}
    </ProfileContainer >
  )
}
