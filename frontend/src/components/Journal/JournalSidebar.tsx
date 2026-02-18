'use client'

import { useState, useMemo } from 'react'
import { IoFolder, IoFolderOutline, IoPricetag, IoAdd, IoClose } from 'react-icons/io5'
import {
  useGetJournalFoldersQuery,
  useGetJournalTagsQuery,
  useCreateJournalFolderMutation,
  useCreateJournalTagMutation,
  JournalFolder,
  JournalTag,
} from '@/store/api/journalApi'
import { useToast } from '@/hooks/useToast'
import { ThemedSelect, ThemedSelectOption } from '@/components/Select/ThemedSelect'
import {
  SidebarContainer,
  SidebarSection,
  SectionTitle,
  SectionContent,
  FolderItem,
  TagItem,
  AddButton,
  Input,
  AddForm,
  MobileSelectWrapper,
  MobileSelectGroup,
} from './JournalSidebar.styled'

interface JournalSidebarProps {
  selectedFolderId?: string
  selectedTagId?: string
  onFolderSelect: (folderId?: string) => void
  onTagSelect: (tagId?: string) => void
}

export const JournalSidebar = ({
  selectedFolderId,
  selectedTagId,
  onFolderSelect,
  onTagSelect,
}: JournalSidebarProps) => {
  const [showAddFolder, setShowAddFolder] = useState(false)
  const [showAddTag, setShowAddTag] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newTagName, setNewTagName] = useState('')

  const { data: folders = [] } = useGetJournalFoldersQuery()
  const { data: tags = [] } = useGetJournalTagsQuery()
  const [createFolder] = useCreateJournalFolderMutation()
  const [createTag] = useCreateJournalTagMutation()
  const { showToast } = useToast()

  const folderOptions: ThemedSelectOption[] = useMemo(() => [
    { value: '', label: 'Все записи' },
    ...folders.map((folder) => ({
      value: folder.id,
      label: folder.name,
    })),
  ], [folders])

  const tagOptions: ThemedSelectOption[] = useMemo(() => [
    { value: '', label: 'Все теги' },
    ...tags.map((tag) => ({
      value: tag.id,
      label: tag.name,
    })),
  ], [tags])

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      await createFolder({ name: newFolderName.trim() }).unwrap()
      setNewFolderName('')
      setShowAddFolder(false)
      showToast('Папка создана', 'success')
    } catch (error) {
      showToast('Ошибка при создании папки', 'error')
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    try {
      await createTag({ name: newTagName.trim() }).unwrap()
      setNewTagName('')
      setShowAddTag(false)
      showToast('Тег создан', 'success')
    } catch (error) {
      showToast('Ошибка при создании тега', 'error')
    }
  }

  return (
    <SidebarContainer>
      {/* Desktop view */}
      <SidebarSection className="desktop-view">
        <SectionTitle>
          Папки
          <AddButton onClick={() => setShowAddFolder(true)} title="Добавить папку" className="desktop-add-btn">
            <IoAdd />
          </AddButton>
        </SectionTitle>
        <SectionContent>
          <FolderItem
            $active={!selectedFolderId}
            onClick={() => onFolderSelect(undefined)}
          >
            <IoFolderOutline />
            <span>Все записи</span>
          </FolderItem>
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              $active={selectedFolderId === folder.id}
              onClick={() => onFolderSelect(folder.id)}
            >
              <IoFolder />
              <span>{folder.name}</span>
              {folder.entriesCount > 0 && (
                <span className="entries-count">
                  {folder.entriesCount}
                </span>
              )}
            </FolderItem>
          ))}
          {showAddFolder && (
            <AddForm>
              <Input
                type="text"
                placeholder="Название папки..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder()
                  if (e.key === 'Escape') {
                    setShowAddFolder(false)
                    setNewFolderName('')
                  }
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <AddButton onClick={handleCreateFolder} $small>
                  ✓
                </AddButton>
                <AddButton
                  onClick={() => {
                    setShowAddFolder(false)
                    setNewFolderName('')
                  }}
                  $small
                >
                  <IoClose />
                </AddButton>
              </div>
            </AddForm>
          )}
        </SectionContent>
      </SidebarSection>

      <SidebarSection className="desktop-view">
        <SectionTitle>
          Теги
          <AddButton onClick={() => setShowAddTag(true)} title="Добавить тег" className="desktop-add-btn">
            <IoAdd />
          </AddButton>
        </SectionTitle>
        <SectionContent>
          <TagItem
            $active={!selectedTagId}
            onClick={() => onTagSelect(undefined)}
          >
            <IoPricetag />
            <span>Все теги</span>
          </TagItem>
          {tags.map((tag) => (
            <TagItem
              key={tag.id}
              $active={selectedTagId === tag.id}
              onClick={() => onTagSelect(tag.id)}
              $color={tag.color}
            >
              <IoPricetag />
              <span>{tag.name}</span>
              {tag.entriesCount > 0 && (
                <span className="entries-count">
                  {tag.entriesCount}
                </span>
              )}
            </TagItem>
          ))}
          {showAddTag && (
            <AddForm>
              <Input
                type="text"
                placeholder="Название тега..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateTag()
                  if (e.key === 'Escape') {
                    setShowAddTag(false)
                    setNewTagName('')
                  }
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <AddButton onClick={handleCreateTag} $small>
                  ✓
                </AddButton>
                <AddButton
                  onClick={() => {
                    setShowAddTag(false)
                    setNewTagName('')
                  }}
                  $small
                >
                  <IoClose />
                </AddButton>
              </div>
            </AddForm>
          )}
        </SectionContent>
      </SidebarSection>

      {/* Mobile view */}
      <div className="mobile-view">
        <MobileSelectWrapper>
          <MobileSelectGroup>
            <ThemedSelect
              compact
              options={folderOptions}
              value={folderOptions.find((o) => o.value === (selectedFolderId || '')) || folderOptions[0]}
              onChange={(option) => {
                const selected = option as ThemedSelectOption
                onFolderSelect(selected.value || undefined)
              }}
              isClearable={false}
              placeholder="Папка"
            />
            <AddButton onClick={() => setShowAddFolder(true)} title="Добавить папку" className="mobile-add-btn">
              <IoAdd />
            </AddButton>
          </MobileSelectGroup>

          <MobileSelectGroup>
            <ThemedSelect
              compact
              options={tagOptions}
              value={tagOptions.find((o) => o.value === (selectedTagId || '')) || tagOptions[0]}
              onChange={(option) => {
                const selected = option as ThemedSelectOption
                onTagSelect(selected.value || undefined)
              }}
              isClearable={false}
              placeholder="Тег"
            />
            <AddButton onClick={() => setShowAddTag(true)} title="Добавить тег" className="mobile-add-btn">
              <IoAdd />
            </AddButton>
          </MobileSelectGroup>
        </MobileSelectWrapper>

        {showAddFolder && (
          <AddForm>
            <Input
              type="text"
              placeholder="Название папки..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder()
                if (e.key === 'Escape') {
                  setShowAddFolder(false)
                  setNewFolderName('')
                }
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <AddButton onClick={handleCreateFolder} $small>
                ✓
              </AddButton>
              <AddButton
                onClick={() => {
                  setShowAddFolder(false)
                  setNewFolderName('')
                }}
                $small
              >
                <IoClose />
              </AddButton>
            </div>
          </AddForm>
        )}

        {showAddTag && (
          <AddForm>
            <Input
              type="text"
              placeholder="Название тега..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateTag()
                if (e.key === 'Escape') {
                  setShowAddTag(false)
                  setNewTagName('')
                }
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <AddButton onClick={handleCreateTag} $small>
                ✓
              </AddButton>
              <AddButton
                onClick={() => {
                  setShowAddTag(false)
                  setNewTagName('')
                }}
                $small
              >
                <IoClose />
              </AddButton>
            </div>
          </AddForm>
        )}
      </div>
    </SidebarContainer>
  )
}
