import styled from 'styled-components'
import { motion } from 'framer-motion'

export const BottomNavContainer = styled(motion.nav)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border-top: ${(props) => props.theme.glass.border};
  padding: 0.5rem 0;
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
  z-index: 1000;
  box-shadow: ${(props) => props.theme.shadows.glass.medium};

  @media (min-width: 768px) {
    display: none;
  }
`

export const BottomNavItem = styled.button<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  min-width: 60px;
  position: relative;

  &:active {
    transform: scale(0.95);
  }

  ${(props) =>
    props.active &&
    `
    background: ${props.theme.colors.dark.glassLight};
    
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 3px;
      background: ${props.theme.colors.primary};
      border-radius: 0 0 4px 4px;
      box-shadow: 0 0 10px ${props.theme.colors.primary}40;
    }
  `}
`

export const BottomNavIcon = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${(props) =>
    props.active
      ? props.theme.colors.primary
      : props.theme.colors.light[300]};
  transition: all 0.3s ease;
  transform: ${(props) => (props.active ? 'scale(1.1)' : 'scale(1)')};

  ${(props) =>
    props.active &&
    `
    filter: drop-shadow(0 0 8px ${props.theme.colors.primary}60);
  `}
`

export const BottomNavLabel = styled.span<{ active: boolean }>`
  font-size: 0.75rem;
  font-weight: ${(props) => (props.active ? 600 : 400)};
  color: ${(props) =>
    props.active
      ? props.theme.colors.primary
      : props.theme.colors.light[300]};
  transition: all 0.3s ease;
  white-space: nowrap;
`
