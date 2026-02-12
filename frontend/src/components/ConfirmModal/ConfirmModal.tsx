'use client'

import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { IoWarning, IoClose, IoCheckmarkCircle } from 'react-icons/io5'
import {
  ConfirmModalOverlay,
  ConfirmModalContainer,
  ConfirmModalHeader,
  ConfirmModalIcon,
  ConfirmModalTitle,
  ConfirmModalMessage,
  ConfirmModalActions,
  ConfirmButton,
  CancelButton,
} from './ConfirmModal.styled'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  type = 'warning',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ConfirmModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <ConfirmModalContainer
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            $type={type}
          >
            <ConfirmModalHeader>
              <ConfirmModalIcon $type={type}>
                {type === 'danger' ? <IoWarning /> : type === 'warning' ? <IoWarning /> : <IoCheckmarkCircle />}
              </ConfirmModalIcon>
              <ConfirmModalTitle>{title}</ConfirmModalTitle>
            </ConfirmModalHeader>
            <ConfirmModalMessage>{message}</ConfirmModalMessage>
            <ConfirmModalActions>
              <CancelButton onClick={onCancel}>{cancelText}</CancelButton>
              <ConfirmButton onClick={onConfirm} $type={type}>
                {confirmText}
              </ConfirmButton>
            </ConfirmModalActions>
          </ConfirmModalContainer>
        </ConfirmModalOverlay>
      )}
    </AnimatePresence>,
    document.body
  )
}
