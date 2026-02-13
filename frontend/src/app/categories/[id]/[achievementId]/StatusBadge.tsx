'use client'

import { IoTimeOutline, IoCheckmarkCircle, IoLockClosed } from 'react-icons/io5'
import { StatusBadgeContainer, StatusText } from './StatusBadge.styled'

interface StatusBadgeProps {
  status: 'in_progress' | 'achieved' | 'not_achieved'
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

  if (status === 'achieved') {
    return (
      <StatusBadgeContainer $status="achieved">
        <IoCheckmarkCircle />
        <StatusText>Достигнуто</StatusText>
      </StatusBadgeContainer>
    )
  }

  if (status === 'not_achieved') {
    return (
      <StatusBadgeContainer $status="not_achieved">
        <IoLockClosed />
        <StatusText>Не достигнуто</StatusText>
      </StatusBadgeContainer>
    )
  }

  return null
}
