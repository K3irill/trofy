import styled from 'styled-components'
import { motion } from 'framer-motion'

export const ThemeSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

export const ThemeSelectorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.light[100]};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const ThemeColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

export const ThemeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const ThemeColumnTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.light[200]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.8;
`

export const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
  }
`

export const ThemeCard = styled(motion.button)`
  padding: 1rem;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: ${(props) => props.theme.glass.radius};
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
    border-color: ${(props) => `${props.theme.colors.primary}4d`};
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.8125rem;
    min-height: 50px;
  }
`

export const ThemeCardActive = styled(ThemeCard)`
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  border-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.dark.bg};
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
  font-weight: 700;

  &:hover {
    background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
  }
`
