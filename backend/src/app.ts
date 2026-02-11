import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './core/config'
import { errorHandler } from './core/middlewares/errorHandler'
import authRoutes from './modules/auth/routes/auth.routes'
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

// API routes
app.use('/api/auth', authRoutes)
// Роут для получения других пользователей (публичный, но может использовать viewerId из токена)
app.get('/api/users/:id', authController.getUserById.bind(authController))

// Error handler должен быть последним
app.use(errorHandler)

export { app }
