import { ProfileProps } from './types'
import { SectionMarker } from '@/components/SectionMarker'
import { useGetStatsQuery } from '@/store/api/userApi'
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
} from './styled'
import { Button } from '@/components/ui/Button'

export const Profile = ({ user, isAuthenticated = true, onLoginClick }: ProfileProps) => {
  const { data: stats } = useGetStatsQuery(undefined, {
    skip: !isAuthenticated,
  })

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

  const pinnedAchievementsHook = usePinnedAchievements(user)
  const priorityAchievementsHook = usePriorityAchievements(user)

  return (
    <ProfileContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      $isBlurred={!isAuthenticated}
    >


      <ProfileTitleWrap>
        <SectionMarker />
        <h2 style={{ color: '#f3f4f6', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Профиль</h2>
      </ProfileTitleWrap>

      <MainInfoWrap>
        <ProfileHeader
          user={user}
          isAuthenticated={isAuthenticated}
          progress={progress}
          xpToNextLevel={xpToNextLevel}
          currentXP={currentXP}
        />
        <div>
          <PriorityAchievements
            isAuthenticated={isAuthenticated}
            priorityAchievements={priorityAchievementsHook.priorityAchievements}
            onAdd={priorityAchievementsHook.handleAddAchievement}
            onRemove={priorityAchievementsHook.handleRemoveAchievement}
          />
          <ProfileStreak isAuthenticated={isAuthenticated} user={user} stats={stats} />
          <ProfileActions isAuthenticated={isAuthenticated} />
        </div>
      </MainInfoWrap>

      <PinnedAchievements
        isAuthenticated={isAuthenticated}
        pinnedAchievements={pinnedAchievementsHook.pinnedAchievements}
        onAdd={pinnedAchievementsHook.handleAddAchievement}
        onRemove={pinnedAchievementsHook.handleRemoveAchievement}
      />

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

      <ProfileStats isAuthenticated={isAuthenticated} stats={stats} />
      <ProfileShare isAuthenticated={isAuthenticated} user={user} />
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
