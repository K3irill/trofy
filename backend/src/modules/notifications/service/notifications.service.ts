import { prisma } from '../../../shared/database'
import { ApiError } from '../../../core/errors/ApiError'
import { CreateNotificationDto, NotificationType } from '../dto/notifications.dto'

export class NotificationService {
  /**
   * Получить все уведомления пользователя
   */
  async getUserNotifications(userId: string) {
    const notifications = await prisma.notification.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type as NotificationType,
      is_read: notification.is_read,
      time: this.formatRelativeTime(notification.created_at),
      created_at: notification.created_at,
    }))
  }

  /**
   * Получить количество непрочитанных уведомлений
   */
  async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    })

    return { count }
  }

  /**
   * Создать уведомление (для админов)
   * Если user_id не указан, отправляется всем пользователям
   */
  async createNotification(dto: CreateNotificationDto) {
    if (dto.user_id) {
      // Отправка конкретному пользователю
      const user = await prisma.user.findUnique({
        where: { id: dto.user_id },
      })

      if (!user) {
        throw ApiError.notFound('User not found')
      }

      const notification = await prisma.notification.create({
        data: {
          user_id: dto.user_id,
          title: dto.title,
          message: dto.message,
          type: dto.type || NotificationType.INFO,
        },
      })

      return {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        user_id: notification.user_id,
        created_at: notification.created_at,
      }
    } else {
      // Отправка всем пользователям
      const users = await prisma.user.findMany({
        select: { id: true },
      })

      const notifications = await Promise.all(
        users.map((user) =>
          prisma.notification.create({
            data: {
              user_id: user.id,
              title: dto.title,
              message: dto.message,
              type: dto.type || NotificationType.INFO,
            },
          })
        )
      )

      return {
        count: notifications.length,
        message: `Notification sent to ${notifications.length} users`,
      }
    }
  }

  /**
   * Пометить уведомление как прочитанное
   */
  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        user_id: userId,
      },
    })

    if (!notification) {
      throw ApiError.notFound('Notification not found')
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    })

    return {
      id: updated.id,
      is_read: updated.is_read,
    }
  }

  /**
   * Удалить уведомление
   */
  async deleteNotification(notificationId: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        user_id: userId,
      },
    })

    if (!notification) {
      throw ApiError.notFound('Notification not found')
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    })

    return { success: true }
  }

  /**
   * Форматирование времени в относительный формат
   */
  private formatRelativeTime(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days} ${days === 1 ? 'день' : 'дней'} назад`
    }
    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'час' : 'часов'} назад`
    }
    if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'минуту' : 'минут'} назад`
    }
    return 'только что'
  }
}
