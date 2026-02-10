'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { setTheme } from '@/store/slices/themeSlice'
import { ThemeName, themes } from '@/styles/themes'
import {
  ThemeSelectorContainer,
  ThemeSelectorTitle,
  ThemeColumns,
  ThemeColumn,
  ThemeColumnTitle,
  ThemeGrid,
  ThemeCard,
  ThemeCardActive,
} from './ThemeSelector.styled'

// Классические темы
const classicThemes: ThemeName[] = ['STOIC', 'BLACK_GLOSS', 'TWILIGHT']

// Красочные темы (все остальные)
const colorfulThemes: ThemeName[] = Object.keys(themes).filter(
  (theme) => !classicThemes.includes(theme as ThemeName)
) as ThemeName[]

export const ThemeSelector = () => {
  const dispatch = useDispatch()
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme)

  const handleThemeChange = (themeName: ThemeName) => {
    dispatch(setTheme(themeName))
  }

  return (
    <ThemeSelectorContainer>
      <ThemeColumns>
        <ThemeColumn>
          <ThemeColumnTitle>Классические</ThemeColumnTitle>
          <ThemeGrid>
            {classicThemes.map((themeName) => {
              const theme = themes[themeName]
              const isActive = currentTheme === themeName
              const CardComponent = isActive ? ThemeCardActive : ThemeCard

              return (
                <CardComponent
                  key={themeName}
                  onClick={() => handleThemeChange(themeName)}
                >
                  {theme.displayName}
                </CardComponent>
              )
            })}
          </ThemeGrid>
        </ThemeColumn>
        <ThemeColumn>
          <ThemeColumnTitle>Красочные</ThemeColumnTitle>
          <ThemeGrid>
            {colorfulThemes.map((themeName) => {
              const theme = themes[themeName]
              const isActive = currentTheme === themeName
              const CardComponent = isActive ? ThemeCardActive : ThemeCard

              return (
                <CardComponent
                  key={themeName}
                  onClick={() => handleThemeChange(themeName)}
                >
                  {theme.displayName}
                </CardComponent>
              )
            })}
          </ThemeGrid>
        </ThemeColumn>
      </ThemeColumns>
    </ThemeSelectorContainer>
  )
}
