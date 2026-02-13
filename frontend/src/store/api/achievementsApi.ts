import { baseApi } from './baseApi'

export interface Achievement {
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
  unlocked_at: string | null
  is_public: boolean
  created_at: string
  progress?: number
  completion_date?: string
  is_hidden?: boolean
  user_achievement?: {
    is_hidden: boolean
  }
}

export interface ShowcaseAchievement {
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
  unlocked_at: string
  completion_date?: string
  owner: {
    id: string
    username: string
  }
  is_current_user: boolean
}

export interface Category {
  id: string
  name: string
  icon_url: string | null
  is_custom: boolean
  achievements_count: number
  created_at: string
  updated_at: string
}

export interface CategoryWithStats {
  id: string
  name: string
  icon_url: string | null
  is_custom: boolean
  total: number
  unlocked: number
  achievements_preview: Array<{
    id: string
    icon_url: string | null
    unlocked: boolean
    progress?: number
    completion_date?: string
  }>
  created_at: string
  updated_at: string
}

export interface Rarity {
  value: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  label: string
}

export interface GetAchievementsParams {
  query?: string
  categoryId?: string
  rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  unlocked?: boolean
  sortBy?: 'default' | 'unlocked-asc' | 'unlocked-desc' | 'date-asc' | 'date-desc' | 'xp-asc' | 'xp-desc'
  limit?: number
  offset?: number
}

export interface GetAchievementsResponse {
  achievements: Achievement[]
  total: number
  limit: number
  offset: number
}

export const achievementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRarities: builder.query<Rarity[], void>({
      query: () => '/achievements/rarities',
      providesTags: ['Category'],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => '/achievements/categories',
      providesTags: ['Category'],
    }),
    getCategoriesWithStats: builder.query<CategoryWithStats[], void>({
      query: () => '/achievements/categories/with-stats',
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query<Category, string>({
      query: (id) => `/achievements/categories/${id}`,
      providesTags: ['Category'],
    }),
    getCategoryByIdWithStats: builder.query<CategoryWithStats, string>({
      query: (id) => `/achievements/categories/${id}/with-stats`,
      providesTags: ['Category'],
    }),
    getAchievements: builder.query<GetAchievementsResponse, GetAchievementsParams | void>({
      query: (params) => ({
        url: '/achievements',
        params: params || {},
      }),
      providesTags: ['Achievement'],
    }),
    getAchievementsByCategory: builder.query<GetAchievementsResponse, { categoryId: string; params?: GetAchievementsParams }>({
      query: ({ categoryId, params }) => ({
        url: `/achievements/categories/${categoryId}/achievements`,
        params: params || {},
      }),
      providesTags: ['Achievement'],
    }),
    getAchievementById: builder.query<Achievement, string>({
      query: (id) => `/achievements/${id}`,
      providesTags: ['Achievement'],
    }),
    getShowcaseAchievements: builder.query<ShowcaseAchievement[], { type: 'best' | 'recent'; limit?: number }>({
      query: ({ type, limit = 10 }) => ({
        url: `/achievements/showcase/${type}`,
        params: { limit },
      }),
      providesTags: ['Achievement'],
    }),
  }),
})

export const {
  useGetRaritiesQuery,
  useGetCategoriesQuery,
  useGetCategoriesWithStatsQuery,
  useGetCategoryByIdQuery,
  useGetCategoryByIdWithStatsQuery,
  useGetAchievementsQuery,
  useGetAchievementsByCategoryQuery,
  useGetAchievementByIdQuery,
  useGetShowcaseAchievementsQuery,
} = achievementsApi
