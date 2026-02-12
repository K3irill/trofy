'use client'

import { IoTimeOutline, IoCheckmarkCircle, IoLockClosed } from 'react-icons/io5'
import { StatusBadgeContainer, StatusText } from './StatusBadge.styled'

interface StatusBadgeProps {
  status: 'in_progress' | 'completed' | 'not_started'
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status === 'in_progress') {
    return (
      <StatusBadgeContainer $status="in_progress">
        <IoTimeOutline />
        <StatusText>В работе</StatusText>
      </StatusBadgeContainer>
    )
  }

  if (status === 'completed') {
    return (
      <StatusBadgeContainer $status="completed">
        <IoCheckmarkCircle />
        <StatusText>Достигнуто</StatusText>
      </StatusBadgeContainer>
    )
  }

  if (status === 'not_started') {
    return (
      <StatusBadgeContainer $status="not_started">
        <IoLockClosed />
        <StatusText>Не достигнуто</StatusText>
      </StatusBadgeContainer>
    )
  }

  return null
}
