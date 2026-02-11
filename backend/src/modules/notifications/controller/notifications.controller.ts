import { Request, Response, NextFunction } from 'express'
import { NotificationService } from '../service/notifications.service'
import { CreateNotificationDto } from '../dto/notifications.dto'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { AuthRequest } from '../../auth/middleware/auth.middleware'

const notificationService = new NotificationService()

export class NotificationController {
  /**
   * GET /notifications
   * Получить все уведомления текущего пользователя
   */
  async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return next(new Error('User not authenticated'))
      }

      const notifications = await notificationService.getUserNotifications(userId)
      res.json(notifications)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /notifications
   * Создать уведомление (только для админов)
   */
  async createNotification(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(CreateNotificationDto, req.body)
      const errors = await validate(dto)

      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      const result = await notificationService.createNotification(dto)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PATCH /notifications/:id/read
   * Пометить уведомление как прочитанное
   */
  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return next(new Error('User not authenticated'))
      }

      const { id } = req.params
      const result = await notificationService.markAsRead(id, userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /notifications/:id
   * Удалить уведомление
   */
  async deleteNotification(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return next(new Error('User not authenticated'))
      }

      const { id } = req.params
      const result = await notificationService.deleteNotification(id, userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /notifications/unread/count
   * Получить количество непрочитанных уведомлений
   */
  async getUnreadCount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return next(new Error('User not authenticated'))
      }

      const result = await notificationService.getUnreadCount(userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const notificationController = new NotificationController()
