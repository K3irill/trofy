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

  const xpToNextLevel = Math.pow(user.level, 2) * 100
  const currentLevelXP = Math.pow(user.level - 1, 2) * 100
  const progress = Math.max(0, Math.min(100, ((user.xp - currentLevelXP) / (xpToNextLevel - currentLevelXP)) * 100))

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
