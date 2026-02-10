'use client'

import { useState } from 'react'
import { AchievementDetail } from './types'
import {
  VerificationContainer,
  VerificationStatus,
  VerificationBadge,
  VerificationButton,
  VerificationList,
  VerificationItem,
  VerificationInfo,
  VerificationReason,
} from './AchievementVerification.styled'

interface AchievementVerificationProps {
  achievement: AchievementDetail
  isOwner: boolean
}

export const AchievementVerification = ({ achievement, isOwner }: AchievementVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(false)

  if (!achievement.requiresVerification) {
    return null
  }

  const handleVerify = () => {
    setIsVerifying(true)
    // Здесь будет API вызов для подтверждения
    setTimeout(() => {
      setIsVerifying(false)
      alert('Достижение подтверждено!')
    }, 1000)
  }

  const isVerified = achievement.isVerified || false
  const verificationCount = achievement.verificationCount || 0

  return (
    <VerificationContainer>
      <VerificationStatus>
        {isVerified ? (
          <VerificationBadge verified>
            ✅ Подтверждено ({verificationCount} подтверждений)
          </VerificationBadge>
        ) : (
          <VerificationBadge verified={false}>
            ⏳ Требуется подтверждение ({verificationCount} подтверждений)
          </VerificationBadge>
        )}
      </VerificationStatus>

      {!isOwner && !isVerified && (
        <VerificationButton onClick={handleVerify} disabled={isVerifying}>
          {isVerifying ? 'Подтверждаю...' : 'Подтвердить достижение'}
        </VerificationButton>
      )}

      {verificationCount > 0 && (
        <VerificationList>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Подтвердили:
          </div>
          {/* Здесь будет список подтвердивших пользователей */}
          <VerificationItem>
            <VerificationInfo>
              <span>👤</span>
              <span>Пользователь 1</span>
            </VerificationInfo>
            <VerificationReason>Подтвердил по фотографиям</VerificationReason>
          </VerificationItem>
        </VerificationList>
      )}
    </VerificationContainer>
  )
}
