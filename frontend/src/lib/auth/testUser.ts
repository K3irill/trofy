import type { User } from '@/types'
import type { AuthResponse, TokenResponse } from '@/types/auth'

export const TEST_USER_CREDENTIALS = {
  email: 'test@trofy.art',
  phone: '+79991234567',
  password: 'test123',
  username: 'testuser',
}

export const createTestUser = (): User => ({
  id: 'test-user-1',
  username: TEST_USER_CREDENTIALS.username,
  email: TEST_USER_CREDENTIALS.email,
  phone: TEST_USER_CREDENTIALS.phone,
  xp: 1250,
  level: 4,
  profile_theme: {
    profile_color: 'dark',
  },
  privacy_settings: {
    show_achievements: true,
    show_level: true,
    show_profile: true,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  bio: 'Тестовый пользователь для разработки',
  badges: ['Тестер', 'Разработчик'],
  streak: 7,
  uniqueness_score: 87,
  growth_rate: 12,
  fastest_achievement: {
    title: 'Первое достижение',
    days: 3,
  },
})

export const createTestTokens = (): TokenResponse => ({
  access_token: 'test-access-token-' + Date.now(),
  refresh_token: 'test-refresh-token-' + Date.now(),
  expires_in: 3600, // 1 час
})

export const createTestAuthResponse = (): AuthResponse => ({
  user: createTestUser(),
  tokens: createTestTokens(),
})
