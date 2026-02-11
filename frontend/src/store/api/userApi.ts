import { baseApi } from './baseApi'
import type { User } from '@/types'

export interface UpdateUserRequest {
  bio?: string
  profile_theme_id?: string
  privacy_settings?: {
    show_achievements?: boolean
    show_level?: boolean
    show_profile?: boolean
  }
  pinned_achievements?: string[]
}

export interface UserStats {
  total_achievements: number
  achievements_by_rarity: {
    common: number
    rare: number
    epic: number
    legendary: number
  }
  uniqueness_score: number
  growth_rate: number
  fastest_achievement: {
    title: string
    days: number
  } | null
  streak: number
  xp: number
  level: number
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    updateMe: builder.mutation<User, UpdateUserRequest>({
      query: (data) => ({
        url: '/users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateActivity: builder.mutation<User, void>({
      query: () => ({
        url: '/users/me/activity',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    getStats: builder.query<UserStats, void>({
      query: () => '/users/me/stats',
      providesTags: ['User'],
    }),
  }),
})

export const { useGetMeQuery, useUpdateMeMutation, useUpdateActivityMutation, useGetStatsQuery } = userApi
