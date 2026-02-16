'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { IoClose, IoCreateOutline } from 'react-icons/io5'
import { JournalEditor } from './JournalEditor'
import {
  useCreateJournalEntryMutation,
  useUpdateJournalEntryMutation,
  useGetJournalFoldersQuery,
  useGetJournalTagsQuery,
  JournalEntry,
  JournalEntryType,
} from '@/store/api/journalApi'
import { useToast } from '@/hooks/useToast'
import { ThemedSelect, ThemedSelectOption } from '@/components/Select/ThemedSelect'
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  Input,
  ButtonGroup,
  SaveButton,
  CancelButton,
  SelectGroup,
  SelectLabel,
  EntryInfoContainer,
  InfoRow,
  InfoLabel,
  InfoValue,
  InfoTags,
  InfoTag,
} from './QuickNoteModal.styled'

interface JournalEntryModalProps {
  isOpen: boolean
  onClose: (wasCreated?: boolean) => void
  entry?: JournalEntry | null
  viewMode?: boolean // Режим просмотра (read-only)
}

const entryTypeOptions: ThemedSelectOption[] = [
  { value: JournalEntryType.NOTE, label: 'Заметка' },
  { value: JournalEntryType.TASK, label: 'Задача' },
  { value: JournalEntryType.TOPIC, label: 'Тема' },
  { value: JournalEntryType.IDEA, label: 'Идея' },
]

const typeColors: Record<JournalEntryType, string> = {
  NOTE: '#6366f1',
  TASK: '#10b981',
  TOPIC: '#f59e0b',
  IDEA: '#ec4899',
}

