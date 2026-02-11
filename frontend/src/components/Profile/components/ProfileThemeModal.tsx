'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import { IoClose } from 'react-icons/io5'
import { useUpdateMeMutation } from '@/store/api/userApi'
import type { ProfileThemeType } from '../styled'

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: ${(props) => props.theme.glass.radius};
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: ${(props) => props.theme.glass.border};
  position: relative;
`

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.light[100]};
  flex: 1;
  text-align: center;
`

const CloseButton = styled.button`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
    color: ${(props) => props.theme.colors.light[100]};
  }
`

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`

const ThemeCard = styled(motion.button)<{ $isSelected: boolean; $gradient: string }>`
  aspect-ratio: 1;
  border-radius: 16px;
  border: 2px solid
    ${(props) =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.dark.glassLight};
  background: ${(props) => props.$gradient};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.$isSelected
      ? props.theme.shadows.glow.primary
      : props.theme.shadows.glass.light};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(props) => props.theme.shadows.glass.medium};
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) =>
      props.$isSelected
        ? 'rgba(0, 212, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)'};
    transition: all 0.3s ease;
  }
`

const ThemeName = styled.div<{ $isSelected: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  background: ${(props) =>
    props.$isSelected
      ? `${props.theme.colors.primary}cc`
      : 'rgba(0, 0, 0, 0.7)'};
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  z-index: 1;
`

const CheckIcon = styled.div<{ $isSelected: boolean }>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-weight: 700;
  z-index: 2;
  opacity: ${(props) => (props.$isSelected ? 1 : 0)};
  transform: ${(props) => (props.$isSelected ? 'scale(1)' : 'scale(0)')};
  transition: all 0.3s ease;
`

const themes: Array<{ value: ProfileThemeType; gradient: string; name: string }> = [
  {
    value: 'midnight',
    gradient: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    name: 'Полночь',
  },
  {
    value: 'deepBlue',
    gradient: 'linear-gradient(145deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
    name: 'Глубокий синий',
  },
  {
    value: 'velvetPurple',
    gradient: 'linear-gradient(145deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)',
    name: 'Бархатный фиолет',
  },
  {
    value: 'forest',
    gradient: 'linear-gradient(145deg, #064e3b 0%, #059669 50%, #34d399 100%)',
    name: 'Лес',
  },
  {
    value: 'cosmic',
    gradient: 'linear-gradient(145deg, #1e1b4b 0%, #3730a3 50%, #818cf8 100%)',
    name: 'Космос',
  },
  {
    value: 'sunset',
    gradient: 'linear-gradient(145deg, #7c2d12 0%, #ea580c 50%, #fb923c 100%)',
    name: 'Закат',
  },
  {
    value: 'nebula',
    gradient: 'linear-gradient(145deg, #500724 0%, #be185d 50%, #f472b6 100%)',
    name: 'Туманность',
  },
  {
    value: 'aurora',
    gradient: 'linear-gradient(145deg, #064e3b 0%, #0d9488 50%, #22d3ee 100%)',
    name: 'Северное сияние',
  },
  {
    value: 'gold',
    gradient: 'linear-gradient(145deg, #78350f 0%, #d97706 50%, #fbbf24 100%)',
    name: 'Золото',
  },
  {
    value: 'platinum',
    gradient: 'linear-gradient(145deg, #374151 0%, #9ca3af 50%, #d1d5db 100%)',
    name: 'Платина',
  },
  {
    value: 'dragonScale',
    gradient: 'linear-gradient(145deg, #064e3b 0%, #0891b2 50%, #7dd3fc 100%)',
    name: 'Чешуя дракона',
  },
]

interface ProfileThemeModalProps {
  isOpen: boolean
  onClose: () => void
  currentTheme: ProfileThemeType | null
}

export function ProfileThemeModal({
  isOpen,
  onClose,
  currentTheme,
}: ProfileThemeModalProps) {
  const [updateMe, { isLoading }] = useUpdateMeMutation()

  const handleSelectTheme = async (theme: ProfileThemeType) => {
    try {
      await updateMe({ main_info_theme: theme }).unwrap()
      onClose()
    } catch (error) {
      console.error('Failed to update theme:', error)
    }
  }

  if (typeof window === 'undefined') {
    return null
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Выберите тему блока</ModalTitle>
              <CloseButton onClick={onClose}>
                <IoClose />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              {themes.map((theme) => {
                const isSelected = currentTheme === theme.value
                return (
                  <ThemeCard
                    key={theme.value}
                    $isSelected={isSelected}
                    $gradient={theme.gradient}
                    onClick={() => handleSelectTheme(theme.value)}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckIcon $isSelected={isSelected}>✓</CheckIcon>
                    <ThemeName $isSelected={isSelected}>{theme.name}</ThemeName>
                  </ThemeCard>
                )
              })}
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>,
    document.body
  )
}
