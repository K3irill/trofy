'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { AchievementDetail } from './types'
import { useUpdateProgressMutation } from '@/store/api/achievementDetailApi'
import { IoAdd, IoRemove } from 'react-icons/io5'
import {
  ProgressContainer,
  ProgressBar,
  ProgressText,
  ProgressInfo,
  ProgressControls,
  ProgressButton,
  ProgressSlider,
} from './AchievementProgress.styled'

interface AchievementProgressProps {
  achievement: AchievementDetail
  achievementId?: string
  onUpdate?: () => void
  isInteractive?: boolean
}

export const AchievementProgress = ({
  achievement,
  achievementId,
  onUpdate,
  isInteractive = false,
}: AchievementProgressProps) => {
  const progress = achievement.progress || 0
  const maxProgress = achievement.maxProgress || 100
  const percentage = Math.round((progress / maxProgress) * 100)

  const [localProgress, setLocalProgress] = useState(progress)
  const [updateProgress, { isLoading }] = useUpdateProgressMutation()
  const pendingProgressRef = useRef<number | null>(null)

  // Синхронизируем локальное состояние с пропсами
  useEffect(() => {
    setLocalProgress(progress)
  }, [progress])

  const handleProgressChange = async (newProgress: number) => {
    if (!isInteractive || !achievementId) return

    const clampedProgress = Math.max(0, Math.min(maxProgress, newProgress))
    
    try {
      await updateProgress({
        achievementId,
        data: { progress: clampedProgress },
      }).unwrap()
      onUpdate?.()
    } catch (error) {
      setLocalProgress(progress) // Откатываем при ошибке
    }
  }

  const handleIncrement = () => {
    const newProgress = localProgress + 1
    setLocalProgress(newProgress)
    handleProgressChange(newProgress)
  }

  const handleDecrement = () => {
    const newProgress = localProgress - 1
    setLocalProgress(newProgress)
    handleProgressChange(newProgress)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value, 10)
    setLocalProgress(newProgress)
    // Сохраняем значение для отправки после отпускания
    pendingProgressRef.current = newProgress
  }

  const handleSliderEnd = () => {
    // Отправляем на сервер только после отпускания
    if (pendingProgressRef.current !== null) {
      handleProgressChange(pendingProgressRef.current)
      pendingProgressRef.current = null
    }
  }

  const displayProgress = isInteractive ? localProgress : progress
  const displayPercentage = Math.round((displayProgress / maxProgress) * 100)
  const isComplete = displayProgress >= maxProgress

  return (
    <ProgressContainer $isComplete={isComplete}>
      <ProgressInfo>
        <ProgressText>Прогресс выполнения</ProgressText>
        <ProgressText>
          {displayProgress} / {maxProgress} ({displayPercentage}%)
        </ProgressText>
      </ProgressInfo>
      {isInteractive ? (
        <>
          <ProgressBar>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${displayPercentage}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #00d4ff 0%, #00a8cc 100%)',
                borderRadius: '8px',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
                position: 'relative',
                zIndex: 1,
              }}
            />
            <ProgressSlider
              type="range"
              min="0"
              max={maxProgress}
              value={localProgress}
              onChange={handleSliderChange}
              onMouseUp={handleSliderEnd}
              onTouchEnd={handleSliderEnd}
              disabled={isLoading}
            />
          </ProgressBar>
          <ProgressControls>
            <ProgressButton onClick={handleDecrement} disabled={isLoading || localProgress === 0}>
              <IoRemove />
            </ProgressButton>
            <ProgressButton onClick={handleIncrement} disabled={isLoading || localProgress >= maxProgress}>
              <IoAdd />
            </ProgressButton>
          </ProgressControls>
        </>
      ) : (
        <ProgressBar>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${displayPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #00d4ff 0%, #00a8cc 100%)',
              borderRadius: '8px',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
            }}
          />
        </ProgressBar>
      )}
    </ProgressContainer>
  )
}
