import { Router } from 'express'
import { authController } from '../controller/auth.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// Публичные роуты
router.post('/register', authController.register.bind(authController))
router.post('/login', authController.login.bind(authController))
router.post('/refresh', authController.refreshToken.bind(authController))
router.post('/logout', authController.logout.bind(authController))

// Защищенные роуты
router.get('/me', authenticate, authController.getMe.bind(authController))
router.post(
  '/link-platform',
  authenticate,
  authController.linkPlatform.bind(authController)
)

// Роут для получения других пользователей вынесен в отдельный модуль users

export default router
