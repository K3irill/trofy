'use client'

import { AnimatePresence } from 'framer-motion'
import { useNotificationContext } from '@/contexts/NotificationContext'
import { ToastComponent } from './Toast'
import { ToastListContainer } from './ToastContainer.styled'

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotificationContext()

  return (
    <ToastListContainer>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </ToastListContainer>
  )
}
