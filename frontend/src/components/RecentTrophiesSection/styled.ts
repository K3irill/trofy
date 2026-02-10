import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Container = styled(motion.section)`
  background: rgba(26, 32, 44, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
  }
`

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`

export const SectionTitle = styled.h3`
  color: #f3f4f6;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;

  b{
    color: #00d4ff;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const ShowAllButton = styled(motion.button)`
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 0.625rem 1.25rem;
  color: #00d4ff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(0, 212, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
`

export const TrophiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

export const TrophyItem = styled(motion.div) <{ rarity: string }>`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 4px 4px 8px rgba(0, 0, 0, 0.2),
    inset -4px -4px 8px rgba(255, 255, 255, 0.02);
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
    height: 3px;
    background: ${(props) => {
    const colors = {
      base: '#1dd469',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#ffd700',
    }
    return colors[props.rarity as keyof typeof colors] || '#9ca3af'
  }};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.4),
      0 0 25px ${(props) => {
    const colors = {
      base: 'rgba(5, 178, 74, 0.2)',
      rare: 'rgba(59, 130, 246, 0.2)',
      epic: 'rgba(168, 85, 247, 0.2)',
      legendary: 'rgba(255, 215, 0, 0.2)',
    }
    return colors[props.rarity as keyof typeof colors] || 'rgba(156, 163, 175, 0.2)'
  }};
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 16px;
  }
`

export const TrophyIcon = styled.div <{ rarity: string }>`
  font-size: 3rem;
  align-self: flex-start;
  filter: drop-shadow(0 0 15px ${(props) => {
    const colors = {
      base: 'rgba(6, 158, 47, 0.4)',
      rare: 'rgba(59, 130, 246, 0.4)',
      epic: 'rgba(168, 85, 247, 0.4)',
      legendary: 'rgba(255, 215, 0, 0.4)',
    }
    return colors[props.rarity as keyof typeof colors] || 'rgba(156, 163, 175, 0.4)'
  }});

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

export const TrophyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const TrophyName = styled.div`
  color: #f3f4f6;
  font-size: 1.125rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const TrophyDate = styled.div`
  color: #9ca3af;
  font-size: 0.8125rem;
`

export const TrophyRarity = styled.div <{ rarity: string }>`
  align-self: flex-start;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${(props) => {
    const colors = {
      base: '#1dd469',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#ffd700',
    }
    return colors[props.rarity as keyof typeof colors] || '#9ca3af'
  }};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.25rem 0.75rem;
  background: ${(props) => {
    const colors = {
      base: 'rgba(9, 179, 89, 0.1)',
      rare: 'rgba(59, 130, 246, 0.1)',
      epic: 'rgba(168, 85, 247, 0.1)',
      legendary: 'rgba(255, 215, 0, 0.1)',
    }
    return colors[props.rarity as keyof typeof colors] || 'rgba(156, 163, 175, 0.1)'
  }};
  border-radius: 6px;
`
