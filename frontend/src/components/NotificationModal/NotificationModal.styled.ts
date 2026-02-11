import styled from 'styled-components'
import { motion } from 'framer-motion'

export const NotificationModalOverlay = styled(motion.div)`
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

  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-end;
  }
`

export const NotificationModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: ${(props) => props.theme.glass.radius};
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 100vh;
    border-radius: ${(props) => props.theme.glass.radius} ${(props) => props.theme.glass.radius} 0 0;
  }
`

export const NotificationModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: ${(props) => props.theme.glass.border};
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const NotificationModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.light[100]};

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const NotificationModalCloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
    color: ${(props) => props.theme.colors.light[100]};
  }
`

export const NotificationContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`

export const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const NotificationItem = styled(motion.button)<{ read: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: ${(props) => 
    props.read 
      ? props.theme.colors.dark.glassLight 
      : `${props.theme.colors.primary}15`
  };
  border: ${(props) => props.theme.glass.border};
  border-left: ${(props) => 
    props.read 
      ? `3px solid transparent`
      : `3px solid ${props.theme.colors.primary}`
  };
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover {
    background: ${(props) => `${props.theme.colors.primary}1a`};
    transform: translateX(4px);
  }
`

export const NotificationItemIcon = styled.div<{ type: string }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 1rem;
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

export const NotificationItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const NotificationItemTitle = styled.div<{ read: boolean }>`
  font-size: 0.9375rem;
  font-weight: ${(props) => (props.read ? 500 : 700)};
  color: ${(props) => props.theme.colors.light[100]};
`

export const NotificationItemMessage = styled.div`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.light[300]};
  line-height: 1.4;
`

export const NotificationItemTime = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.light[300]};
  opacity: 0.7;
  margin-top: 0.25rem;
`

export const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`

export const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`

export const EmptyStateText = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.light[300]};
  font-weight: 500;
`

export const NotificationDeleteButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.875rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  opacity: 0.6;

  &:hover {
    background: ${(props) => `${props.theme.colors.danger}20`};
    color: ${(props) => props.theme.colors.danger};
    opacity: 1;
  }
`
