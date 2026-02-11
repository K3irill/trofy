import styled from 'styled-components'
import { motion } from 'framer-motion'
import { ToastType } from './Toast'

export const ToastContainer = styled(motion.div)<{ type: ToastType }>`
  min-width: 300px;
  max-width: 400px;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-left: 4px solid ${(props) => {
    switch (props.type) {
      case 'success':
        return props.theme.colors.success
      case 'error':
        return props.theme.colors.danger
      case 'warning':
        return props.theme.colors.warning
      case 'info':
        return props.theme.colors.primary
      default:
        return props.theme.colors.primary
    }
  }};
  border-radius: 12px;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  overflow: hidden;

  @media (max-width: 768px) {
    min-width: 280px;
    max-width: 320px;
  }
`

export const ToastContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
`

export const ToastIcon = styled.div<{ type: ToastType }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
  background: ${(props) => {
    switch (props.type) {
      case 'success':
        return `${props.theme.colors.success}20`
      case 'error':
        return `${props.theme.colors.danger}20`
      case 'warning':
        return `${props.theme.colors.warning}20`
      case 'info':
        return `${props.theme.colors.primary}20`
      default:
        return `${props.theme.colors.primary}20`
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case 'success':
        return props.theme.colors.success
      case 'error':
        return props.theme.colors.danger
      case 'warning':
        return props.theme.colors.warning
      case 'info':
        return props.theme.colors.primary
      default:
        return props.theme.colors.primary
    }
  }};
`

export const ToastMessage = styled.div`
  flex: 1;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
`

export const ToastCloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
    color: ${(props) => props.theme.colors.light[100]};
  }
`
