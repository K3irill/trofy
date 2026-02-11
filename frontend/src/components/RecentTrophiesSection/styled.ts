import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Container = styled(motion.section)`
  background: ${(props) => props.theme.glass.bg};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: 24px;
  padding: 2rem;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};

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
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;

  b{
    color: ${(props) => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const ShowAllButton = styled(motion.button)`
  background: ${(props) => `${props.theme.colors.primary}1a`};
  border: 1px solid ${(props) => `${props.theme.colors.primary}4d`};
  border-radius: 12px;
  padding: 0.625rem 1.25rem;
  color: ${(props) => props.theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: ${(props) => `${props.theme.colors.primary}33`};
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
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
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => props.theme.colors.neomorphLight};
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: ${(props) => props.theme.shadows.neomorph.flat};
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
    const rarityMap: Record<string, keyof typeof props.theme.colors.rarity> = {
      common: 'base',
      rare: 'rare',
      epic: 'epic',
      legendary: 'legendary',
    }
    const mappedRarity = rarityMap[props.rarity] || 'base'
    return props.theme.colors.rarity[mappedRarity] || props.theme.colors.light[300]
  }};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    box-shadow: 
      ${(props) => props.theme.shadows.glass.medium},
      0 0 25px ${(props) => {
    const rarityMap: Record<string, keyof typeof props.theme.colors.rarity> = {
      common: 'base',
      rare: 'rare',
      epic: 'epic',
      legendary: 'legendary',
    }
    const mappedRarity = rarityMap[props.rarity] || 'base'
    const rarityColor = props.theme.colors.rarity[mappedRarity] || props.theme.colors.light[300]
    return `${rarityColor}33`
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
    const rarityMap: Record<string, keyof typeof props.theme.colors.rarity> = {
      common: 'base',
      rare: 'rare',
      epic: 'epic',
      legendary: 'legendary',
    }
    const mappedRarity = rarityMap[props.rarity] || 'base'
    const rarityColor = props.theme.colors.rarity[mappedRarity] || props.theme.colors.light[300]
    return `${rarityColor}66`
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
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.125rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const TrophyDate = styled.div`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.8125rem;
`

export const TrophyRarity = styled.div <{ rarity: string }>`
  align-self: flex-start;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${(props) => {
    const rarityMap: Record<string, keyof typeof props.theme.colors.rarity> = {
      common: 'base',
      rare: 'rare',
      epic: 'epic',
      legendary: 'legendary',
    }
    const mappedRarity = rarityMap[props.rarity] || 'base'
    return props.theme.colors.rarity[mappedRarity] || props.theme.colors.light[300]
  }};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.25rem 0.75rem;
  background: ${(props) => {
    const rarityMap: Record<string, keyof typeof props.theme.colors.rarity> = {
      common: 'base',
      rare: 'rare',
      epic: 'epic',
      legendary: 'legendary',
    }
    const mappedRarity = rarityMap[props.rarity] || 'base'
    const rarityColor = props.theme.colors.rarity[mappedRarity] || props.theme.colors.light[300]
    return `${rarityColor}1a`
  }};
  border-radius: 6px;
`
