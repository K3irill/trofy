'use client'

import { motion } from 'framer-motion'
import { AchievementDetail } from './types'
import { ProgressContainer, ProgressBar, ProgressText, ProgressInfo } from './AchievementProgress.styled'

interface AchievementProgressProps {
  achievement: AchievementDetail
}

export const AchievementProgress = ({ achievement }: AchievementProgressProps) => {
  const progress = achievement.progress || 0
  const maxProgress = achievement.maxProgress || 100
  const percentage = Math.round((progress / maxProgress) * 100)

  return (
    <ProgressContainer>
      <ProgressInfo>
        <ProgressText>Прогресс выполнения</ProgressText>
        <ProgressText>{progress} / {maxProgress} ({percentage}%)</ProgressText>
      </ProgressInfo>
      <ProgressBar>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #00d4ff 0%, #00a8cc 100%)',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
          }}
        />
      </ProgressBar>
    </ProgressContainer>
  )
}
