'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import { IoClose } from 'react-icons/io5'
import { useUpdateMeMutation } from '@/store/api/userApi'
import type { ProfileThemeType } from '../styled'

// Доступные иконки для фона
export const availableIcons = [
  '🦅', // Орел
  '🦆', // Утка
  '🦢', // Лебедь
  '🦉', // Сова
  '🦇', // Летучая мышь
  '⭐', // Звезда
  '✨', // Искры
  '🌟', // Сияющая звезда
  '💫', // Падающая звезда
  '🌙', // Луна
  '☀️', // Солнце
  '🔥', // Огонь
  '💎', // Алмаз
  '⚡', // Молния
  '🌊', // Волна
  '🌪️', // Торнадо
  '❄️', // Снежинка
  '🌺', // Цветок
  '🌻', // Подсолнух
  '🌹', // Роза
  '🌷', // Тюльпан
  '🦋', // Бабочка
  '🐉', // Дракон
  '🦄', // Единорог
  '🐲', // Дракон
  '⚔️', // Мечи
  '🛡️', // Щит
  '🏆', // Трофей
  '🎯', // Мишень
  '🎪', // Цирк
  '🎭', // Маски
  '🎨', // Палитра
]

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
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 0.75rem;
    padding: 1rem;
  }
`

const ThemeCard = styled(motion.button) <{ $isSelected: boolean; $gradient: string }>`
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
  width: 100%;
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

  @media (max-width: 768px) {
    border-radius: 50%;
    border-width: 3px;
    min-width: 60px;
    min-height: 60px;
    
    &:hover {
      transform: scale(1.1);
    }
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

  @media (max-width: 768px) {
    display: none;
  }
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

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
    top: 0.25rem;
    right: 0.25rem;
  }
`

const IconsSection = styled.div`
  padding: 1.5rem;
  border-top: ${(props) => props.theme.glass.border};
`

const IconsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.light[100]};
  margin-bottom: 1rem;
`

const IconsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
`

const IconButton = styled(motion.button) <{ $isSelected: boolean }>`
  aspect-ratio: 1;
  border-radius: 12px;
  border: 2px solid
    ${(props) =>
    props.$isSelected
      ? props.theme.colors.primary
      : props.theme.colors.dark.glassLight};
  background: ${(props) =>
    props.$isSelected
      ? `${props.theme.colors.primary}33`
      : props.theme.colors.dark.glassLight};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    transform: scale(1.1);
    border-color: ${(props) => props.theme.colors.primary};
  }
`

const IconCheck = styled.div<{ $isSelected: boolean }>`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.625rem;
  font-weight: 700;
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
  currentIcons?: string[]
}

const PreviewBlock = styled.div<{ $gradient: string; $shadow: string; $border: string }>`
  width: 100%;
  height: 120px;
  border-radius: 16px;
  background: ${(props) => props.$gradient};
  box-shadow: ${(props) => props.$shadow};
  border: ${(props) => props.$border};
  position: relative;
  overflow: hidden;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-weight: 600;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0.3;
  }
`

const PreviewLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.light[300]};
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
`

const ThemeNameMobile = styled.div<{ $isSelected: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: absolute;
    bottom: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 0.75rem;
    color: ${(props) =>
    props.$isSelected
      ? props.theme.colors.primary
      : props.theme.colors.light[300]};
    font-weight: ${(props) => (props.$isSelected ? 600 : 400)};
    text-align: center;
    width: max-content;
  }
`

const ThemeCardWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`

export function ProfileThemeModal({
  isOpen,
  onClose,
  currentTheme,
  currentIcons = [],
}: ProfileThemeModalProps) {
  const [updateMe, { isLoading }] = useUpdateMeMutation()
  const [selectedIcons, setSelectedIcons] = useState<string[]>(currentIcons)
  const [previewTheme, setPreviewTheme] = useState<ProfileThemeType | null>(currentTheme)

  // Обновляем состояние при открытии модалки
  if (isOpen && JSON.stringify(selectedIcons) !== JSON.stringify(currentIcons)) {
    setSelectedIcons(currentIcons)
  }

  if (isOpen && previewTheme !== currentTheme) {
    setPreviewTheme(currentTheme)
  }

  const handleSelectTheme = async (theme: ProfileThemeType) => {
    try {
      await updateMe({ main_info_theme: theme }).unwrap()
      setPreviewTheme(theme)
    } catch (error) {
      console.error('Failed to update theme:', error)
    }
  }

  const handleThemeHover = (theme: ProfileThemeType) => {
    setPreviewTheme(theme)
  }

  const handleThemeLeave = () => {
    setPreviewTheme(currentTheme)
  }

  const getPreviewTheme = () => {
    if (!previewTheme) {
      const defaultTheme = themes.find(t => t.value === 'midnight') || themes[0]
      return {
        gradient: defaultTheme.gradient,
        shadow: '0 8px 32px rgba(15, 23, 42, 0.4)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
      }
    }

    const theme = themes.find(t => t.value === previewTheme)
    if (!theme) {
      const defaultTheme = themes[0]
      return {
        gradient: defaultTheme.gradient,
        shadow: '0 8px 32px rgba(15, 23, 42, 0.4)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
      }
    }

    // Получаем стили темы из getThemeStyles
    const themeStyles: Record<string, { gradient: string; shadow: string; border: string }> = {
      midnight: { gradient: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #334155 100%)', shadow: '0 8px 32px rgba(15, 23, 42, 0.4)', border: '1px solid rgba(148, 163, 184, 0.1)' },
      deepBlue: { gradient: 'linear-gradient(145deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)', shadow: '0 8px 32px rgba(30, 58, 138, 0.35)', border: '1px solid rgba(96, 165, 250, 0.2)' },
      velvetPurple: { gradient: 'linear-gradient(145deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', shadow: '0 8px 32px rgba(76, 29, 149, 0.35)', border: '1px solid rgba(167, 139, 250, 0.2)' },
      forest: { gradient: 'linear-gradient(145deg, #064e3b 0%, #059669 50%, #34d399 100%)', shadow: '0 8px 32px rgba(6, 78, 59, 0.35)', border: '1px solid rgba(52, 211, 153, 0.2)' },
      cosmic: { gradient: 'linear-gradient(145deg, #1e1b4b 0%, #3730a3 50%, #818cf8 100%)', shadow: '0 8px 32px rgba(30, 27, 75, 0.4), 0 0 24px rgba(129, 140, 248, 0.3)', border: '1px solid rgba(129, 140, 248, 0.3)' },
      sunset: { gradient: 'linear-gradient(145deg, #7c2d12 0%, #ea580c 50%, #fb923c 100%)', shadow: '0 8px 32px rgba(124, 45, 18, 0.35)', border: '1px solid rgba(251, 146, 60, 0.2)' },
      nebula: { gradient: 'linear-gradient(145deg, #500724 0%, #be185d 50%, #f472b6 100%)', shadow: '0 8px 32px rgba(80, 7, 36, 0.4), 0 0 20px rgba(244, 114, 182, 0.2)', border: '1px solid rgba(244, 114, 182, 0.25)' },
      aurora: { gradient: 'linear-gradient(145deg, #064e3b 0%, #0d9488 50%, #22d3ee 100%)', shadow: '0 8px 32px rgba(6, 78, 59, 0.35)', border: '1px solid rgba(34, 211, 238, 0.2)' },
      gold: { gradient: 'linear-gradient(145deg, #78350f 0%, #d97706 50%, #fbbf24 100%)', shadow: '0 8px 40px rgba(120, 53, 15, 0.5), 0 0 30px rgba(251, 191, 36, 0.3)', border: '1px solid rgba(251, 191, 36, 0.3)' },
      platinum: { gradient: 'linear-gradient(145deg, #374151 0%, #9ca3af 50%, #d1d5db 100%)', shadow: '0 8px 40px rgba(55, 65, 81, 0.5), 0 0 30px rgba(209, 213, 219, 0.2)', border: '1px solid rgba(209, 213, 219, 0.3)' },
      dragonScale: { gradient: 'linear-gradient(145deg, #064e3b 0%, #0891b2 50%, #7dd3fc 100%)', shadow: '0 8px 40px rgba(6, 78, 59, 0.5), 0 0 30px rgba(125, 211, 252, 0.3)', border: '1px solid rgba(125, 211, 252, 0.25)' },
    }

    return themeStyles[previewTheme] || themeStyles.midnight
  }

  const handleToggleIcon = async (icon: string) => {
    const newIcons = selectedIcons.includes(icon)
      ? selectedIcons.filter((i) => i !== icon)
      : [...selectedIcons, icon].slice(0, 10) // Максимум 10 иконок

    setSelectedIcons(newIcons)

    // Сохраняем иконки на бэкенд
    try {
      await updateMe({ background_icons: newIcons }).unwrap()
    } catch (error) {
      console.error('Failed to update background icons:', error)
      // Откатываем изменение при ошибке
      setSelectedIcons(selectedIcons)
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
                  <ThemeCardWrapper key={theme.value}>
                    <ThemeCard
                      $isSelected={isSelected}
                      $gradient={theme.gradient}
                      onClick={() => handleSelectTheme(theme.value)}
                      onMouseEnter={() => handleThemeHover(theme.value)}
                      onMouseLeave={handleThemeLeave}
                      onTouchStart={() => handleThemeHover(theme.value)}
                      disabled={isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CheckIcon $isSelected={isSelected}>✓</CheckIcon>
                      <ThemeName $isSelected={isSelected}>{theme.name}</ThemeName>
                    </ThemeCard>
                    <ThemeNameMobile $isSelected={isSelected}>
                      {theme.name}
                    </ThemeNameMobile>
                  </ThemeCardWrapper>
                )
              })}
            </ModalContent>

            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <PreviewLabel>Предпросмотр</PreviewLabel>
              <PreviewBlock
                $gradient={getPreviewTheme().gradient}
                $shadow={getPreviewTheme().shadow}
                $border={getPreviewTheme().border}
              >
                {themes.find(t => t.value === previewTheme)?.name || 'Полночь'}
              </PreviewBlock>
            </div>

            <IconsSection>
              <IconsTitle>Иконки для фона ({selectedIcons.length}/10)</IconsTitle>
              <IconsGrid>
                {availableIcons.map((icon) => {
                  const isSelected = selectedIcons.includes(icon)
                  return (
                    <IconButton
                      key={icon}
                      $isSelected={isSelected}
                      onClick={() => handleToggleIcon(icon)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {icon}
                      <IconCheck $isSelected={isSelected}>✓</IconCheck>
                    </IconButton>
                  )
                })}
              </IconsGrid>
            </IconsSection>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>,
    document.body
  )
}
