export enum PlatformType {
  WEB = 'WEB',
  VK = 'VK',
  TELEGRAM = 'TELEGRAM',
}

export interface PlatformAccount {
  platform: PlatformType
  platform_user_id: string
  linked_at: string
  username?: string
  avatar_url?: string
}

export interface LoginRequest {
  login: string // email или телефон
  password: string
}

export interface RegisterRequest {
  email?: string
  phone?: string
  password: string
  username: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number // время жизни access токена в секундах
}

export interface AuthResponse {
  user: import('./index').User
  tokens: TokenResponse
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface LinkPlatformRequest {
  platform: PlatformType
  platform_user_id: string
  access_token?: string // токен от платформы для верификации
}
