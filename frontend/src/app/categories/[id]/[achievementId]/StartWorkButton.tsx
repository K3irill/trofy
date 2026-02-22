'use client'

import { useState } from 'react'
import { useUpdateProgressMutation } from '@/store/api/achievementDetailApi'
import { useToast } from '@/hooks/useToast'
import styled from 'styled-components'
import { IoPlay } from 'react-icons/io5'

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--primary-color, #6366f1) 0%, var(--primary-color-dark, #4f46e5) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    font-size: 1.25rem;
  }
`

interface StartWorkButtonProps {
  achievementId: string
  onStart?: () => void
}

export const StartWorkButton = ({ achievementId, onStart }: StartWorkButtonProps) => {
  const [updateProgress, { isLoading }] = useUpdateProgressMutation()
  const { showToast } = useToast()

  const handleStart = async () => {
    try {
      await updateProgress({
        achievementId,
        data: { progress: 1 },
      }).unwrap()
      
      showToast('Достижение взято в работу!', 'success')
      onStart?.()
    } catch (error: any) {
      showToast(error?.data?.message || 'Ошибка при взятии достижения в работу', 'error')
    }
  }

  return (
    <Button onClick={handleStart} disabled={isLoading}>
      <IoPlay />
      {isLoading ? 'Загрузка...' : 'Взять в работу'}
    </Button>
  )
}
