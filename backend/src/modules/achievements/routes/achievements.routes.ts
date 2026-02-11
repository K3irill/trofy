import { Router } from 'express'
import { achievementsController } from '../controller/achievements.controller'
import { authenticate, optionalAuthenticate } from '../../auth/middleware/auth.middleware'
import { requireAdmin } from '../../auth/middleware/admin.middleware'

const router = Router()

// Публичные роуты (с опциональной аутентификацией для получения userId если токен передан)
router.get('/rarities', achievementsController.getRarities.bind(achievementsController))
router.get('/categories', achievementsController.getCategories.bind(achievementsController))
router.get(
  '/categories/with-stats',
  authenticate,
  achievementsController.getCategoriesWithStats.bind(achievementsController)
)
router.get(
  '/categories/:id',
  optionalAuthenticate,
  achievementsController.getCategoryById.bind(achievementsController)
)
router.get(
  '/categories/:categoryId/achievements',
  optionalAuthenticate,
  achievementsController.getAchievementsByCategory.bind(achievementsController)
)
router.get('/', optionalAuthenticate, achievementsController.getAchievements.bind(achievementsController))
router.get('/:id', optionalAuthenticate, achievementsController.getAchievementById.bind(achievementsController))

// Роуты для создания (только для админов)
router.post(
  '/categories',
  authenticate,
  requireAdmin,
  achievementsController.createCategory.bind(achievementsController)
)
router.post(
  '/',
  authenticate,
  requireAdmin,
  achievementsController.createAchievement.bind(achievementsController)
)

// Роуты для создания кастомных категорий и достижений (для пользователей)
router.post(
  '/categories/custom',
  authenticate,
  achievementsController.createCustomCategory.bind(achievementsController)
)
router.post(
  '/custom',
  authenticate,
  achievementsController.createCustomAchievement.bind(achievementsController)
)

export default router
