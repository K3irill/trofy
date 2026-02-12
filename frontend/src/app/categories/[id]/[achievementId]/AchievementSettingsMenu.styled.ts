import styled from 'styled-components'
import { motion } from 'framer-motion'

export const SettingsButton = styled.button<{ $isOpen: boolean }>`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${(props) => props.$isOpen
    ? `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`
    : `linear-gradient(135deg, ${props.theme.colors.dark[600]} 0%, ${props.theme.colors.dark[700]} 100%)`};
  border: 2px solid ${(props) => props.$isOpen ? props.theme.colors.primary : props.theme.colors.dark[600]}80;
  color: ${(props) => props.$isOpen ? props.theme.colors.dark[900] : props.theme.colors.light[300]};
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: ${(props) => props.$isOpen ? props.theme.shadows.glow.primary : props.theme.shadows.glass.light};
  z-index: 10;

  &:hover {
    transform: rotate(90deg) scale(1.1);
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
    background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
    color: ${(props) => props.theme.colors.dark[900]};
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
    top: 1rem;
    right: 1rem;
  }
`

export const SettingsMenu = styled(motion.div)`
  position: fixed;
  min-width: 280px;
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}f5 0%, ${(props) => props.theme.colors.dark[800]}f8 100%);
  border-radius: 16px;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy}, ${(props) => props.theme.shadows.glow.primary}40;
  padding: 0.5rem;
  z-index: 1000;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    right: 10px !important;
    left: 10px !important;
    min-width: auto;
    width: calc(100% - 20px);
  }
`

export const MenuItem = styled.div<{ $active?: boolean; $danger?: boolean; $warning?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  color: ${(props) => {
    if (props.$danger) return props.theme.colors.danger
    if (props.$warning) return props.theme.colors.danger
    if (props.$active) return props.theme.colors.primary
    return props.theme.colors.light[200]
  }};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  &:hover {
    background: ${(props) => {
      if (props.$danger) return `${props.theme.colors.danger}20`
      if (props.$warning) return `${props.theme.colors.danger}20`
      if (props.$active) return `${props.theme.colors.primary}20`
      return `${props.theme.colors.primary}15`
    }};
    transform: translateX(4px);
  }

  &:active {
    transform: translateX(2px);
  }
`

export const MenuDivider = styled.div`
  height: 1px;
  background: ${(props) => props.theme.colors.dark[600]}60;
  margin: 0.5rem 0;
`
