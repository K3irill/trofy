'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { IoTrophy, IoList, IoDiamond, IoDocumentText } from 'react-icons/io5'
import {
  QuickActionsSection,
  QuickActionButton,
  ButtonIcon,
  ButtonText,
} from '../styled'

interface ProfileActionsProps {
  isAuthenticated: boolean
  username?: string
  isOwnProfile?: boolean
}

export function ProfileActions({ isAuthenticated, username, isOwnProfile = false }: ProfileActionsProps) {
  const router = useRouter()

  if (!username) return null

  const handleAchievementsClick = () => {
    router.push(`/user/${username}/achievements`)
  }

  const handleTasksClick = () => {
    // TODO: Добавить страницу заданий
    console.log('Tasks clicked')
  }

  const handleCollectionsClick = () => {
    // TODO: Добавить страницу коллекций
    console.log('Collections clicked')
  }

  const handleHistoryClick = () => {
    // TODO: Добавить страницу истории
    console.log('History clicked')
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
        onClick={handleTasksClick}
        style={{ cursor: 'pointer' }}
      >
        <ButtonIcon>
          <IoList />
        </ButtonIcon>
        <ButtonText>Задания</ButtonText>
      </QuickActionButton>
      <QuickActionButton
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCollectionsClick}
        style={{ cursor: 'pointer' }}
      >
        <ButtonIcon>
          <IoDiamond />
        </ButtonIcon>
        <ButtonText>Коллекции</ButtonText>
      </QuickActionButton>
      <QuickActionButton
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleHistoryClick}
        style={{ cursor: 'pointer' }}
      >
        <ButtonIcon>
          <IoDocumentText />
        </ButtonIcon>
        <ButtonText>История</ButtonText>
      </QuickActionButton>
    </QuickActionsSection>
  )
}
