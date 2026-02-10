'use client'

import { useEffect, useMemo, useState } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { ThemeName } from './themes'
import { getTheme } from './themes'
import { createAppTheme, defaultTheme } from './theme'
import { GlobalStyle } from './GlobalStyle'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const storeThemeName = useSelector((state: RootState) => state.theme.currentTheme)
  const [mounted, setMounted] = useState(false)

  // На сервере и при первом клиентском рендере используем NEON
  // После монтирования переключаемся на сохраненную тему
  useEffect(() => {
    setMounted(true)
  }, [])

  const themeName = mounted ? storeThemeName : 'NEON'

  // Обновляем data-theme атрибут при изменении темы
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeName.toLowerCase())
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
    } catch (e) {
      return defaultTheme
    }
  }, [themeName])

  return (
    <StyledThemeProvider theme={theme} key={mounted ? themeName : 'server'}>
      <GlobalStyle />
      {children}
    </StyledThemeProvider>
  )
}
