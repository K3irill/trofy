'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { User } from '@/types'
import {
  Avatar,
  Username,
  Level,
  XPBar,
  XPProgress,
  XPText,
  BadgesContainer,
  Badge,
  StatusContainer,
  StatusInput,
  MainInfo,
  mapProfileColorToTheme,
} from '../styled'
import { useProfileBio } from '../hooks/useProfileBio'

interface ProfileHeaderProps {
  user: User
  isAuthenticated: boolean
  progress: number
  xpToNextLevel: number
}

export function ProfileHeader({ user, isAuthenticated, progress, xpToNextLevel }: ProfileHeaderProps) {
  const {
    status,
    setStatus,
    isEditingStatus,
    statusInputRef,
    displayStatus,
    handleBlur,
    handleKeyDown,
    handleFocus,
    handleClick,
  } = useProfileBio(user, isAuthenticated)

  return (
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
                  if (statusInputRef.current) {
                    statusInputRef.current.style.height = 'auto'
                    statusInputRef.current.style.height = `${statusInputRef.current.scrollHeight}px`
                  }
                }}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
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
              onClick={handleClick}
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
  )
}
