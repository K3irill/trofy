import styled from 'styled-components'
import { motion } from 'framer-motion'

export const ShowcaseContainer = styled(motion.aside)`
  background: rgba(26, 32, 44, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem 0;
    gap: 0.5rem;
    border-radius: 20px;
  }
`

export const ShowcaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 0 1.5rem ;
  }
`

export const ShowcaseTitle = styled.h3`
  color: #f3f4f6;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    display: none;
  }
`

export const ToggleContainer = styled.div`
  position: relative;
  display: flex;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  padding: 4px;
  box-shadow: 
    inset 2px 2px 4px rgba(0, 0, 0, 0.5),
    inset -2px -2px 4px rgba(255, 255, 255, 0.02);
`

export const SwitchOption = styled(motion.button) <{ active: boolean; position: 'left' | 'center' | 'right' }>`
  position: relative;
  z-index: 1;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 16px;
  color: ${(props) => props.active ? '#ffffff' : '#9ca3af'};
  font-size: 0.6875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: #f3f4f6;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.625rem;
  }

  &::before{
    position: absolute;
    content: '';
    display: block;
    opacity:  ${(props) => props.active ? 1 : 0};
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
    border-radius: 16px;
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  


    @media (max-width: 768px) {
      border-radius: 12px;
    }
  }
`



export const TrophiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 50vh;
  overflow-y: scroll;
  scrollbar-width: none;

  @media (max-width: 768px) {
    flex-direction: row;
    overflow: hidden;
    gap: 0.5rem;
    padding: 0 1rem;
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 5%,
      black 95%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 5%,
      black 95%,
      transparent 100%
    );
  }
`

export const TrophiesScrollTrack = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;


  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  @media (max-width: 768px) {
    flex-direction: row;
    animation: scroll 30s linear infinite;

    &:hover {
      animation-play-state: paused;
    }
  }
`

export const DuplicateItems = styled(motion.div)`
  @media (min-width: 769px) {
    display: none;
  }
`

export const TrophyItem = styled(motion.div) <{ rarity: string }>`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1rem;
  display: flex;
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
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 4px;
    background: ${(props) => {
    const colors = {
      base: '#1dd469',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#ffd700',
    }
    return colors[props.rarity as keyof typeof colors] || '#9ca3af'
  }};
    border-radius: 20px;
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
      base: 'rgba(5, 190, 64, 0.2)',
      rare: 'rgba(59, 130, 246, 0.2)',
      epic: 'rgba(168, 85, 247, 0.2)',
      legendary: 'rgba(255, 215, 0, 0.2)',
    }
    return colors[props.rarity as keyof typeof colors] || 'rgba(156, 163, 175, 0.2)'
  }};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: fit-content;
    padding: 0.6rem;
    border-radius: 16px;
    gap: 0;
    width: 150px;
    min-width: 150px;
    box-shadow: none;

    &::before{
      content: none;
    }
  }
`

export const TrophyHeader = styled.div <{ rarity: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  span{
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    flex-shrink: 0;
    box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.4), inset -2px -2px 4px rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 14px;
    width: 56px;
    height: 56px;

  }

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: nowrap;
    span{

      width: 48px;
      height: 48px;
      border-radius: 12px;
    }
  }
`

export const TrophyIcon = styled.span`
  font-size: 2rem;
  filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.4));

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

export const TrophyContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0;
  }
`

export const TrophyInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0;
    display: none;
  }
`

export const TrophyName = styled.div`
  color: #f3f4f6;
  font-size: 1rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`

export const TrophyRarity = styled.div <{ rarity: string }>`
  font-size: 0.625rem;
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
  padding: 0.1875rem 0.5rem;
  background: ${(props) => {
    const colors = {
      common: 'rgba(16, 184, 75, 0.1)',
      rare: 'rgba(59, 130, 246, 0.1)',
      epic: 'rgba(168, 85, 247, 0.1)',
      legendary: 'rgba(255, 215, 0, 0.1)',
    }
    return colors[props.rarity as keyof typeof colors] || 'rgba(156, 163, 175, 0.1)'
  }};
  border-radius: 6px;

  @media (max-width: 768px) {
    display: none;
  }
`

export const TrophyOwner = styled.div`
  color: #9ca3af;
  font-size: 0.8125rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    display: none;
  }
`

export const TrophyDate = styled.div`
  color: #6b7280;
  font-size: 0.75rem;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
    display: none;
  }
`

export const TrophyHeaderInfo = styled.div`
   display: none;

   ${TrophyOwner}{
      display: block;
   }
   ${TrophyDate}{
      display: block;
   }

   @media (max-width: 768px) {
      display: block;
  }
`
