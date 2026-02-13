import styled from 'styled-components'
import { motion } from 'framer-motion'

export const ProfileContainer = styled(motion.div) <{ $isBlurred?: boolean }>`
  background: ${(props) => props.theme.glass.bg};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  text-align: center;
  position: relative;
  overflow: hidden;
  filter: ${(props) => (props.$isBlurred ? 'brightness(1)' : 'none')};
  transition: filter 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 20%, ${(props) => `${props.theme.colors.primary}0d`} 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 20px;
  }
`
export const ProfileTitleWrap = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
      display: none;
    }
 `


export const MainInfoWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: auto;
  }
`

export type ProfileThemeType =
  | 'midnight'
  | 'deepBlue'
  | 'velvetPurple'
  | 'forest'
  | 'cosmic'
  | 'sunset'
  | 'nebula'
  | 'aurora'
  | 'gold'
  | 'platinum'
  | 'dragonScale'

export type MainInfoProps = {
  profileTheme?: ProfileThemeType
}

export const mapProfileColorToTheme = (color: string): ProfileThemeType => {
  const colorMap: Record<string, ProfileThemeType> = {
    'dark': 'midnight',
    'blue': 'deepBlue',
    'purple': 'velvetPurple',
    'green': 'forest',
    'orange': 'sunset',
    'pink': 'nebula',
    'red': 'aurora',
    'yellow': 'gold'
  }
  return colorMap[color] || 'midnight'
}

const getThemeStyles = (theme: MainInfoProps['profileTheme'] = 'midnight') => {
  const themes = {
    midnight: {
      gradient: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      shadow: '0 8px 32px rgba(15, 23, 42, 0.4)',
      accent: 'rgba(148, 163, 184, 0.15)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      overlay: 'rgba(15, 23, 42, 0.7)',
      name: 'Полночь'
    },
    deepBlue: {
      gradient: 'linear-gradient(145deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
      shadow: '0 8px 32px rgba(30, 58, 138, 0.35)',
      accent: 'rgba(59, 130, 246, 0.2)',
      border: '1px solid rgba(96, 165, 250, 0.2)',
      overlay: 'rgba(30, 58, 138, 0.6)',
      name: 'Глубокий синий'
    },
    velvetPurple: {
      gradient: 'linear-gradient(145deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)',
      shadow: '0 8px 32px rgba(76, 29, 149, 0.35)',
      accent: 'rgba(124, 58, 237, 0.2)',
      border: '1px solid rgba(167, 139, 250, 0.2)',
      overlay: 'rgba(76, 29, 149, 0.6)',
      name: 'Бархатный фиолет'
    },
    forest: {
      gradient: 'linear-gradient(145deg, #064e3b 0%, #059669 50%, #34d399 100%)',
      shadow: '0 8px 32px rgba(6, 78, 59, 0.35)',
      accent: 'rgba(5, 150, 105, 0.2)',
      border: '1px solid rgba(52, 211, 153, 0.2)',
      overlay: 'rgba(6, 78, 59, 0.6)',
      name: 'Лес'
    },

    // Более уникальные с изюминкой
    cosmic: {
      gradient: 'linear-gradient(145deg, #1e1b4b 0%, #3730a3 50%, #818cf8 100%)',
      shadow: '0 8px 32px rgba(30, 27, 75, 0.4), 0 0 24px rgba(129, 140, 248, 0.3)',
      accent: 'rgba(129, 140, 248, 0.25)',
      border: '1px solid rgba(129, 140, 248, 0.3)',
      overlay: 'rgba(30, 27, 75, 0.7)',
      name: 'Космос'
    },
    sunset: {
      gradient: 'linear-gradient(145deg, #7c2d12 0%, #ea580c 50%, #fb923c 100%)',
      shadow: '0 8px 32px rgba(124, 45, 18, 0.35)',
      accent: 'rgba(234, 88, 12, 0.2)',
      border: '1px solid rgba(251, 146, 60, 0.2)',
      overlay: 'rgba(124, 45, 18, 0.6)',
      name: 'Закат'
    },
    nebula: {
      gradient: 'linear-gradient(145deg, #500724 0%, #be185d 50%, #f472b6 100%)',
      shadow: '0 8px 32px rgba(80, 7, 36, 0.4), 0 0 20px rgba(244, 114, 182, 0.2)',
      accent: 'rgba(190, 24, 93, 0.25)',
      border: '1px solid rgba(244, 114, 182, 0.25)',
      overlay: 'rgba(80, 7, 36, 0.7)',
      name: 'Туманность'
    },
    aurora: {
      gradient: 'linear-gradient(145deg, #064e3b 0%, #0d9488 50%, #22d3ee 100%)',
      shadow: '0 8px 32px rgba(6, 78, 59, 0.35)',
      accent: 'rgba(13, 148, 136, 0.2)',
      border: '1px solid rgba(34, 211, 238, 0.2)',
      overlay: 'rgba(6, 78, 59, 0.6)',
      name: 'Северное сияние'
    },

    // Премиум-темы (разблокируются за достижения)
    gold: {
      gradient: 'linear-gradient(145deg, #78350f 0%, #d97706 50%, #fbbf24 100%)',
      shadow: '0 8px 40px rgba(120, 53, 15, 0.5), 0 0 30px rgba(251, 191, 36, 0.3)',
      accent: 'rgba(217, 119, 6, 0.25)',
      border: '1px solid rgba(251, 191, 36, 0.3)',
      overlay: 'rgba(120, 53, 15, 0.7)',
      name: 'Золото'
    },
    platinum: {
      gradient: 'linear-gradient(145deg, #374151 0%, #9ca3af 50%, #d1d5db 100%)',
      shadow: '0 8px 40px rgba(55, 65, 81, 0.5), 0 0 30px rgba(209, 213, 219, 0.2)',
      accent: 'rgba(156, 163, 175, 0.25)',
      border: '1px solid rgba(209, 213, 219, 0.3)',
      overlay: 'rgba(55, 65, 81, 0.7)',
      name: 'Платина'
    },
    dragonScale: {
      gradient: 'linear-gradient(145deg, #064e3b 0%, #0891b2 50%, #7dd3fc 100%)',
      shadow: '0 8px 40px rgba(6, 78, 59, 0.5), 0 0 30px rgba(125, 211, 252, 0.3)',
      accent: 'rgba(8, 145, 178, 0.25)',
      border: '1px solid rgba(125, 211, 252, 0.25)',
      overlay: 'rgba(6, 78, 59, 0.7)',
      name: 'Чешуя дракона'
    }
  }
  return themes[theme] || themes.midnight
}

