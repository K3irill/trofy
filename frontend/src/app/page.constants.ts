import { Achievement, Rarity } from '@/types'

export const mockUser = {
  id: '1',
  vk_id: '123456',
  username: 'justLive_26',
  bio: 'потихоньку живем 👾',
  xp: 1250,
  level: 4,
  profile_theme: {
    profile_color: 'dark'
  },
  privacy_settings: {
    show_achievements: true,
    show_level: true,
    show_profile: true,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Первые права',
    description: 'Получил права категории B',
    icon_url: '',
    rarity: Rarity.BASE,
    category_id: '1',
    xp_reward: 100,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Путешественник',
    description: 'Пересек границу на поезде',
    icon_url: '',
    rarity: Rarity.RARE,
    category_id: '2',
    xp_reward: 250,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Прыжок веры',
    description: 'Совершил парашютный прыжок',
    icon_url: '',
    rarity: Rarity.EPIC,
    category_id: '3',
    xp_reward: 500,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Морской волк',
    description: 'Получил права на лодку',
    icon_url: '',
    rarity: Rarity.LEGENDARY,
    category_id: '1',
    xp_reward: 1000,
    created_at: new Date().toISOString(),
  },
]
