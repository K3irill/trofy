'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoShareSocial } from 'react-icons/io5'
import type { User } from '@/types'
import { useToast } from '@/hooks/useToast'
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
  const { showToast, ToastComponent } = useToast()

  const particlePositions = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        x: 20 + (i * 137) % 60,
        y: 20 + (i * 89) % 60,
      })),
    []
  )

  const profileUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/u/${user.username}`
    : `trofy.art/u/${user.username}`

  const handleShare = async () => {
    setShowParticles(true)
    setTimeout(() => setShowParticles(false), 2000)

    // Используем navigator.share если доступен
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Профиль ${user.username}`,
          text: `Посмотрите мой профиль на Trofy!`,
          url: profileUrl,
        })
      } catch (error) {
        // Пользователь отменил или произошла ошибка
        if ((error as Error).name !== 'AbortError') {
          console.error('Ошибка при попытке поделиться:', error)
        }
      }
    } else {
      // Fallback: копируем ссылку в буфер обмена
      try {
        await navigator.clipboard.writeText(profileUrl)
        showToast('Ссылка скопирована в буфер обмена!', 'success')
      } catch (error) {
        console.error('Ошибка при копировании:', error)
        showToast('Не удалось скопировать ссылку', 'error')
      }
    }
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
        <IoShareSocial style={{ fontSize: '1.25rem' }} />
        Поделиться профилем
      </ShareButton>
      <ToastComponent />
    </>
  )
}
