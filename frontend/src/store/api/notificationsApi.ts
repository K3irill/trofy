import { baseApi } from './baseApi'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  time: string
  created_at: string
}

export interface CreateNotificationRequest {
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  user_id?: string // Если не указан, отправляется всем пользователям
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications',
      providesTags: ['Notifications'],
    }),
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => '/notifications/unread/count',
      providesTags: ['Notifications'],
    }),
    createNotification: builder.mutation<
      { id?: string; count?: number; message?: string },
      CreateNotificationRequest
    >({
      query: (data) => ({
        url: '/notifications',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications'],
    }),
    markAsRead: builder.mutation<{ id: string; is_read: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
    deleteNotification: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useCreateNotificationMutation,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi
