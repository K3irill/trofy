import styled from 'styled-components'
import { motion } from 'framer-motion'

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

export const BackButton = styled(motion.button)`
  background: linear-gradient(135deg, ${(props) => props.theme.colors.dark[600]} 0%, ${(props) => props.theme.colors.dark[700]} 100%);
  color: ${(props) => props.theme.colors.light[100]};
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  margin-bottom: 2.5rem;
  box-shadow: ${(props) => props.theme.shadows.glass.light};

  svg {
    font-size: 1.25rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg, ${(props) => props.theme.colors.dark[700]} 0%, ${(props) => props.theme.colors.dark[600]} 100%);
    transform: translateX(-8px);
    border-color: ${(props) => props.theme.colors.primary}60;
    box-shadow: ${(props) => props.theme.shadows.glass.medium};

    svg {
      transform: translateX(-3px);
    }
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    gap: 0.5rem;

    svg {
      font-size: 1rem;
    }
  }
`

export const HiddenBanner = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.danger}20 0%, ${(props) => props.theme.colors.danger}10 100%);
  border: 2px solid ${(props) => props.theme.colors.danger}60;
  border-radius: 12px;
  color: ${(props) => props.theme.colors.danger};
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  box-shadow: ${(props) => props.theme.shadows.glass.light};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, ${(props) => props.theme.colors.danger}10, transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  svg {
    font-size: 1.25rem;
    flex-shrink: 0;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.25rem;
    font-size: 0.8125rem;
    gap: 0.5rem;

    svg {
      font-size: 1.125rem;
    }
  }
`

export const AchievementHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 1rem;
  padding: 3rem;
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}f0 0%, ${(props) => props.theme.colors.dark[800]}f5 100%);
  border-radius: 24px;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}60;
  box-shadow: ${(props) => props.theme.shadows.glass.medium};
  position: relative;
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 50%, ${(props) => props.theme.colors.primary}15 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 2rem 1.5rem;
  }
`

export const AchievementIcon = styled.div<{ $unlocked: boolean }>`
  width: 240px;
  height: 240px;
  border-radius: 28px;
  background: ${props => props.$unlocked
    ? `linear-gradient(135deg, ${props.theme.colors.primary}40 0%, ${props.theme.colors.secondary}20 50%, ${props.theme.colors.gold}15 100%)`
    : `linear-gradient(135deg, ${props.theme.colors.dark[600]}90 0%, ${props.theme.colors.dark[700]}b3 100%)`};
  border: 4px solid ${props => props.$unlocked ? `${props.theme.colors.primary}90` : `${props.theme.colors.dark[600]}90`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7rem;
  filter: ${props => props.$unlocked ? `drop-shadow(${props.theme.shadows.glow.primary}) drop-shadow(${props.theme.shadows.glow.gold})` : 'grayscale(0.7) brightness(0.6)'};
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  box-shadow: ${props => props.$unlocked
    ? `${props.theme.shadows.glass.heavy}, ${props.theme.shadows.glow.primary}40`
    : props.theme.shadows.glass.medium};

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: ${props => props.$unlocked
    ? `conic-gradient(from 0deg, transparent, ${props.theme.colors.primary}20, transparent 30%)`
    : 'transparent'};
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    animation: ${props => props.$unlocked ? 'rotate 3s linear infinite' : 'none'};
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$unlocked
    ? `radial-gradient(circle at center, ${props.theme.colors.primary}25 0%, transparent 70%)`
    : 'transparent'};
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }

  &:hover {
    transform: translateZ(30px) scale(1.08);
    border-color: ${props => props.$unlocked ? props.theme.colors.primary : props.theme.colors.light[300]};
    box-shadow: ${props => props.$unlocked
    ? `${props.theme.shadows.glass.heavy}, ${props.theme.shadows.glow.primary}60, ${props.theme.shadows.glow.gold}40`
    : props.theme.shadows.glass.medium};

    &::before {
      opacity: ${props => props.$unlocked ? 1 : 0};
    }

    &::after {
      opacity: 1;
    }
  }

  &:active {
    transform: translateZ(10px) scale(1.02);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 180px;
    height: 180px;
    font-size: 6rem;
    border-radius: 24px;
  }
`

export const AchievementTitle = styled.h1`
  font-size: 3rem;
  color: ${(props) => props.theme.colors.light[100]};
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.light[100]} 0%, ${(props) => props.theme.colors.primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`

export const AchievementDescription = styled.p`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.light[200]};
  line-height: 1.8;
  margin-bottom: 1rem;
  padding: 2rem;
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}f0 0%, ${(props) => props.theme.colors.dark[800]}f5 100%);
  border-radius: 20px;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}60;
  box-shadow: ${(props) => props.theme.shadows.glass.light};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
    border-radius: 20px 0 0 20px;
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
    padding: 1.5rem;
    line-height: 1.6;
  }
`

export const AchievementIndicators = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`

export const IndicatorIcon = styled.div<{ $warning?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${(props) => props.$warning
    ? `linear-gradient(135deg, ${props.theme.colors.danger}30 0%, ${props.theme.colors.danger}20 100%)`
    : `linear-gradient(135deg, ${props.theme.colors.primary}30 0%, ${props.theme.colors.secondary}20 100%)`};
  border: 2px solid ${(props) => props.$warning ? props.theme.colors.danger : props.theme.colors.primary}60;
  color: ${(props) => props.$warning ? props.theme.colors.danger : props.theme.colors.primary};
  font-size: 1.125rem;
  cursor: help;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.15);
    box-shadow: ${(props) => props.$warning
    ? `${props.theme.shadows.glow.danger}`
    : `${props.theme.shadows.glow.primary}`};
    border-color: ${(props) => props.$warning ? props.theme.colors.danger : props.theme.colors.primary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

export const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`