export const MainInfo = styled.div<MainInfoProps>`
  padding: 1.5rem;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  background: ${props => getThemeStyles(props.profileTheme).gradient};
  box-shadow: ${props => getThemeStyles(props.profileTheme).shadow};
  border: ${props => getThemeStyles(props.profileTheme).border};



  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    animation: shimmer 8s infinite linear;
    
  }

  @keyframes shimmer {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    100% {
      transform: translate(-20%, -20%) rotate(5deg);
    }
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    margin-bottom: 1rem;
    border-radius: 20px;
  }
`


export const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  border: 4px solid ${(props) => props.theme.colors.neomorphLight};
  box-shadow: 
    ${(props) => props.theme.shadows.glow.primary},
    inset 0 0 20px ${(props) => props.theme.colors.neomorphLight};
  position: relative;
  z-index: 1;
  overflow: hidden;

  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;

  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 3rem;
  }
`

export const Username = styled.h2`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const Level = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.gold} 0%, ${(props) => props.theme.colors.goldLight} 100%);
  color: ${(props) => props.theme.colors.dark.bg};
  padding: 0.5rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  box-shadow: ${(props) => props.theme.shadows.glow.gold};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 0.4rem 1.25rem;
    font-size: 0.875rem;
  }
`

export const LevelRing = styled.div`
  position: absolute;
  bottom: 0;
  right: -5px;
  width: 40px;
  height: 40px;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    right: -3px;
  }
`

export const XPBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  box-shadow: ${(props) => props.theme.shadows.neomorph.dark};
`

export const XPProgress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  border-radius: 12px;
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
`

export const XPText = styled.p`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.875rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`
export const StatsSection = styled.div``


export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  position: relative;
  z-index: 1;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
`

export const StatItem = styled.div`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.colors.neomorphLight};
  backdrop-filter: blur(10px);
  box-shadow: ${(props) => props.theme.shadows.neomorph.dark};

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
`

