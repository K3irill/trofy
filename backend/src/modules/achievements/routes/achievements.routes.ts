import { Router } from 'express'
import { achievementsController } from '../controller/achievements.controller'
import { authenticate } from '../../auth/middleware/auth.middleware'

const router = Router()

// Публичные роуты
router.get('/rarities', achievementsController.getRarities.bind(achievementsController))
router.get('/categories', achievementsController.getCategories.bind(achievementsController))
router.get(
  '/categories/:id',
  achievementsController.getCategoryById.bind(achievementsController)
)
router.get(
  '/categories/:categoryId/achievements',
  achievementsController.getAchievementsByCategory.bind(achievementsController)
)
router.get('/', achievementsController.getAchievements.bind(achievementsController))
router.get('/:id', achievementsController.getAchievementById.bind(achievementsController))

// Защищенные роуты (опционально, для получения данных о разблокированных достижениях)
// authenticate middleware применяется в контроллере через проверку req.user

export default router
