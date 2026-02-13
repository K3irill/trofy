'use client'

import { useState } from 'react'
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
  type ProfileThemeType,
} from '../styled'
import { useProfileBio } from '../hooks/useProfileBio'
import { ProfileThemeModal } from './ProfileThemeModal'
import { BackgroundIcons } from './BackgroundIcons'
import { AvatarUploadModal } from './AvatarUploadModal'
import { IoColorPaletteOutline, IoPerson, IoCamera } from 'react-icons/io5'
import styled from 'styled-components'

const ThemeButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${(props) => props.theme.colors.light[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
    transform: scale(1.1);
  }
`

interface ProfileHeaderProps {
  user: User
  isAuthenticated: boolean
  progress: number
  xpToNextLevel: number
  currentXP: number
}

export function ProfileHeader({ user, isAuthenticated, progress, xpToNextLevel, currentXP }: ProfileHeaderProps) {
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

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  // Используем main_info_theme если есть, иначе fallback на profile_theme.profile_color
  const currentTheme = user.main_info_theme
    ? (user.main_info_theme as ProfileThemeType)
    : mapProfileColorToTheme(user.profile_theme.profile_color || 'dark')

  // Используем background_icons из пользователя
  const backgroundIcons = user.background_icons || []

  return (
    <MainInfo profileTheme={currentTheme}>
      <BackgroundIcons icons={backgroundIcons} count={15} />
      {isAuthenticated && (
        <ThemeButton
          onClick={() => setIsThemeModalOpen(true)}
          title="Изменить тему блока"
        >
          <IoColorPaletteOutline size={20} />
        </ThemeButton>
      )}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Avatar
          onClick={() => isAuthenticated && setIsAvatarModalOpen(true)}
          style={{ cursor: isAuthenticated ? 'pointer' : 'default' }}
        >
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={user.avatar_url}
              src={user.avatar_url.startsWith('http') ? user.avatar_url : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${user.avatar_url}`}
              alt={user.username}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
              onError={(e) => {
                // Если изображение не загрузилось, показываем иконку
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <IoPerson size={48} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
          )}
        </Avatar>
        {isAuthenticated && (
          <AvatarEditButton
            onClick={() => setIsAvatarModalOpen(true)}
            title="Изменить аватарку"
          >
            <IoCamera size={16} />
          </AvatarEditButton>
        )}
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
      <XPText>{currentXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</XPText>

      <ProfileThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        currentIcons={backgroundIcons}
      />

      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </MainInfo>
  )
}

const AvatarEditButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary};
  border: 2px solid ${(props) => props.theme.colors.dark[800]};
  color: ${(props) => props.theme.colors.light[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;

  &:hover {
    background: ${(props) => props.theme.colors.secondary};
    transform: scale(1.1);
    box-shadow: 0 0 15px ${(props) => props.theme.colors.primary}80;
  }
`
