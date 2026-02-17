'use client'

import { useState } from 'react'
import { IoPin, IoPinOutline, IoArchive, IoArchiveOutline, IoTrash, IoCreateOutline, IoFolder, IoPricetag } from 'react-icons/io5'
import { JournalEntry, JournalEntryType } from '@/store/api/journalApi'
import { useTogglePinEntryMutation, useToggleArchiveEntryMutation, useDeleteJournalEntryMutation } from '@/store/api/journalApi'
import { useToast } from '@/hooks/useToast'
import { useConfirm } from '@/hooks/useConfirm'
import {
  EntryCard,
  EntryHeader,
  EntryTitle,
  EntryMeta,
  EntryContent,
  EntryActions,
  ActionButton,
  EntryBadges,
  Badge,
  TypeBadge,
} from './JournalEntryCard.styled'

interface JournalEntryCardProps {
  entry: JournalEntry
  onEdit: (entry: JournalEntry) => void
  onView?: (entry: JournalEntry) => void
}

const typeLabels: Record<JournalEntryType, string> = {
  NOTE: 'Заметка',
  TASK: 'Задача',
  TOPIC: 'Тема',
  IDEA: 'Идея',
}

const typeColors: Record<JournalEntryType, string> = {
  NOTE: '#6366f1',
  TASK: '#10b981',
  TOPIC: '#f59e0b',
  IDEA: '#ec4899',
}

export const JournalEntryCard = ({ entry, onEdit, onView }: JournalEntryCardProps) => {
  const [togglePin] = useTogglePinEntryMutation()
  const [toggleArchive] = useToggleArchiveEntryMutation()
  const [deleteEntry] = useDeleteJournalEntryMutation()
  const { showToast, ToastComponent } = useToast()
  const { confirm, ConfirmComponent } = useConfirm()

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await togglePin(entry.id).unwrap()
      showToast(entry.isPinned ? 'Откреплено' : 'Закреплено', 'success')
    } catch (error) {
      showToast('Ошибка при обновлении', 'error')
    }
  }

  const handleToggleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await toggleArchive(entry.id).unwrap()
      showToast(entry.isArchived ? 'Разархивировано' : 'Архивировано', 'success')
    } catch (error) {
      showToast('Ошибка при обновлении', 'error')
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const confirmed = await confirm({
      title: 'Удалить запись?',
      message: 'Вы уверены, что хотите удалить эту запись? Это действие нельзя отменить.',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
      type: 'danger',
    })

    if (!confirmed) return

    try {
      await deleteEntry(entry.id).unwrap()
      showToast('Запись удалена', 'success')
    } catch (error) {
      showToast('Ошибка при удалении', 'error')
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(entry)
  }

  const handleCardClick = () => {
    if (onView) {
      onView(entry)
    } else {
      onEdit(entry)
    }
  }

  // Извлекаем текст из TipTap JSON для предпросмотра
  const getPreviewText = (content: any): string => {
    if (!content) return ''
    if (typeof content === 'string') return content.substring(0, 150)

    const extractText = (node: any): string => {
      if (typeof node === 'string') return node
      if (Array.isArray(node)) {
        return node.map(extractText).filter(Boolean).join(' ')
      }
      if (node && typeof node === 'object') {
        if (node.type === 'text' && node.text) return node.text
        if (node.content) return extractText(node.content)
        if (node.text) return node.text
      }
      return ''
    }

    const text = extractText(content)
    const preview = text.trim().substring(0, 150)
    return preview + (text.length > 150 ? '...' : '')
  }

  return (
    <>
      <EntryCard $isPinned={entry.isPinned} onClick={handleCardClick}>
        <EntryHeader>
          <div style={{ flex: 1 }}>
            <EntryTitle>{entry.title}</EntryTitle>
            <EntryMeta>
              {new Date(entry.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </EntryMeta>
          </div>
          <EntryActions>
            <ActionButton
              onClick={handleTogglePin}
              $active={entry.isPinned}
              title={entry.isPinned ? 'Открепить' : 'Закрепить'}
            >
              {entry.isPinned ? <IoPin /> : <IoPinOutline />}
            </ActionButton>
            <ActionButton
              onClick={handleToggleArchive}
              $active={entry.isArchived}
              title={entry.isArchived ? 'Разархивировать' : 'Архивировать'}
            >
              {entry.isArchived ? <IoArchive /> : <IoArchiveOutline />}
            </ActionButton>
            <ActionButton onClick={handleEdit} title="Редактировать">
              <IoCreateOutline />
            </ActionButton>
            <ActionButton onClick={handleDelete} $danger title="Удалить">
              <IoTrash />
            </ActionButton>
          </EntryActions>
        </EntryHeader>

        <EntryContent>{getPreviewText(entry.content)}</EntryContent>

        <EntryBadges>
          <TypeBadge $color={typeColors[entry.type]}>
            {typeLabels[entry.type]}
          </TypeBadge>
          {entry.folder && (
            <Badge>
              <IoFolder style={{ marginRight: '0.25rem' }} />
              {entry.folder.name}
            </Badge>
          )}
          {entry.tags.map((tag) => (
            <Badge key={tag.id} $color={tag.color}>
              <IoPricetag style={{ marginRight: '0.25rem' }} />
              {tag.name}
            </Badge>
          ))}
        </EntryBadges>
      </EntryCard>
      <ToastComponent />
      <ConfirmComponent />
    </>
  )
}