export const JournalEntryModal = ({ isOpen, onClose, entry, viewMode = false }: JournalEntryModalProps) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<any>(null)
  const [type, setType] = useState<JournalEntryType>(JournalEntryType.NOTE)
  const [folderId, setFolderId] = useState<string | null>(null)
  const [tagIds, setTagIds] = useState<string[]>([])
  const [isEditMode, setIsEditMode] = useState(false)

  const { data: folders = [] } = useGetJournalFoldersQuery()
  const { data: tags = [] } = useGetJournalTagsQuery()
  const [createEntry, { isLoading: isCreating }] = useCreateJournalEntryMutation()
  const [updateEntry, { isLoading: isUpdating }] = useUpdateJournalEntryMutation()
  const { showToast, ToastComponent } = useToast()

  const isLoading = isCreating || isUpdating
  const isEditing = !!entry
  const isViewing = viewMode && entry && !isEditMode

  useEffect(() => {
    if (!isOpen) return

    if (entry) {
      setTitle(entry.title)
      setContent(entry.content)
      setType(entry.type)
      setFolderId(entry.folder?.id || null)
      setTagIds(entry.tags.map((t) => t.id))
      setIsEditMode(!viewMode) // Если viewMode, то начинаем в режиме просмотра
    } else {
      setTitle('')
      setContent(null)
      setType(JournalEntryType.NOTE)
      setFolderId(null)
      setTagIds([])
      setIsEditMode(true) // Для новой записи всегда режим редактирования
    }
  }, [isOpen, entry, viewMode])

  const handleSave = async () => {
    if (!title.trim() || !content) {
      showToast('Заполните заголовок и содержимое', 'error')
      return
    }

    try {
      if (isEditing && entry) {
        await updateEntry({
          id: entry.id,
          data: {
            title: title.trim(),
            content,
            type,
            folder_id: folderId,
            tag_ids: tagIds,
          },
        }).unwrap()
        showToast('Запись обновлена', 'success')
        onClose(false)
      } else {
        await createEntry({
          title: title.trim(),
          content,
          type,
          folder_id: folderId || undefined,
          tag_ids: tagIds.length > 0 ? tagIds : undefined,
        }).unwrap()
        showToast('Запись сохранена', 'success')
        onClose(true) // Передаем true, чтобы сбросить фильтры
      }
    } catch {
      showToast(isEditing ? 'Ошибка при обновлении записи' : 'Ошибка при сохранении записи', 'error')
    }
  }

  const handleCancel = () => {
    if (isLoading) return // Не позволяем закрыть во время сохранения
    onClose(false)
  }

  const folderOptions: ThemedSelectOption[] = [
    { value: '', label: 'Без папки' },
    ...folders.map((f) => ({ value: f.id, label: f.name })),
  ]

  const tagOptions: ThemedSelectOption[] = tags.map((t) => ({ value: t.id, label: t.name }))

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContainer
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>
                {isViewing ? entry?.title : isEditing ? 'Редактировать запись' : 'Новая запись'}
              </ModalTitle>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {isViewing && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      border: '1px solid rgba(99, 102, 241, 0.5)',
                      borderRadius: '8px',
                      color: '#6366f1',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    <IoCreateOutline />
                    Редактировать
                  </button>
                )}
                <CloseButton onClick={handleCancel} disabled={isLoading}>
                  <IoClose />
                </CloseButton>
              </div>
            </ModalHeader>
            <ModalContent>
              {!isViewing && (
                <>
                  <Input
                    type="text"
                    placeholder="Заголовок..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                  />

                  <SelectGroup>
                    <SelectLabel>Тип записи</SelectLabel>
                    <ThemedSelect
                      options={entryTypeOptions}
                      value={entryTypeOptions.find((o) => o.value === type) || null}
                      onChange={(option) => setType((option as ThemedSelectOption)?.value as JournalEntryType)}
                    />
                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel>Папка</SelectLabel>
                    <ThemedSelect
                      options={folderOptions}
                      value={folderOptions.find((o) => o.value === (folderId || '')) || null}
                      onChange={(option) => setFolderId((option as ThemedSelectOption)?.value || null)}
                      isClearable
                    />
                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel>Теги</SelectLabel>
                    <ThemedSelect
                      options={tagOptions}
                      value={tagOptions.filter((o) => tagIds.includes(o.value))}
                      onChange={(options) => {
                        const selected = Array.isArray(options) ? options : []
                        setTagIds(selected.map((o) => o.value))
                      }}
                      isMulti
                      isClearable
                    />
                  </SelectGroup>
                </>
              )}

              {isViewing && (
                <EntryInfoContainer>
                  <InfoRow>
                    <InfoLabel>Тип:</InfoLabel>
                    <InfoValue $color={typeColors[type]}>
                      {entryTypeOptions.find((o) => o.value === type)?.label}
                    </InfoValue>
                  </InfoRow>
                  {entry?.folder && (
                    <InfoRow>
                      <InfoLabel>Папка:</InfoLabel>
                      <InfoValue>
                        {entry.folder.name}
                      </InfoValue>
                    </InfoRow>
                  )}
                  {entry?.tags && entry.tags.length > 0 && (
                    <InfoRow>
                      <InfoLabel>Теги:</InfoLabel>
                      <InfoTags>
                        {entry.tags.map((tag) => (
                          <InfoTag key={tag.id} $color={tag.color}>
                            {tag.name}
                          </InfoTag>
                        ))}
                      </InfoTags>
                    </InfoRow>
                  )}
                </EntryInfoContainer>
              )}

              <JournalEditor
                key={entry?.id || 'new'}
                content={content}
                placeholder="Начните писать..."
                onChange={setContent}
                editable={!isViewing}
                showToolbar={!isViewing}
              />

              {!isViewing && (
                <ButtonGroup>
                  <CancelButton onClick={handleCancel} disabled={isLoading}>
                    Отмена
                  </CancelButton>
                  <SaveButton onClick={handleSave} disabled={isLoading || !title.trim() || !content}>
                    {isLoading ? (isEditing ? 'Сохранение...' : 'Создание...') : isEditing ? 'Сохранить' : 'Создать'}
                  </SaveButton>
                </ButtonGroup>
              )}
            </ModalContent>
            <ToastComponent />
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>,
    document.body
  )
}
