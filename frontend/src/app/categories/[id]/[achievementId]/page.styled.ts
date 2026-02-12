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
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-bottom: 2rem;

  &:hover {
    background: linear-gradient(135deg, ${(props) => props.theme.colors.dark[700]} 0%, ${(props) => props.theme.colors.dark[600]} 100%);
    transform: translateX(-5px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
`

export const AchievementHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  border-radius: 20px;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem;
  }
`

export const AchievementIcon = styled.div<{ $unlocked: boolean }>`
  width: 200px;
  height: 200px;
  border-radius: 24px;
  background: ${props => props.$unlocked
    ? `linear-gradient(135deg, ${props.theme.colors.primary}33 0%, ${props.theme.colors.secondary}1a 100%)`
    : `linear-gradient(135deg, ${props.theme.colors.dark[600]}80 0%, ${props.theme.colors.dark[700]}b3 100%)`};
  border: 3px solid ${props => props.$unlocked ? `${props.theme.colors.primary}80` : `${props.theme.colors.dark[600]}80`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
  filter: ${props => props.$unlocked ? `drop-shadow(${props.theme.shadows.glow.primary})` : 'grayscale(0.6) brightness(0.7)'};
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$unlocked
    ? `radial-gradient(circle at center, ${props.theme.colors.primary}1a 0%, transparent 70%)`
    : 'transparent'};
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateZ(20px) scale(1.05);
    border-color: ${props => props.$unlocked ? props.theme.colors.primary : props.theme.colors.light[300]};
    box-shadow: ${props => props.$unlocked
    ? `${props.theme.shadows.glass.heavy}, ${props.theme.shadows.glow.primary}`
    : props.theme.shadows.glass.medium};

    &::before {
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
    width: 160px;
    height: 160px;
    font-size: 5rem;
    border-radius: 20px;
  }
`

export const AchievementTitle = styled.h1`
  font-size: 2.5rem;
  color: ${(props) => props.theme.colors.light[100]};
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

export const AchievementDescription = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.light[300]};
  line-height: 1.6;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  border-radius: 16px;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 1.25rem;
  }
`

export const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`
