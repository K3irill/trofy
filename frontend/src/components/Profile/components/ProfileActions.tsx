'use client'

import { motion } from 'framer-motion'
import {
  QuickActionsSection,
  QuickActionButton,
  ButtonIcon,
  ButtonText,
} from '../styled'

interface ProfileActionsProps {
  isAuthenticated: boolean
}

export function ProfileActions({ isAuthenticated }: ProfileActionsProps) {
  if (!isAuthenticated) return null

  return (
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
  )
}
