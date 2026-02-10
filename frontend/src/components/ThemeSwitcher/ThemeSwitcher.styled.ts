import styled from 'styled-components'
import { motion } from 'framer-motion'

export const ThemeSwitcherContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: 16px;
  padding: 4px;
  box-shadow: ${(props) => props.theme.shadows.neomorph.dark};
`

export const ThemeOption = styled(motion.button)<{ active: boolean }>`
  position: relative;
  padding: 0.5rem 1rem;
  background: ${(props) => (props.active ? 'transparent' : 'transparent')};
  border: none;
  border-radius: 12px;
  color: ${(props) => (props.active ? props.theme.colors.light[100] : props.theme.colors.light[300])};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  z-index: 1;

  &:hover {
    color: ${(props) => props.theme.colors.light[100]};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: ${(props) => (props.active ? 1 : 0)};
    background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
    border-radius: 12px;
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.6875rem;
  }
`
