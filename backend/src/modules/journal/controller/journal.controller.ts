import { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { journalService } from '../service/journal.service'
import {
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
  CreateJournalFolderDto,
  UpdateJournalFolderDto,
  CreateJournalTagDto,
  UpdateJournalTagDto,
  GetJournalEntriesDto,
} from '../dto/journal.dto'
import { ApiError } from '../../../core/errors/ApiError'
import { AuthRequest } from '../../auth/middleware/auth.middleware'

/**
 * Валидация DTO
 */
async function validateDto(dto: any, res: Response, next: NextFunction): Promise<boolean> {
  const errors = await validate(dto)
  if (errors.length > 0) {
    const messages = errors
      .map((error) => Object.values(error.constraints || {}))
      .flat()
    next(ApiError.badRequest(messages.join(', ')))
    return false
  }
  return true
}

export class JournalController {
  /**
   * GET /api/journal/entries - Получение записей дневника
   */
  async getEntries(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      // Преобразуем строковые boolean значения в boolean
      const query: any = { ...req.query }
      if (query.is_archived !== undefined && query.is_archived !== null) {
        query.is_archived = query.is_archived === 'true' || query.is_archived === true || query.is_archived === '1'
      }
      if (query.is_pinned !== undefined && query.is_pinned !== null) {
        query.is_pinned = query.is_pinned === 'true' || query.is_pinned === true || query.is_pinned === '1'
      }

      const dto = plainToInstance(GetJournalEntriesDto, query)
      if (!(await validateDto(dto, res, next))) return

      const entries = await journalService.getEntries(userId, dto)
      res.json(entries)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/journal/entries/:id - Получение записи по ID
   */
  async getEntryById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const { id } = req.params
      const entry = await journalService.getEntryById(id, userId)
      res.json(entry)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/journal/entries - Создание записи
   */
  async createEntry(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const dto = plainToInstance(CreateJournalEntryDto, req.body)
      if (!(await validateDto(dto, res, next))) return

      const entry = await journalService.createEntry(userId, dto)
      res.status(201).json(entry)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/journal/entries/:id - Обновление записи
   */
  async updateEntry(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const { id } = req.params
      const dto = plainToInstance(UpdateJournalEntryDto, req.body)
      if (!(await validateDto(dto, res, next))) return

      const entry = await journalService.updateEntry(id, userId, dto)
      res.json(entry)
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/journal/entries/:id - Удаление записи
   */
  async deleteEntry(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const { id } = req.params
      const result = await journalService.deleteEntry(id, userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PATCH /api/journal/entries/:id/pin - Закрепление/открепление записи
   */
  async togglePin(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const { id } = req.params
      const result = await journalService.togglePin(id, userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PATCH /api/journal/entries/:id/archive - Архивирование/разархивирование записи
   */
  async toggleArchive(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const { id } = req.params
      const result = await journalService.toggleArchive(id, userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/journal/folders - Получение всех папок
   */
  async getFolders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const folders = await journalService.getFolders(userId)
      res.json(folders)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/journal/folders - Создание папки
   */
  async createFolder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const dto = plainToInstance(CreateJournalFolderDto, req.body)
      if (!(await validateDto(dto, res, next))) return

      const folder = await journalService.createFolder(userId, dto)
      res.status(201).json(folder)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/journal/folders/:id - Обновление папки
   */
  async updateFolder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const { id } = req.params
      const dto = plainToInstance(UpdateJournalFolderDto, req.body)
      if (!(await validateDto(dto, res, next))) return

      const folder = await journalService.updateFolder(id, userId, dto)
      res.json(folder)
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/journal/folders/:id - Удаление папки
   */
  async deleteFolder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const { id } = req.params
      const result = await journalService.deleteFolder(id, userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/journal/tags - Получение всех тегов
   */
  async getTags(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const tags = await journalService.getTags(userId)
      res.json(tags)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/journal/tags - Создание тега
   */
  async createTag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const dto = plainToInstance(CreateJournalTagDto, req.body)
      if (!(await validateDto(dto, res, next))) return

      const tag = await journalService.createTag(userId, dto)
      res.status(201).json(tag)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/journal/tags/:id - Обновление тега
   */
  async updateTag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const { id } = req.params
      const dto = plainToInstance(UpdateJournalTagDto, req.body)
      if (!(await validateDto(dto, res, next))) return

      const tag = await journalService.updateTag(id, userId, dto)
      res.json(tag)
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/journal/tags/:id - Удаление тега
   */
  async deleteTag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(ApiError.unauthorized('User not authenticated'))
      }

      const { id } = req.params
      const result = await journalService.deleteTag(id, userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const journalController = new JournalController()
