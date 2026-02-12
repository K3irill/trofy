import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'
import { ToastType } from './Toast'

export const ToastContainer = styled(motion.div)<{ $type: ToastType }>`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 10001;
  min-width: 300px;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy}, ${(props) => props.theme.shadows.glow.primary};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;

  ${(props) => {
    switch (props.$type) {
      case 'success':
        return css`
          background: linear-gradient(135deg, ${props.theme.colors.success}20 0%, ${props.theme.colors.success}10 100%);
          border: 2px solid ${props.theme.colors.success}60;
        `
      case 'error':
        return css`
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
          border: 2px solid rgba(239, 68, 68, 0.6);
        `
      case 'warning':
        return css`
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
          border: 2px solid rgba(245, 158, 11, 0.6);
        `
      case 'info':
        return css`
          background: linear-gradient(135deg, ${props.theme.colors.primary}20 0%, ${props.theme.colors.primary}10 100%);
          border: 2px solid ${props.theme.colors.primary}60;
        `
      default:
        return ''
    }
  }}

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
    max-width: 100%;
  }
`

export const ToastContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
`

export const ToastIcon = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;

  ${(props) => {
    switch (props.$type) {
      case 'success':
        return css`
          color: ${props.theme.colors.success};
        `
      case 'error':
        return css`
          color: #ef4444;
        `
      case 'warning':
        return css`
          color: #f59e0b;
        `
      case 'info':
        return css`
          color: ${props.theme.colors.primary};
        `
      default:
        return ''
    }
  }}
`

export const ToastMessage = styled.div`
  flex: 1;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.5;
`

export const ToastClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    color: ${(props) => props.theme.colors.light[100]};
    transform: scale(1.1);
  }
`
