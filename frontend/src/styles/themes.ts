export type ThemeName = 'NEON' | 'TWILIGHT' | 'STOIC' | 'OBSIDIAN' | 'MINIMAL' | 'FOREST' | 'DARK_GLASS' | 'SUNSET' | 'MYTHOLOGY' | 'BERSERK' | 'CYBERPUNK' | 'OCEAN' | 'BLACK_GLOSS' | 'BASALT' | 'AMBITION'

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
// 1. Тема OBSIDIAN - градиент с фиолетовыми и синими акцентами
export const obsidianTheme: Theme = {
  name: 'OBSIDIAN',
  displayName: 'ОБСИДИАН',
  colors: {
    primary: '#8b5cf6', // Фиолетовый акцент
    secondary: '#6366f1', // Индиго
    gold: '#a78bfa', // Светло-фиолетовый
    goldLight: '#c4b5fd',
    accent: '#7c3aed', // Темно-фиолетовый
    danger: '#f87171',
    warning: '#fbbf24',
    success: '#34d399',
    dark: {
      bg: '#0f172a', // Очень темный фон для градиента
      glass: 'rgba(30, 41, 59, 0.8)', // Темное стекло с фиолетовым оттенком
      glassLight: 'rgba(51, 65, 85, 0.6)',
      neomorphLight: 'rgba(139, 92, 246, 0.15)', // Фиолетовый отблеск
      neomorphDark: 'rgba(15, 23, 42, 0.5)',
      900: '#0f172a', // slate-900
      800: '#1e293b', // slate-800 с фиолетовым оттенком
      700: '#334155', // slate-700
      600: '#475569', // slate-600
    },
    light: {
      100: '#f1f5f9', // Светлый текст
      200: '#e2e8f0',
      300: '#cbd5e1',
    },
    rarity: {
      base: '#8b5cf6', // Фиолетовый
      rare: '#6366f1', // Индиго
      epic: '#a78bfa', // Светло-фиолетовый
      legendary: '#fbbf24', // Золотой акцент
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(15, 23, 42, 0.5)',
    md: '0 4px 6px rgba(15, 23, 42, 0.5)',
    lg: '0 10px 25px rgba(15, 23, 42, 0.6)',
    xl: '0 20px 40px rgba(15, 23, 42, 0.7)',
    glow: {
      primary: '0 0 20px rgba(139, 92, 246, 0.5)', // Фиолетовое свечение
      secondary: '0 0 20px rgba(99, 102, 241, 0.5)', // Индиго свечение
      gold: '0 0 20px rgba(167, 139, 250, 0.5)',
      accent: '0 0 20px rgba(124, 58, 237, 0.5)',
    },
    neomorph: {
      light: '8px 8px 16px rgba(15, 23, 42, 0.5), -8px -8px 16px rgba(139, 92, 246, 0.1)',
      dark: 'inset 4px 4px 8px rgba(15, 23, 42, 0.5), inset -4px -4px 8px rgba(139, 92, 246, 0.1)',
      flat: '0 8px 32px rgba(15, 23, 42, 0.4)',
    },
    glass: {
      light: '0 8px 32px rgba(15, 23, 42, 0.4)',
      medium: '0 12px 40px rgba(15, 23, 42, 0.5)',
      heavy: '0 20px 60px rgba(15, 23, 42, 0.6)',
    },
  },
  neomorph: {
    bg: '#0f172a',
    radius: '12px',
    radiusSm: '8px',
    radiusLg: '16px',
  },
  glass: {
    bg: 'rgba(30, 41, 59, 0.8)',
    bgLight: 'rgba(51, 65, 85, 0.6)',
    blur: 'blur(20px)',
    radius: '12px',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
}

// 2. Тема MINIMAL - лист тетради, шероховатый сероватый
export const minimalTheme: Theme = {
  name: 'MINIMAL',
  displayName: 'МИНИМАЛИЗМ',
  colors: {
    primary: '#6b7280', // Серый как карандаш
    secondary: '#4b5563', // Темно-серый
    gold: '#9ca3af', // Светло-серый
    goldLight: '#d1d5db',
    accent: '#e5e7eb', // Светло-серый
    danger: '#dc2626',
    warning: '#d97706',
    success: '#059669',
    dark: {
      bg: '#f5f5f4', // Сероватый фон как лист тетради
      glass: 'rgba(229, 231, 235, 0.95)', // Матовое стекло
      glassLight: 'rgba(243, 244, 246, 0.9)',
      neomorphLight: 'rgba(0, 0, 0, 0.03)', // Легкая тень
      neomorphDark: 'rgba(0, 0, 0, 0.06)',
      900: '#1f2937', // Темно-серый для текста
      800: '#374151',
      700: '#4b5563',
      600: '#6b7280',
    },
    light: {
      100: '#111827', // Темный текст
      200: '#1f2937',
      300: '#374151',
    },
    rarity: {
      base: '#9ca3af', // Серый
      rare: '#6b7280', // Темно-серый
      epic: '#4b5563', // Очень темно-серый
      legendary: '#1f2937', // Почти черный
    },
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.08)',
    md: '0 2px 4px rgba(0,0,0,0.1)',
    lg: '0 4px 8px rgba(0,0,0,0.12)',
    xl: '0 8px 16px rgba(0,0,0,0.15)',
    glow: {
      primary: '0 0 8px rgba(107, 114, 128, 0.15)', // Мягкое серое свечение
      secondary: '0 0 8px rgba(75, 85, 99, 0.15)',
      gold: '0 0 8px rgba(156, 163, 175, 0.15)',
      accent: '0 0 8px rgba(229, 231, 235, 0.15)',
    },
    neomorph: {
      light: '2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.9)',
      dark: 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.9)',
      flat: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    glass: {
      light: '0 2px 8px rgba(0, 0, 0, 0.08)',
      medium: '0 4px 12px rgba(0, 0, 0, 0.1)',
      heavy: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
  },
  neomorph: {
    bg: '#f5f5f4',
    radius: '8px',
    radiusSm: '6px',
    radiusLg: '12px',
  },
  glass: {
    bg: 'rgba(229, 231, 235, 0.95)',
    bgLight: 'rgba(243, 244, 246, 0.9)',
    blur: 'blur(10px)',
    radius: '8px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
  },
}

// 3. Тема FOREST - темный ночной лес при звездах, светлая ночь
export const forestTheme: Theme = {
  name: 'FOREST',
  displayName: 'ЛЕСНАЯ ГАРМОНИЯ',
  colors: {
    primary: '#00dc82', // Неоновый зеленый только как акцент
    secondary: '#64748b', // Серо-синий как основной
    gold: '#fbbf24', // Золотистый как звезды
    goldLight: '#fde047',
    accent: '#00dc82', // Зеленый только для акцентов
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#00dc82',
    dark: {
      bg: '#0f172a', // Темное ночное небо (slate-900)
      glass: 'rgba(30, 41, 59, 0.8)', // Темное стекло как ночь
      glassLight: 'rgba(51, 65, 85, 0.6)', // Светлее для звездного эффекта
      neomorphLight: 'rgba(148, 163, 184, 0.1)', // Свет звезд
      neomorphDark: 'rgba(15, 23, 42, 0.5)',
      900: '#0f172a', // Ночное небо
      800: '#1e293b', // Темно-синий
      700: '#334155', // Серо-синий
      600: '#475569', // Светло-серый
    },
    light: {
      100: '#f1f5f9', // Светлый текст как лунный свет
      200: '#e2e8f0', // Светло-серый
      300: '#cbd5e1', // Серый
    },
    rarity: {
      base: '#64748b', // Серо-синий
      rare: '#3b82f6', // Синий как небо
      epic: '#8b5cf6', // Фиолетовый
      legendary: '#fbbf24', // Золотой как звезды
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(15, 23, 42, 0.5)',
    md: '0 4px 6px rgba(15, 23, 42, 0.5)',
    lg: '0 10px 25px rgba(15, 23, 42, 0.6)',
    xl: '0 20px 40px rgba(15, 23, 42, 0.7)',
    glow: {
      primary: '0 0 20px rgba(0, 220, 130, 0.3)', // Мягкое зеленое свечение только для акцентов
      secondary: '0 0 20px rgba(100, 116, 139, 0.3)', // Серо-синее свечение
      gold: '0 0 20px rgba(251, 191, 36, 0.4)', // Золотое свечение как звезды
      accent: '0 0 20px rgba(0, 220, 130, 0.3)', // Зеленое только для акцентов
    },
    neomorph: {
      light: '8px 8px 16px rgba(15, 23, 42, 0.5), -8px -8px 16px rgba(148, 163, 184, 0.08)',
      dark: 'inset 4px 4px 8px rgba(15, 23, 42, 0.5), inset -4px -4px 8px rgba(148, 163, 184, 0.08)',
      flat: '0 8px 32px rgba(15, 23, 42, 0.4)',
    },
    glass: {
      light: '0 8px 32px rgba(15, 23, 42, 0.4)',
      medium: '0 12px 40px rgba(15, 23, 42, 0.5)',
      heavy: '0 20px 60px rgba(15, 23, 42, 0.6)',
    },
  },
  neomorph: {
    bg: '#0f172a',
    radius: '16px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(30, 41, 59, 0.8)',
    bgLight: 'rgba(51, 65, 85, 0.6)',
    blur: 'blur(20px)',
    radius: '20px',
    border: '1px solid rgba(148, 163, 184, 0.2)', // Серо-синяя граница, не зеленая
  },
}

// 3. Новая тема: DARK GLASS (Темное стекло)
export const darkGlassTheme: Theme = {
  name: 'DARK_GLASS',
  displayName: 'ТЁМНОЕ СТЕКЛО',
  colors: {
    primary: '#60a5fa', // Мягкий синий (blue-400)
    secondary: '#3b82f6', // blue-500
    gold: '#c9a961',
    goldLight: '#d4b97a',
    accent: '#8b5cf6', // violet-500
    danger: '#f87171',
    warning: '#fbbf24',
    success: '#34d399',
    dark: {
      bg: 'rgba(17, 24, 39, 0.95)', // Полупрозрачный темный
      glass: 'rgba(30, 41, 59, 0.8)', // Стекло
      glassLight: 'rgba(51, 65, 85, 0.6)',
      neomorphLight: 'rgba(255, 255, 255, 0.05)',
      neomorphDark: 'rgba(0, 0, 0, 0.3)',
      900: '#0f172a', // slate-900
      800: '#1e293b', // slate-800
      700: '#334155', // slate-700
      600: '#475569', // slate-600
    },
    light: {
      100: '#f1f5f9', // slate-100
      200: '#e2e8f0', // slate-200
      300: '#cbd5e1', // slate-300
    },
    rarity: {
      base: '#60a5fa', // blue-400
      rare: '#8b5cf6', // violet-500
      epic: '#ec4899', // pink-500
      legendary: '#fbbf24', // amber-400
    },
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px rgba(0,0,0,0.3)',
    lg: '0 10px 25px rgba(0,0,0,0.4)',
    xl: '0 20px 40px rgba(0,0,0,0.5)',
    glow: {
      primary: '0 0 20px rgba(96, 165, 250, 0.4)',
      secondary: '0 0 20px rgba(59, 130, 246, 0.4)',
      gold: '0 0 20px rgba(201, 169, 97, 0.4)',
      accent: '0 0 20px rgba(139, 92, 246, 0.4)',
    },
    neomorph: {
      light: '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(96, 165, 250, 0.1)',
      dark: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(96, 165, 250, 0.1)',
      flat: '0 8px 32px rgba(0, 0, 0, 0.5)',
    },
    glass: {
      light: '0 8px 32px rgba(0, 0, 0, 0.5)',
      medium: '0 12px 40px rgba(0, 0, 0, 0.6)',
      heavy: '0 20px 60px rgba(0, 0, 0, 0.7)',
    },
  },
  neomorph: {
    bg: 'rgba(17, 24, 39, 0.95)',
    radius: '20px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(30, 41, 59, 0.8)',
    bgLight: 'rgba(51, 65, 85, 0.6)',
    blur: 'blur(20px)',
    radius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
}

// 4. Тема SUNSET - мягкий теплый закат
export const sunsetTheme: Theme = {
  name: 'SUNSET',
  displayName: 'ЗАКАТ',
  colors: {
    primary: '#fb923c', // Теплый оранжевый
    secondary: '#f97316', // Яркий оранжевый
    gold: '#fbbf24', // Теплое золото
    goldLight: '#fde047',
    accent: '#ea580c', // Темно-оранжевый акцент
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#22c55e',
    dark: {
      bg: '#1c1917', // Теплый темно-коричневый фон
      glass: 'rgba(41, 37, 36, 0.8)', // Темное стекло с теплым оттенком
      glassLight: 'rgba(251, 146, 60, 0.12)', // Мягкое оранжевое свечение
      neomorphLight: 'rgba(251, 146, 60, 0.15)', // Теплый оранжевый отблеск
      neomorphDark: 'rgba(28, 25, 23, 0.5)',
      900: '#1c1917',
      800: '#292524', // Темно-коричневый
      700: '#3f3a37', // Средне-коричневый
      600: '#57534e', // Светло-коричневый
    },
    light: {
      100: '#fed7aa', // Светло-оранжевый текст
      200: '#fdba74', // Средне-оранжевый
      300: '#fb923c', // Яркий оранжевый
    },
    rarity: {
      base: '#fb923c', // Теплый оранжевый
      rare: '#f97316', // Яркий оранжевый
      epic: '#ea580c', // Темно-оранжевый
      legendary: '#fbbf24', // Золото заката
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(28, 25, 23, 0.5)',
    md: '0 4px 6px rgba(28, 25, 23, 0.5)',
    lg: '0 10px 25px rgba(28, 25, 23, 0.6)',
    xl: '0 20px 40px rgba(28, 25, 23, 0.7)',
    glow: {
      primary: '0 0 20px rgba(251, 146, 60, 0.4)', // Мягкое оранжевое свечение
      secondary: '0 0 20px rgba(249, 115, 22, 0.4)', // Теплое свечение
      gold: '0 0 20px rgba(251, 191, 36, 0.4)', // Золотое свечение
      accent: '0 0 20px rgba(234, 88, 12, 0.4)', // Темно-оранжевое свечение
    },
    neomorph: {
      light: '8px 8px 16px rgba(28, 25, 23, 0.5), -8px -8px 16px rgba(251, 146, 60, 0.1)',
      dark: 'inset 4px 4px 8px rgba(28, 25, 23, 0.5), inset -4px -4px 8px rgba(251, 146, 60, 0.1)',
      flat: '0 8px 32px rgba(28, 25, 23, 0.4)',
    },
    glass: {
      light: '0 8px 32px rgba(28, 25, 23, 0.4)',
      medium: '0 12px 40px rgba(28, 25, 23, 0.5)',
      heavy: '0 20px 60px rgba(28, 25, 23, 0.6)',
    },
  },
  neomorph: {
    bg: '#1c1917',
    radius: '16px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(41, 37, 36, 0.8)',
    bgLight: 'rgba(251, 146, 60, 0.12)',
    blur: 'blur(20px)',
    radius: '20px',
    border: '1px solid rgba(251, 146, 60, 0.25)',
  },
}

// 5. Тема MYTHOLOGY - темная мифологическая
export const mythologyTheme: Theme = {
  name: 'MYTHOLOGY',
  displayName: 'МИФОЛОГИЯ',
  colors: {
    primary: '#a855f7', // Мистический фиолетовый
    secondary: '#7c3aed', // Темно-фиолетовый
    gold: '#fbbf24', // Золото богов
    goldLight: '#fde047',
    accent: '#ec4899', // Розово-магический
    danger: '#dc2626',
    warning: '#f59e0b',
    success: '#10b981',
    dark: {
      bg: '#0a0514', // Очень темный фиолетово-черный
      glass: 'rgba(30, 20, 40, 0.85)', // Темное стекло с фиолетовым оттенком
      glassLight: 'rgba(168, 85, 247, 0.15)', // Фиолетовое свечение
      neomorphLight: 'rgba(168, 85, 247, 0.2)', // Магический отблеск
      neomorphDark: 'rgba(10, 5, 20, 0.5)',
      900: '#0a0514',
      800: '#1a0f2e', // Темно-фиолетовый
      700: '#2d1b3d', // Средне-фиолетовый
      600: '#3d2a4d', // Светло-фиолетовый
    },
    light: {
      100: '#f3e8ff', // Светло-фиолетовый текст
      200: '#e9d5ff', // Средне-фиолетовый
      300: '#ddd6fe', // Более яркий фиолетовый
    },
    rarity: {
      base: '#a855f7', // Фиолетовый
      rare: '#ec4899', // Розовый
      epic: '#8b5cf6', // Фиолетовый
      legendary: '#fbbf24', // Золото
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(10, 5, 20, 0.6)',
    md: '0 4px 6px rgba(10, 5, 20, 0.6)',
    lg: '0 10px 25px rgba(10, 5, 20, 0.7)',
    xl: '0 20px 40px rgba(10, 5, 20, 0.8)',
    glow: {
      primary: '0 0 25px rgba(168, 85, 247, 0.5)', // Магическое фиолетовое свечение
      secondary: '0 0 25px rgba(124, 58, 237, 0.5)',
      gold: '0 0 25px rgba(251, 191, 36, 0.5)', // Золотое свечение
      accent: '0 0 25px rgba(236, 72, 153, 0.5)', // Розовое свечение
    },
    neomorph: {
      light: '8px 8px 16px rgba(10, 5, 20, 0.6), -8px -8px 16px rgba(168, 85, 247, 0.15)',
      dark: 'inset 4px 4px 8px rgba(10, 5, 20, 0.6), inset -4px -4px 8px rgba(168, 85, 247, 0.15)',
      flat: '0 8px 32px rgba(10, 5, 20, 0.5)',
    },
    glass: {
      light: '0 8px 32px rgba(10, 5, 20, 0.5)',
      medium: '0 12px 40px rgba(10, 5, 20, 0.6)',
      heavy: '0 20px 60px rgba(10, 5, 20, 0.7)',
    },
  },
  neomorph: {
    bg: '#0a0514',
    radius: '16px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(30, 20, 40, 0.85)',
    bgLight: 'rgba(168, 85, 247, 0.15)',
    blur: 'blur(20px)',
    radius: '20px',
    border: '1px solid rgba(168, 85, 247, 0.3)',
  },
}

// 6. Тема BERSERK - темное старое аниме как Берсерк
export const berserkTheme: Theme = {
  name: 'BERSERK',
  displayName: 'БЕРСЕРК',
  colors: {
    primary: '#991b1b', // Темно-красный
    secondary: '#7f1d1d', // Очень темный красный
    gold: '#92400e', // Темное золото
    goldLight: '#a16207',
    accent: '#dc2626', // Кроваво-красный
    danger: '#dc2626',
    warning: '#d97706',
    success: '#16a34a',
    dark: {
      bg: '#0c0a09', // Почти черный фон
      glass: 'rgba(20, 15, 12, 0.9)', // Очень темное стекло
      glassLight: 'rgba(153, 27, 27, 0.2)', // Кровавое свечение
      neomorphLight: 'rgba(153, 27, 27, 0.15)', // Красный отблеск
      neomorphDark: 'rgba(12, 10, 9, 0.6)',
      900: '#0c0a09',
      800: '#1c1917', // Темно-коричневый
      700: '#292524', // Коричневый
      600: '#3f3a37', // Светло-коричневый
    },
    light: {
      100: '#fef2f2', // Светло-красный текст
      200: '#fee2e2', // Средне-красный
      300: '#fecaca', // Более яркий красный
    },
    rarity: {
      base: '#991b1b', // Темно-красный
      rare: '#b91c1c', // Красный
      epic: '#dc2626', // Яркий красный
      legendary: '#92400e', // Темное золото
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(12, 10, 9, 0.7)',
    md: '0 4px 6px rgba(12, 10, 9, 0.7)',
    lg: '0 10px 25px rgba(12, 10, 9, 0.8)',
    xl: '0 20px 40px rgba(12, 10, 9, 0.9)',
    glow: {
      primary: '0 0 20px rgba(153, 27, 27, 0.5)', // Кровавое свечение
      secondary: '0 0 20px rgba(127, 29, 29, 0.5)',
      gold: '0 0 20px rgba(146, 64, 14, 0.5)', // Темное золотое свечение
      accent: '0 0 20px rgba(220, 38, 38, 0.5)', // Яркое красное свечение
    },
    neomorph: {
      light: '8px 8px 16px rgba(12, 10, 9, 0.7), -8px -8px 16px rgba(153, 27, 27, 0.1)',
      dark: 'inset 4px 4px 8px rgba(12, 10, 9, 0.7), inset -4px -4px 8px rgba(153, 27, 27, 0.1)',
      flat: '0 8px 32px rgba(12, 10, 9, 0.6)',
    },
    glass: {
      light: '0 8px 32px rgba(12, 10, 9, 0.6)',
      medium: '0 12px 40px rgba(12, 10, 9, 0.7)',
      heavy: '0 20px 60px rgba(12, 10, 9, 0.8)',
    },
  },
  neomorph: {
    bg: '#0c0a09',
    radius: '16px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(20, 15, 12, 0.9)',
    bgLight: 'rgba(153, 27, 27, 0.2)',
    blur: 'blur(20px)',
    radius: '20px',
    border: '1px solid rgba(153, 27, 27, 0.4)',
  },
}

// 7. Тема CYBERPUNK - неоновый киберпанк
export const cyberpunkTheme: Theme = {
  name: 'CYBERPUNK',
  displayName: 'КИБЕРПАНК',
  colors: {
    primary: '#ec4899', // Неоновый розовый
    secondary: '#8b5cf6', // Неоновый фиолетовый
    gold: '#fbbf24', // Неоновое золото
    goldLight: '#fde047',
    accent: '#06b6d4', // Неоновый циан
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    dark: {
      bg: '#030712', // Очень темный фон
      glass: 'rgba(30, 20, 50, 0.8)', // Темное стекло с фиолетовым оттенком
      glassLight: 'rgba(236, 72, 153, 0.15)', // Розовое свечение
      neomorphLight: 'rgba(139, 92, 246, 0.2)', // Фиолетовый отблеск
      neomorphDark: 'rgba(3, 7, 18, 0.5)',
      900: '#030712',
      800: '#0f172a', // Темно-синий
      700: '#1e293b', // Серо-синий
      600: '#334155', // Светло-серый
    },
    light: {
      100: '#fce7f3', // Светло-розовый текст
      200: '#fbcfe8', // Средне-розовый
      300: '#f9a8d4', // Более яркий розовый
    },
    rarity: {
      base: '#ec4899', // Розовый
      rare: '#8b5cf6', // Фиолетовый
      epic: '#06b6d4', // Циан
      legendary: '#fbbf24', // Золото
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(3, 7, 18, 0.6)',
    md: '0 4px 6px rgba(3, 7, 18, 0.6)',
    lg: '0 10px 25px rgba(3, 7, 18, 0.7)',
    xl: '0 20px 40px rgba(3, 7, 18, 0.8)',
    glow: {
      primary: '0 0 30px rgba(236, 72, 153, 0.6)', // Яркое розовое свечение
      secondary: '0 0 30px rgba(139, 92, 246, 0.6)', // Фиолетовое свечение
      gold: '0 0 30px rgba(251, 191, 36, 0.6)', // Золотое свечение
      accent: '0 0 30px rgba(6, 182, 212, 0.6)', // Циановое свечение
    },
    neomorph: {
      light: '8px 8px 16px rgba(3, 7, 18, 0.6), -8px -8px 16px rgba(236, 72, 153, 0.15)',
      dark: 'inset 4px 4px 8px rgba(3, 7, 18, 0.6), inset -4px -4px 8px rgba(236, 72, 153, 0.15)',
      flat: '0 8px 32px rgba(3, 7, 18, 0.5)',
    },
    glass: {
      light: '0 8px 32px rgba(3, 7, 18, 0.5)',
      medium: '0 12px 40px rgba(3, 7, 18, 0.6)',
      heavy: '0 20px 60px rgba(3, 7, 18, 0.7)',
    },
  },
  neomorph: {
    bg: '#030712',
    radius: '16px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(30, 20, 50, 0.8)',
    bgLight: 'rgba(236, 72, 153, 0.15)',
    blur: 'blur(20px)',
    radius: '20px',
    border: '1px solid rgba(236, 72, 153, 0.3)',
  },
}

// 8. Тема OCEAN - глубокий океан
export const oceanTheme: Theme = {
  name: 'OCEAN',
  displayName: 'ОКЕАН',
  colors: {
    primary: '#06b6d4', // Бирюзовый
    secondary: '#0891b2', // Темно-бирюзовый
    gold: '#fbbf24', // Золото как сокровища
    goldLight: '#fde047',
    accent: '#0ea5e9', // Яркий синий
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    dark: {
      bg: '#0c1221', // Глубокий темно-синий как океан
      glass: 'rgba(20, 30, 50, 0.8)', // Темное стекло с синим оттенком
      glassLight: 'rgba(6, 182, 212, 0.15)', // Бирюзовое свечение
      neomorphLight: 'rgba(14, 165, 233, 0.15)', // Синий отблеск
      neomorphDark: 'rgba(12, 18, 33, 0.5)',
      900: '#0c1221',
      800: '#1e293b', // Темно-синий
      700: '#334155', // Серо-синий
      600: '#475569', // Светло-серый
    },
    light: {
      100: '#e0f2fe', // Светло-синий текст
      200: '#bae6fd', // Средне-синий
      300: '#7dd3fc', // Более яркий синий
    },
    rarity: {
      base: '#06b6d4', // Бирюзовый
      rare: '#0ea5e9', // Синий
      epic: '#3b82f6', // Яркий синий
      legendary: '#fbbf24', // Золото
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(12, 18, 33, 0.6)',
    md: '0 4px 6px rgba(12, 18, 33, 0.6)',
    lg: '0 10px 25px rgba(12, 18, 33, 0.7)',
    xl: '0 20px 40px rgba(12, 18, 33, 0.8)',
    glow: {
      primary: '0 0 25px rgba(6, 182, 212, 0.5)', // Бирюзовое свечение
      secondary: '0 0 25px rgba(8, 145, 178, 0.5)', // Темно-бирюзовое свечение
      gold: '0 0 25px rgba(251, 191, 36, 0.5)', // Золотое свечение
      accent: '0 0 25px rgba(14, 165, 233, 0.5)', // Синее свечение
    },
    neomorph: {
      light: '8px 8px 16px rgba(12, 18, 33, 0.6), -8px -8px 16px rgba(6, 182, 212, 0.1)',
      dark: 'inset 4px 4px 8px rgba(12, 18, 33, 0.6), inset -4px -4px 8px rgba(6, 182, 212, 0.1)',
      flat: '0 8px 32px rgba(12, 18, 33, 0.5)',
    },
    glass: {
      light: '0 8px 32px rgba(12, 18, 33, 0.5)',
      medium: '0 12px 40px rgba(12, 18, 33, 0.6)',
      heavy: '0 20px 60px rgba(12, 18, 33, 0.7)',
    },
  },
  neomorph: {
    bg: '#0c1221',
    radius: '16px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(20, 30, 50, 0.8)',
    bgLight: 'rgba(6, 182, 212, 0.15)',
    blur: 'blur(20px)',
    radius: '20px',
    border: '1px solid rgba(6, 182, 212, 0.3)',
  },
}

// 9. Тема BLACK_GLOSS - черный глянец
export const blackGlossTheme: Theme = {
  name: 'BLACK_GLOSS',
  displayName: 'ЧЕРНЫЙ ГЛЯНЕЦ',
  colors: {
    primary: '#ffffff', // Белый для контраста на черном
    secondary: '#b8b8b9', // Светло-серый
    gold: '#fbbf24', // Золотой акцент
    goldLight: '#fde047',
    accent: '#d1d5db', // Серый акцент
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    dark: {
      bg: '#000000', // Чистый черный
      glass: 'rgba(0, 0, 0, 0.9)', // Почти черное стекло
      glassLight: 'rgba(30, 30, 30, 0.8)', // Светлее для глянца
      neomorphLight: 'rgba(255, 255, 255, 0.1)', // Белый отблеск для глянца
      neomorphDark: 'rgba(0, 0, 0, 0.6)',
      900: '#000000',
      800: '#0a0a0a', // Почти черный
      700: '#1a1a1a', // Очень темно-серый
      600: '#2a2a2a', // Темно-серый
    },
    light: {
      100: '#ffffff', // Белый текст
      200: '#f3f4f6', // Светло-серый
      300: '#e5e7eb', // Серый
    },
    rarity: {
      base: '#6b7280', // Серый
      rare: '#3b82f6', // Синий
      epic: '#8b5cf6', // Фиолетовый
      legendary: '#fbbf24', // Золотой
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.8)',
    md: '0 4px 6px rgba(0, 0, 0, 0.8)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.9)',
    xl: '0 20px 40px rgba(0, 0, 0, 1)',
    glow: {
      primary: '0 0 20px rgba(255, 255, 255, 0.3)', // Белое свечение
      secondary: '0 0 20px rgba(229, 231, 235, 0.3)', // Серое свечение
      gold: '0 0 25px rgba(251, 191, 36, 0.5)', // Золотое свечение
      accent: '0 0 20px rgba(209, 213, 219, 0.3)', // Серое свечение
    },
    neomorph: {
      light: '8px 8px 16px rgba(0, 0, 0, 0.8), -8px -8px 16px rgba(255, 255, 255, 0.05)', // Глянцевый эффект
      dark: 'inset 4px 4px 8px rgba(0, 0, 0, 0.8), inset -4px -4px 8px rgba(255, 255, 255, 0.05)',
      flat: '0 8px 32px rgba(0, 0, 0, 0.6)',
    },
    glass: {
      light: '0 8px 32px rgba(0, 0, 0, 0.6)',
      medium: '0 12px 40px rgba(0, 0, 0, 0.7)',
      heavy: '0 20px 60px rgba(0, 0, 0, 0.8)',
    },
  },
  neomorph: {
    bg: '#000000',
    radius: '16px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(0, 0, 0, 0.9)',
    bgLight: 'rgba(30, 30, 30, 0.8)',
    blur: 'blur(20px)',
    radius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)', // Тонкая белая граница для глянца
  },
}

// 10. Тема TWILIGHT - темные лунные цвета, серебристые и голубоватые оттенки
export const twilightTheme: Theme = {
  name: 'TWILIGHT',
  displayName: 'СУМЕРКИ',
  colors: {
    primary: '#cbd5e1', // Серебристый лунный свет
    secondary: '#94a3b8', // Голубовато-серый
    gold: '#fde047', // Лунное золото
    goldLight: '#fef08a',
    accent: '#e2e8f0', // Светло-серебристый
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    dark: {
      bg: '#020617', // Почти черный ночной фон
      glass: 'rgba(15, 23, 42, 0.9)', // Темное лунное стекло
      glassLight: 'rgba(30, 41, 59, 0.8)',
      neomorphLight: 'rgba(203, 213, 225, 0.12)', // Лунный серебристый отблеск
      neomorphDark: 'rgba(2, 6, 23, 0.6)',
      900: '#020617',
      800: '#0f172a', // Очень темно-синий
      700: '#1e293b', // Темно-синий
      600: '#334155', // Серо-синий
    },
    light: {
      100: '#f8fafc', // Почти белый лунный
      200: '#e2e8f0', // Серебристый
      300: '#cbd5e1', // Голубовато-серый
    },
    rarity: {
      base: '#94a3b8', // Голубовато-серый
      rare: '#cbd5e1', // Серебристый
      epic: '#e2e8f0', // Светло-серебристый
      legendary: '#fde047', // Лунное золото
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(2, 6, 23, 0.7)',
    md: '0 4px 6px rgba(2, 6, 23, 0.7)',
    lg: '0 10px 25px rgba(2, 6, 23, 0.8)',
    xl: '0 20px 40px rgba(2, 6, 23, 0.9)',
    glow: {
      primary: '0 0 25px rgba(203, 213, 225, 0.4)', // Лунное серебристое свечение
      secondary: '0 0 25px rgba(148, 163, 184, 0.4)', // Голубоватое свечение
      gold: '0 0 30px rgba(253, 224, 71, 0.5)', // Лунное золотое свечение
      accent: '0 0 20px rgba(226, 232, 240, 0.4)', // Светло-серебристое свечение
    },
    neomorph: {
      light: '8px 8px 16px rgba(2, 6, 23, 0.6), -8px -8px 16px rgba(203, 213, 225, 0.1)',
      dark: 'inset 4px 4px 8px rgba(2, 6, 23, 0.6), inset -4px -4px 8px rgba(203, 213, 225, 0.1)',
      flat: '0 8px 32px rgba(2, 6, 23, 0.5)',
    },
    glass: {
      light: '0 8px 32px rgba(2, 6, 23, 0.5)',
      medium: '0 12px 40px rgba(2, 6, 23, 0.6)',
      heavy: '0 20px 60px rgba(2, 6, 23, 0.7)',
    },
  },
  neomorph: {
    bg: '#020617',
    radius: '16px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(15, 23, 42, 0.9)',
    bgLight: 'rgba(30, 41, 59, 0.8)',
    blur: 'blur(20px)',
    radius: '20px',
    border: '1px solid rgba(203, 213, 225, 0.2)',
  },
}

// 11. Тема BASALT - вулканический базальт с зеленоватыми и коричневыми акцентами
export const basaltTheme: Theme = {
  name: 'BASALT',
  displayName: 'БАЗАЛЬТ',
  colors: {
    primary: '#16a34a', // Вулканический зеленый
    secondary: '#15803d', // Темно-зеленый
    gold: '#b45309', // Медное золото
    goldLight: '#d97706',
    accent: '#78716c', // Каменный коричневый
    danger: '#dc2626',
    warning: '#d97706',
    success: '#16a34a', // Зеленый
    dark: {
      bg: '#0c0a09', // Почти черный вулканический
      glass: 'rgba(20, 15, 12, 0.9)', // Базальтовое стекло
      glassLight: 'rgba(39, 35, 32, 0.8)',
      neomorphLight: 'rgba(22, 163, 74, 0.15)', // Зеленоватый вулканический отблеск
      neomorphDark: 'rgba(12, 10, 9, 0.6)',
      900: '#0c0a09',
      800: '#1c1917', // Темно-коричневый
      700: '#292524', // Коричневый
      600: '#3f3a37', // Светло-коричневый
    },
    light: {
      100: '#f5f5f4', // Светло-бежевый
      200: '#e7e5e4', // Бежевый
      300: '#d6d3d1', // Серо-бежевый
    },
    rarity: {
      base: '#78716c', // Каменный коричневый
      rare: '#16a34a', // Вулканический зеленый
      epic: '#15803d', // Темно-зеленый
      legendary: '#b45309', // Медное золото
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(12, 10, 9, 0.7)',
    md: '0 4px 6px rgba(12, 10, 9, 0.7)',
    lg: '0 10px 25px rgba(12, 10, 9, 0.8)',
    xl: '0 20px 40px rgba(12, 10, 9, 0.9)',
    glow: {
      primary: '0 0 20px rgba(22, 163, 74, 0.4)', // Вулканическое зеленое свечение
      secondary: '0 0 20px rgba(21, 128, 61, 0.4)', // Темно-зеленое свечение
      gold: '0 0 25px rgba(180, 83, 9, 0.5)', // Медное свечение
      accent: '0 0 15px rgba(120, 113, 108, 0.4)', // Каменное свечение
    },
    neomorph: {
      light: '8px 8px 16px rgba(12, 10, 9, 0.6), -8px -8px 16px rgba(22, 163, 74, 0.1)',
      dark: 'inset 4px 4px 8px rgba(12, 10, 9, 0.6), inset -4px -4px 8px rgba(22, 163, 74, 0.1)',
      flat: '0 8px 32px rgba(12, 10, 9, 0.5)',
    },
    glass: {
      light: '0 8px 32px rgba(12, 10, 9, 0.5)',
      medium: '0 12px 40px rgba(12, 10, 9, 0.6)',
      heavy: '0 20px 60px rgba(12, 10, 9, 0.7)',
    },
  },
  neomorph: {
    bg: '#0c0a09',
    radius: '16px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(20, 15, 12, 0.9)',
    bgLight: 'rgba(39, 35, 32, 0.8)',
    blur: 'blur(20px)',
    radius: '20px',
    border: '1px solid rgba(22, 163, 74, 0.3)',
  },
}

// Тема AMBITION - черно-золотая тема амбиций (на основе BLACK_GLOSS)
export const ambitionTheme: Theme = {
  name: 'AMBITION',
  displayName: 'АМБИЦИИ',
  colors: {
    primary: '#d4af37', // Строгое золото для контраста на черном
    secondary: '#b8860b', // Темное золото
    gold: '#d4af37', // Строгое золото
    goldLight: '#daa520', // Среднее золото
    accent: '#b8860b', // Темное золото акцент
    danger: '#dc2626',
    warning: '#d97706',
    success: '#10b981',
    dark: {
      bg: '#000000', // Чистый черный
      glass: 'rgba(0, 0, 0, 0.9)', // Почти черное стекло
      glassLight: 'rgba(30, 30, 30, 0.8)', // Светлее для глянца
      neomorphLight: 'rgba(212, 175, 55, 0.08)', // Слабый золотой отблеск для глянца
      neomorphDark: 'rgba(0, 0, 0, 0.6)',
      900: '#000000',
      800: '#0a0a0a', // Почти черный
      700: '#1a1a1a', // Очень темно-серый
      600: '#2a2a2a', // Темно-серый
    },
    light: {
      100: '#d4af37', // Строгое золото для текста
      200: '#daa520', // Среднее золото
      300: '#b8860b', // Темное золото
    },
    rarity: {
      base: '#6b7280', // Серый
      rare: '#b8860b', // Темное золото
      epic: '#d4af37', // Строгое золото
      legendary: '#d4af37', // Строгое золото
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.8)',
    md: '0 4px 6px rgba(0, 0, 0, 0.8)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.9)',
    xl: '0 20px 40px rgba(0, 0, 0, 1)',
    glow: {
      primary: 'none', // Без свечения
      secondary: 'none', // Без свечения
      gold: 'none', // Без свечения
      accent: 'none', // Без свечения
    },
    neomorph: {
      light: '8px 8px 16px rgba(0, 0, 0, 0.8), -8px -8px 16px rgba(212, 175, 55, 0.05)', // Глянцевый эффект с золотым
      dark: 'inset 4px 4px 8px rgba(0, 0, 0, 0.8), inset -4px -4px 8px rgba(212, 175, 55, 0.05)',
      flat: '0 8px 32px rgba(0, 0, 0, 0.6)',
    },
    glass: {
      light: '0 8px 32px rgba(0, 0, 0, 0.6)',
      medium: '0 12px 40px rgba(0, 0, 0, 0.7)',
      heavy: '0 20px 60px rgba(0, 0, 0, 0.8)',
    },
  },
  neomorph: {
    bg: '#000000',
    radius: '16px',
    radiusSm: '12px',
    radiusLg: '24px',
  },
  glass: {
    bg: 'rgba(0, 0, 0, 0.9)',
    bgLight: 'rgba(30, 30, 30, 0.8)',
    blur: 'blur(20px)',
    radius: '20px',
    border: '1px solid rgba(212, 175, 55, 0.15)', // Тонкая золотая граница для глянца
  },
}


// Обновляем объект themes
export const themes: Record<ThemeName, Theme> = {
  NEON: neonTheme,
  TWILIGHT: twilightTheme,
  STOIC: stoicTheme,
  OBSIDIAN: obsidianTheme,
  MINIMAL: minimalTheme,
  FOREST: forestTheme,
  DARK_GLASS: darkGlassTheme,
  SUNSET: sunsetTheme,
  MYTHOLOGY: mythologyTheme,
  BERSERK: berserkTheme,
  CYBERPUNK: cyberpunkTheme,
  OCEAN: oceanTheme,
  BLACK_GLOSS: blackGlossTheme,
  BASALT: basaltTheme,
  AMBITION: ambitionTheme,
}

export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName] || neonTheme
}