import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import fs from 'fs'
import { config } from './core/config'
import { errorHandler } from './core/middlewares/errorHandler'
import authRoutes from './modules/auth/routes/auth.routes'
import userRoutes from './modules/user/routes/user.routes'
import achievementsRoutes from './modules/achievements/routes/achievements.routes'
import notificationsRoutes from './modules/notifications/routes/notifications.routes'
import journalRoutes from './modules/journal/routes/journal.routes'
import { authController } from './modules/auth/controller/auth.controller'

const app = express()

app.use(
  cors({
    origin: [config.server.frontendUrl, 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: 'cross-origin' },
//   })
// )
app.use(express.json())
// Статическая раздача загруженных файлов
// Определяем путь к uploads с учетом структуры проекта
let uploadsPath = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsPath)) {
  // В продакшене PM2: cwd = /root/trofy/trofy, uploads в backend/uploads
  uploadsPath = path.join(process.cwd(), 'backend', 'uploads')
}
console.log('📁 Uploads path:', uploadsPath)
console.log('📁 Uploads exists:', fs.existsSync(uploadsPath))
console.log('📁 Process cwd:', process.cwd())
app.use('/uploads', express.static(uploadsPath))
app.use('/api/uploads', express.static(uploadsPath))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/achievements', achievementsRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/journal', journalRoutes)
// Роут для получения других пользователей (публичный, но может использовать viewerId из токена)
app.get('/api/users/:id', authController.getUserById.bind(authController))

// Error handler должен быть последним
app.use(errorHandler)

export { app }
