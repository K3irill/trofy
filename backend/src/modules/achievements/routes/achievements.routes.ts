import { Router } from 'express'
import multer from 'multer'
import { achievementsController } from '../controller/achievements.controller'
import { authenticate, optionalAuthenticate } from '../../auth/middleware/auth.middleware'
import { requireAdmin } from '../../auth/middleware/admin.middleware'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10, // Максимум 10 файлов
  },
})

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
  '/categories/:id/with-stats',
  optionalAuthenticate,
  achievementsController.getCategoryByIdWithStats.bind(achievementsController)
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

// Детальная информация о достижении
router.get(
  '/:id/detail',
  optionalAuthenticate,
  achievementsController.getAchievementDetail.bind(achievementsController)
)

// Завершение достижения
router.post(
  '/:id/complete',
  authenticate,
  upload.array('photos', 10),
  achievementsController.completeAchievement.bind(achievementsController)
)

// Обновление выполненного достижения
router.put(
  '/user-achievements/:userAchievementId',
  authenticate,
  upload.array('photos', 10),
  achievementsController.updateAchievement.bind(achievementsController)
)

// Сброс выполнения достижения
router.delete(
  '/user-achievements/:userAchievementId',
  authenticate,
  achievementsController.resetAchievement.bind(achievementsController)
)

// Настройки достижения
router.patch(
  '/user-achievements/:userAchievementId/settings',
  authenticate,
  achievementsController.updateAchievementSettings.bind(achievementsController)
)

// Избранное
router.post(
  '/user-achievements/:userAchievementId/favorite',
  authenticate,
  achievementsController.toggleFavorite.bind(achievementsController)
)

// Комментарии
router.get(
  '/user-achievements/:userAchievementId/comments',
  achievementsController.getComments.bind(achievementsController)
)
router.post(
  '/user-achievements/:userAchievementId/comments',
  authenticate,
  achievementsController.createComment.bind(achievementsController)
)
router.delete(
  '/user-achievements/:userAchievementId/comments/:commentId',
  authenticate,
  achievementsController.deleteComment.bind(achievementsController)
)

// Лайки
router.post(
  '/user-achievements/:userAchievementId/likes',
  authenticate,
  achievementsController.toggleLike.bind(achievementsController)
)

// Фотографии
router.post(
  '/user-achievements/:userAchievementId/photos',
  authenticate,
  upload.array('photos', 10),
  achievementsController.uploadPhotos.bind(achievementsController)
)
router.delete(
  '/user-achievements/:userAchievementId/photos/:photoId',
  authenticate,
  achievementsController.deletePhoto.bind(achievementsController)
)

// Прогресс выполнения
router.patch(
  '/:achievementId/progress',
  authenticate,
  achievementsController.updateProgress.bind(achievementsController)
)

export default router
