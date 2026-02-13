'use client'

import { IoListOutline } from 'react-icons/io5'
import { ViewModeSelectorWrapper, ModeButton } from './ViewModeSelector.styled'

export type AchievementViewMode = 'grid6' | 'grid2' | 'list'

interface ViewModeSelectorProps {
  mode: AchievementViewMode
  onChange: (mode: AchievementViewMode) => void
}

export const ViewModeSelector = ({ mode, onChange }: ViewModeSelectorProps) => {
  return (
    <ViewModeSelectorWrapper>
      <ModeButton active={mode === 'grid6'} onClick={() => onChange('grid6')}>
        6
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
