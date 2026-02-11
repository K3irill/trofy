'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { User } from '@/types'
import {
  ShareButton,
  ParticlesContainer,
  Particle,
} from '../styled'

interface ProfileShareProps {
  isAuthenticated: boolean
  user: User
}

export function ProfileShare({ isAuthenticated, user }: ProfileShareProps) {
  const [showParticles, setShowParticles] = useState(false)

  const particlePositions = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        x: 20 + (i * 137) % 60,
        y: 20 + (i * 89) % 60,
      })),
    []
  )

  const handleShare = () => {
    setShowParticles(true)
    setTimeout(() => setShowParticles(false), 2000)
    navigator.clipboard?.writeText(`Мой профиль trofy.art/u/${user.username}`)
  }

  if (!isAuthenticated) return null

  return (
    <>
      <ParticlesContainer>
        <AnimatePresence>
          {showParticles &&
            particlePositions.map((pos, i) => (
              <Particle
                key={i}
                color={['#00d4ff', '#ffd700', '#ff6b6b', '#a855f7'][i % 4]}
                initial={{
                  x: '50%',
                  y: '50%',
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: `${pos.x}%`,
                  y: `${pos.y}%`,
                  opacity: 0,
                  scale: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: i * 0.05 }}
              />
            ))}
        </AnimatePresence>
      </ParticlesContainer>

      <ShareButton
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleShare}
      >
        <span>📤</span> Поделиться профилем
      </ShareButton>
    </>
  )
}
