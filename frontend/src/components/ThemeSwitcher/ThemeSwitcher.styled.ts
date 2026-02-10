import styled from 'styled-components'
import { motion } from 'framer-motion'

export const ThemeSwitcherContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`

export const SettingsButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: 12px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) => props.theme.shadows.neomorph.dark};

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
    border-color: ${(props) => `${props.theme.colors.primary}4d`};
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.875rem;
  }
`

export const ThemeSelectButton = styled(motion.button) <{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: 12px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: ${(props) => props.isOpen ? props.theme.shadows.glow.primary : props.theme.shadows.neomorph.dark};

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
    border-color: ${(props) => `${props.theme.colors.primary}4d`};
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.6875rem;
  }
`

export const ChevronIcon = styled.span<{ isOpen: boolean }>`
  display: inline-block;
  font-size: 0.625rem;
  transition: transform 0.3s ease;
  transform: ${(props) => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`

export const ThemeDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 160px;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  z-index: 1000;
  overflow: hidden;

  @media (max-width: 768px) {
    right: 0;
    min-width: 140px;
  }
`

export const ThemeOption = styled(motion.button) <{ active: boolean }>`
  position: relative;
  width: 100%;
  padding: 0.625rem 1rem;
  background: ${(props) => (props.active ? `${props.theme.colors.primary}1a` : 'transparent')};
  border: none;
  border-radius: 8px;
  color: ${(props) => (props.active ? props.theme.colors.light[100] : props.theme.colors.light[300])};
  font-size: 0.75rem;
  font-weight: ${(props) => (props.active ? 700 : 500)};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  white-space: nowrap;

  &:hover {
    background: ${(props) => `${props.theme.colors.primary}1a`};
    color: ${(props) => props.theme.colors.light[100]};
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    opacity: ${(props) => (props.active ? 1 : 0)};
    background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
    border-radius: 0 2px 2px 0;
    transition: opacity 0.2s ease;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.6875rem;
  }
`
