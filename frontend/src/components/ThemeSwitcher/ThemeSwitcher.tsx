'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { setTheme } from '@/store/slices/themeSlice'
import { ThemeName, themes } from '@/styles/themes'
import { ThemeSwitcherContainer, ThemeOption } from './ThemeSwitcher.styled'

export const ThemeSwitcher = () => {
  const dispatch = useDispatch()
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme)

  const handleThemeChange = (themeName: ThemeName) => {
    dispatch(setTheme(themeName))
  }

  return (
    <ThemeSwitcherContainer>
      {Object.values(themes).map((theme) => (
        <ThemeOption
          key={theme.name}
          active={currentTheme === theme.name}
          onClick={() => handleThemeChange(theme.name)}
        >
          {theme.displayName}
        </ThemeOption>
      ))}
    </ThemeSwitcherContainer>
  )
}
