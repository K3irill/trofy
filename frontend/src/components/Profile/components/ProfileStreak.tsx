'use client'

import { motion } from 'framer-motion'
import type { UserStats } from '@/store/api/userApi'
import type { User } from '@/types'
import {
  StreakContainer,
  StreakFlame,
  StreakText,
  StreakDays,
} from '../styled'

interface ProfileStreakProps {
  isAuthenticated: boolean
  user: User
  stats?: UserStats
}

export function ProfileStreak({ isAuthenticated, user, stats }: ProfileStreakProps) {
  const streak = isAuthenticated && stats ? stats.streak : isAuthenticated ? (user.streak || 0) : '?'

  return (
    <StreakContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <StreakFlame
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        🔥
      </StreakFlame>
      <div>
        <StreakText>Серия подряд</StreakText>
        <StreakDays>{streak}</StreakDays>
      </div>
    </StreakContainer>
  )
}
