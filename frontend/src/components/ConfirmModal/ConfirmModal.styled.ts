import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

type ConfirmType = 'danger' | 'warning' | 'info'

export const ConfirmModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10002;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

export const ConfirmModalContainer = styled(motion.div)<{ $type: ConfirmType }>`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]} 0%, ${(props) => props.theme.colors.dark[800]} 100%);
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy}, ${(props) => props.theme.shadows.glow.primary};
  border: 2px solid ${(props) => {
    switch (props.$type) {
      case 'danger':
        return 'rgba(239, 68, 68, 0.5)'
      case 'warning':
        return 'rgba(245, 158, 11, 0.5)'
      case 'info':
        return `${props.theme.colors.primary}50`
      default:
        return `${props.theme.colors.dark[600]}50`
    }
  }};

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 100%;
  }
`

export const ConfirmModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

export const ConfirmModalIcon = styled.div<{ $type: ConfirmType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.75rem;
  flex-shrink: 0;

  ${(props) => {
    switch (props.$type) {
      case 'danger':
        return css`
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 2px solid rgba(239, 68, 68, 0.4);
        `
      case 'warning':
        return css`
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 2px solid rgba(245, 158, 11, 0.4);
        `
      case 'info':
        return css`
          background: ${props.theme.colors.primary}20;
          color: ${props.theme.colors.primary};
          border: 2px solid ${props.theme.colors.primary}40;
        `
      default:
        return ''
    }
  }}
`

export const ConfirmModalTitle = styled.h3`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const ConfirmModalMessage = styled.p`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    margin-bottom: 1.5rem;
  }
`

export const ConfirmModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: 2px solid ${(props) => props.theme.colors.dark[600]};
  background: ${(props) => props.theme.colors.dark[700]};
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => props.theme.colors.dark[600]};
    border-color: ${(props) => props.theme.colors.dark[500]};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
`

export const ConfirmButton = styled.button<{ $type: ConfirmType }>`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) => {
    switch (props.$type) {
      case 'danger':
        return css`
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);

          &:hover {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.6);
            transform: translateY(-2px);
          }
        `
      case 'warning':
        return css`
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);

          &:hover {
            background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.6);
            transform: translateY(-2px);
          }
        `
      case 'info':
        return css`
          background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%);
          color: ${props.theme.colors.dark[900]};
          box-shadow: 0 4px 15px ${props.theme.colors.primary}40;

          &:hover {
            box-shadow: 0 6px 20px ${props.theme.colors.primary}60;
            transform: translateY(-2px);
          }
        `
      default:
        return ''
    }
  }}

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
`
