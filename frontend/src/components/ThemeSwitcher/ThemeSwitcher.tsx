'use client'

import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { setTheme } from '@/store/slices/themeSlice'
import { ThemeName, themes } from '@/styles/themes'
import {
  ThemeSwitcherContainer,
  ThemeSelectButton,
  ThemeDropdown,
  ThemeOption,
  ChevronIcon,
  SettingsButton,
} from './ThemeSwitcher.styled'

interface ThemeSwitcherProps {
  onOpenSettings?: () => void
}

export const ThemeSwitcher = ({ onOpenSettings }: ThemeSwitcherProps = {}) => {
  const dispatch = useDispatch()
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentThemeData = themes[currentTheme]

  const handleThemeChange = (themeName: ThemeName) => {
    dispatch(setTheme(themeName))
    setIsOpen(false)
  }

  // Закрываем выпадающий список при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <ThemeSwitcherContainer ref={containerRef}>
      {onOpenSettings && (
        <SettingsButton
          onClick={onOpenSettings}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎨
        </SettingsButton>
      )}
      <div style={{ visibility: 'hidden', position: 'absolute' }}>

        <ThemeSelectButton
          onClick={() => setIsOpen(!isOpen)}
          isOpen={isOpen}
        >
          <span>{currentThemeData.displayName}</span>
          <ChevronIcon isOpen={isOpen}>▼</ChevronIcon>
        </ThemeSelectButton>
        {isOpen && (
          <ThemeDropdown>
            {Object.values(themes).map((theme) => (
              <ThemeOption
                key={theme.name}
                active={currentTheme === theme.name}
                onClick={() => handleThemeChange(theme.name)}
              >
                {theme.displayName}
              </ThemeOption>
            ))}
          </ThemeDropdown>
        )}
      </div>
    </ThemeSwitcherContainer>
  )
}
