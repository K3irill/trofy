'use client'

import { useState, useCallback } from 'react'
import { ConfirmModal } from '@/components/ConfirmModal/ConfirmModal'

type ConfirmType = 'danger' | 'warning' | 'info'

interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: ConfirmType
}

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    options: ConfirmOptions | null
    resolve: ((value: boolean) => void) | null
  }>({
    isOpen: false,
    options: null,
    resolve: null,
  })

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    if (confirmState.resolve) {
      confirmState.resolve(true)
    }
    setConfirmState({
      isOpen: false,
      options: null,
      resolve: null,
    })
  }, [confirmState])

  const handleCancel = useCallback(() => {
    if (confirmState.resolve) {
      confirmState.resolve(false)
    }
    setConfirmState({
      isOpen: false,
      options: null,
      resolve: null,
    })
  }, [confirmState])

  const ConfirmComponent = () => {
    if (!confirmState.options) return null

    return (
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.options.title}
        message={confirmState.options.message}
        confirmText={confirmState.options.confirmText}
        cancelText={confirmState.options.cancelText}
        type={confirmState.options.type || 'warning'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    )
  }

  return {
    confirm,
    ConfirmComponent,
  }
}
