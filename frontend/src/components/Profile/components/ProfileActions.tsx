'use client'

import { useRouter } from 'next/navigation'
import { IoTrophy, IoDocumentText } from 'react-icons/io5'
import {
  QuickActionsSection,
  QuickActionButton,
  ButtonIcon,
  ButtonText,
} from '../styled'

interface ProfileActionsProps {
  isAuthenticated: boolean
  username?: string
  isOwnProfile?: boolean | null
}

export function ProfileActions({ isAuthenticated, username, isOwnProfile = false }: ProfileActionsProps) {
  const router = useRouter()

  if (!username) return null

  const handleAchievementsClick = () => {
    router.push(`/user/${username}/achievements`)
  }

  const handleNotesClick = () => {
    router.push(`/journal`)
  }

  return (
    <QuickActionsSection>
      <QuickActionButton
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAchievementsClick}
        style={{ cursor: 'pointer' }}
      >
        <ButtonIcon>
          <IoTrophy />
        </ButtonIcon>
        <ButtonText>{isOwnProfile ? 'Мои достижения' : 'Достижения'}</ButtonText>
      </QuickActionButton>
      <QuickActionButton
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNotesClick}
        style={{ cursor: 'pointer' }}
      >
        <ButtonIcon>
          <IoDocumentText />
        </ButtonIcon>
        <ButtonText>Заметки</ButtonText>
      </QuickActionButton>
    </QuickActionsSection>
  )
}
