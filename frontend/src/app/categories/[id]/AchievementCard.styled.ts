import styled from 'styled-components'

export const AchievementCardContainer = styled.div<{ $unlocked: boolean }>`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${props => props.$unlocked ? `${props.theme.colors.primary}80` : `${props.theme.colors.dark[600]}80`};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-height: 180px;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
    opacity: ${props => props.$unlocked ? 1 : 0};
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: ${props => props.$unlocked ? props.theme.colors.primary : props.theme.colors.dark[600]};
    box-shadow: ${props => props.$unlocked
    ? `${props.theme.shadows.glass.medium}, ${props.theme.shadows.glow.primary}`
    : props.theme.shadows.glass.light};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    min-height: 160px;
  }
`

export const AchievementIcon = styled.div<{ $unlocked: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: ${props => props.$unlocked
    ? `linear-gradient(135deg, ${props.theme.colors.primary}33 0%, ${props.theme.colors.secondary}1a 100%)`
    : `linear-gradient(135deg, ${props.theme.colors.dark[600]}80 0%, ${props.theme.colors.dark[700]}b3 100%)`};
  border: 2px solid ${props => props.$unlocked ? `${props.theme.colors.primary}80` : `${props.theme.colors.dark[600]}80`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  position: relative;
  transition: all 0.3s ease;
  filter: ${props => props.$unlocked ? `drop-shadow(${props.theme.shadows.glow.primary})` : 'grayscale(0.6) brightness(0.7)'};
  transform: translateZ(20px);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    font-size: 2rem;
  }
`

export const UnlockedBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.dark.bg};
  border: 2px solid ${(props) => props.theme.colors.dark.bg};
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
  transform: translateZ(30px);

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 0.625rem;
    top: -6px;
    right: -6px;
  }
`

export const AchievementInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  transform: translateZ(10px);
`

export const AchievementName = styled.h3`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.light[100]};
  font-weight: 600;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const AchievementStatus = styled.span<{ $unlocked: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$unlocked ? props.theme.colors.primary : props.theme.colors.light[300]};
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
  }
`
