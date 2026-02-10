import { Theme, getTheme } from './themes'

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
}

// Экспортируем тип темы для использования в styled-components
export type AppTheme = Theme & {
  breakpoints: typeof breakpoints
  spacing: typeof spacing
}

// Функция для создания полной темы с breakpoints и spacing
export const createAppTheme = (theme: Theme): AppTheme => ({
  ...theme,
  breakpoints,
  spacing,
})

// Экспортируем дефолтную тему NEON для обратной совместимости
export const defaultTheme = createAppTheme(getTheme('NEON'))
