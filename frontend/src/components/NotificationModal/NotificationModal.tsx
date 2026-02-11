'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  NotificationModalOverlay,
  NotificationModalContainer,
  NotificationModalHeader,
  NotificationModalTitle,
  NotificationModalCloseButton,
  NotificationContent,
  NotificationList,
  NotificationItem,
  NotificationItemIcon,
  NotificationItemContent,
  NotificationItemTitle,
  NotificationItemMessage,
  NotificationItemTime,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  NotificationDeleteButton,
} from './NotificationModal.styled'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  time: string
  read: boolean
}

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  notifications?: Notification[]
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
}

const notificationIcons = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Новое достижение',
    message: 'Вы получили достижение "Первые шаги"',
    type: 'success',
    time: '2 минуты назад',
    read: false,
  },
  {
    id: '2',
    title: 'Уровень повышен',
    message: 'Поздравляем! Вы достигли 5 уровня',
    type: 'info',
    time: '1 час назад',
    read: false,
  },
  {
    id: '3',
    title: 'Новый друг',
    message: 'Пользователь @GamerPro добавил вас в друзья',
    type: 'info',
    time: '3 часа назад',
    read: true,
  },
]

export const NotificationModal = ({ 
  isOpen, 
  onClose, 
  notifications,
  onMarkAsRead,
  onDelete 
}: NotificationModalProps) => {
  const displayNotifications = notifications || mockNotifications
  const handleItemClick = (notification: Notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <NotificationModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <NotificationModalContainer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <NotificationModalHeader>
              <NotificationModalTitle>Уведомления</NotificationModalTitle>
              <NotificationModalCloseButton onClick={onClose}>✕</NotificationModalCloseButton>
            </NotificationModalHeader>

            <NotificationContent>
              {displayNotifications.length === 0 ? (
                <EmptyState
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <EmptyStateIcon>🔔</EmptyStateIcon>
                  <EmptyStateText>Нет уведомлений</EmptyStateText>
                </EmptyState>
              ) : (
                <NotificationList>
                  {displayNotifications.map((notification, index) => (
                    <NotificationItem
                      key={notification.id}
                      read={notification.read}
                      onClick={() => handleItemClick(notification)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NotificationItemIcon type={notification.type}>
                        {notificationIcons[notification.type]}
                      </NotificationItemIcon>
                      <NotificationItemContent>
                        <NotificationItemTitle read={notification.read}>
                          {notification.title}
                        </NotificationItemTitle>
                        <NotificationItemMessage>{notification.message}</NotificationItemMessage>
                        <NotificationItemTime>{notification.time}</NotificationItemTime>
                      </NotificationItemContent>
                      {onDelete && (
                        <NotificationDeleteButton
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(notification.id)
                          }}
                        >
                          ✕
                        </NotificationDeleteButton>
                      )}
                    </NotificationItem>
                  ))}
                </NotificationList>
              )}
            </NotificationContent>
          </NotificationModalContainer>
        </NotificationModalOverlay>
      )}
    </AnimatePresence>
  )
}
