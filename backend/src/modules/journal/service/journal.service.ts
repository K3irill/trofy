import { prisma } from '../../../shared/database'
import { ApiError } from '../../../core/errors/ApiError'
import {
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
  CreateJournalFolderDto,
  UpdateJournalFolderDto,
  CreateJournalTagDto,
  UpdateJournalTagDto,
  GetJournalEntriesDto,
  JournalEntryType,
} from '../dto/journal.dto'

export class JournalService {
  /**
   * Получение записей дневника с фильтрами
   */
  async getEntries(userId: string, filters: GetJournalEntriesDto = {}) {
    const where: any = {
      user_id: userId,
      is_archived: filters.is_archived ?? false,
    }

    if (filters.type) {
      where.type = filters.type
    }

    if (filters.folder_id) {
      where.folder_id = filters.folder_id
    }

    if (filters.is_pinned !== undefined) {
      where.is_pinned = filters.is_pinned
    }

    if (filters.tag_id) {
      where.tags = {
        some: {
          journal_tag_id: filters.tag_id,
        },
      }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        // Можно добавить поиск по содержимому, если нужно
      ]
    }

    const entries = await prisma.journalEntry.findMany({
      where,
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
      orderBy: [
        { is_pinned: 'desc' },
        { created_at: 'desc' },
      ],
    })

