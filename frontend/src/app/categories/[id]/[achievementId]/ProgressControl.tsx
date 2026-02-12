'use client'

import { useState } from 'react'
import { useUpdateProgressMutation } from '@/store/api/achievementDetailApi'
import { IoAdd, IoRemove } from 'react-icons/io5'
import {
  ProgressContainer,
  ProgressHeader,
  ProgressTitle,
  ProgressValue,
  ProgressControls,
  ProgressButton,
  ProgressBar,
  ProgressBarFill,
} from './ProgressControl.styled'

interface ProgressControlProps {
  achievementId: string
  currentProgress: number
  onUpdate?: () => void
}

export const ProgressControl = ({
  achievementId,
  currentProgress,
  onUpdate,
}: ProgressControlProps) => {
  const [progress, setProgress] = useState(currentProgress)
  const [updateProgress, { isLoading }] = useUpdateProgressMutation()

  const handleIncrement = async () => {
    const newProgress = progress + 1
    setProgress(newProgress)
    try {
      await updateProgress({
        achievementId,
        data: { progress: newProgress },
      }).unwrap()
      onUpdate?.()
    } catch (error) {
      setProgress(progress) // Откатываем при ошибке
    }
  }

  const handleDecrement = async () => {
    const newProgress = Math.max(0, progress - 1)
    setProgress(newProgress)
    try {
      await updateProgress({
        achievementId,
        data: { progress: newProgress },
      }).unwrap()
      onUpdate?.()
    } catch (error) {
      setProgress(progress) // Откатываем при ошибке
    }
  }

  return (
    <ProgressContainer>
      <ProgressHeader>
        <ProgressTitle>Прогресс выполнения</ProgressTitle>
        <ProgressValue>{progress}%</ProgressValue>
      </ProgressHeader>
      <ProgressBar>
        <ProgressBarFill $progress={progress} />
      </ProgressBar>
      <ProgressControls>
        <ProgressButton onClick={handleDecrement} disabled={isLoading || progress === 0}>
          <IoRemove />
        </ProgressButton>
        <ProgressButton onClick={handleIncrement} disabled={isLoading}>
          <IoAdd />
        </ProgressButton>
      </ProgressControls>
    </ProgressContainer>
  )
}
