import { Router } from 'express'
import { userController } from '../controller/user.controller'
import { authenticate } from '../../auth/middleware/auth.middleware'

const router = Router()

// Все роуты требуют авторизации
router.get('/me', authenticate, userController.getMe.bind(userController))
router.patch('/me', authenticate, userController.updateMe.bind(userController))
router.post('/me/activity', authenticate, userController.updateActivity.bind(userController))
router.get('/me/stats', authenticate, userController.getStats.bind(userController))

export default router
