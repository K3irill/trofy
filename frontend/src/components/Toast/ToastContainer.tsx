'use client'

import { AnimatePresence } from 'framer-motion'
import { useNotificationContext } from '@/contexts/NotificationContext'
import { Toast } from './Toast'

import { ToastListContainer } from './ToastContainer.styled'

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotificationContext()

  return (
    <ToastListContainer>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            isOpen={true}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </ToastListContainer>
  )
}
