'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import {
  ModalOverlay,
  ModalContainer,
  ModalCloseButton,
  ModalIcon,
  ModalImage,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from './AchievementPreviewModal.styled'
import { ActionButton } from './AchievementActions.styled'
import { isImageUrl } from '@/lib/utils/iconUtils'
import Image from 'next/image'
import { IoShareSocial } from 'react-icons/io5'

interface AchievementPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  icon: string | null
  name: string
  description: string
  unlocked: boolean
}

export const AchievementPreviewModal = ({
  isOpen,
  onClose,
  icon,
  name,
  description,
  unlocked,
}: AchievementPreviewModalProps) => {
  const isIconImage = icon && isImageUrl(icon)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Сброс трансформации при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      // Используем setTimeout для избежания синхронного setState в эффекте
      const timer = setTimeout(() => {
        setTransform({ rotateX: 0, rotateY: 0, scale: 1 })
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -20
    const rotateY = ((x - centerX) / centerX) * 20

    setTransform({
      rotateX,
      rotateY,
      scale: 1.05,
    })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -20
    const rotateY = ((x - centerX) / centerX) * 20

    setTransform({
      rotateX,
      rotateY,
      scale: 1.05,
    })
  }

  const handleTouchEnd = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
            {isIconImage ? (
              <ModalImage
                $unlocked={unlocked}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
                  transformStyle: 'preserve-3d',
                }}
              >
пше фв                 <Image 
                  src={icon!} 
                  alt={name} 
                  fill 
                  style={{ objectFit: 'contain' }} 
                  unoptimized
                />
              </ModalImage>
            ) : (
              <ModalIcon
                $unlocked={unlocked}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {icon || '🏆'}
              </ModalIcon>
            )}
            <ModalContent>
              <ModalTitle>{name}</ModalTitle>
              <ModalDescription>{description}</ModalDescription>
              <ActionButton onClick={() => console.log()} variant="primary">
                <IoShareSocial />
                Поделиться
              </ActionButton>
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  )
}
