import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ThemeName } from '@/styles/themes'

const THEME_STORAGE_KEY = 'trofy-theme'

// Получаем сохраненную тему из localStorage или используем NEON по умолчанию
const getInitialTheme = (): ThemeName => {
  // На сервере всегда возвращаем NEON
  if (typeof window === 'undefined') return 'NEON'

  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null
    const validThemes: ThemeName[] = ['NEON', 'STOIC', 'MINIMAL', 'FOREST', 'DARK_GLASS', 'SUNSET', 'MYTHOLOGY', 'BERSERK', 'CYBERPUNK', 'OCEAN', 'BLACK_GLOSS']
    if (savedTheme && validThemes.includes(savedTheme)) {
      return savedTheme
    }
  } catch (e) {
    // Если localStorage недоступен, возвращаем NEON
    console.warn('Failed to read theme from localStorage:', e)
  }
  return 'NEON'
}

interface ThemeState {
  currentTheme: ThemeName
}

const initialState: ThemeState = {
  currentTheme: getInitialTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeName>) => {
      state.currentTheme = action.payload
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, action.payload)
      }
    },
  },
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer
