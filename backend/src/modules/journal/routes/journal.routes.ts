import { Router } from 'express'
import { journalController } from '../controller/journal.controller'
import { authenticate } from '../../auth/middleware/auth.middleware'

const router = Router()

// Все роуты требуют аутентификации
router.use(authenticate)

// Записи дневника
router.get('/entries', journalController.getEntries.bind(journalController))
router.get('/entries/:id', journalController.getEntryById.bind(journalController))
router.post('/entries', journalController.createEntry.bind(journalController))
router.put('/entries/:id', journalController.updateEntry.bind(journalController))
router.delete('/entries/:id', journalController.deleteEntry.bind(journalController))
router.patch('/entries/:id/pin', journalController.togglePin.bind(journalController))
router.patch('/entries/:id/archive', journalController.toggleArchive.bind(journalController))

// Папки
router.get('/folders', journalController.getFolders.bind(journalController))
router.post('/folders', journalController.createFolder.bind(journalController))
router.put('/folders/:id', journalController.updateFolder.bind(journalController))
router.delete('/folders/:id', journalController.deleteFolder.bind(journalController))

// Теги
router.get('/tags', journalController.getTags.bind(journalController))
router.post('/tags', journalController.createTag.bind(journalController))
router.put('/tags/:id', journalController.updateTag.bind(journalController))
router.delete('/tags/:id', journalController.deleteTag.bind(journalController))

export default router