export const StatValue = styled(motion.div)`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  text-shadow: ${(props) => props.theme.shadows.glow.primary};
  font-family: 'Courier New', monospace;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const StatLabel = styled.div`
  font-size: 0.6875rem;
  color: ${(props) => props.theme.colors.light[300]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
`

export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
`

export const StatusInput = styled.textarea`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => props.theme.colors.dark.neomorphLight};
  border-radius: 12px;
  padding: 0.5rem 1rem 1rem;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.875rem;
  text-align: center;
  width: 100%;
  min-height: 40px;
  max-height: 200px;
  max-width: 300px;
  transition: all 0.3s ease;
  outline: none;
  resize: none;
  overflow: hidden;
  line-height: 1.5;
  font-family: inherit;

  &:focus {
    border-color: ${(props) => `${props.theme.colors.primary}4d`};
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
    color: ${(props) => props.theme.colors.light[100]};
  }

  &::placeholder {
    color: ${(props) => `${props.theme.colors.light[300]}80`};
  }
`

export const BadgesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`

export const Badge = styled(motion.div) <{ rarity: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.rarity) {
      case 'legendary':
        return `
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
          color: #fff;
          box-shadow: 0 0 15px rgba(255, 107, 107, 0.5);
        `
      case 'epic':
        return `
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
          color: #fff;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
        `
      case 'rare':
        return `
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #fff;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        `
      default:
        return `
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
        `
    }
  }}
`

export const SectionTitle = styled.h3`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const RareTrophiesSection = styled.div`
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`

export const RareTrophiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`

export const TrophyCard = styled(motion.div) <{ isNew: boolean }>`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid ${(props) => props.theme.colors.neomorphLight};
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${props => props.isNew && `
    animation: pulse-border 2s infinite;
  `}

  @keyframes pulse-border {
    0%, 100% {
      border-color: ${(props) => `${props.theme.colors.primary}4d`};
      box-shadow: ${(props) => props.theme.shadows.glow.primary};
    }
    50% {
      border-color: ${(props) => `${props.theme.colors.primary}cc`};
      box-shadow: ${(props) => props.theme.shadows.glow.primary};
    }
  }

  &:hover {
    transform: translateY(-5px) rotateY(10deg);
    box-shadow: ${(props) => props.theme.shadows.glass.medium};
    border-color: ${(props) => `${props.theme.colors.primary}4d`};
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`

export const TrophyIcon = styled(motion.div) <{ rarity: string }>`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 2.5rem;
  filter: ${props => {
    switch (props.rarity) {
      case 'legendary':
        return 'drop-shadow(0 0 15px rgba(255, 107, 107, 0.8))'
      case 'epic':
        return 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.8))'
      case 'rare':
        return 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.8))'
      default:
        return 'drop-shadow(0 0 10px rgba(156, 163, 175, 0.5))'
    }
  }};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    height: 2rem;
  }
`

export const TrophyTitle = styled.div`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.6875rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`

export const AddTrophyButton = styled(motion.button)`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px dashed ${(props) => props.theme.colors.dark[600]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  width: 100%;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background: ${(props) => `${props.theme.colors.primary}1a`};
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    min-height: 100px;
  }
