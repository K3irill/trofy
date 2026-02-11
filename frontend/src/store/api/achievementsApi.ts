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
    getCategoryById: builder.query<Category, string>({
      query: (id) => `/achievements/categories/${id}`,
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
  }),
})

export const {
  useGetRaritiesQuery,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetAchievementsQuery,
  useGetAchievementsByCategoryQuery,
  useGetAchievementByIdQuery,
} = achievementsApi
