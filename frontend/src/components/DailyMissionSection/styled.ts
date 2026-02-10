import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Container = styled(motion.section)`
  background: linear-gradient(135deg, ${(props) => `${props.theme.colors.rarity.epic}1a`} 0%, ${(props) => `${props.theme.colors.accent}0d`} 100%);
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: 1px solid ${(props) => `${props.theme.colors.rarity.epic}33`};
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 
    ${(props) => props.theme.shadows.glass.heavy},
    0 0 40px ${(props) => `${props.theme.colors.rarity.epic}1a`};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -100%;
    left: -100%;
    width: 400%;
    height: 400%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      ${(props) => `${props.theme.colors.rarity.epic}0d`} 60deg,
      transparent 120deg,
      ${(props) => `${props.theme.colors.accent}0d`} 180deg,
      transparent 240deg,
      ${(props) => `${props.theme.colors.rarity.epic}0d`} 300deg,
      transparent 360deg
    );
    animation: rotate 15s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
  }
`

export const Header = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`


export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => `${props.theme.colors.rarity.epic}33`};
  border: 1px solid ${(props) => `${props.theme.colors.rarity.epic}66`};
  border-radius: 12px;
  padding: 0.5rem 1rem;
  color: ${(props) => props.theme.colors.rarity.epic};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 0 15px ${(props) => `${props.theme.colors.rarity.epic}4d`};

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.6875rem;
 
  }
`

export const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const MissionTitle = styled.h3`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  position: relative;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const GlitchText = styled.span`
  position: relative;
  display: inline-block;
  
  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }

  &::before {
    color: ${(props) => props.theme.colors.primary};
    animation: glitch-1 2s infinite linear alternate-reverse;
    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  }

  &::after {
    color: ${(props) => props.theme.colors.accent};
    animation: glitch-2 3s infinite linear alternate-reverse;
    clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
  }

  @keyframes glitch-1 {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
  }

  @keyframes glitch-2 {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(2px, -2px); }
    40% { transform: translate(2px, 2px); }
    60% { transform: translate(-2px, -2px); }
    80% { transform: translate(-2px, 2px); }
  }
`

export const MissionDescription = styled.p`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const MissionStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`

export const StatItem = styled.div`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => `${props.theme.colors.rarity.epic}33`};
  border-radius: 16px;
  padding: 1.25rem;
  text-align: center;
  box-shadow: ${(props) => props.theme.shadows.neomorph.dark};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => `${props.theme.colors.rarity.epic}66`};
    box-shadow: 
      ${(props) => props.theme.shadows.neomorph.dark},
      0 0 20px ${(props) => `${props.theme.colors.rarity.epic}33`};
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
`

export const StatValue = styled.div`
  color: ${(props) => props.theme.colors.rarity.epic};
  font-size: 1.75rem;
  font-weight: 700;
  text-shadow: 0 0 20px ${(props) => `${props.theme.colors.rarity.epic}80`};
  font-family: 'Courier New', monospace;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const StatLabel = styled.div`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
`

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const ProgressText = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.5rem;
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadows.neomorph.dark};
`

export const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, ${(props) => props.theme.colors.rarity.epic} 0%, ${(props) => props.theme.colors.accent} 100%);
  border-radius: 12px;
  box-shadow: 0 0 15px ${(props) => `${props.theme.colors.rarity.epic}80`};
`

export const CTAButton = styled(motion.button)`
  align-self: flex-start;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.rarity.epic} 0%, ${(props) => props.theme.colors.accent} 100%);
  border: 1px solid ${(props) => `${props.theme.colors.rarity.epic}4d`};
  border-radius: 12px;
  padding: 1rem 2rem;
  color: ${(props) => props.theme.colors.dark.bg};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 0 20px ${(props) => `${props.theme.colors.rarity.epic}66`};
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, ${(props) => props.theme.colors.rarity.epic}dd 0%, ${(props) => props.theme.colors.accent}dd 100%);
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.875rem;
    width: 100%;
  }
`
