import dotenv from 'dotenv'

dotenv.config()

export const config = {
  database: {
    url: process.env.DATABASE_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  server: {
    port: parseInt(process.env.PORT || '3333', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  vk: {
    appId: process.env.VK_APP_ID || '',
    appSecret: process.env.VK_APP_SECRET || '',
  },
}
