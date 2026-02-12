import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApi } from './baseApi'

export interface AchievementDetail {
  id: string
  title: string
  description: string
  icon_url: string | null
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: {
    id: string
    name: string
    icon_url: string | null
  }
  xp_reward: number
  unlocked: boolean
  unlocked_at?: string
  is_public: boolean
  created_at: string
  updated_at: string
  userAchievement?: {
    id: string
    completion_date?: string
    difficulty?: number
    impressions?: string
    is_main: boolean
    is_hidden: boolean
    can_like: boolean
    can_comment: boolean
    is_public: boolean
    progress: number
  }
  likesCount: number
  commentsCount: number
  isLiked: boolean
  isFavorite: boolean
  photos: Array<{
    id: string
    url: string
    order: number
  }>
}

export interface Comment {
  id: string
  userId: string
  username: string
  text: string
  createdAt: string
  parentCommentId?: string
  replies?: Comment[]
}

export interface CompleteAchievementRequest {
  completion_date: string
  difficulty?: number
  impressions?: string
  photos?: File[]
}

export interface UpdateSettingsRequest {
  is_main?: boolean
  is_hidden?: boolean
  can_like?: boolean
  can_comment?: boolean
  is_public?: boolean
}

export interface CreateCommentRequest {
  text: string
  parent_comment_id?: string
}

export interface UpdateProgressRequest {
  progress: number
}

export const achievementDetailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAchievementDetail: builder.query<AchievementDetail, string>({
      query: (id) => `/achievements/${id}/detail`,
      providesTags: (result, error, id) => [{ type: 'AchievementDetail', id }, { type: 'Like', id }],
    }),
    completeAchievement: builder.mutation<AchievementDetail, { id: string; data: CompleteAchievementRequest }>({
      query: ({ id, data }) => {
        const formData = new FormData()
        formData.append('completion_date', data.completion_date)
        if (data.difficulty) formData.append('difficulty', data.difficulty.toString())
        if (data.impressions) formData.append('impressions', data.impressions)
        if (data.photos) {
          data.photos.forEach((photo) => {
            formData.append('photos', photo)
          })
        }
        return {
          url: `/achievements/${id}/complete`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'AchievementDetail', id }],
    }),
    updateAchievement: builder.mutation<AchievementDetail, { userAchievementId: string; achievementId: string; data: CompleteAchievementRequest }>({
      query: ({ userAchievementId, data }) => {
        const formData = new FormData()
        if (data.completion_date) formData.append('completion_date', data.completion_date)
        if (data.difficulty) formData.append('difficulty', data.difficulty.toString())
        if (data.impressions) formData.append('impressions', data.impressions)
        if (data.photos) {
          data.photos.forEach((photo) => {
            formData.append('photos', photo)
          })
        }
        return {
          url: `/achievements/user-achievements/${userAchievementId}`,
          method: 'PUT',
          body: formData,
        }
      },
      invalidatesTags: (result, error, { achievementId }) => [{ type: 'AchievementDetail', id: achievementId }],
    }),
    resetAchievement: builder.mutation<{ success: boolean }, { userAchievementId: string; achievementId: string }>({
      query: ({ userAchievementId }) => ({
        url: `/achievements/user-achievements/${userAchievementId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { achievementId }) => [{ type: 'AchievementDetail', id: achievementId }],
    }),
    updateAchievementSettings: builder.mutation<
      { id: string; is_main: boolean; is_hidden: boolean; can_like: boolean; can_comment: boolean; is_public: boolean },
      { userAchievementId: string; achievementId: string; data: UpdateSettingsRequest }
    >({
      query: ({ userAchievementId, data }) => ({
        url: `/achievements/user-achievements/${userAchievementId}/settings`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { achievementId }) => [{ type: 'AchievementDetail', id: achievementId }],
    }),
    toggleFavorite: builder.mutation<{ isFavorite: boolean }, { userAchievementId: string; achievementId: string }>({
      query: ({ userAchievementId }) => ({
        url: `/achievements/user-achievements/${userAchievementId}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { achievementId }) => [{ type: 'AchievementDetail', id: achievementId }],
    }),
    getComments: builder.query<Comment[], { userAchievementId: string; limit?: number; offset?: number }>({
      query: ({ userAchievementId, limit = 50, offset = 0 }) => ({
        url: `/achievements/user-achievements/${userAchievementId}/comments`,
        params: { limit, offset },
      }),
      providesTags: (result, error, { userAchievementId }) => [
        { type: 'Comment', id: `LIST-${userAchievementId}` },
      ],
    }),
    createComment: builder.mutation<Comment, { userAchievementId: string; data: CreateCommentRequest }>({
      query: ({ userAchievementId, data }) => ({
        url: `/achievements/user-achievements/${userAchievementId}/comments`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { userAchievementId }) => [
        { type: 'Comment', id: `LIST-${userAchievementId}` },
      ],
    }),
    deleteComment: builder.mutation<{ success: boolean }, { userAchievementId: string; commentId: string }>({
      query: ({ userAchievementId, commentId }) => ({
        url: `/achievements/user-achievements/${userAchievementId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { userAchievementId }) => [
        { type: 'Comment', id: `LIST-${userAchievementId}` },
      ],
    }),
    toggleLike: builder.mutation<{ isLiked: boolean }, { userAchievementId: string; achievementId: string }>({
      query: ({ userAchievementId }) => ({
        url: `/achievements/user-achievements/${userAchievementId}/likes`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { achievementId }) => [
        { type: 'AchievementDetail', id: achievementId },
        { type: 'Like', id: achievementId },
      ],
    }),
    uploadPhotos: builder.mutation<
      Array<{ id: string; url: string; order: number }>,
      { userAchievementId: string; photos: File[] }
    >({
      query: ({ userAchievementId, photos }) => {
        const formData = new FormData()
        photos.forEach((photo) => {
          formData.append('photos', photo)
        })
        return {
          url: `/achievements/user-achievements/${userAchievementId}/photos`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (result, error, { userAchievementId }) => [{ type: 'AchievementDetail', id: userAchievementId }],
    }),
    deletePhoto: builder.mutation<{ success: boolean }, { userAchievementId: string; photoId: string; achievementId?: string }>({
      query: ({ userAchievementId, photoId }) => ({
        url: `/achievements/user-achievements/${userAchievementId}/photos/${photoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { userAchievementId, achievementId }) => [
        { type: 'AchievementDetail', id: achievementId || userAchievementId },
      ],
    }),
    updateProgress: builder.mutation<{ success: boolean; progress: number; achievementId: string }, { achievementId: string; data: UpdateProgressRequest }>({
      query: ({ achievementId, data }) => ({
        url: `/achievements/${achievementId}/progress`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { achievementId }) => [{ type: 'AchievementDetail', id: achievementId }],
    }),
  }),
})

export const {
  useGetAchievementDetailQuery,
  useCompleteAchievementMutation,
  useUpdateAchievementMutation,
  useResetAchievementMutation,
  useUpdateAchievementSettingsMutation,
  useToggleFavoriteMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useToggleLikeMutation,
  useUploadPhotosMutation,
  useDeletePhotoMutation,
  useUpdateProgressMutation,
} = achievementDetailApi
