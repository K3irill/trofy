'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import { IoClose, IoWarning, IoTrash } from 'react-icons/io5'
import { useDeleteCustomCategoryMutation } from '@/store/api/achievementsApi'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: ${(props) => props.theme.glass.radius};
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.dark[600]}80;
`

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.light[100]};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.dark[600]}80;
    color: ${(props) => props.theme.colors.light[100]};
  }
`

const ModalContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const WarningSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: ${(props) => `${props.theme.colors.error}20`};
  border: 1px solid ${(props) => `${props.theme.colors.error}40`};
  border-radius: 12px;
`

const WarningIcon = styled(IoWarning)`
  color: ${(props) => props.theme.colors.error};
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
`

const WarningText = styled.div`
  color: ${(props) => props.theme.colors.light[200]};
  font-size: 0.9375rem;
  line-height: 1.5;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  color: ${(props) => props.theme.colors.light[200]};
  font-size: 0.9375rem;
  font-weight: 500;
`

const Input = styled.input`
  padding: 0.75rem 1rem;
  background: ${(props) => props.theme.colors.dark[700]}cc;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => `${props.theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.light[400]};
  }
`

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid ${(props) => props.theme.colors.dark[600]}80;
  background: ${(props) => props.theme.colors.dark[800]}f2;
  backdrop-filter: blur(10px);
`

interface DeleteCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  categoryName: string
  categoryId: string
}

export function DeleteCategoryModal({ isOpen, onClose, onSuccess, categoryName, categoryId }: DeleteCategoryModalProps) {
  const [confirmName, setConfirmName] = useState('')
  const [deleteCategory, { isLoading }] = useDeleteCustomCategoryMutation()
  const { showToast, ToastComponent } = useToast()

  const handleDelete = async () => {
    if (confirmName.trim() !== categoryName.trim()) {
      showToast('Название категории не совпадает', 'error')
      return
    }

    try {
      await deleteCategory({ id: categoryId }).unwrap()
      showToast('Категория успешно удалена', 'success')
      setConfirmName('')
      onSuccess?.()
      onClose()
    } catch (error: any) {
      showToast(error?.data?.message || 'Ошибка при удалении категории', 'error')
    }
  }

  const handleClose = () => {
    setConfirmName('')
    onClose()
  }

  if (typeof window === 'undefined') return null

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ModalContainer
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
              >
                <ModalHeader>
                  <ModalTitle>
                    <IoTrash />
                    Удалить категорию
                  </ModalTitle>
                  <CloseButton onClick={handleClose}>
                    <IoClose />
                  </CloseButton>
                </ModalHeader>

                <ModalContent>
                  <WarningSection>
                    <WarningIcon />
                    <WarningText>
                      <strong>Внимание!</strong> При удалении категории будут удалены все достижения в этой категории. 
                      Это действие нельзя отменить.
                    </WarningText>
                  </WarningSection>

                  <FormGroup>
                    <Label>
                      Для подтверждения введите название категории: <strong>{categoryName}</strong>
                    </Label>
                    <Input
                      type="text"
                      value={confirmName}
                      onChange={(e) => setConfirmName(e.target.value)}
                      placeholder="Введите название категории"
                      autoFocus
                    />
                  </FormGroup>
                </ModalContent>

                <ModalActions>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={handleClose}
                    style={{ flex: 1 }}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="md"
                    onClick={handleDelete}
                    disabled={isLoading || confirmName.trim() !== categoryName.trim()}
                    style={{ flex: 1 }}
                  >
                    {isLoading ? 'Удаление...' : 'Удалить категорию'}
                  </Button>
                </ModalActions>
                {ToastComponent && <ToastComponent />}
              </ModalContainer>
            </ModalOverlay>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
