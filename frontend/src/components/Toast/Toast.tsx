'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle, IoWarning } from 'react-icons/io5'
import { ToastContainer, ToastContent, ToastIcon, ToastMessage, ToastClose } from './Toast.styled'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type: ToastType
  isOpen: boolean
  onClose: () => void
  duration?: number
}

export const Toast = ({ message, type, isOpen, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle />
      case 'error':
        return <IoCloseCircle />
      case 'warning':
        return <IoWarning />
      case 'info':
        return <IoInformationCircle />
      default:
        return <IoInformationCircle />
    }
  }

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ToastContainer
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          $type={type}
        >
          <ToastContent>
            <ToastIcon $type={type}>{getIcon()}</ToastIcon>
            <ToastMessage>{message}</ToastMessage>
            <ToastClose onClick={onClose}>
              <IoCloseCircle />
            </ToastClose>
          </ToastContent>
        </ToastContainer>
      )}
    </AnimatePresence>,
    document.body
  )
}