`
export const AddTrophyIcon = styled.div`
  font-size: 2.5rem;
  color: ${(props) => props.theme.colors.light[300]};
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
`

export const AddGoalButton = styled(motion.button)`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px dashed ${(props) => props.theme.colors.dark[600]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 80px;
  width: 100%;

  .trophy-icon {
    font-size: 1.5rem;
    margin-bottom: 0;
  }

  .trophy-text {
    font-size: 0.8125rem;
  }

  &:hover .trophy-icon {
    color: ${(props) => props.theme.colors.primary};
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`



export const AddTrophyText = styled.div`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.6875rem;
  font-weight: 600;
  text-align: center;

  ${AddTrophyButton}:hover & {
    color: ${(props) => props.theme.colors.primary};
  }

  ${AddGoalButton}:hover & {
    color: ${(props) => props.theme.colors.primary};
  }
`

export const CurrentGoalsSection = styled.div`
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`
export const CurrentGoals = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`


export const GoalItem = styled(motion.div) <{ $isComplete?: boolean }>`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.colors.neomorphLight};
  transition: all 0.3s ease;
  min-height: 80px;
  display: flex;
  align-items: center;

  ${(props) =>
    props.$isComplete &&
    `
    border-color: ${props.theme.colors.success || '#10b981'};
    box-shadow: 0 0 20px ${props.theme.colors.success || '#10b981'}40;
    background: linear-gradient(145deg, ${props.theme.colors.dark.neomorphDark} 0%, ${props.theme.colors.success || '#10b981'}15 100%);
    animation: pulse-complete 2s infinite;
  `}

  @keyframes pulse-complete {
    0%, 100% {
      box-shadow: 0 0 20px ${(props) => (props.theme.colors.success || '#10b981') + '40'};
      border-color: ${(props) => props.theme.colors.success || '#10b981'};
    }
    50% {
      box-shadow: 0 0 30px ${(props) => (props.theme.colors.success || '#10b981') + '80'};
      border-color: ${(props) => (props.theme.colors.success || '#10b981') + 'CC'};
    }
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
  }
`

export const GoalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 1rem;
`

export const GoalIcon = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.dark.glassLight};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

export const GoalContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const GoalTitle = styled.div`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.8125rem;
  font-weight: 500;
`

export const GoalProgress = styled.div<{ $isComplete?: boolean }>`
  color: ${(props) => (props.$isComplete ? props.theme.colors.success || '#10b981' : props.theme.colors.primary)};
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: ${(props) => (props.$isComplete ? `0 0 10px ${props.theme.colors.success || '#10b981'}80` : 'none')};
  transition: all 0.3s ease;
`

export const GoalBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border-radius: 6px;
  overflow: hidden;
`

export const GoalProgressBar = styled(motion.div) <{ $isComplete?: boolean }>`
  height: 100%;
  background: ${(props) =>
    props.$isComplete
      ? `linear-gradient(90deg, ${props.theme.colors.success || '#10b981'} 0%, ${props.theme.colors.success || '#10b981'}CC 100%)`
      : `linear-gradient(90deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
  border-radius: 6px;
  box-shadow: ${(props) => (props.$isComplete ? `0 0 10px ${props.theme.colors.success || '#10b981'}80` : 'none')};
  transition: all 0.3s ease;
`

export const RemoveButton = styled(motion.button)`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.dark.glassLight};
  border: 1px solid ${(props) => props.theme.colors.neomorphLight};
  border-radius: 50%;
  color: ${(props) => props.theme.colors.light[300]};
  cursor: pointer;
  z-index: 10;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    background: ${(props) => props.theme.colors.danger};
    border-color: ${(props) => props.theme.colors.danger};
    color: ${(props) => props.theme.colors.light[100]};
    transform: scale(1.1);
  }

  svg {
    width: 100%;
    height: 100%;
  }
`

export const StreakContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    margin-bottom: 1.5rem;
  }
`

export const StreakFlame = styled(motion.span)`
  font-size: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.8));
`

export const StreakText = styled.div`
  color: #ff6b6b;
  font-size: 0.875rem;
  font-weight: 600;
`

export const StreakDays = styled(motion.div)`
  color: #f3f4f6;
  font-size: 1.5rem;
  font-weight: 700;
`


export const ShareButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem;
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => props.theme.colors.neomorphLight};
  border-radius: 12px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  position: relative;
  z-index: 1;

  &:hover {
    background: ${(props) => `${props.theme.colors.primary}1a`};
    border-color: ${(props) => `${props.theme.colors.primary}4d`};
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.8125rem;
  }
`

export const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 2;
`

export const Particle = styled(motion.div) <{ color: string }>`
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 0 10px ${props => props.color};
`

export const QuickActionsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

 
`

export const QuickActionButton = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => `${props.theme.colors.primary}80`};
  box-shadow: ${(props) => props.theme.shadows.neomorph.dark};
  border-radius: 16px;
  color: ${(props) => props.theme.colors.light[100]};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => `${props.theme.colors.primary}1a`};
    border-color: ${(props) => `${props.theme.colors.primary}4d`};
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
  }

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    border-radius: 12px;
  }
`

export const ButtonIcon = styled.span`
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const ButtonText = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`

export const ProfileOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  gap: 1.5rem;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1rem;
  }
`

export const OverlayTitle = styled.h3`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const OverlayButton = styled(motion.button)`
  padding: 0.875rem 2rem;
  background: ${(props) => props.theme.colors.secondary};
  border: none;
  border-radius: 12px;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: ${(props) => props.theme.shadows.glow.secondary};
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }
`
