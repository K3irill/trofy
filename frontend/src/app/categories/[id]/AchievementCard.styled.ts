import styled from 'styled-components'

type AchievementStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed'

export const AchievementCardContainer = styled.div<{ $status: AchievementStatus }>`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${(props) => {
    if (props.$status === 'completed') return `${props.theme.colors.success}80`
    if (props.$status === 'in_progress') return `#ffa50080`
    if (props.$status === 'unlocked') return `${props.theme.colors.primary}80`
    return `${props.theme.colors.dark[600]}80`
  }};
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
    background: ${(props) => {
      if (props.$status === 'completed') return `linear-gradient(90deg, ${props.theme.colors.success} 0%, ${props.theme.colors.success}CC 100%)`
      if (props.$status === 'in_progress') return `linear-gradient(90deg, #ffa500 0%, #ff8c00 100%)`
      if (props.$status === 'unlocked') return `linear-gradient(90deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`
      return 'transparent'
    }};
    opacity: ${(props) => (props.$status !== 'locked' ? 1 : 0)};
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: ${(props) => {
      if (props.$status === 'completed') return props.theme.colors.success
      if (props.$status === 'in_progress') return '#ffa500'
      if (props.$status === 'unlocked') return props.theme.colors.primary
      return props.theme.colors.dark[600]
    }};
    box-shadow: ${(props) => {
      if (props.$status === 'locked') return props.theme.shadows.glass.light
      return `${props.theme.shadows.glass.medium}, ${props.theme.shadows.glow.primary}`
    }};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    min-height: 160px;
  }
`

export const AchievementIcon = styled.div<{ $status: AchievementStatus }>`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: ${(props) => {
    if (props.$status === 'completed') return `linear-gradient(135deg, ${props.theme.colors.success}33 0%, ${props.theme.colors.success}1a 100%)`
    if (props.$status === 'in_progress') return `linear-gradient(135deg, #ffa50033 0%, #ff8c001a 100%)`
    if (props.$status === 'unlocked') return `linear-gradient(135deg, ${props.theme.colors.primary}33 0%, ${props.theme.colors.secondary}1a 100%)`
    return `linear-gradient(135deg, ${props.theme.colors.dark[600]}80 0%, ${props.theme.colors.dark[700]}b3 100%)`
  }};
  border: 2px solid ${(props) => {
    if (props.$status === 'completed') return `${props.theme.colors.success}80`
    if (props.$status === 'in_progress') return `#ffa50080`
    if (props.$status === 'unlocked') return `${props.theme.colors.primary}80`
    return `${props.theme.colors.dark[600]}80`
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  position: relative;
  transition: all 0.3s ease;
  filter: ${(props) => {
    if (props.$status === 'locked') return 'grayscale(0.6) brightness(0.7)'
    return `drop-shadow(${props.theme.shadows.glow.primary})`
  }};
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

export const StatusBadge = styled.div<{ $status: 'completed' | 'in_progress' }>`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  border: 2px solid ${(props) => props.theme.colors.dark.bg};
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
  transform: translateZ(30px);

  ${(props) =>
    props.$status === 'completed' &&
    `
    background: linear-gradient(135deg, ${props.theme.colors.success} 0%, ${props.theme.colors.success}CC 100%);
    color: ${props.theme.colors.dark.bg};
  `}

  ${(props) =>
    props.$status === 'in_progress' &&
    `
    background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%);
    color: ${props.theme.colors.dark.bg};
  `}

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
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

export const AchievementStatus = styled.span<{ $status: AchievementStatus }>`
  font-size: 0.75rem;
  color: ${(props) => {
    if (props.$status === 'completed') return props.theme.colors.success
    if (props.$status === 'in_progress') return '#ffa500'
    if (props.$status === 'unlocked') return props.theme.colors.primary
    return props.theme.colors.light[300]
  }};
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
  }
`
