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
  priority_achievements?: string[]
  main_info_theme?: string | null
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

export interface RecentAchievement {
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
  unlocked_at: string
  is_public: boolean
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
    getRecentAchievements: builder.query<RecentAchievement[], number | void>({
      query: (limit = 6) => ({
        url: '/users/me/achievements/recent',
        params: { limit },
      }),
      providesTags: ['User', 'Achievement'],
    }),
  }),
})

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateActivityMutation,
  useGetStatsQuery,
  useGetRecentAchievementsQuery,
} = userApi
