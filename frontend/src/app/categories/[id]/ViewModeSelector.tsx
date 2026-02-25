'use client'

import { useState, useEffect } from 'react'
import { IoListOutline, IoGridOutline, IoAlbumsOutline } from 'react-icons/io5'
import { ViewModeSelectorWrapper, ModeButton } from './ViewModeSelector.styled'

export type AchievementViewMode = 'grid6' | 'grid3' | 'grid2' | 'list'

interface ViewModeSelectorProps {
  mode: AchievementViewMode
  onChange: (mode: AchievementViewMode) => void
}

export const ViewModeSelector = ({ mode, onChange }: ViewModeSelectorProps) => {
  const [isTablet, setIsTablet] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth
      setIsMobile(width <= 767)
      setIsTablet(width > 767 && width <= 1024)
    }

    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  // На мобилке: grid3 (2 колонки), grid2 (большая карточка), список
  if (isMobile) {
    return (
      <ViewModeSelectorWrapper>
        <ModeButton active={mode === 'grid3'} onClick={() => onChange('grid3')}>
          <IoGridOutline />
        </ModeButton>
        <ModeButton active={mode === 'grid2'} onClick={() => onChange('grid2')}>
          <IoAlbumsOutline />
        </ModeButton>
        <ModeButton active={mode === 'list'} onClick={() => onChange('list')}>
          <IoListOutline />
        </ModeButton>
      </ViewModeSelectorWrapper>
    )
  }

  // На планшете: 3, 2 и список
  if (isTablet) {
    return (
      <ViewModeSelectorWrapper>
        <ModeButton active={mode === 'grid3'} onClick={() => onChange('grid3')}>
          3
        </ModeButton>
        <ModeButton active={mode === 'grid2'} onClick={() => onChange('grid2')}>
          2
        </ModeButton>
        <ModeButton active={mode === 'list'} onClick={() => onChange('list')}>
          <IoListOutline />
        </ModeButton>
      </ViewModeSelectorWrapper>
    )
  }

  // На десктопе: 6, 3 и список
  return (
    <ViewModeSelectorWrapper>
      <ModeButton active={mode === 'grid6'} onClick={() => onChange('grid6')}>
        6
      </ModeButton>
      <ModeButton active={mode === 'grid3'} onClick={() => onChange('grid3')}>
        3
      </ModeButton>
      <ModeButton active={mode === 'list'} onClick={() => onChange('list')}>
        <IoListOutline />
      </ModeButton>
    </ViewModeSelectorWrapper>
  )
}
