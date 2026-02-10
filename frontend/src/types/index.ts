export type ProfileColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'dark' | 'red' | 'yellow'

export interface ProfileTheme {
  id?: string
  name?: string
  preview_url?: string
  cost?: number
  xp_required?: number
  profile_color?: ProfileColor
}


export interface User {
  id: string
  vk_id: string
  username: string
  xp: number
  level: number
  profile_theme: ProfileTheme
  privacy_settings: PrivacySettings
  created_at: string
  updated_at: string
  bio?: string
  badges?: string[]
  streak?: number
  uniqueness_score?: number
  growth_rate?: number
  fastest_achievement?: {
    title: string
    days: number
  }
}

export interface PrivacySettings {
  show_achievements: boolean
  show_level: boolean
  show_profile: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon_url: string
  rarity: Rarity
  category_id: string
  xp_reward: number
  created_at: string
}

export enum Rarity {
  BASE = 'base',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export interface Category {
  id: string
  name: string
  icon_url: string
  is_custom: boolean
  creator_id?: string
  created_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
  is_public: boolean
  achievement: Achievement
}


export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface AchievementState {
  achievements: Achievement[]
  userAchievements: UserAchievement[]
  categories: Category[]
  loading: boolean
  error: string | null
}
