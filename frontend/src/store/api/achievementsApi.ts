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
  is_custom?: boolean
  creator_id?: string
  creator_username?: string
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
  creator_id?: string
  creator_username?: string
  is_public?: boolean
  allowed_user_ids?: string[]
  achievements_count: number
  likes_count?: number
  is_liked?: boolean
  is_favorite?: boolean
  created_at: string
  updated_at: string
}

export interface CategoryWithStats {
  id: string
  name: string
  icon_url: string | null
  is_custom: boolean
  creator_id?: string
  creator_username?: string
  is_public?: boolean
  allowed_user_ids?: string[]
  total: number
  unlocked: number
  achievements_preview: Array<{
    id: string
    icon_url: string | null
    unlocked: boolean
    progress?: number
    completion_date?: string
  }>
  likes_count?: number
  is_liked?: boolean
  is_favorite?: boolean
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
  excludeUserIds?: string[]
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
    getCategories: builder.query<Category[], { excludeUserIds?: string[]; favoriteOnly?: boolean } | void>({
      query: (params) => {
        const queryParams: Record<string, string> = {}
        if (params) {
          if (params.excludeUserIds && params.excludeUserIds.length > 0) {
            queryParams.excludeUserIds = JSON.stringify(params.excludeUserIds)
          }
          if (params.favoriteOnly) {
            queryParams.favoriteOnly = 'true'
          }
        }
        return {
          url: '/achievements/categories',
          params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
        }
      },
      providesTags: ['Category'],
    }),
    getCategoriesWithStats: builder.query<CategoryWithStats[], { excludeUserIds?: string[]; favoriteOnly?: boolean } | void>({
      query: (params) => {
        const queryParams: Record<string, string> = {}
        if (params) {
          if (params.excludeUserIds && params.excludeUserIds.length > 0) {
            queryParams.excludeUserIds = JSON.stringify(params.excludeUserIds)
          }
          if (params.favoriteOnly) {
            queryParams.favoriteOnly = 'true'
          }
        }
        return {
          url: '/achievements/categories/with-stats',
          params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
        }
      },
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query<Category, string>({
      query: (id) => `/achievements/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }, 'Category'],
    }),
    getCategoryByIdWithStats: builder.query<CategoryWithStats, string>({
      query: (id) => `/achievements/categories/${id}/with-stats`,
      providesTags: (result, error, id) => [{ type: 'Category', id }, 'Category'],
    }),
    getAchievements: builder.query<GetAchievementsResponse, GetAchievementsParams | void>({
      query: (params) => ({
        url: '/achievements',
        params: params
          ? {
              ...params,
              ...(params.excludeUserIds && params.excludeUserIds.length > 0
                ? { excludeUserIds: params.excludeUserIds }
                : {}),
            }
          : {},
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
    getAchievementById: builder.query<Achievement, { id: string; forUserId?: string }>({
      query: ({ id, forUserId }) => ({
        url: `/achievements/${id}`,
        params: forUserId ? { forUserId } : undefined,
      }),
      providesTags: ['Achievement'],
    }),
    getShowcaseAchievements: builder.query<ShowcaseAchievement[], { type: 'best' | 'recent'; limit?: number }>({
      query: ({ type, limit = 10 }) => ({
        url: `/achievements/showcase/${type}`,
        params: { limit },
      }),
      providesTags: ['Achievement'],
    }),
    createCustomCategory: builder.mutation<
      Category,
      { name: string; icon_url?: string; is_public?: boolean; allowed_user_ids?: string[]; image?: File }
    >({
      query: (data) => {
        const formData = new FormData()
        formData.append('name', data.name)
        if (data.icon_url) formData.append('icon_url', data.icon_url)
        if (data.is_public !== undefined) formData.append('is_public', String(data.is_public))
        if (data.allowed_user_ids && data.allowed_user_ids.length > 0) {
          formData.append('allowed_user_ids', JSON.stringify(data.allowed_user_ids))
        }
        if (data.image) {
          formData.append('image', data.image)
        }
        return {
          url: '/achievements/categories/custom',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Category', { type: 'Category', id: 'LIST' }],
    }),
    createCustomAchievement: builder.mutation<
      Achievement,
      {
        title: string
        description: string
        icon_url?: string
        rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
        category_id: string
        xp_reward?: number
        is_public?: boolean
        allowed_user_ids?: string[]
        image?: File
      }
    >({
      query: (data) => {
        const formData = new FormData()
        formData.append('title', String(data.title))
        formData.append('description', String(data.description))
        formData.append('category_id', String(data.category_id))
        if (data.icon_url) formData.append('icon_url', String(data.icon_url))
        if (data.rarity) formData.append('rarity', String(data.rarity))
        if (data.xp_reward !== undefined) formData.append('xp_reward', String(data.xp_reward))
        if (data.is_public !== undefined) formData.append('is_public', String(data.is_public))
        if (data.allowed_user_ids && data.allowed_user_ids.length > 0) {
          formData.append('allowed_user_ids', JSON.stringify(data.allowed_user_ids))
        }
        if (data.image) {
          formData.append('image', data.image)
        }
        return {
          url: '/achievements/custom',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Achievement', 'Category'],
    }),
    updateCategory: builder.mutation<
      Category,
      { id: string; name?: string; is_public?: boolean; allowed_user_ids?: string[]; image?: File }
    >({
      query: ({ id, image, ...data }) => {
        const formData = new FormData()
        if (data.name !== undefined) formData.append('name', data.name)
        if (data.is_public !== undefined) formData.append('is_public', String(data.is_public))
        // Отправляем allowed_user_ids если он определен (даже если пустой массив)
        if (data.allowed_user_ids !== undefined) {
          formData.append('allowed_user_ids', JSON.stringify(data.allowed_user_ids))
        }
        if (image) {
          formData.append('image', image)
        }
        return {
          url: `/achievements/categories/${id}`,
          method: 'PATCH',
          body: formData,
        }
      },
      invalidatesTags: ['Category', { type: 'Category', id: 'LIST' }],
    }),
    updateCustomAchievement: builder.mutation<
      Achievement,
      {
        id: string
        title?: string
        description?: string
        rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
        category_id?: string
        xp_reward?: number
        is_public?: boolean
        allowed_user_ids?: string[]
        image?: File
      }
    >({
      query: ({ id, image, ...data }) => {
        const formData = new FormData()
        if (data.title !== undefined) formData.append('title', data.title)
        if (data.description !== undefined) formData.append('description', data.description)
        if (data.rarity !== undefined) formData.append('rarity', data.rarity)
        if (data.category_id !== undefined) formData.append('category_id', data.category_id)
        if (data.xp_reward !== undefined) formData.append('xp_reward', String(data.xp_reward))
        if (data.is_public !== undefined) formData.append('is_public', String(data.is_public))
        if (data.allowed_user_ids && data.allowed_user_ids.length > 0) {
          formData.append('allowed_user_ids', JSON.stringify(data.allowed_user_ids))
        }
        if (image) {
          formData.append('image', image)
        }
        return {
          url: `/achievements/custom/${id}`,
          method: 'PATCH',
          body: formData,
        }
      },
      invalidatesTags: (result, error, { id }) => [
        'Achievement',
        'Category',
        { type: 'AchievementDetail', id },
        { type: 'AchievementDetail', id: 'LIST' },
      ],
    }),
    deleteCustomCategory: builder.mutation<
      { success: boolean; message: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/achievements/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category', { type: 'Category', id: 'LIST' }],
    }),
    deleteCustomAchievement: builder.mutation<
      { success: boolean; message: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/achievements/custom/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Achievement', 'Category'],
    }),
    toggleCategoryLike: builder.mutation<{ isLiked: boolean }, { categoryId: string }>({
      query: ({ categoryId }) => ({
        url: `/achievements/categories/${categoryId}/likes`,
        method: 'POST',
      }),
      async onQueryStarted({ categoryId }, { dispatch, queryFulfilled }) {
        // Оптимистичное обновление для всех вариантов запросов
        const patchResults: any[] = []
        
        // Обновляем getCategories для всех возможных параметров
        try {
          const patchResult1 = dispatch(
            achievementsApi.util.updateQueryData('getCategories', undefined, (draft) => {
              const category = draft.find((cat) => cat.id === categoryId)
              if (category) {
                const wasLiked = category.is_liked || false
                category.is_liked = !wasLiked
                category.likes_count = (category.likes_count || 0) + (wasLiked ? -1 : 1)
              }
            })
          )
          if (patchResult1) patchResults.push(patchResult1)
        } catch (e) {
          // Игнорируем ошибки, если запрос не найден в кэше
        }
        
        try {
          const patchResult2 = dispatch(
            achievementsApi.util.updateQueryData('getCategoriesWithStats', undefined, (draft) => {
              const category = draft.find((cat) => cat.id === categoryId)
              if (category) {
                const wasLiked = category.is_liked || false
                category.is_liked = !wasLiked
                category.likes_count = (category.likes_count || 0) + (wasLiked ? -1 : 1)
              }
            })
          )
          if (patchResult2) patchResults.push(patchResult2)
        } catch (e) {
          // Игнорируем ошибки, если запрос не найден в кэше
        }
        
        // Обновляем с параметром favoriteOnly: true
        try {
          const patchResult3 = dispatch(
            achievementsApi.util.updateQueryData('getCategories', { favoriteOnly: true }, (draft) => {
              const category = draft.find((cat) => cat.id === categoryId)
              if (category) {
                category.is_liked = !category.is_liked
                category.likes_count = (category.likes_count || 0) + (category.is_liked ? 1 : -1)
              }
            })
          )
          if (patchResult3) patchResults.push(patchResult3)
        } catch (e) {
          // Игнорируем ошибки, если запрос не найден в кэше
        }
        
        try {
          const patchResult4 = dispatch(
            achievementsApi.util.updateQueryData('getCategoriesWithStats', { favoriteOnly: true }, (draft) => {
              const category = draft.find((cat) => cat.id === categoryId)
              if (category) {
                category.is_liked = !category.is_liked
                category.likes_count = (category.likes_count || 0) + (category.is_liked ? 1 : -1)
              }
            })
          )
          if (patchResult4) patchResults.push(patchResult4)
        } catch (e) {
          // Игнорируем ошибки, если запрос не найден в кэше
        }
        
        try {
          await queryFulfilled
        } catch {
          // Откатываем все изменения при ошибке
          patchResults.forEach((patchResult) => {
            if (patchResult && patchResult.undo) {
              patchResult.undo()
            }
          })
        }
      },
      invalidatesTags: (result, error, { categoryId }) => [
        'Category',
        { type: 'Category', id: categoryId },
        { type: 'Category', id: 'LIST' },
      ],
    }),
    toggleCategoryFavorite: builder.mutation<{ isFavorite: boolean }, { categoryId: string }>({
      query: ({ categoryId }) => ({
        url: `/achievements/categories/${categoryId}/favorite`,
        method: 'POST',
      }),
      async onQueryStarted({ categoryId }, { dispatch, queryFulfilled }) {
        // Оптимистичное обновление для всех вариантов запросов
        const patchResults: any[] = []
        
        // Обновляем getCategories для всех возможных параметров
        try {
          const patchResult1 = dispatch(
            achievementsApi.util.updateQueryData('getCategories', undefined, (draft) => {
              const category = draft.find((cat) => cat.id === categoryId)
              if (category) {
                category.is_favorite = !category.is_favorite
              }
            })
          )
          if (patchResult1) patchResults.push(patchResult1)
        } catch (e) {
          // Игнорируем ошибки, если запрос не найден в кэше
        }
        
        try {
          const patchResult2 = dispatch(
            achievementsApi.util.updateQueryData('getCategoriesWithStats', undefined, (draft) => {
              const category = draft.find((cat) => cat.id === categoryId)
              if (category) {
                category.is_favorite = !category.is_favorite
              }
            })
          )
          if (patchResult2) patchResults.push(patchResult2)
        } catch (e) {
          // Игнорируем ошибки, если запрос не найден в кэше
        }
        
        // Обновляем с параметром favoriteOnly: true
        try {
          const patchResult3 = dispatch(
            achievementsApi.util.updateQueryData('getCategories', { favoriteOnly: true }, (draft) => {
              const category = draft.find((cat) => cat.id === categoryId)
              if (category) {
                category.is_favorite = !category.is_favorite
              }
            })
          )
          if (patchResult3) patchResults.push(patchResult3)
        } catch (e) {
          // Игнорируем ошибки, если запрос не найден в кэше
        }
        
        try {
          const patchResult4 = dispatch(
            achievementsApi.util.updateQueryData('getCategoriesWithStats', { favoriteOnly: true }, (draft) => {
              const category = draft.find((cat) => cat.id === categoryId)
              if (category) {
                category.is_favorite = !category.is_favorite
              }
            })
          )
          if (patchResult4) patchResults.push(patchResult4)
        } catch (e) {
          // Игнорируем ошибки, если запрос не найден в кэше
        }
        
        try {
          await queryFulfilled
        } catch {
          // Откатываем все изменения при ошибке
          patchResults.forEach((patchResult) => {
            if (patchResult && patchResult.undo) {
              patchResult.undo()
            }
          })
        }
      },
      invalidatesTags: (result, error, { categoryId }) => [
        'Category',
        { type: 'Category', id: categoryId },
        { type: 'Category', id: 'LIST' },
      ],
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
  useCreateCustomCategoryMutation,
  useCreateCustomAchievementMutation,
  useUpdateCategoryMutation,
  useUpdateCustomAchievementMutation,
  useDeleteCustomCategoryMutation,
  useDeleteCustomAchievementMutation,
  useToggleCategoryLikeMutation,
  useToggleCategoryFavoriteMutation,
} = achievementsApi
