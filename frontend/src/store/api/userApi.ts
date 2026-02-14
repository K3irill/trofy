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
  background_icons?: string[]
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
  unlocked_at: string | null
  start_at: string | null
  is_achieved: boolean
  is_public: boolean
  is_hidden?: boolean
  user_achievement?: {
    is_hidden: boolean
  }
}

export interface UserAchievement {
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
  completion_date: string | null
  is_achieved: boolean
  is_public: boolean
  is_hidden: boolean
}

export const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
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
    getUserByUsername: builder.query<User, string>({
      query: (username) => `/users/${username}`,
      providesTags: (result, error, username) => [{ type: 'User', id: username }],
    }),
    getUserStatsByUsername: builder.query<UserStats, string>({
      query: (username) => `/users/${username}/stats`,
      providesTags: (result, error, username) => [{ type: 'User', id: username }],
    }),
    getUserAchievementsByUsername: builder.query<
      UserAchievement[],
      { username: string; status?: 'all' | 'achieved' | 'in_progress'; limit?: number; offset?: number }
    >({
      query: ({ username, status, limit, offset }) => ({
        url: `/users/${username}/achievements`,
        params: {
          ...(status && { status }),
          ...(limit && { limit }),
          ...(offset && { offset }),
        },
      }),
      providesTags: (result, error, { username }) => [
        { type: 'User', id: username },
        'Achievement',
      ],
    }),
    getRecentAchievementsByUsername: builder.query<RecentAchievement[], { username: string; limit?: number }>({
      query: ({ username, limit = 6 }) => ({
        url: `/users/${username}/achievements/recent`,
        params: { limit },
      }),
      providesTags: (result, error, { username }) => [
        { type: 'User', id: username },
        'Achievement',
      ],
    }),
  }),
})

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateActivityMutation,
  useGetStatsQuery,
  useGetRecentAchievementsQuery,
  useGetUserByUsernameQuery,
  useGetUserStatsByUsernameQuery,
  useGetUserAchievementsByUsernameQuery,
  useGetRecentAchievementsByUsernameQuery,
} = userApi
