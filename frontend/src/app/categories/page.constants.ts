// Типы оставлены для совместимости, но данные теперь загружаются из API
export interface Category {
  id: string
  name: string
  icon: string
  total: number
  unlocked: number
  achievements: AchievementPreview[]
}

export interface AchievementPreview {
  id: string
  icon: string
  unlocked: boolean
  name?: string
  description?: string
}

// Хардкод удален - данные загружаются из API
// Этот массив больше не используется, но оставлен для совместимости типов
export const categories: Category[] = []
