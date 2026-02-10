export const colors = {
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
}

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

export const shadows = {
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
}

export const theme = {
  colors,
  breakpoints,
  spacing,
  shadows,
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
