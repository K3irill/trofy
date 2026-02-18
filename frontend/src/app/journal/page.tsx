'use client'

import { useState, useEffect, useMemo } from 'react'
import Container from '@/components/Container/Container'
import { BlockLoader } from '@/components/Loader/BlockLoader'
import { JournalEntryCard } from '@/components/Journal/JournalEntryCard'
import { JournalSidebar } from '@/components/Journal/JournalSidebar'
import { JournalEntryModal } from '@/components/Journal/JournalEntryModal'
import {
  useGetJournalEntriesQuery,
  JournalEntryType,
  JournalEntry,
} from '@/store/api/journalApi'
import { IoSearch, IoAdd, IoArchive, IoArchiveOutline } from 'react-icons/io5'
import {
  PageContainer,
  PageHeader,
  Title,
  CreateButton,
  ContentWrapper,
  MainContent,
  EntriesList,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FiltersRow,
  FilterButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
} from './page.styled'

export default function JournalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [viewMode, setViewMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>()
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>()
  const [selectedType, setSelectedType] = useState<JournalEntryType | undefined>()
  const [showArchived, setShowArchived] = useState(false)

  // Debounce для поискового запроса
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: entries = [], isLoading } = useGetJournalEntriesQuery({
    search: debouncedSearchQuery || undefined,
    folder_id: selectedFolderId,
    tag_id: selectedTagId,
    type: selectedType,
    is_archived: showArchived,
  })

  const handleCreateEntry = () => {
    setEditingEntry(null)
    setIsModalOpen(true)
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setViewMode(false) // Режим редактирования
    setIsModalOpen(true)
  }

  const handleViewEntry = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setViewMode(true) // Режим просмотра
    setIsModalOpen(true)
  }

  const handleCloseModal = (wasCreated: boolean = false) => {
    setIsModalOpen(false)
    setEditingEntry(null)
    setViewMode(false)
    // Сбрасываем фильтры после создания новой записи, чтобы пользователь видел новую запись
    if (wasCreated && !editingEntry) {
      setSelectedFolderId(undefined)
      setSelectedTagId(undefined)
      setSelectedType(undefined)
      setSearchQuery('')
    }
  }

  const pinnedEntries = useMemo(() => entries.filter((e) => e.isPinned), [entries])
  const regularEntries = useMemo(() => entries.filter((e) => !e.isPinned), [entries])

  if (isLoading) {
    return (
      <Container>
        <BlockLoader text="Загрузка дневника..." />
      </Container>
    )
  }

  return (
    <Container>
      <PageContainer>
        <PageHeader>
          <Title>Дневник</Title>
          <CreateButton onClick={handleCreateEntry}>
            <IoAdd style={{ marginRight: '0.5rem' }} />
            Новая запись
          </CreateButton>
        </PageHeader>

        <ContentWrapper>
          <SearchContainer className="mobile-search">
            <SearchIcon>
              <IoSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Поиск по записям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          <JournalSidebar
            selectedFolderId={selectedFolderId}
            selectedTagId={selectedTagId}
            onFolderSelect={(id) => setSelectedFolderId(id)}
            onTagSelect={(id) => setSelectedTagId(id)}
          />

          <MainContent>
            <SearchContainer className="desktop-search">
              <SearchIcon>
                <IoSearch />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Поиск по записям..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>

            <FiltersRow>
              <FilterButton
                $active={selectedType === JournalEntryType.NOTE}
                onClick={() => setSelectedType(selectedType === JournalEntryType.NOTE ? undefined : JournalEntryType.NOTE)}
              >
                Заметки
              </FilterButton>
              <FilterButton
                $active={selectedType === JournalEntryType.TASK}
                onClick={() => setSelectedType(selectedType === JournalEntryType.TASK ? undefined : JournalEntryType.TASK)}
              >
                Задачи
              </FilterButton>
              <FilterButton
                $active={selectedType === JournalEntryType.TOPIC}
                onClick={() => setSelectedType(selectedType === JournalEntryType.TOPIC ? undefined : JournalEntryType.TOPIC)}
              >
                Темы
              </FilterButton>
              <FilterButton
                $active={selectedType === JournalEntryType.IDEA}
                onClick={() => setSelectedType(selectedType === JournalEntryType.IDEA ? undefined : JournalEntryType.IDEA)}
              >
                Идеи
              </FilterButton>
              <FilterButton
                $active={showArchived}
                onClick={() => setShowArchived(!showArchived)}
              >
                {showArchived ? <IoArchive /> : <IoArchiveOutline />}
                {showArchived ? 'Архив' : 'Активные'}
              </FilterButton>
            </FiltersRow>

            {entries.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>📝</EmptyStateIcon>
                <EmptyStateText>
                  {showArchived ? 'Архив пуст' : 'Нет записей'}
                </EmptyStateText>
                {!showArchived && (
                  <CreateButton onClick={handleCreateEntry} style={{ marginTop: '1rem' }}>
                    <IoAdd style={{ marginRight: '0.5rem' }} />
                    Создать первую запись
                  </CreateButton>
                )}
              </EmptyState>
            ) : (
              <EntriesList>
                {pinnedEntries.length > 0 && (
                  <>
                    {pinnedEntries.map((entry) => (
                      <JournalEntryCard key={entry.id} entry={entry} onEdit={handleEditEntry} onView={handleViewEntry} />
                    ))}
                    {regularEntries.length > 0 && (
                      <div style={{ margin: '2rem 0 1rem 0', padding: '0.75rem', borderTop: '2px solid rgba(55, 65, 81, 0.6)' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(156, 163, 175, 1)', margin: 0 }}>
                          Остальные записи
                        </h3>
                      </div>
                    )}
                  </>
                )}
                {regularEntries.map((entry) => (
                  <JournalEntryCard key={entry.id} entry={entry} onEdit={handleEditEntry} onView={handleViewEntry} />
                ))}
              </EntriesList>
            )}
          </MainContent>
        </ContentWrapper>

        <JournalEntryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          entry={editingEntry}
          viewMode={viewMode}
        />
      </PageContainer>
    </Container>
  )
}
