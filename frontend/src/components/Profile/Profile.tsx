import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { Rarity } from '@/types'
import { ProfileProps } from './types'
import { SectionMarker } from '@/components/SectionMarker'
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
} from './styled'

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

export const Profile = ({ user }: ProfileProps) => {
  const [status, setStatus] = useState(user.bio || '')
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [expandedTrophy, setExpandedTrophy] = useState<string | null>(null)
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

  const rareTrophies: TrophyData[] = [
    { id: '1', title: 'Легенда', icon: '👑', rarity: Rarity.LEGENDARY, isNew: true },
    { id: '2', title: 'Исследователь', icon: '🔮', rarity: Rarity.EPIC },
    { id: '3', title: 'Мастер', icon: '⚡', rarity: Rarity.RARE },
  ]

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
            <Avatar>{user.avatar ? <img src={user.avatar} alt="" /> : '👤'}</Avatar>
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
                >
                  <StatusInput
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    onBlur={() => setIsEditingStatus(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingStatus(false)}
                    autoFocus
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsEditingStatus(true)}
                  style={{
                    color: status ? '#f3f4f6' : 'rgba(156, 163, 175, 0.5)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {status || 'Напишите свой статус...'}
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
            {currentGoals.map((goal, index) => (
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
            ))}
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
              <StreakDays>{user.streak || 7}</StreakDays>
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



      <RareTrophiesSection>
        <SectionTitle>🏆 Редкие трофеи</SectionTitle>
        <RareTrophiesGrid>
          {rareTrophies.map((trophy, index) => (
            <TrophyCard
              key={trophy.id}
              isNew={trophy.isNew || false}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, rotateY: 15 }}
              onClick={() => setExpandedTrophy(expandedTrophy === trophy.id ? null : trophy.id)}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <TrophyIcon rarity={trophy.rarity}>{trophy.icon}</TrophyIcon>
              <TrophyTitle>{trophy.title}</TrophyTitle>
            </TrophyCard>
          ))}
        </RareTrophiesGrid>
      </RareTrophiesSection>


      <StatsSection>
        <SectionTitle>📊 Статистика</SectionTitle>
        <Stats>
          <StatItem>
            <StatValue initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}>42</StatValue>
            <StatLabel>Всего</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}>5</StatValue>
            <StatLabel>Редких</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}>1</StatValue>
            <StatLabel>Эпических</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}>{user.uniqueness_score || 87}%</StatValue>
            <StatLabel>Уникальность</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}>+{user.growth_rate || 12}</StatValue>
            <StatLabel>Темп роста</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}>  {user.fastest_achievement?.days || 3}д</StatValue>
            <StatLabel>Рекорд</StatLabel>
          </StatItem>
        </Stats>
      </StatsSection>




      <ShareButton
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleShare}
      >
        <span>📤</span> Поделиться профилем
      </ShareButton>
    </ProfileContainer >
  )
}
