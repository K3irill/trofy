import styled from 'styled-components'

export const AchievementCardContainer = styled.div<{ unlocked: boolean }>`
  background: linear-gradient(145deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${props => props.unlocked ? 'rgba(0, 212, 255, 0.5)' : 'rgba(55, 65, 81, 0.5)'};
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
    background: linear-gradient(90deg, #00d4ff 0%, #00a8cc 100%);
    opacity: ${props => props.unlocked ? 1 : 0};
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: ${props => props.unlocked ? '#00d4ff' : '#4b5563'};
    box-shadow: ${props => props.unlocked
    ? '0 20px 40px rgba(0, 212, 255, 0.2), 0 0 20px rgba(0, 212, 255, 0.1)'
    : '0 10px 20px rgba(0, 0, 0, 0.2)'};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    min-height: 160px;
  }
`

export const AchievementIcon = styled.div<{ unlocked: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: ${props => props.unlocked
    ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 168, 204, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(55, 65, 81, 0.5) 0%, rgba(31, 41, 55, 0.7) 100%)'};
  border: 2px solid ${props => props.unlocked ? 'rgba(0, 212, 255, 0.5)' : 'rgba(75, 85, 99, 0.5)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  position: relative;
  transition: all 0.3s ease;
  filter: ${props => props.unlocked ? 'drop-shadow(0 0 15px rgba(0, 212, 255, 0.4))' : 'grayscale(0.6) brightness(0.7)'};
  transform: translateZ(20px);

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
  background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0a0e17;
  border: 2px solid #0a0e17;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
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
  color: #f3f4f6;
  font-weight: 600;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const AchievementStatus = styled.span<{ unlocked: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.unlocked ? '#00d4ff' : '#9ca3af'};
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
  }
`
