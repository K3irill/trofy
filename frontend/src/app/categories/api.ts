// API функции для поиска и фильтрации достижений (заглушки для будущей интеграции с бекендом)

export interface SearchAchievementsParams {
  query?: string
  categoryId?: string
  unlocked?: boolean
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  page?: number
  limit?: number
}

export interface Achievement {
  id: string
  name: string
  description?: string
  icon: string
  categoryId: string
  categoryName: string
  unlocked: boolean
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  completionDate?: string
  progress?: number
  completion_date?: string
}

export interface SearchAchievementsResponse {
  achievements: Achievement[]
  total: number
  page: number
  limit: number
}

/**
 * Поиск достижений по названию, категории, завершенности и редкости
 * @param params - Параметры поиска
 * @returns Список достижений
 */
export async function searchAchievements(
  params: SearchAchievementsParams
): Promise<SearchAchievementsResponse> {
  // TODO: Реализовать запрос к API
  // const searchParams = new URLSearchParams()
  // if (params.query) searchParams.append('query', params.query)
  // if (params.categoryId) searchParams.append('categoryId', params.categoryId)
  // if (params.unlocked !== undefined) searchParams.append('unlocked', String(params.unlocked))
  // if (params.rarity) searchParams.append('rarity', params.rarity)
  // if (params.page) searchParams.append('page', String(params.page))
  // if (params.limit) searchParams.append('limit', String(params.limit))
  // const response = await fetch(`/api/achievements/search?${searchParams}`)
  // return response.json()

  return {
    achievements: [],
    total: 0,
    page: params.page || 1,
    limit: params.limit || 20,
  }
}

/**
 * Получить список всех достижений
 * @param params - Параметры фильтрации
 * @returns Список достижений
 */
export async function getAllAchievements(
  params?: SearchAchievementsParams
): Promise<SearchAchievementsResponse> {
  // TODO: Реализовать запрос к API
  // const response = await fetch(`/api/achievements?${new URLSearchParams(params)}`)
  // return response.json()

  return {
    achievements: [],
    total: 0,
    page: params?.page || 1,
    limit: params?.limit || 20,
  }
}