    return entries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      type: entry.type,
      folder: entry.folder,
      tags: entry.tags.map((et) => et.tag),
      isPinned: entry.is_pinned,
      isArchived: entry.is_archived,
      createdAt: entry.created_at.toISOString(),
      updatedAt: entry.updated_at.toISOString(),
    }))
  }

  /**
   * Получение записи по ID
   */
  async getEntryById(entryId: string, userId: string) {
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        user_id: userId,
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    })

    if (!entry) {
      throw ApiError.notFound('Journal entry not found')
    }

    return {
      id: entry.id,
      title: entry.title,
      content: entry.content,
      type: entry.type,
      folder: entry.folder,
      tags: entry.tags.map((et) => et.tag),
      isPinned: entry.is_pinned,
      isArchived: entry.is_archived,
      createdAt: entry.created_at.toISOString(),
      updatedAt: entry.updated_at.toISOString(),
    }
  }

  /**
   * Создание записи
   */
  async createEntry(userId: string, dto: CreateJournalEntryDto) {
    // Проверяем папку, если указана
    if (dto.folder_id) {
      const folder = await prisma.journalFolder.findFirst({
        where: {
          id: dto.folder_id,
          user_id: userId,
        },
      })

      if (!folder) {
        throw ApiError.notFound('Folder not found')
      }
    }

    // Создаем запись
    const entry = await prisma.journalEntry.create({
      data: {
        user_id: userId,
        title: dto.title,
        content: dto.content as any,
        type: dto.type || JournalEntryType.NOTE,
        folder_id: dto.folder_id || null,
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    })

    // Добавляем теги, если указаны
    if (dto.tag_ids && dto.tag_ids.length > 0) {
      // Проверяем, что все теги принадлежат пользователю
      const tags = await prisma.journalTag.findMany({
        where: {
          id: { in: dto.tag_ids },
          user_id: userId,
        },
      })

      if (tags.length !== dto.tag_ids.length) {
        throw ApiError.badRequest('Some tags not found')
      }

      // Создаем связи
      await prisma.journalEntryTag.createMany({
        data: dto.tag_ids.map((tagId) => ({
          journal_entry_id: entry.id,
          journal_tag_id: tagId,
        })),
      })
    }

    // Получаем обновленную запись с тегами
    return this.getEntryById(entry.id, userId)
  }

  /**
   * Обновление записи
   */
  async updateEntry(entryId: string, userId: string, dto: UpdateJournalEntryDto) {
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        user_id: userId,
      },
    })

    if (!entry) {
      throw ApiError.notFound('Journal entry not found')
    }

    // Проверяем папку, если указана
    if (dto.folder_id !== undefined) {
      if (dto.folder_id) {
        const folder = await prisma.journalFolder.findFirst({
          where: {
            id: dto.folder_id,
            user_id: userId,
          },
        })

        if (!folder) {
          throw ApiError.notFound('Folder not found')
        }
      }
    }

    // Обновляем запись
    await prisma.journalEntry.update({
      where: { id: entryId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.content && { content: dto.content as any }),
        ...(dto.type && { type: dto.type }),
        ...(dto.folder_id !== undefined && { folder_id: dto.folder_id }),
      },
    })

    // Обновляем теги, если указаны
    if (dto.tag_ids !== undefined) {
      // Удаляем все существующие связи
      await prisma.journalEntryTag.deleteMany({
        where: {
          journal_entry_id: entryId,
        },
      })

      // Создаем новые связи
      if (dto.tag_ids.length > 0) {
        const tags = await prisma.journalTag.findMany({
          where: {
            id: { in: dto.tag_ids },
            user_id: userId,
          },
        })

        if (tags.length !== dto.tag_ids.length) {
          throw ApiError.badRequest('Some tags not found')
        }

        await prisma.journalEntryTag.createMany({
          data: dto.tag_ids.map((tagId) => ({
            journal_entry_id: entryId,
            journal_tag_id: tagId,
          })),
        })
      }
    }

    return this.getEntryById(entryId, userId)
  }

  /**
   * Удаление записи
   */
  async deleteEntry(entryId: string, userId: string) {
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        user_id: userId,
      },
    })

    if (!entry) {
      throw ApiError.notFound('Journal entry not found')
    }

    await prisma.journalEntry.delete({
      where: { id: entryId },
    })

    return { success: true }
  }

  /**
   * Закрепление/открепление записи
   */
  async togglePin(entryId: string, userId: string) {
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        user_id: userId,
      },
    })

    if (!entry) {
      throw ApiError.notFound('Journal entry not found')
    }

    const updated = await prisma.journalEntry.update({
      where: { id: entryId },
      data: { is_pinned: !entry.is_pinned },
    })

    return { isPinned: updated.is_pinned }
  }

  /**
   * Архивирование/разархивирование записи
   */
  async toggleArchive(entryId: string, userId: string) {
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        user_id: userId,
      },
    })

    if (!entry) {
      throw ApiError.notFound('Journal entry not found')
    }

    const updated = await prisma.journalEntry.update({
      where: { id: entryId },
      data: { is_archived: !entry.is_archived },
    })

    return { isArchived: updated.is_archived }
  }

  /**
   * Получение всех папок пользователя
   */
  async getFolders(userId: string) {
    const folders = await prisma.journalFolder.findMany({
      where: {
        user_id: userId,
      },
      include: {
        _count: {
          select: {
            entries: true,
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
      orderBy: { created_at: 'asc' },
    })

    return folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      color: folder.color,
      icon: folder.icon,
      parentId: folder.parent_id,
      parent: folder.parent,
      children: folder.children,
      entriesCount: folder._count.entries,
      createdAt: folder.created_at.toISOString(),
    }))
  }

  /**
   * Создание папки
   */
  async createFolder(userId: string, dto: CreateJournalFolderDto) {
    // Проверяем родительскую папку, если указана
    if (dto.parent_id) {
      const parent = await prisma.journalFolder.findFirst({
        where: {
          id: dto.parent_id,
          user_id: userId,
        },
      })

      if (!parent) {
        throw ApiError.notFound('Parent folder not found')
      }
    }

    const folder = await prisma.journalFolder.create({
      data: {
        user_id: userId,
        name: dto.name,
        color: dto.color || null,
        icon: dto.icon || null,
        parent_id: dto.parent_id || null,
      },
    })

    return {
      id: folder.id,
      name: folder.name,
      color: folder.color,
      icon: folder.icon,
      parentId: folder.parent_id,
      createdAt: folder.created_at.toISOString(),
    }
  }

  /**
   * Обновление папки
   */
  async updateFolder(folderId: string, userId: string, dto: UpdateJournalFolderDto) {
    const folder = await prisma.journalFolder.findFirst({
      where: {
        id: folderId,
        user_id: userId,
      },
    })

    if (!folder) {
      throw ApiError.notFound('Folder not found')
    }

    // Проверяем родительскую папку, если указана
    if (dto.parent_id !== undefined) {
      if (dto.parent_id && dto.parent_id !== folderId) {
        const parent = await prisma.journalFolder.findFirst({
          where: {
            id: dto.parent_id,
            user_id: userId,
          },
        })

        if (!parent) {
          throw ApiError.notFound('Parent folder not found')
        }

        // Проверяем, что не создаем циклическую зависимость
        if (dto.parent_id === folderId) {
          throw ApiError.badRequest('Cannot set folder as its own parent')
        }
      }
    }

    const updated = await prisma.journalFolder.update({
      where: { id: folderId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.icon !== undefined && { icon: dto.icon }),
        ...(dto.parent_id !== undefined && { parent_id: dto.parent_id }),
      },
    })

    return {
      id: updated.id,
      name: updated.name,
      color: updated.color,
      icon: updated.icon,
      parentId: updated.parent_id,
      createdAt: updated.created_at.toISOString(),
    }
  }

  /**
   * Удаление папки
   */
  async deleteFolder(folderId: string, userId: string) {
    const folder = await prisma.journalFolder.findFirst({
      where: {
        id: folderId,
        user_id: userId,
      },
      include: {
        _count: {
          select: {
            entries: true,
            children: true,
          },
        },
      },
    })

    if (!folder) {
      throw ApiError.notFound('Folder not found')
    }

    if (folder._count.entries > 0 || folder._count.children > 0) {
      throw ApiError.badRequest('Cannot delete folder with entries or subfolders')
    }

    await prisma.journalFolder.delete({
      where: { id: folderId },
    })

    return { success: true }
  }

  /**
   * Получение всех тегов пользователя
   */
  async getTags(userId: string) {
    const tags = await prisma.journalTag.findMany({
      where: {
        user_id: userId,
      },
      include: {
        _count: {
          select: {
            entries: true,
          },
        },
      },
      orderBy: { created_at: 'asc' },
    })

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      entriesCount: tag._count.entries,
      createdAt: tag.created_at.toISOString(),
    }))
  }

  /**
   * Создание тега
   */
  async createTag(userId: string, dto: CreateJournalTagDto) {
    // Проверяем, что тег с таким именем не существует
    const existing = await prisma.journalTag.findUnique({
      where: {
        user_id_name: {
          user_id: userId,
          name: dto.name,
        },
      },
    })

    if (existing) {
      throw ApiError.badRequest('Tag with this name already exists')
    }

    const tag = await prisma.journalTag.create({
      data: {
        user_id: userId,
        name: dto.name,
        color: dto.color || null,
      },
    })

    return {
      id: tag.id,
      name: tag.name,
      color: tag.color,
      createdAt: tag.created_at.toISOString(),
    }
  }

  /**
   * Обновление тега
   */
  async updateTag(tagId: string, userId: string, dto: UpdateJournalTagDto) {
    const tag = await prisma.journalTag.findFirst({
      where: {
        id: tagId,
        user_id: userId,
      },
    })

    if (!tag) {
      throw ApiError.notFound('Tag not found')
    }

    // Если меняется имя, проверяем уникальность
    if (dto.name && dto.name !== tag.name) {
      const existing = await prisma.journalTag.findUnique({
        where: {
          user_id_name: {
            user_id: userId,
            name: dto.name,
          },
        },
      })

      if (existing) {
        throw ApiError.badRequest('Tag with this name already exists')
      }
    }

    const updated = await prisma.journalTag.update({
      where: { id: tagId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.color !== undefined && { color: dto.color }),
      },
    })

    return {
      id: updated.id,
      name: updated.name,
      color: updated.color,
      createdAt: updated.created_at.toISOString(),
    }
  }

  /**
   * Удаление тега
   */
  async deleteTag(tagId: string, userId: string) {
    const tag = await prisma.journalTag.findFirst({
      where: {
        id: tagId,
        user_id: userId,
      },
    })

    if (!tag) {
      throw ApiError.notFound('Tag not found')
    }

    await prisma.journalTag.delete({
      where: { id: tagId },
    })

    return { success: true }
  }
}

export const journalService = new JournalService()
