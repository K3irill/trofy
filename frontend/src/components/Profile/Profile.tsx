import { useMemo } from 'react'
import { ProfileProps } from './types'
import { IoLockClosed } from 'react-icons/io5'
import { SectionMarker } from '@/components/SectionMarker'
import { useGetStatsQuery, useGetUserAchievementsByUsernameQuery } from '@/store/api/userApi'
import { PinnedAchievementsModal } from './PinnedAchievementsModal'
import { PriorityAchievementsModal } from './PriorityAchievementsModal'
import { usePinnedAchievements } from './hooks/usePinnedAchievements'
import { usePriorityAchievements } from './hooks/usePriorityAchievements'
import { ProfileHeader } from './components/ProfileHeader'
import { ProfileStats } from './components/ProfileStats'
import { PriorityAchievements } from './components/PriorityAchievements'
import { PinnedAchievements } from './components/PinnedAchievements'
import { ProfileStreak } from './components/ProfileStreak'
import { ProfileActions } from './components/ProfileActions'
import { ProfileShare } from './components/ProfileShare'
import {
  ProfileContainer,
  MainInfoWrap,
  ProfileTitleWrap,
  ProfileOverlay,
  OverlayTitle,
  ProfileTitle,
  ClosedProfileNotice,
  ProfileSidePanel,
} from './styled'
import { Button } from '@/components/ui/Button'

export const Profile = ({
  user,
  isAuthenticated = true,
  isOwnProfile = false,
  stats: externalStats,
  onLoginClick
}: ProfileProps) => {
  const isOwn = !!isOwnProfile

  // Используем переданные stats или получаем для текущего пользователя
  const { data: ownStats } = useGetStatsQuery(undefined, {
    skip: !isOwn || !!externalStats,
  })

  const stats = externalStats || ownStats

  const isProfileHidden = !user.privacy_settings?.show_profile
  const hideLevelAndXp = isProfileHidden && !isOwn

  // Расчет опыта для текущего уровня
  // XP для уровня N = (N-1)^2 * 100
  // Например: уровень 1 = 0 XP, уровень 2 = 100 XP, уровень 3 = 400 XP, уровень 4 = 900 XP
  const currentLevelXP = Math.pow(Math.max(0, user.level - 1), 2) * 100
  const nextLevelXP = Math.pow(user.level, 2) * 100
  const xpToNextLevel = nextLevelXP - currentLevelXP
  const currentXP = Math.max(0, user.xp - currentLevelXP)

  // Прогресс в процентах (0-100)
  const progress = xpToNextLevel > 0
    ? Math.max(0, Math.min(100, (currentXP / xpToNextLevel) * 100))
    : 100

  const pinnedAchievementsHook = usePinnedAchievements(user, isOwn)
  const priorityAchievementsHook = usePriorityAchievements(user, isOwn)

  // Получаем главное достижение
  const { data: userAchievements } = useGetUserAchievementsByUsernameQuery(
    { username: user.username, status: 'all' },
    { skip: !user.username }
  )

  const mainAchievement = useMemo(() => {
    if (!userAchievements) return null
    return userAchievements.find((achievement) => achievement.is_main === true) || null
  }, [userAchievements])

  return (
    <ProfileContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      $isBlurred={!isAuthenticated && isOwn}
    >


      <ProfileTitleWrap>
        <SectionMarker />
        <ProfileTitle>{isOwn ? 'Мой профиль' : 'Профиль пользователя'}</ProfileTitle>
      </ProfileTitleWrap>

      <MainInfoWrap>
        <ProfileHeader
          user={user}
          isAuthenticated={isOwn}
          isOwnProfile={isOwn}
          progress={progress}
          xpToNextLevel={hideLevelAndXp ? 0 : xpToNextLevel}
          currentXP={hideLevelAndXp ? 0 : currentXP}
          mainAchievement={mainAchievement}
          hideLevelAndXp={hideLevelAndXp}
        />
        <ProfileSidePanel $centered={isProfileHidden && !isOwn}>
          {isProfileHidden && !isOwn && (
            <ClosedProfileNotice>
              <IoLockClosed />
              <span>Это закрытый профиль. Часть информации скрыта настройками приватности.</span>
            </ClosedProfileNotice>
          )}
          {!isProfileHidden && (
            <>
              <PriorityAchievements
                priorityAchievements={priorityAchievementsHook.priorityAchievements}
                username={user.username}
                onAdd={isOwn ? priorityAchievementsHook.handleAddAchievement : undefined}
                onRemove={isOwn ? priorityAchievementsHook.handleRemoveAchievement : undefined}
              />
              <ProfileStreak isAuthenticated={true} user={user} stats={stats} />
              <ProfileActions isAuthenticated={isAuthenticated} username={user.username} isOwnProfile={isOwn} />
            </>
          )}
        </ProfileSidePanel>
      </MainInfoWrap>

      {!isProfileHidden && (
        <PinnedAchievements
          isAuthenticated={true}
          pinnedAchievements={pinnedAchievementsHook.pinnedAchievements}
          username={user.username}
          onAdd={isOwn ? pinnedAchievementsHook.handleAddAchievement : undefined}
          onRemove={isOwn ? pinnedAchievementsHook.handleRemoveAchievement : undefined}
        />
      )}

      {isOwn && (
        <>
          <PinnedAchievementsModal
            isOpen={pinnedAchievementsHook.modalOpen}
            onClose={() => {
              pinnedAchievementsHook.setModalOpen(false)
              pinnedAchievementsHook.setSelectedSlotIndex(null)
            }}
            onSelect={pinnedAchievementsHook.handleSelectAchievement}
            currentPinned={user.pinned_achievements || []}
          />

          <PriorityAchievementsModal
            isOpen={priorityAchievementsHook.modalOpen}
            onClose={() => {
              priorityAchievementsHook.setModalOpen(false)
              priorityAchievementsHook.setSelectedSlotIndex(null)
            }}
            onSelect={priorityAchievementsHook.handleSelectAchievement}
            currentPriority={user.priority_achievements || []}
          />
        </>
      )}

      {!isProfileHidden && <ProfileStats isAuthenticated={true} stats={stats} />}
      {isOwn && <ProfileShare isAuthenticated={isAuthenticated} user={user} />}
      {!isAuthenticated && isOwn && (
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
