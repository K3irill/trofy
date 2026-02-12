'use client'

import { AnimatePresence } from 'framer-motion'
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  type Notification,
} from '@/store/api/notificationsApi'
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

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
}

const notificationIcons = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
}

export const NotificationModal = ({
  isOpen,
  onClose,
}: NotificationModalProps) => {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery(undefined, {
    skip: !isOpen,
  })
  const [markAsRead] = useMarkAsReadMutation()
  const [deleteNotification] = useDeleteNotificationMutation()

  const handleItemClick = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        await markAsRead(notification.id).unwrap()
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await deleteNotification(id).unwrap()
    } catch (error) {
      console.error('Failed to delete notification:', error)
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
              {isLoading ? (
                <BlockLoader text="Загрузка уведомлений..." size="small" />
              ) : notifications.length === 0 ? (
                <EmptyState
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <EmptyStateIcon>🔔</EmptyStateIcon>
                  <EmptyStateText>Нет уведомлений</EmptyStateText>
                </EmptyState>
              ) : (
                <NotificationList>
                  {notifications.map((notification, index) => (
                    <NotificationItem
                      key={notification.id}
                      $read={notification.is_read}
                      onClick={() => handleItemClick(notification)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NotificationItemIcon type={notification.type}>
                        {notificationIcons[notification.type]}
                      </NotificationItemIcon>
                      <NotificationItemContent>
                        <NotificationItemTitle $read={notification.is_read}>
                          {notification.title}
                        </NotificationItemTitle>
                        <NotificationItemMessage>{notification.message}</NotificationItemMessage>
                        <NotificationItemTime>{notification.time}</NotificationItemTime>
                      </NotificationItemContent>
                      <NotificationDeleteButton
                        onClick={(e) => handleDelete(notification.id, e)}
                      >
                        ✕
                      </NotificationDeleteButton>
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
