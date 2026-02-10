export type ThemeName = 'NEON' | 'STOIC'

export interface ThemeColors {
  primary: string
  secondary: string
  gold: string
  goldLight: string
  accent: string
  danger: string
  warning: string
  success: string
  dark: {
    bg: string
    glass: string
    glassLight: string
    neomorphLight: string
    neomorphDark: string
    900: string
    800: string
    700: string
    600: string
  }
  light: {
    100: string
    200: string
    300: string
  }
  rarity: {
    base: string
    rare: string
    epic: string
    legendary: string
  }
}

export interface ThemeShadows {
  sm: string
  md: string
  lg: string
  xl: string
  glow: {
    primary: string
    secondary: string
    gold: string
    accent: string
  }
  neomorph: {
    light: string
    dark: string
    flat: string
  }
  glass: {
    light: string
    medium: string
    heavy: string
  }
}

export interface Theme {
  name: ThemeName
  displayName: string
  colors: ThemeColors
  shadows: ThemeShadows
  neomorph: {
    bg: string
    radius: string
    radiusSm: string
    radiusLg: string
  }
  glass: {
    bg: string
    bgLight: string
    blur: string
    radius: string
    border: string
  }
}

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

// Тема NEON - текущая игровая тема с неоновыми синими цветами
export const neonTheme: Theme = {
  name: 'NEON',
  displayName: 'NEON',
  colors: {
    primary: '#00d4ff',
    secondary: '#00a8cc',
    gold: '#ffd700',
    goldLight: '#ffec8b',
    accent: '#ff00ff',
    danger: '#ff4444',
    warning: '#ffaa00',
    success: '#00ff88',
    dark: {
      bg: '#0a0e17',
      glass: 'rgba(26, 32, 44, 0.7)',
      glassLight: 'rgba(45, 55, 72, 0.5)',
      neomorphLight: 'rgba(255, 255, 255, 0.05)',
      neomorphDark: 'rgba(0, 0, 0, 0.3)',
      900: '#0a0e17',
      800: '#111827',
      700: '#1a202c',
      600: '#2d3748',
    },
    light: {
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
    },
    rarity: {
      base: '#1dd469',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#ffd700',
    },
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.5)',
    md: '0 4px 6px rgba(0,0,0,0.5)',
    lg: '0 10px 25px rgba(0,0,0,0.5)',
    xl: '0 20px 40px rgba(0,0,0,0.5)',
    glow: {
      primary: '0 0 20px rgba(0, 212, 255, 0.5)',
      secondary: '0 0 20px rgba(0, 168, 204, 0.5)',
      gold: '0 0 20px rgba(255, 215, 0, 0.5)',
      accent: '0 0 20px rgba(255, 0, 255, 0.5)',
    },
    neomorph: {
      light: '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.03)',
      dark: 'inset 4px 4px 8px rgba(0, 0, 0, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.02)',
      flat: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    glass: {
      light: '0 8px 32px rgba(0, 0, 0, 0.2)',
      medium: '0 12px 40px rgba(0, 0, 0, 0.3)',
      heavy: '0 20px 60px rgba(0, 0, 0, 0.4)',
    },
  },
  neomorph: {
    bg: '#0a0e17',
    radius: '16px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(26, 32, 44, 0.7)',
    bgLight: 'rgba(45, 55, 72, 0.5)',
    blur: 'blur(20px)',
    radius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
}

// Тема STOIC - стоицизм, темные стеклянные тона, приближенная к жизни
export const stoicTheme: Theme = {
  name: 'STOIC',
  displayName: 'СТОИЦИЗМ',
  colors: {
    primary: '#8b7355', // Темный бежевый, цвет дерева
    secondary: '#6b5d4f', // Более темный оттенок
    gold: '#c9a961', // Приглушенное золото
    goldLight: '#d4b97a',
    accent: '#7a6b5c', // Нейтральный акцент
    danger: '#b85450', // Приглушенный красный
    warning: '#b8965a', // Приглушенный оранжевый
    success: '#6b8e6b', // Приглушенный зеленый
    dark: {
      bg: '#1a1816', // Очень темный фон
      glass: 'rgba(35, 32, 28, 0.85)', // Темное стекло с большей непрозрачностью
      glassLight: 'rgba(45, 42, 38, 0.7)',
      neomorphLight: 'rgba(255, 255, 255, 0.03)',
      neomorphDark: 'rgba(0, 0, 0, 0.4)',
      900: '#1a1816',
      800: '#252320',
      700: '#2f2c28',
      600: '#3d3935',
    },
    light: {
      100: '#e8e6e3', // Теплый светлый
      200: '#d4d1cc',
      300: '#b8b5b0',
    },
    rarity: {
      base: '#6b8e6b', // Приглушенный зеленый
      rare: '#6b7a8e', // Приглушенный синий
      epic: '#8e6b7a', // Приглушенный фиолетовый
      legendary: '#c9a961', // Приглушенное золото
    },
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.6)',
    md: '0 4px 6px rgba(0,0,0,0.6)',
    lg: '0 10px 25px rgba(0,0,0,0.7)',
    xl: '0 20px 40px rgba(0,0,0,0.8)',
    glow: {
      primary: '0 0 15px rgba(139, 115, 85, 0.3)',
      secondary: '0 0 15px rgba(107, 93, 79, 0.3)',
      gold: '0 0 15px rgba(201, 169, 97, 0.3)',
      accent: '0 0 15px rgba(122, 107, 92, 0.3)',
    },
    neomorph: {
      light: '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.02)',
      dark: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.015)',
      flat: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
    glass: {
      light: '0 8px 32px rgba(0, 0, 0, 0.4)',
      medium: '0 12px 40px rgba(0, 0, 0, 0.5)',
      heavy: '0 20px 60px rgba(0, 0, 0, 0.6)',
    },
  },
  neomorph: {
    bg: '#1a1816',
    radius: '16px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(35, 32, 28, 0.85)',
    bgLight: 'rgba(45, 42, 38, 0.7)',
    blur: 'blur(20px)',
    radius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
}

export const themes: Record<ThemeName, Theme> = {
  NEON: neonTheme,
  STOIC: stoicTheme,
}

export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName] || neonTheme
}
