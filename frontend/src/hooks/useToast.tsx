'use client'

import { useState, useCallback, useMemo } from 'react'
import { Toast, ToastType } from '@/components/Toast/Toast'

export const useToast = (): {
  showToast: (message: string, type?: ToastType) => void
  hideToast: () => void
  ToastComponent: () => JSX.Element
} => {
  const [toast, setToast] = useState<{
    message: string
    type: ToastType
    isOpen: boolean
  }>({
    message: '',
    type: 'info',
    isOpen: false,
  })

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({
      message,
      type,
      isOpen: true,
    })
  }, [])

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const ToastComponent = useMemo(() => {
    return () => (
      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.isOpen}
        onClose={hideToast}
      />
    )
  }, [toast.message, toast.type, toast.isOpen, hideToast])

  return {
    showToast,
    hideToast,
    ToastComponent,
  }
}
