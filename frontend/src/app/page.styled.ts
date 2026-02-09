import styled from 'styled-components'
import { motion } from 'framer-motion'



export const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 40px rgba(0, 255, 136, 0.3);
`

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`

export const Section = styled.section`
  margin-bottom: 3rem;
`

export const SectionTitle = styled.h2`
  font-size: 1.75rem;
  color: #f3f4f6;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 4px;
    height: 32px;
    background: linear-gradient(180deg, #00ff88 0%, #00d4ff 100%);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
`

export const TopAchievementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const TopAchievementItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
  border-radius: 12px;
  border: 1px solid #374151;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ff88;
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
    transform: translateX(5px);
  }

  @media (max-width: 768px) {
    gap: 0.75rem;
    padding: 0.75rem;
  }
`

export const TopAchievementRank = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff 0%, #ff00ff 100%);
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a0e17;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
`

export const TopAchievementInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: 768px) {
    gap: 0.15rem;
  }
`

export const TopAchievementName = styled.h3`
  color: #f3f4f6;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const TopAchievementUser = styled.span`
  color: #9ca3af;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`

export const TopAchievementXP = styled.span`
  color: #00ff88;
  font-weight: 700;
  font-size: 0.875rem;
`
