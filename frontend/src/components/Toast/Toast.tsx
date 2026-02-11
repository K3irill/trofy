'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ToastContainer, ToastContent, ToastIcon, ToastMessage, ToastCloseButton } from './Toast.styled'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const toastIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

export const ToastComponent = ({ toast, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id, toast.duration])

  return (
    <ToastContainer
      type={toast.type}
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      layout
    >
      <ToastContent>
        <ToastIcon type={toast.type}>{toastIcons[toast.type]}</ToastIcon>
        <ToastMessage>{toast.message}</ToastMessage>
        <ToastCloseButton onClick={() => onClose(toast.id)}>✕</ToastCloseButton>
      </ToastContent>
    </ToastContainer>
  )
}
