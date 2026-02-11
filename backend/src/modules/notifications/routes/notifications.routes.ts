import { Router } from 'express'
import { notificationController } from '../controller/notifications.controller'
import { authenticate } from '../../auth/middleware/auth.middleware'
import { requireAdmin } from '../../auth/middleware/admin.middleware'

const router = Router()

// Все роуты требуют авторизации
router.get('/', authenticate, notificationController.getNotifications.bind(notificationController))
router.get('/unread/count', authenticate, notificationController.getUnreadCount.bind(notificationController))
router.post('/', authenticate, requireAdmin, notificationController.createNotification.bind(notificationController))
router.patch('/:id/read', authenticate, notificationController.markAsRead.bind(notificationController))
router.delete('/:id', authenticate, notificationController.deleteNotification.bind(notificationController))

export default router
