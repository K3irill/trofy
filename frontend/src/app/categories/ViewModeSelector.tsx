'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { IoGridOutline, IoListOutline } from 'react-icons/io5'

export type AchievementViewMode = 'grid3' | 'grid2' | 'list'

const SelectorContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background: ${(props) => props.theme.colors.dark[700]}80;
  padding: 0.25rem;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.dark[600]}80;
`

const SelectorButton = styled(motion.button) <{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 40px;
  padding: 0.5rem 1rem;
  background: ${(props) =>
    props.active
      ? `linear-gradient(135deg, ${props.theme.colors.primary}4d 0%, ${props.theme.colors.secondary}33 100%)`
      : 'transparent'};
  border: 2px solid
    ${(props) =>
    props.active
      ? props.theme.colors.primary
      : 'transparent'};
  border-radius: 8px;
  color: ${(props) =>
    props.active
      ? props.theme.colors.primary
      : props.theme.colors.light[300]};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
    props.active
      ? `linear-gradient(135deg, ${props.theme.colors.primary}66 0%, ${props.theme.colors.secondary}4d 100%)`
      : `${props.theme.colors.primary}1a`};
    border-color: ${(props) =>
    props.active
      ? props.theme.colors.primary
      : props.theme.colors.dark[600]};
    color: ${(props) =>
    props.active
      ? props.theme.colors.primary
      : props.theme.colors.light[200]};
  }

  ${(props) =>
    props.active &&
    `
    box-shadow: ${props.theme.shadows.glow.primary};
  `}

  @media (max-width: 768px) {

    padding: 0.4rem 0.75rem;
    font-size: 0.875rem;
    min-width: 40px;
    height: 36px;
  }
`

interface ViewModeSelectorProps {
  mode: AchievementViewMode
  onChange: (mode: AchievementViewMode) => void
}

export const ViewModeSelector = ({
  mode,
  onChange,
}: ViewModeSelectorProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <SelectorContainer>
      <SelectorButton
        active={mode === 'grid3'}
        onClick={() => onChange('grid3')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobile ? '2' : '3'}
      </SelectorButton>
      <SelectorButton
        active={mode === 'grid2'}
        onClick={() => onChange('grid2')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobile ? <IoGridOutline /> : '2'}
      </SelectorButton>
      <SelectorButton
        active={mode === 'list'}
        onClick={() => onChange('list')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoListOutline />
      </SelectorButton>
    </SelectorContainer>
  )
}
