import { Theme, neonTheme } from './themes'

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}

const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
}

export type AppTheme = Theme & {
  breakpoints: typeof breakpoints
  spacing: typeof spacing
}

export const createAppTheme = (theme: Theme): AppTheme => {
  return {
    ...theme,
    breakpoints,
    spacing,
  }
}

export const defaultTheme = createAppTheme(neonTheme)