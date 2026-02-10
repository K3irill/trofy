'use client'

import { useLayoutEffect, useMemo } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getTheme } from './themes'
import { createAppTheme, defaultTheme } from './theme'
import { GlobalStyle } from './GlobalStyle'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const storeThemeName = useSelector((state: RootState) => state.theme.currentTheme)

  // На сервере всегда используем NEON, на клиенте - сохраненную тему
  const isClient = typeof window !== 'undefined'
  const themeName = isClient ? storeThemeName : 'NEON'

  // Обновляем data-theme атрибут при изменении темы
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const themeAttr = themeName.toLowerCase().replace('_', '-')
      document.documentElement.setAttribute('data-theme', themeAttr)
    }
  }, [themeName])

  // Мемоизируем тему
  const theme = useMemo(() => {
    try {
      const themeData = getTheme(themeName)
      if (!themeData || !themeData.colors || !themeData.colors.dark) {
        return defaultTheme
      }
      return createAppTheme(themeData)
    } catch {
      return defaultTheme
    }
  }, [themeName])

  return (
    <StyledThemeProvider theme={theme} key={isClient ? themeName : 'server'}>
      <GlobalStyle />
      {children}
    </StyledThemeProvider>
  )
}
