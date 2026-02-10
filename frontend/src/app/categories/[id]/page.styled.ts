import styled from 'styled-components'
import { motion } from 'framer-motion'



export const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
`

export const PageHeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

export const CategoryCard = styled(motion.div)`
  background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid #374151;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #00ff88 0%, #00d4ff 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    border-color: #00ff88;
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2);

    &::before {
      transform: scaleX(1);
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const CategoryIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  border: 2px solid #4b5563;

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    font-size: 2rem;
  }
`

export const CategoryName = styled.h3`
  font-size: 1.5rem;
  color: #f3f4f6;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const CategoryStats = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

export const StatItem = styled.div`
  background: rgba(0, 255, 136, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
  }
`

export const StatLabel = styled.span`
  color: #9ca3af;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`

export const StatValue = styled.span`
  color: #00ff88;
  font-weight: 700;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const ProgressRing = styled.svg`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 60px;
  height: 60px;
  transform: rotate(-90deg);

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    top: 0.75rem;
    right: 0.75rem;
  }
`

export const ProgressCircle = styled.circle`
  fill: none;
  stroke: #374151;
  stroke-width: 3;
`

export const ProgressFill = styled.circle<{ progress: number }>`
  fill: none;
  stroke: #00ff88;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 2 * Math.PI * 26;
  stroke-dashoffset: 2 * Math.PI * 26 * (1 - progress / 100);
  transition: stroke-dashoffset 0.5s ease;
`

export const ProgressText = styled.text`
  fill: #f3f4f6;
  font-size: 0.75rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`

export const AchievementPreview = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.4rem;
  }
`

export const PreviewItem = styled.div<{ unlocked: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(145deg, ${(props) => props.unlocked ? '#1f2937' : '#374151'} 0%, ${(props) => props.unlocked ? '#111827' : '#1f2937'} 100%);
  border: 2px solid ${(props) => props.unlocked ? '#00ff88' : '#4b5563'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  opacity: ${(props) => props.unlocked ? 1 : 0.4};

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
`

export const AchievementCount = styled.span`
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: #00ff88;
  color: #0a0e17;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid #0a0e17;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 0.625rem;
  }
`

export const BackButton = styled(motion.button)`
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  color: #f3f4f6;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
    transform: translateX(-5px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
`

export const CategoryInfo = styled.div`
  background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid #374151;
  margin-bottom: 2rem;
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1rem;
  }
`

export const CategoryIconLarge = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 20px;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  border: 2px solid #4b5563;

  @media (max-width: 768px) {
    width: 96px;
    height: 96px;
    font-size: 3rem;
  }
`

export const CategoryDetails = styled.div`
  flex: 1;
`

export const CategoryNameLarge = styled.h1`
  font-size: 2rem;
  color: #f3f4f6;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const CategoryStatsLarge = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

export const Stat = styled.div`
  background: rgba(0, 255, 136, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 12px;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

export const StatValueLarge = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #00ff88;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const StatLabelLarge = styled.div`
  color: #9ca3af;
  font-size: 0.875rem;
  margin-top: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #f3f4f6;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const SectionIcon = styled.span`
  font-size: 1.25rem;
`

export const AchievementGrid = styled.div<{ mode?: 'grid6' | 'grid2' | 'list' }>`
  display: grid;
  gap: 1.5rem;
  
  ${props => {
    if (props.mode === 'grid6') {
      return `
        grid-template-columns: repeat(6, 1fr);
        @media (max-width: 1400px) {
          grid-template-columns: repeat(5, 1fr);
        }
        @media (max-width: 1200px) {
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 900px) {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 600px) {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
      `
    } else if (props.mode === 'grid2') {
      return `
        grid-template-columns: repeat(2, 1fr);
        @media (max-width: 768px) {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
      `
    } else {
      return `
        grid-template-columns: 1fr;
        gap: 1rem;
      `
    }
  }}
`

export const AchievementListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const AchievementListItem = styled(motion.div) <{ unlocked: boolean }>`
  background: linear-gradient(145deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  border: 2px solid ${props => props.unlocked ? 'rgba(0, 212, 255, 0.5)' : 'rgba(55, 65, 81, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%);
    opacity: ${props => props.unlocked ? 0.8 : 0};
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: ${props => props.unlocked ? '#00d4ff' : '#4b5563'};
    transform: translateX(8px);
    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.15);

    &::before {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;

    &:hover {
      transform: translateX(4px);
    }
  }
`

export const AchievementListIcon = styled.div<{ unlocked: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: ${props => props.unlocked
    ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 168, 204, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(55, 65, 81, 0.5) 0%, rgba(31, 41, 55, 0.7) 100%)'};
  border: 2px solid ${props => props.unlocked ? 'rgba(0, 212, 255, 0.5)' : 'rgba(75, 85, 99, 0.5)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
  filter: ${props => props.unlocked ? 'drop-shadow(0 0 15px rgba(0, 212, 255, 0.4))' : 'grayscale(0.6) brightness(0.7)'};

  @media (max-width: 768px) {
    width: 52px;
    height: 52px;
    font-size: 1.5rem;
  }
`

export const AchievementListContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const AchievementListName = styled.h3`
  font-size: 1.25rem;
  color: #f3f4f6;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

export const AchievementListStatus = styled.span<{ unlocked: boolean }>`
  font-size: 0.875rem;
  color: ${props => props.unlocked ? '#00d4ff' : '#9ca3af'};
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`

export const UnlockedSection = styled(motion.section)`
  margin-bottom: 2rem;
`

export const LockedSection = styled(motion.section)`
  opacity: 0.6;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
  font-size: 1.125rem;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    font-size: 1rem;
  }
`

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`
